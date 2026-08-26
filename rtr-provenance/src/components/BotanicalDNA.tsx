import { useRef, useMemo } from 'react'
import type React from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

/* ---------------------------------------------------------------------------
   BotanicalDNA — ORGANIC BOTANICAL ROOT-VINE DOUBLE HELIX

   Architecture:
   ① Two independently-noised helix curves (phase 0 and π)
   ② Custom BufferGeometry with PER-SEGMENT variable radius (bulge/taper)
   ③ Vertex colors: dark crevice / bright ridge gradient per ring
   ④ 42 rungs connecting the two strands
   ⑤ InstancedMesh leaf sprites sprouting from both strands
   ⑥ Outer glow shell (BackSide, transparent) for soft bloom halo
   All geometry computed ONCE in useMemo, never per frame.
--------------------------------------------------------------------------- */

/* ── Scene constants (keep in sync with ProvenanceScene.tsx) ── */
const HELIX_RADIUS  = 0.50    // radial distance from central axis
const HELIX_LENGTH  = 14.0    // world units
const HELIX_TURNS   = 5.5
const BASE_RADIUS   = 0.038   // mean tube radius
const RUNG_COUNT    = 42
const CURVE_STEPS   = 220     // points sampled for the curve
const TUBE_SEGS     = 420     // longitudinal segments for custom tube
const RADIAL_SEGS   = 12      // ring subdivisions
const LEAF_PER_STRAND = 38    // leaves per strand via InstancedMesh

/* ══════════════════════════════════════════════════════════════════════
   MULTI-OCTAVE ORGANIC NOISE  (no external dependency)
   Returns value in [-1, 1] with fractal character
   Independently seeded per strand for non-mirrored look
══════════════════════════════════════════════════════════════════════ */
function oNoise(t: number, seed: number): number {
  // 4 octaves of sine/cosine with incommensurate frequencies
  return (
    Math.sin(t *  3.71 + seed * 1.37) * 0.42 +
    Math.cos(t *  7.13 + seed * 2.91) * 0.28 +
    Math.sin(t * 13.41 + seed * 0.83) * 0.18 +
    Math.cos(t * 23.17 + seed * 3.59) * 0.09 +
    Math.sin(t * 41.03 + seed * 1.11) * 0.03
  )
  // Sum ≈ range [-1, 1]
}

/* ══════════════════════════════════════════════════════════════════════
   NOISE-PERTURBED HELIX POINTS
   Returns the raw point array (cached) AND the CatmullRomCurve3
══════════════════════════════════════════════════════════════════════ */
function buildNoisyHelix(phase: number, seed: number): {
  curve: THREE.CatmullRomCurve3
  pts: THREE.Vector3[]
} {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= CURVE_STEPS; i++) {
    const t = i / CURVE_STEPS
    const angle = t * Math.PI * 2 * HELIX_TURNS + phase

    // Base helix
    const baseY = HELIX_RADIUS * Math.sin(angle)
    const baseZ = HELIX_RADIUS * Math.cos(angle)

    // Independent radial noise for each strand
    const radNoise  = oNoise(t, seed)          * 0.055  // ±5.5% radial wobble
    const axNoise   = oNoise(t, seed + 7.3)   * 0.028  // ±2.8% axial wobble
    const rollNoise = oNoise(t, seed + 14.7)  * 0.018  // cross-plane wobble

    const r = HELIX_RADIUS + radNoise
    const x = t * HELIX_LENGTH - HELIX_LENGTH / 2 + axNoise
    const y = r * Math.sin(angle) + rollNoise
    const z = r * Math.cos(angle) + rollNoise * 0.5

    pts.push(new THREE.Vector3(x, y, z))
  }
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5)
  return { curve, pts }
}

/* ══════════════════════════════════════════════════════════════════════
   CUSTOM VARIABLE-RADIUS TUBE GEOMETRY
   TubeGeometry cannot vary radius per segment.
   We build it manually:
     - Sample curve at TUBE_SEGS points
     - Compute Frenet frames (tangent/normal/binormal)
     - At each ring, scale radius by noise-driven bulge factor
     - Assemble position + normal + uv + index into BufferGeometry
     - Add vertex colors (dark in crevice, bright on ridge)
══════════════════════════════════════════════════════════════════════ */
function buildOrganicTubeGeo(
  curve: THREE.CatmullRomCurve3,
  seed: number
): THREE.BufferGeometry {
  const N = TUBE_SEGS
  const R = RADIAL_SEGS

  // Sample points + Frenet frames
  const frames = curve.computeFrenetFrames(N, false)

  const posArr:   number[] = []
  const normArr:  number[] = []
  const uvArr:    number[] = []
  const colArr:   number[] = []  // vertex colors
  const idxArr:   number[] = []

  for (let i = 0; i <= N; i++) {
    const t = i / N
    const pt = curve.getPointAt(t)
    const N3 = frames.normals[i]
    const B3 = frames.binormals[i]

    // Per-segment radius: BASE_RADIUS × (0.55 + noise * 0.90)  → range [0.55..1.45]×BASE
    const bulge = 0.55 + (oNoise(t, seed + 3.3) * 0.5 + 0.5) * 0.90
    const radius = BASE_RADIUS * bulge

    for (let j = 0; j <= R; j++) {
      const ang = (j / R) * Math.PI * 2
      const sinA = Math.sin(ang)
      const cosA = Math.cos(ang)

      // Normal on ring
      const nx = sinA * N3.x + cosA * B3.x
      const ny = sinA * N3.y + cosA * B3.y
      const nz = sinA * N3.z + cosA * B3.z

      posArr.push(pt.x + radius * nx, pt.y + radius * ny, pt.z + radius * nz)
      normArr.push(nx, ny, nz)
      uvArr.push(j / R, t * HELIX_TURNS)  // repeat UV along length

      // Vertex color: ridge = bright lime, crevice = dark forest green
      // cosA ∈ [-1,1] → use it to bias ridge vs crevice
      const ridge = (cosA * 0.5 + 0.5)   // [0..1], 1 = ridge
      // Add per-segment tonal variation
      const tone = 0.72 + oNoise(t * 4.1, seed + j * 0.27) * 0.28

      const cr = (0.18 + ridge * 0.22) * tone   // R channel
      const cg = (0.32 + ridge * 0.28) * tone   // G channel
      const cb = (0.06 + ridge * 0.04) * tone   // B channel
      colArr.push(cr, cg, cb)
    }
  }

  // Indices — two triangles per quad
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < R; j++) {
      const a = (R + 1) * i       + j
      const b = (R + 1) * (i + 1) + j
      const c = (R + 1) * (i + 1) + (j + 1)
      const d = (R + 1) * i       + (j + 1)
      idxArr.push(a, b, d,  b, c, d)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(posArr,  3))
  geo.setAttribute('normal',   new THREE.Float32BufferAttribute(normArr, 3))
  geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uvArr,   2))
  geo.setAttribute('color',    new THREE.Float32BufferAttribute(colArr,  3))
  geo.setIndex(idxArr)
  return geo
}

/* ══════════════════════════════════════════════════════════════════════
   OUTER GLOW SHELL  — BackSide enlarged tube for soft halo effect
   We use TubeGeometry here because constant radius is fine for glow
══════════════════════════════════════════════════════════════════════ */
function buildGlowTube(curve: THREE.CatmullRomCurve3): THREE.BufferGeometry {
  return new THREE.TubeGeometry(curve, 160, BASE_RADIUS * 3.2, 8, false)
}

/* ══════════════════════════════════════════════════════════════════════
   RUNGS — connect matching point on curve1 to curve2
   Resampled from both noisy curves for correct alignment
══════════════════════════════════════════════════════════════════════ */
interface RungDatum {
  mid: [number, number, number]
  quat: THREE.Quaternion
  len: number
  thick: number
}

function buildRungs(
  curve1: THREE.CatmullRomCurve3,
  curve2: THREE.CatmullRomCurve3
): RungDatum[] {
  const rungs: RungDatum[] = []
  for (let i = 0; i < RUNG_COUNT; i++) {
    const t = (i + 0.5) / RUNG_COUNT
    const p1 = curve1.getPointAt(t)
    const p2 = curve2.getPointAt(t)
    const dir = new THREE.Vector3().subVectors(p2, p1)
    const len = dir.length()
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5)
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.normalize()
    )
    const thick = 0.008 + Math.abs(Math.sin(i * 2.3)) * 0.007
    rungs.push({ mid: [mid.x, mid.y, mid.z], quat: q, len, thick })
  }
  return rungs
}

/* ══════════════════════════════════════════════════════════════════════
   LEAF SPRITE DATA  for InstancedMesh
══════════════════════════════════════════════════════════════════════ */
interface LeafInstance {
  matrix: THREE.Matrix4
  color: THREE.Color
}

function buildLeafInstances(
  curve: THREE.CatmullRomCurve3,
  frames: ReturnType<THREE.CatmullRomCurve3['computeFrenetFrames']>,
  seed: number
): LeafInstance[] {
  const instances: LeafInstance[] = []
  const dummy = new THREE.Object3D()
  const rng = (s: number) => (Math.sin(s * 127.1 + seed * 311.7) * 0.5 + 0.5)

  for (let i = 0; i < LEAF_PER_STRAND; i++) {
    const t = (i + rng(i * 3.1)) / LEAF_PER_STRAND
    const pt = curve.getPointAt(t)
    const N3 = frames.normals[Math.min(Math.floor(t * TUBE_SEGS), TUBE_SEGS - 1)]
    const B3 = frames.binormals[Math.min(Math.floor(t * TUBE_SEGS), TUBE_SEGS - 1)]
    const T3 = frames.tangents[Math.min(Math.floor(t * TUBE_SEGS), TUBE_SEGS - 1)]

    // Random outward direction from strand surface
    const outAngle = rng(i * 7.3) * Math.PI * 2
    const outDir = new THREE.Vector3(
      Math.sin(outAngle) * N3.x + Math.cos(outAngle) * B3.x,
      Math.sin(outAngle) * N3.y + Math.cos(outAngle) * B3.y,
      Math.sin(outAngle) * N3.z + Math.cos(outAngle) * B3.z,
    ).normalize()

    const leafOffset = BASE_RADIUS * 1.6 + rng(i * 2.9) * 0.04
    dummy.position.set(
      pt.x + outDir.x * leafOffset,
      pt.y + outDir.y * leafOffset,
      pt.z + outDir.z * leafOffset,
    )

    // Orient leaf: up = outDir, forward = blend of tangent and out
    const leafUp = outDir.clone()
    const leafFwd = new THREE.Vector3().crossVectors(leafUp, T3).normalize()
    dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), leafUp)
    // twist around its axis by random amount
    const twist = new THREE.Quaternion().setFromAxisAngle(leafUp, rng(i * 4.1) * Math.PI * 2)
    dummy.quaternion.multiply(twist)
    dummy.quaternion.multiply(
      new THREE.Quaternion().setFromAxisAngle(leafFwd, (rng(i * 5.7) - 0.5) * 0.8)
    )

    const scale = 0.028 + rng(i * 6.3) * 0.042
    dummy.scale.set(scale, scale * (1.4 + rng(i * 8.1) * 0.8), scale * 0.3)
    dummy.updateMatrix()

    // Leaf color: range from dark mossy to bright lime
    const bright = 0.35 + rng(i * 9.7) * 0.65
    const leafColor = new THREE.Color(
      0.05 + bright * 0.25,
      0.18 + bright * 0.50,
      0.02 + bright * 0.05
    )

    instances.push({ matrix: dummy.matrix.clone(), color: leafColor })
  }
  return instances
}

/* ══════════════════════════════════════════════════════════════════════
   LEAF GEOMETRY — simple elongated ellipse shape
══════════════════════════════════════════════════════════════════════ */
function createLeafGeo(): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.bezierCurveTo( 0.4,  0.3,  0.45,  0.7, 0, 1.0)
  shape.bezierCurveTo(-0.45, 0.7, -0.4,  0.3, 0, 0)
  return new THREE.ShapeGeometry(shape, 6)
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════════════ */

interface BotanicalDNAProps {
  groupRef: React.RefObject<THREE.Group>
  liftY?: number
}

export default function BotanicalDNA({ groupRef, liftY = 0 }: BotanicalDNAProps) {
  const targetLift = useRef(0)

  /* ── Build everything ONCE ── */
  const geo = useMemo(() => {
    // Two independently noised curves
    const { curve: curve1, pts: pts1 } = buildNoisyHelix(0,        2.17)
    const { curve: curve2            } = buildNoisyHelix(Math.PI,  8.43)

    // Custom variable-radius tube geometry
    const tube1 = buildOrganicTubeGeo(curve1, 2.17)
    const tube2 = buildOrganicTubeGeo(curve2, 8.43)

    // Glow shells (cheap — constant radius TubeGeometry)
    const glow1 = buildGlowTube(curve1)
    const glow2 = buildGlowTube(curve2)

    // Rungs aligned to actual noisy curves
    const rungs = buildRungs(curve1, curve2)

    // Leaf instances on both strands
    const frames1 = curve1.computeFrenetFrames(TUBE_SEGS, false)
    const frames2 = curve2.computeFrenetFrames(TUBE_SEGS, false)
    const leaves1 = buildLeafInstances(curve1, frames1, 5.33)
    const leaves2 = buildLeafInstances(curve2, frames2, 12.71)

    // Leaf geometry (shared)
    const leafGeo = createLeafGeo()

    // Expose curve1 pts for external use (stage node alignment if needed)
    void pts1

    return { tube1, tube2, glow1, glow2, rungs, leaves1, leaves2, leafGeo }
  }, [])

  /* ── Materials — memoized ── */
  const mats = useMemo(() => {
    // Main strand — matte bark-like, vertex colors enabled
    const strandMat = new THREE.MeshStandardMaterial({
      roughness:         0.82,
      metalness:         0.04,
      vertexColors:      true,       // uses per-vertex color arrays built above
      emissive:          new THREE.Color('#0d2206'),
      emissiveIntensity: 0.40,
    })

    // Outer glow shell — very transparent bright green
    const glowMat = new THREE.MeshStandardMaterial({
      color:       new THREE.Color('#72d936'),
      transparent: true,
      opacity:     0.040,
      roughness:   1.0,
      side:        THREE.BackSide,
      depthWrite:  false,
    })

    // Rung (crossbar) — slightly lighter, semi-transparent
    const rungMat = new THREE.MeshStandardMaterial({
      color:             new THREE.Color('#4a8820'),
      roughness:         0.78,
      metalness:         0.02,
      emissive:          new THREE.Color('#1e3e0a'),
      emissiveIntensity: 0.35,
      transparent:       true,
      opacity:           0.85,
    })

    // Leaf material — double-sided, varied green
    const leafMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness:    0.75,
      metalness:    0.0,
      side:         THREE.DoubleSide,
      transparent:  true,
      opacity:      0.88,
      emissive:     new THREE.Color('#0a1e04'),
      emissiveIntensity: 0.30,
    })

    return { strandMat, glowMat, rungMat, leafMat }
  }, [])

  /* ── Set leaf instance matrices & colors on mount ── */
  useMemo(() => {
    // We set them in a separate effect-like useMemo that runs after ref assignment.
    // Actual assignment happens in the render below via a callback ref pattern.
    return null
  }, [])

  /* ── Gentle breathing motion (only Y translation) ── */
  useFrame(() => {
    if (!groupRef.current) return
    const breathe = Math.sin(Date.now() * 0.00030) * 0.022
    targetLift.current += (liftY - targetLift.current) * 0.048
    groupRef.current.position.y = breathe + targetLift.current
  })

  /* Helper: apply leaf instances to an InstancedMesh ref */
  const applyLeaves = (
    mesh: THREE.InstancedMesh | null,
    instances: { matrix: THREE.Matrix4; color: THREE.Color }[]
  ) => {
    if (!mesh) return
    instances.forEach(({ matrix, color }, i) => {
      mesh.setMatrixAt(i, matrix)
      mesh.setColorAt(i, color)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }

  return (
    <group ref={groupRef}>

      {/* ── Strand 1 — organic variable-radius tube ── */}
      <mesh geometry={geo.tube1} castShadow receiveShadow material={mats.strandMat} />
      {/* Strand 1 outer glow */}
      <mesh geometry={geo.glow1} material={mats.glowMat} />

      {/* ── Strand 2 — organic variable-radius tube ── */}
      <mesh geometry={geo.tube2} castShadow receiveShadow material={mats.strandMat} />
      {/* Strand 2 outer glow */}
      <mesh geometry={geo.glow2} material={mats.glowMat} />

      {/* ── Rungs / base-pair crossbars ── */}
      {geo.rungs.map((rung, i) => (
        <mesh
          key={i}
          position={rung.mid}
          quaternion={rung.quat}
          castShadow
          material={mats.rungMat}
        >
          <cylinderGeometry args={[rung.thick, rung.thick * 0.65, rung.len, 6, 1]} />
        </mesh>
      ))}

      {/* ── Leaves on Strand 1 ── */}
      <instancedMesh
        ref={(mesh) => { applyLeaves(mesh, geo.leaves1) }}
        args={[geo.leafGeo, mats.leafMat, geo.leaves1.length]}
        castShadow
      />

      {/* ── Leaves on Strand 2 ── */}
      <instancedMesh
        ref={(mesh) => { applyLeaves(mesh, geo.leaves2) }}
        args={[geo.leafGeo, mats.leafMat, geo.leaves2.length]}
        castShadow
      />

    </group>
  )
}
