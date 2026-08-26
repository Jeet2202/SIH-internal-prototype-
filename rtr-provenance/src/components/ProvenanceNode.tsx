import { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { ProvenanceStage } from '../types/provenance'

/* ---------------------------------------------------------------------------
   ProvenanceNode — Distinct 3D node for each provenance stage.
   
   Each node has a unique visual identity communicating what the stage IS:
   - Farmer:        leaf/nature  (emerald green)
   - Lab:           flask/DNA    (scientific blue)
   - Manufacturing: gear/factory (amber gold)
   - Transport:     route/truck  (violet)
   - Product:       bottle/leaf  (bright green)

   All nodes: glowing core sphere + stage icon + rotating outer ring +
              animated stem + HTML label
--------------------------------------------------------------------------- */

const HELIX_LENGTH = 6.0
const NODE_Y_UP    =  0.80
const NODE_Y_DOWN  = -0.80

interface ProvenanceNodeProps {
  stage: ProvenanceStage
  isSelected: boolean
  isAnySelected: boolean
  onSelect: (stage: ProvenanceStage) => void
}

export default function ProvenanceNode({
  stage, isSelected, isAnySelected, onSelect,
}: ProvenanceNodeProps) {
  const coreRef  = useRef<THREE.Mesh>(null!)
  const ringRef  = useRef<THREE.Mesh>(null!)
  const ring2Ref = useRef<THREE.Mesh>(null!)
  const glowRef  = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  const pos: [number, number, number] = useMemo(() => {
    const x = stage.tPosition * HELIX_LENGTH - HELIX_LENGTH / 2
    const y = stage.nodePosition === 'up' ? NODE_Y_UP : NODE_Y_DOWN
    return [x, y, 0]
  }, [stage])

  const stemH = Math.abs(pos[1]) - 0.10
  const color = new THREE.Color(stage.color)
  const dimmed = isAnySelected && !isSelected

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (coreRef.current) {
      coreRef.current.position.y = pos[1] + Math.sin(t * 0.85 + stage.number * 1.1) * 0.055
    }
    if (ringRef.current)  ringRef.current.rotation.z  =  t * 0.5 + stage.number
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.3 + stage.number * 0.7
    if (glowRef.current)  glowRef.current.scale.setScalar(1 + Math.sin(t * 1.1 + stage.number) * 0.04)
  })

  const coreR = isSelected ? 0.145 : hovered ? 0.135 : 0.115
  const emI   = isSelected ? 1.0   : hovered ? 0.85  : 0.6
  const alpha = dimmed ? 0.2 : 1.0

  return (
    <group>
      {/* Organic vine stem connecting to DNA */}
      <mesh position={[pos[0], pos[1] / 2, pos[2]]}>
        <cylinderGeometry args={[0.008, 0.003, stemH, 5, 3]} />
        <meshStandardMaterial
          color={new THREE.Color('#5aac38')}
          transparent opacity={alpha * 0.55}
          emissive={new THREE.Color('#3a7a22')}
          emissiveIntensity={0.6}
          roughness={0.8}
        />
      </mesh>

      {/* Outer ambient glow halo */}
      <mesh ref={glowRef} position={pos}>
        <sphereGeometry args={[0.26, 10, 10]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={dimmed ? 0.03 : isSelected ? 0.16 : 0.09}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer rotation ring — stage-specific geometry */}
      <StageRing stage={stage} pos={pos} ringRef={ringRef} ring2Ref={ring2Ref} dimmed={dimmed} isSelected={isSelected} hovered={hovered} />

      {/* Core interactive sphere */}
      <mesh
        ref={coreRef}
        position={pos}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerLeave={() => setHovered(false)}
        onClick={(e) => { e.stopPropagation(); onSelect(stage) }}
      >
        <sphereGeometry args={[coreR, 22, 22]} />
        <meshStandardMaterial
          color={color}
          roughness={0.25}
          metalness={0.35}
          emissive={color}
          emissiveIntensity={emI}
          transparent
          opacity={dimmed ? 0.25 : 1}
        />
      </mesh>

      {/* Stage icon + label via Html */}
      <Html
        position={[pos[0], pos[1] + (pos[1] > 0 ? 0.30 : -0.30), pos[2]]}
        center
        distanceFactor={6}
        zIndexRange={[20, 30]}
        style={{ pointerEvents: 'none' }}
      >
        <NodeLabel stage={stage} hovered={hovered} isSelected={isSelected} dimmed={dimmed} />
      </Html>

      {/* Icon inside node — uses Html for SVG icon clarity */}
      <Html
        position={pos}
        center
        distanceFactor={5}
        zIndexRange={[21, 31]}
        style={{ pointerEvents: 'none' }}
        occlude={false}
      >
        <StageIcon
          type={stage.type}
          color={stage.color}
          dim={dimmed}
          size={isSelected ? 22 : 18}
        />
      </Html>
    </group>
  )
}

/* ─── Stage-specific outer ring ─────────────────────────────── */

function StageRing({ stage, pos, ringRef, ring2Ref, dimmed, isSelected, hovered }: {
  stage: ProvenanceStage
  pos: [number, number, number]
  ringRef: React.RefObject<THREE.Mesh>
  ring2Ref: React.RefObject<THREE.Mesh>
  dimmed: boolean
  isSelected: boolean
  hovered: boolean
}) {
  const color = new THREE.Color(stage.color)
  const alpha = dimmed ? 0.08 : isSelected ? 0.72 : hovered ? 0.55 : 0.38
  const alpha2 = dimmed ? 0.04 : isSelected ? 0.36 : 0.18
  const innerR = isSelected ? 0.20 : hovered ? 0.185 : 0.168
  const outerR = innerR + 0.028

  /* Vary the ring geometry per stage */
  const segments: Record<string, number> = {
    farmer: 48, lab: 6, manufacturing: 8, transport: 40, product: 48,
  }
  const segs = segments[stage.type] || 40

  return (
    <>
      <mesh ref={ringRef} position={pos}>
        <ringGeometry args={[innerR, outerR, segs]} />
        <meshBasicMaterial color={color} transparent opacity={alpha} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2Ref} position={pos}>
        <ringGeometry args={[innerR + 0.038, innerR + 0.052, segs]} />
        <meshBasicMaterial color={color} transparent opacity={alpha2} side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}

/* ─── SVG-based stage icons ──────────────────────────────────── */

function StageIcon({ type, color, dim, size }: { type: string; color: string; dim: boolean; size: number }) {
  const opacity = dim ? 0.25 : 0.95
  const s = size
  const svgs: Record<string, React.ReactNode> = {
    farmer: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6 2 3 7 3 12c0 2 1 4 2 5.5L12 22l7-4.5C20 16 21 14 21 12c0-5-3-10-9-10z" stroke={color} strokeWidth="1.5" fill={`${color}20`}/>
        <circle cx="12" cy="11" r="2.5" fill={color}/>
        <path d="M8 17c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    lab: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M9 3h6M10 3v8l-4 8a1 1 0 001 1h10a1 1 0 001-1l-4-8V3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="10" cy="15" r="1" fill={color}/>
        <circle cx="14" cy="17" r="0.8" fill={color}/>
        <circle cx="12" cy="14" r="0.6" fill={color} opacity="0.7"/>
      </svg>
    ),
    manufacturing: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="11" width="18" height="10" rx="1" stroke={color} strokeWidth="1.5"/>
        <path d="M7 11V7l4 4V7l4 4V7l3 3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="9" y="15" width="6" height="6" fill={`${color}30`} stroke={color} strokeWidth="1"/>
        <line x1="6" y1="14" x2="6" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="18" y1="14" x2="18" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    transport: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <rect x="1" y="9" width="15" height="8" rx="1" stroke={color} strokeWidth="1.5"/>
        <path d="M16 11h3l3 4v2h-6V11z" stroke={color} strokeWidth="1.5"/>
        <circle cx="5.5" cy="18.5" r="1.5" fill={color}/>
        <circle cx="18.5" cy="18.5" r="1.5" fill={color}/>
        <path d="M4 9V6c0-.6.4-1 1-1h8" stroke={color} strokeWidth="1" strokeDasharray="2 2" opacity="0.6"/>
      </svg>
    ),
    product: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <rect x="8" y="3" width="8" height="18" rx="2" stroke={color} strokeWidth="1.5" fill={`${color}18`}/>
        <path d="M8 7h8" stroke={color} strokeWidth="1.5"/>
        <path d="M10 11h4" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
        <path d="M10 13h4" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
        <path d="M10 15h3" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
        <path d="M12 3v1M12 20v1" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  }

  return (
    <div style={{ opacity, filter: `drop-shadow(0 0 4px ${color}80)` }}>
      {svgs[type]}
    </div>
  )
}

/* ─── Node label ─────────────────────────────────────────────── */

function NodeLabel({ stage, hovered, isSelected, dimmed }: {
  stage: ProvenanceStage
  hovered: boolean
  isSelected: boolean
  dimmed: boolean
}) {
  if (dimmed) return null
  return (
    <div style={{
      textAlign: 'center',
      userSelect: 'none',
      fontFamily: "'IBM Plex Mono', monospace",
      transition: 'opacity 0.3s',
    }}>
      <div style={{
        fontSize: 26,
        fontWeight: 700,
        color: stage.color,
        lineHeight: 1,
        textShadow: `0 0 12px ${stage.color}80`,
        fontFamily: "'Instrument Sans', 'Inter', sans-serif",
      }}>
        {stage.number}
      </div>
      <div style={{
        fontSize: 10,
        fontWeight: 600,
        color: '#e4ede0',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginTop: 2,
        whiteSpace: 'nowrap',
        textShadow: '0 1px 8px #000a',
      }}>
        {stage.title}
      </div>
      <div style={{
        fontSize: 9,
        color: stage.color,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        marginTop: 2,
        textShadow: `0 0 8px ${stage.color}60`,
      }}>
        {(hovered || isSelected) ? (isSelected ? '● Selected' : 'View Details') : 'Verified'}
      </div>
    </div>
  )
}
