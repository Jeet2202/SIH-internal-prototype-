import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

/* ---------------------------------------------------------------------------
   BotanicalDNA — ORGANIC BOTANICAL VINE HELIX
   
   The DNA looks like LIVING BOTANICAL VINES intertwined.
   - Thick, irregular strands with noise-displaced curves  
   - Small leaf geometries growing off the strands
   - Warm moss-green material with roughness + emissive highlights
   - Organic rungs that look like natural plant connectors
--------------------------------------------------------------------------- */

const HELIX_RADIUS  = 0.42
const HELIX_LENGTH  = 6.0
const HELIX_TURNS   = 4.5
const TUBE_RADIUS   = 0.095   // thick botanical vines
const RUNG_COUNT    = 22
const LEAF_COUNT    = 52      // leaves per strand
const SEGMENT_COUNT = 320

/* Smooth pseudo-noise for organic curve displacement */
function organicNoise(t: number, seed: number) {
  return (
    Math.sin(t * 7.3 + seed * 2.1) * 0.028 +
    Math.cos(t * 13.7 + seed * 0.8) * 0.016 +
    Math.sin(t * 21.1 + seed * 1.4) * 0.008
  )
}

/* Build an organically displaced helix curve */
function buildHelixCurve(phase: number): THREE.CatmullRomCurve3 {
  const points: THREE.Vector3[] = []
  const steps = 160
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const angle = t * Math.PI * 2 * HELIX_TURNS + phase
    const x = t * HELIX_LENGTH - HELIX_LENGTH / 2
    const y = HELIX_RADIUS * Math.sin(angle) + organicNoise(t, 1 + phase)
    const z = HELIX_RADIUS * Math.cos(angle) + organicNoise(t, 2 + phase)
    points.push(new THREE.Vector3(x, y, z))
  }
  return new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5)
}

/* Build rung (base-pair connector) geometry between the two strands */
function buildRungData() {
  const rungs: { start: THREE.Vector3; end: THREE.Vector3; thickness: number }[] = []
  for (let i = 0; i < RUNG_COUNT; i++) {
    const t = (i + 0.5) / RUNG_COUNT
    const angle = t * Math.PI * 2 * HELIX_TURNS
    const x = t * HELIX_LENGTH - HELIX_LENGTH / 2
    const noise = organicNoise(t, 3)
    const y1 = HELIX_RADIUS * Math.sin(angle) + noise
    const z1 = HELIX_RADIUS * Math.cos(angle)
    const y2 = HELIX_RADIUS * Math.sin(angle + Math.PI) + noise
    const z2 = HELIX_RADIUS * Math.cos(angle + Math.PI)
    rungs.push({
      start: new THREE.Vector3(x, y1, z1),
      end:   new THREE.Vector3(x, y2, z2),
      thickness: 0.024 + (Math.abs(Math.sin(i * 2.1)) * 0.014), // varied thickness
    })
  }
  return rungs
}

/* Build leaf data — tiny leaves growing off the strand at natural angles */
function buildLeafData(phase: number) {
  const leaves: {
    pos: THREE.Vector3
    rot: THREE.Euler
    scale: number
  }[] = []

  for (let i = 0; i < LEAF_COUNT; i++) {
    const t = i / LEAF_COUNT
    const angle = t * Math.PI * 2 * HELIX_TURNS + phase
    const x = t * HELIX_LENGTH - HELIX_LENGTH / 2
    const y = HELIX_RADIUS * Math.sin(angle) + organicNoise(t, phase)
    const z = HELIX_RADIUS * Math.cos(angle)

    // Offset slightly outward from center
    const outDir = new THREE.Vector3(0, Math.sin(angle), Math.cos(angle)).normalize()
    const leafPos = new THREE.Vector3(
      x + (Math.random() - 0.5) * 0.12,
      y + outDir.y * (TUBE_RADIUS + 0.02),
      z + outDir.z * (TUBE_RADIUS + 0.02)
    )

    // Random leaf orientation pointing outward
    const rotX = Math.random() * Math.PI * 2
    const rotY = Math.atan2(outDir.z, outDir.y) + (Math.random() - 0.5) * 0.8
    const rotZ = Math.random() * Math.PI

    leaves.push({
      pos: leafPos,
      rot: new THREE.Euler(rotX, rotY, rotZ),
      scale: 0.045 + Math.random() * 0.055,
    })
  }
  return leaves
}

/* Leaf shape — elongated ellipse with a point */
function createLeafShape(): THREE.Shape {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.bezierCurveTo(0.3, 0.4, 0.55, 0.8, 0, 1.2)
  shape.bezierCurveTo(-0.55, 0.8, -0.3, 0.4, 0, 0)
  return shape
}

/* ──────────────────────────────────────────────────────────────── */

interface BotanicalDNAProps {
  groupRef: React.RefObject<THREE.Group>
}

export default function BotanicalDNA({ groupRef }: BotanicalDNAProps) {
  /* Build all geometry in useMemo — expensive but cached */
  const geos = useMemo(() => {
    const curve1 = buildHelixCurve(0)
    const curve2 = buildHelixCurve(Math.PI)

    const strand1 = new THREE.TubeGeometry(curve1, SEGMENT_COUNT, TUBE_RADIUS, 12, false)
    const strand2 = new THREE.TubeGeometry(curve2, SEGMENT_COUNT, TUBE_RADIUS, 12, false)

    const rungData = buildRungData()
    const leafData1 = buildLeafData(0)
    const leafData2 = buildLeafData(Math.PI)
    const leafShape = createLeafShape()

    return { strand1, strand2, rungData, leafData1, leafData2, leafShape }
  }, [])

  /* Gentle idle motion — breathe */
  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.position.y = Math.sin(Date.now() * 0.00038) * 0.035
  })

  /* Materials */
  const strandMat = (
    <meshStandardMaterial
      color={new THREE.Color('#3a6b18')}
      roughness={0.72}
      metalness={0.04}
      emissive={new THREE.Color('#1c3d0c')}
      emissiveIntensity={0.42}
    />
  )

  const rungMat = (
    <meshStandardMaterial
      color={new THREE.Color('#4a7d22')}
      roughness={0.78}
      metalness={0.02}
      emissive={new THREE.Color('#22480e')}
      emissiveIntensity={0.28}
    />
  )

  const leafMat = (
    <meshStandardMaterial
      color={new THREE.Color('#5fa028')}
      roughness={0.65}
      metalness={0.0}
      emissive={new THREE.Color('#2a5010')}
      emissiveIntensity={0.38}
      side={THREE.DoubleSide}
    />
  )

  const glowMat1 = (
    <meshStandardMaterial
      color={new THREE.Color('#8fd44e')}
      transparent
      opacity={0.045}
      roughness={1}
      side={THREE.BackSide}
    />
  )

  return (
    <group ref={groupRef}>
      {/* ── Strand 1 ── */}
      <mesh geometry={geos.strand1} castShadow receiveShadow>
        {strandMat}
      </mesh>
      {/* Strand 1 outer glow */}
      <mesh geometry={geos.strand1}>
        {glowMat1}
      </mesh>

      {/* ── Strand 2 ── */}
      <mesh geometry={geos.strand2} castShadow receiveShadow>
        {strandMat}
      </mesh>
      <mesh geometry={geos.strand2}>
        {glowMat1}
      </mesh>

      {/* ── Rungs (cross-bars / base pairs) ── */}
      {geos.rungData.map((rung, i) => {
        const dir = new THREE.Vector3().subVectors(rung.end, rung.start)
        const len = dir.length()
        const mid = new THREE.Vector3().addVectors(rung.start, rung.end).multiplyScalar(0.5)
        const q = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.clone().normalize()
        )
        return (
          <mesh key={i} position={[mid.x, mid.y, mid.z]} quaternion={q} castShadow>
            <cylinderGeometry args={[rung.thickness, rung.thickness * 0.8, len, 7, 1]} />
            {rungMat}
          </mesh>
        )
      })}

      {/* ── Leaves on Strand 1 ── */}
      {geos.leafData1.map((leaf, i) => (
        <mesh
          key={`l1-${i}`}
          position={[leaf.pos.x, leaf.pos.y, leaf.pos.z]}
          rotation={leaf.rot}
          scale={leaf.scale}
        >
          <shapeGeometry args={[geos.leafShape]} />
          {leafMat}
        </mesh>
      ))}

      {/* ── Leaves on Strand 2 ── */}
      {geos.leafData2.map((leaf, i) => (
        <mesh
          key={`l2-${i}`}
          position={[leaf.pos.x, leaf.pos.y, leaf.pos.z]}
          rotation={leaf.rot}
          scale={leaf.scale}
        >
          <shapeGeometry args={[geos.leafShape]} />
          {leafMat}
        </mesh>
      ))}
    </group>
  )
}
