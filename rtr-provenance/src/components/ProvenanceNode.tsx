import { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { ProvenanceStage } from '../types/provenance'

/* ---------------------------------------------------------------------------
   ProvenanceNode — Premium provenance checkpoint
   
   Visual identity per stage:
   - Farmer:        botanical green  — leaf/nature icon
   - Lab:           cyan/scientific  — flask icon
   - Manufacturing: amber/gold       — factory icon
   - Transport:     violet/purple    — truck icon
   - Product:       bright green     — bottle icon

   Structure per node:
   - Thin connector stem to DNA
   - Outer ambient glow halo
   - Three layered rings (outer glow, main ring, inner fill)
   - Small glowing core sphere
   - SVG icon via Html
   - HTML label: number + title + VERIFIED always visible
--------------------------------------------------------------------------- */

const HELIX_LENGTH = 14.0
const NODE_Y_UP    =  1.10
const NODE_Y_DOWN  = -1.10

interface ProvenanceNodeProps {
  stage: ProvenanceStage
  isSelected: boolean
  isAnySelected: boolean
  onSelect: (stage: ProvenanceStage) => void
}

export default function ProvenanceNode({
  stage, isSelected, isAnySelected, onSelect,
}: ProvenanceNodeProps) {
  const coreRef   = useRef<THREE.Mesh>(null!)
  const ring1Ref  = useRef<THREE.Mesh>(null!)
  const ring2Ref  = useRef<THREE.Mesh>(null!)
  const ring3Ref  = useRef<THREE.Mesh>(null!)
  const glowRef   = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  const pos: [number, number, number] = useMemo(() => {
    const x = stage.tPosition * HELIX_LENGTH - HELIX_LENGTH / 2
    const y = stage.nodePosition === 'up' ? NODE_Y_UP : NODE_Y_DOWN
    return [x, y, 0]
  }, [stage])

  const isUp = pos[1] > 0
  // Stem goes from node down/up to the DNA axis (y=0)
  const stemH = Math.abs(pos[1]) - 0.08
  const stemMid: [number, number, number] = [pos[0], pos[1] / 2, pos[2]]

  const color = new THREE.Color(stage.color)
  // dimmed = another stage is selected, this one is NOT
  const dimmed = isAnySelected && !isSelected
  const alpha = dimmed ? 0.3 : 1.0

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // Subtle float
    if (coreRef.current) {
      coreRef.current.position.y = pos[1] + Math.sin(t * 0.8 + stage.number * 1.2) * 0.04
    }
    // Ring rotations — each ring moves at different speed/direction
    if (ring1Ref.current) ring1Ref.current.rotation.z =  t * 0.55 + stage.number
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.35 + stage.number * 0.8
    if (ring3Ref.current) ring3Ref.current.rotation.z =  t * 0.22 + stage.number * 0.5
    // Glow pulse
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(t * 1.0 + stage.number) * 0.055)
    }
  })

  // Sizes scale with selected/hovered state
  const coreR  = isSelected ? 0.120 : hovered ? 0.110 : 0.092
  const ring1R = isSelected ? 0.200 : hovered ? 0.185 : 0.162  // inner edge of outer ring
  const ring2R = isSelected ? 0.250 : hovered ? 0.232 : 0.205  // outer glow ring
  const emI    = isSelected ? 1.1   : hovered ? 0.85  : 0.65

  /* Ring segments vary by stage type — visual identity */
  const ringSegments: Record<string, number> = {
    farmer: 52, lab: 6, manufacturing: 8, transport: 42, product: 52,
  }
  const segs = ringSegments[stage.type] || 42

  /* HTML label offset — push further from DNA center */
  const labelOffset = isUp ? 0.55 : -0.55

  return (
    <group>
      {/* ── Connector stem — organic vine ── */}
      <mesh position={stemMid} castShadow>
        <cylinderGeometry args={[0.006, 0.003, stemH, 5, 2]} />
        <meshStandardMaterial
          color={new THREE.Color(stage.color)}
          transparent
          opacity={alpha * 0.60}
          emissive={new THREE.Color(stage.color)}
          emissiveIntensity={0.5}
          roughness={0.8}
        />
      </mesh>

      {/* ── Outer ambient glow halo ── */}
      <mesh ref={glowRef} position={pos}>
        <sphereGeometry args={[0.30, 10, 10]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={dimmed ? 0.03 : isSelected ? 0.18 : hovered ? 0.12 : 0.07}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* ── Outer glow ring (widest, most transparent) ── */}
      <mesh ref={ring3Ref} position={pos}>
        <ringGeometry args={[ring2R, ring2R + 0.045, segs]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={dimmed ? 0.04 : isSelected ? 0.22 : hovered ? 0.15 : 0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* ── Main ring ── */}
      <mesh ref={ring1Ref} position={pos}>
        <ringGeometry args={[ring1R, ring1R + 0.028, segs]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={dimmed ? 0.08 : isSelected ? 0.75 : hovered ? 0.58 : 0.42}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Inner accent ring ── */}
      <mesh ref={ring2Ref} position={pos}>
        <ringGeometry args={[ring1R - 0.050, ring1R - 0.030, segs]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={dimmed ? 0.05 : isSelected ? 0.40 : hovered ? 0.28 : 0.18}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Core interactive sphere ── */}
      <mesh
        ref={coreRef}
        position={pos}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerLeave={() => setHovered(false)}
        onClick={(e) => { e.stopPropagation(); onSelect(stage) }}
      >
        <sphereGeometry args={[coreR, 24, 24]} />
        <meshStandardMaterial
          color={color}
          roughness={0.20}
          metalness={0.40}
          emissive={color}
          emissiveIntensity={emI}
          transparent
          opacity={dimmed ? 0.30 : 1}
        />
      </mesh>

      {/* ── Stage icon (HTML/SVG) inside node ── */}
      <Html
        position={pos}
        center
        distanceFactor={5.5}
        zIndexRange={[21, 31]}
        style={{ pointerEvents: 'none' }}
        occlude={false}
      >
        <StageIcon
          type={stage.type}
          color={stage.color}
          dim={dimmed}
          size={isSelected ? 20 : 16}
        />
      </Html>

      {/* ── Label: number + title + VERIFIED ── */}
      <Html
        position={[pos[0], pos[1] + labelOffset, pos[2]]}
        center
        distanceFactor={6}
        zIndexRange={[20, 30]}
        style={{ pointerEvents: 'none' }}
      >
        <NodeLabel
          stage={stage}
          hovered={hovered}
          isSelected={isSelected}
          dimmed={dimmed}
          isUp={isUp}
        />
      </Html>
    </group>
  )
}

/* ─── Stage-specific SVG icons ───────────────────────────────── */

function StageIcon({ type, color, dim, size }: {
  type: string; color: string; dim: boolean; size: number
}) {
  const opacity = dim ? 0.30 : 0.95
  const s = size
  const svgs: Record<string, React.ReactNode> = {
    farmer: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M12 3C9 3 6 5 5 8c1 0 2 .5 3 1.5C9 8 10.5 7 12 7c1.5 0 3 1 4 2.5C17 8.5 18 8 19 8c-1-3-4-5-7-5z" stroke={color} strokeWidth="1.4" fill={`${color}18`}/>
        <path d="M5 8c-1.5 2-2 4.5-1 7l8 5 8-5c1-2.5.5-5-1-7" stroke={color} strokeWidth="1.4"/>
        <circle cx="12" cy="13" r="2.2" fill={`${color}30`} stroke={color} strokeWidth="1.2"/>
        <path d="M9.5 18.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    lab: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M9 3h6M10 3v7l-4.5 9a1 1 0 001 1h11a1 1 0 001-1L14 10V3" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="10.5" cy="15.5" r="1.1" fill={color}/>
        <circle cx="14"   cy="17.5" r="0.9" fill={color}/>
        <circle cx="12"   cy="14"   r="0.7" fill={color} opacity="0.7"/>
      </svg>
    ),
    manufacturing: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="12" width="20" height="9" rx="1" stroke={color} strokeWidth="1.4"/>
        <path d="M6 12V8l5 4V8l5 4V8l3 3" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
        <rect x="9" y="15" width="6" height="6" fill={`${color}25`} stroke={color} strokeWidth="1.1"/>
        <line x1="6"  y1="14" x2="6"  y2="18" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="18" y1="14" x2="18" y2="18" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    transport: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <rect x="1" y="9" width="14" height="8" rx="1.5" stroke={color} strokeWidth="1.4"/>
        <path d="M15 11h3.5l3 4.5V17h-6.5V11z" stroke={color} strokeWidth="1.4"/>
        <circle cx="5.5"  cy="18.5" r="1.8" fill={color}/>
        <circle cx="18.5" cy="18.5" r="1.8" fill={color}/>
        <line x1="4" y1="9" x2="4" y2="7" stroke={color} strokeWidth="1" strokeDasharray="1.5 1.5" opacity="0.6"/>
      </svg>
    ),
    product: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <rect x="8" y="3" width="8" height="18" rx="2.5" stroke={color} strokeWidth="1.4" fill={`${color}15`}/>
        <path d="M8 7.5h8" stroke={color} strokeWidth="1.4"/>
        <path d="M10.5 11h3" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
        <path d="M10.5 13h3" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
        <path d="M10.5 15h2" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.38"/>
        <path d="M12 3v1M12 20.5v1" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  }

  return (
    <div style={{
      opacity,
      filter: `drop-shadow(0 0 ${dim ? 2 : 5}px ${color}${dim ? '40' : '90'})`,
    }}>
      {svgs[type]}
    </div>
  )
}

/* ─── Node label — ALWAYS visible ────────────────────────────── */

function NodeLabel({ stage, hovered, isSelected, dimmed, isUp }: {
  stage: ProvenanceStage
  hovered: boolean
  isSelected: boolean
  dimmed: boolean
  isUp: boolean
}) {
  // Never fully hide — dimmed nodes show label at reduced opacity
  const textOpacity = dimmed ? 0.40 : 1.0

  return (
    <div style={{
      textAlign: 'center',
      userSelect: 'none',
      opacity: textOpacity,
      transition: 'opacity 0.3s',
      // Flip label below vs above the node
      display: 'flex',
      flexDirection: isUp ? 'column' : 'column-reverse',
      alignItems: 'center',
      gap: 2,
    }}>
      {/* Stage number */}
      <div style={{
        fontSize: 24,
        fontWeight: 700,
        color: stage.color,
        lineHeight: 1.0,
        textShadow: `0 0 14px ${stage.color}90, 0 0 28px ${stage.color}40`,
        fontFamily: "'Instrument Sans', var(--font-body)",
        letterSpacing: '-0.02em',
      }}>
        {stage.number}
      </div>

      {/* Title */}
      <div style={{
        fontSize: 9.5,
        fontWeight: 600,
        color: '#ddebd8',
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        textShadow: '0 1px 10px #000c',
        lineHeight: 1.2,
      }}>
        {stage.title}
      </div>

      {/* VERIFIED badge */}
      <div style={{
        fontSize: 8,
        color: stage.color,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        textShadow: `0 0 8px ${stage.color}70`,
        fontFamily: "var(--font-mono)",
        opacity: isSelected || hovered ? 1.0 : 0.75,
      }}>
        {isSelected ? '● SELECTED' : 'Verified'}
      </div>
    </div>
  )
}
