import re

with open('src/components/TransportationStagePanel.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '/* ══════════════════════════════════════════════════════════════════\n   LEFT COLUMN — WHO + WHAT'
end_marker = '/* ══════════════════════════════════════════════════════════════════\n   SHARED PRIMITIVES'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_columns = """/* ══════════════════════════════════════════════════════════════════
   LEFT COLUMN — SHIPMENT
══════════════════════════════════════════════════════════════════ */
function LeftColumn({ rec }: { rec: typeof TRANSPORTATION_RECORD }) {
  return (
    <div style={{
      padding: '24px 32px',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto',
    }}>
      {[
        { label: 'Transporter',      value: rec.transporter.name },
        { label: 'Transporter ID',   value: rec.transporter.transporterId },
        { label: 'Vehicle Type',     value: rec.transporter.vehicleType },
        { label: 'Vehicle ID',       value: rec.transporter.vehicleId },
        { label: 'Driver',           value: rec.transporter.driverName },
        { label: 'Driver ID',        value: rec.transporter.driverId },
        { label: 'Shipment ID',      value: rec.shipmentId },
        { label: 'Origin',           value: rec.route.origin.split(',')[0] },
        { label: 'Destination',      value: rec.route.destination.split(',')[0] },
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{item.label}</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: '#f0f8f0', textAlign: 'right' }}>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MIDDLE COLUMN — ROUTE
══════════════════════════════════════════════════════════════════ */
/* Coordinates */
const NASHIK : [number, number] = [20.0059, 73.7910]
const MUMBAI : [number, number] = [19.0760, 72.8777]
const ROUTE_WAYPOINTS: [number, number][] = [
  NASHIK, [19.9735, 73.7012], [19.8206, 73.4816], [19.6833, 73.3101],
  [19.5503, 73.1428], [19.3800, 73.0553], [19.2183, 72.9781], MUMBAI,
]
const CHECKPOINT_DOTS: [number, number][] = [
  [19.9735, 73.7012], [19.8206, 73.4816], [19.6833, 73.3101],
  [19.5503, 73.1428], [19.3800, 73.0553], [19.2183, 72.9781],
]

function FitBounds() {
  const map = useMap()
  useEffect(() => { map.fitBounds(L.latLngBounds([NASHIK, MUMBAI]).pad(0.18)) }, [map])
  return null
}

function AnimatedRoute({ color }: { color: string }) {
  const map = useMap()
  const lineRef = useRef<L.Polyline | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const DURATION = 1800
    let start: number | null = null
    let raf: number

    const tick = (now: number) => {
      if (!start) start = now
      const t = Math.min((now - start) / DURATION, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    const timer = setTimeout(() => { raf = requestAnimationFrame(tick) }, 400)
    return () => { clearTimeout(timer); cancelAnimationFrame(raf) }
  }, [])

  const total = ROUTE_WAYPOINTS.length - 1
  const idx   = Math.floor(progress * total)
  const frac  = (progress * total) - idx
  const sliced: [number, number][] = ROUTE_WAYPOINTS.slice(0, idx + 1)
  if (idx < total) {
    const a = ROUTE_WAYPOINTS[idx]
    const b = ROUTE_WAYPOINTS[idx + 1]
    sliced.push([a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac])
  }

  useEffect(() => {
    if (lineRef.current) lineRef.current.setLatLngs(sliced)
    else if (map) {
      lineRef.current = L.polyline(sliced, { color, weight: 3, opacity: 0.90 }).addTo(map)
    }
  }, [progress, color, map])

  useEffect(() => {
    return () => { lineRef.current?.remove(); lineRef.current = null }
  }, [])

  return null
}

function MiddleColumn({ rec }: { rec: typeof TRANSPORTATION_RECORD }) {
  const originIcon = createSvgIcon(ACCENT2, 'NASHIK')
  const destIcon   = createSvgIcon(GREEN,   'MUMBAI')
  const checkpointIcon = L.divIcon({
    html: `<div style="width:7px;height:7px;border-radius:50%;background:${ACCENT2};box-shadow:0 0 5px ${ACCENT2}99;border:1px solid rgba(255,255,255,0.3)"></div>`,
    className: '', iconSize: [7, 7], iconAnchor: [3.5, 3.5],
  })

  return (
    <div style={{ padding: '24px 32px', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
        Route Map
      </div>
      <div style={{ flex: 1, minHeight: 200, borderRadius: 16, overflow: 'hidden', border: `1px solid rgba(255,255,255,0.12)`, position: 'relative' }}>
        <MapContainer
          center={[19.55, 73.35]} zoom={8} zoomControl={false} attributionControl={false} scrollWheelZoom={false} dragging={false} doubleClickZoom={false}
          style={{ width: '100%', height: '100%', background: '#060310' }}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap contributors &copy; CARTO' />
          <FitBounds />
          <AnimatedRoute color={ACCENT} />
          <Polyline positions={ROUTE_WAYPOINTS} pathOptions={{ color: `${ACCENT}35`, weight: 2, dashArray: '5 6' }} />
          <Marker position={NASHIK} icon={originIcon} />
          <Marker position={MUMBAI} icon={destIcon} />
          {CHECKPOINT_DOTS.map((pos, i) => (
            <Marker key={i} position={pos} icon={checkpointIcon} />
          ))}
        </MapContainer>
        <div style={{
          position: 'absolute', bottom: 12, left: 12, right: 12,
          background: 'rgba(4,2,12,0.84)', backdropFilter: 'blur(8px)',
          borderRadius: 12, padding: '10px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          border: `1px solid ${ACCENT}20`, zIndex: 1000, pointerEvents: 'none',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: ACCENT2 }}>{rec.route.distanceKm} km</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: DIM, textTransform: 'uppercase' }}>Distance</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: ACCENT2 }}>{rec.route.gpsCheckpoints}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: DIM, textTransform: 'uppercase' }}>Checkpoints</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: GREEN }}>{rec.route.routeDeviations}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: DIM, textTransform: 'uppercase' }}>Deviations</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   RIGHT COLUMN — CONDITIONS & PROTECTION
══════════════════════════════════════════════════════════════════ */
function RightColumn({ rec }: { rec: typeof TRANSPORTATION_RECORD }) {
  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto' }}>
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          Transit Conditions
        </div>
        {[
          { label: 'Temperature', value: rec.conditions.temperature },
          { label: 'Humidity',    value: rec.conditions.humidity },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10, paddingTop: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{item.label}</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: '#f0f8f0' }}>{item.value}</span>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          Smart Insurance
        </div>
        <div style={{ background: 'rgba(232,196,74,0.1)', border: '1px solid rgba(232,196,74,0.3)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: '#e8c44a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Policy ID</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: '#f5e8a8' }}>{rec.insurance.policyId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: '#e8c44a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Coverage</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 12, color: '#f5e8a8' }}>{rec.insurance.coverage}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(232,196,74,0.2)', paddingTop: 10, marginTop: 10 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: GREEN }}>{rec.insurance.transitStatus}</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          Ledger Record
        </div>
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'var(--night-dim)' }}>Block</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: '#f0f8f0' }}>{rec.ledger.blockNumber}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'var(--night-dim)' }}>Tx Hash</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: ACCENT }}>{rec.ledger.transactionId.substring(0, 16)}...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

"""

content = content[:start_idx] + new_columns + content[end_idx:]

with open('src/components/TransportationStagePanel.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
