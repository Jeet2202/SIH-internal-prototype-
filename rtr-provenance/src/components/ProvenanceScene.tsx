import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import BotanicalDNA from './BotanicalDNA'
import ProvenanceNode from './ProvenanceNode'
import { PRODUCT } from '../data/provenance'
import type { ProvenanceStage } from '../types/provenance'

/* ---------------------------------------------------------------------------
   Constants — keep in sync with BotanicalDNA.tsx
--------------------------------------------------------------------------- */
const HELIX_LENGTH = 14.0
const NODE_Y_UP    =  1.10
const NODE_Y_DOWN  = -1.10

export { HELIX_LENGTH, NODE_Y_UP, NODE_Y_DOWN }

function getNodePos(stage: ProvenanceStage): THREE.Vector3 {
  const x = stage.tPosition * HELIX_LENGTH - HELIX_LENGTH / 2
  const y = stage.nodePosition === 'up' ? NODE_Y_UP : NODE_Y_DOWN
  return new THREE.Vector3(x, y, 0)
}

/* ---------------------------------------------------------------------------
   CameraController — smooth cinematic zoom to selected node
   
   Overview:  camera at [0, 1.4, 11.5], looking at [0, 0.1, 0]
   Selected:  camera shifts X toward node, Y raises, zooms slightly
              DNA lifts in composition leaving bottom space for detail panel
--------------------------------------------------------------------------- */

interface CameraControllerProps {
  selectedStage: ProvenanceStage | null
}

function CameraController({ selectedStage }: CameraControllerProps) {
  const { camera } = useThree()
  const targetPos    = useRef(new THREE.Vector3(0, 1.4, 11.5))
  const targetLookAt = useRef(new THREE.Vector3(0, 0.1, 0))
  const currentLookAt = useRef(new THREE.Vector3(0, 0.1, 0))
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      camera.position.set(0, 1.4, 11.5)
      initialized.current = true
    }
  }, [camera])

  useEffect(() => {
    if (selectedStage) {
      const np = getNodePos(selectedStage)
      // Pull camera back a little, shift toward node X, raise Y to create
      // space at bottom for the detail panel
      targetPos.current.set(
        np.x * 0.12,
        1.8,
        10.8
      )
      // Look slightly lower than center so DNA sits in upper portion
      targetLookAt.current.set(np.x * 0.08, 0.3, 0)
    } else {
      targetPos.current.set(0, 1.4, 11.5)
      targetLookAt.current.set(0, 0.1, 0)
    }
  }, [selectedStage])

  useFrame((_, delta) => {
    const speed = Math.min(delta * 2.0, 0.07)
    camera.position.lerp(targetPos.current, speed)
    currentLookAt.current.lerp(targetLookAt.current, speed)
    camera.lookAt(currentLookAt.current)
  })

  return null
}

/* ---------------------------------------------------------------------------
   BotanicalBackground — very dark forest environment
--------------------------------------------------------------------------- */

function BotanicalLeafPlane({ pos, rot, scale, opacity }: {
  pos: [number, number, number]
  rot: [number, number, number]
  scale: number
  opacity: number
}) {
  return (
    <mesh position={pos} rotation={rot} scale={scale}>
      <planeGeometry args={[2.8, 4.0]} />
      <meshBasicMaterial
        color={new THREE.Color('#080f05')}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

function BotanicalBackground() {
  const bgLeaves = [
    { pos: [-10, 2.5, -8] as [number,number,number],  rot: [0.1, 0.2, 0.6]  as [number,number,number], scale: 5.0, opacity: 0.92 },
    { pos: [ 10, 2.5, -8] as [number,number,number],  rot: [0.2,-0.2, 1.1]  as [number,number,number], scale: 5.0, opacity: 0.88 },
    { pos: [-8, -2.0, -7] as [number,number,number],  rot: [0.3, 0.1,-0.7]  as [number,number,number], scale: 4.2, opacity: 0.80 },
    { pos: [ 8, -2.0, -7] as [number,number,number],  rot: [-0.1,0.4, 0.9]  as [number,number,number], scale: 4.5, opacity: 0.78 },
    { pos: [ 0.5, 4.5, -9] as [number,number,number], rot: [0.0,-0.1,0.2]   as [number,number,number], scale: 6.0, opacity: 0.65 },
    { pos: [-1.0,-4.0, -8] as [number,number,number], rot: [0.1, 0.05,-0.3] as [number,number,number], scale: 5.5, opacity: 0.70 },
    { pos: [-12, 0.5, -10] as [number,number,number], rot: [0.0, 0.5, 1.2]  as [number,number,number], scale: 7.0, opacity: 0.60 },
    { pos: [ 12, 0.0, -10] as [number,number,number], rot: [0.1,-0.4, 0.8]  as [number,number,number], scale: 6.5, opacity: 0.55 },
    // Mid-distance
    { pos: [-5, 3.5, -5]  as [number,number,number],  rot: [0.4, 0.2, 1.9]  as [number,number,number], scale: 2.8, opacity: 0.48 },
    { pos: [ 6,-3.0, -5]  as [number,number,number],  rot: [0.3,-0.3,-1.3]  as [number,number,number], scale: 3.0, opacity: 0.42 },
    { pos: [ 4, 4.0, -6]  as [number,number,number],  rot: [0.5, 0.1, 2.1]  as [number,number,number], scale: 3.2, opacity: 0.38 },
    { pos: [-4,-3.5, -5.5] as [number,number,number], rot: [0.2, 0.4,-1.6]  as [number,number,number], scale: 3.0, opacity: 0.35 },
  ]

  return (
    <>
      {bgLeaves.map((l, i) => (
        <BotanicalLeafPlane key={i} {...l} />
      ))}
    </>
  )
}

/* ---------------------------------------------------------------------------
   BotanicalParticles — subtle organic pollen
--------------------------------------------------------------------------- */

function BotanicalParticles() {
  const count = 120
  const posBase = useRef<Float32Array>(null!)
  const pointsRef = useRef<THREE.Points>(null!)

  if (!posBase.current) {
    posBase.current = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      posBase.current[i * 3 + 0] = (Math.random() - 0.5) * 20
      posBase.current[i * 3 + 1] = (Math.random() - 0.5) * 8
      posBase.current[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1
    }
  }

  useFrame((state) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      const t = state.clock.elapsedTime * 0.055 + i * 0.22
      ;(pos.array as Float32Array)[i * 3 + 1] = posBase.current[i * 3 + 1] + Math.sin(t) * 0.10
      ;(pos.array as Float32Array)[i * 3 + 0] = posBase.current[i * 3 + 0] + Math.cos(t * 0.6) * 0.04
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[posBase.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#5aad2a"
        size={0.018}
        sizeAttenuation
        transparent
        opacity={0.22}
        depthWrite={false}
      />
    </points>
  )
}

/* ---------------------------------------------------------------------------
   StageLighting
--------------------------------------------------------------------------- */

function StageLighting({ selectedStage }: { selectedStage: ProvenanceStage | null }) {
  const lightRef  = useRef<THREE.PointLight>(null!)
  const targetColor = useRef(new THREE.Color('#3a7a22'))
  const currentColor = useRef(new THREE.Color('#3a7a22'))

  useEffect(() => {
    if (!selectedStage) {
      targetColor.current.set('#3a7a22')
    } else {
      targetColor.current.set(selectedStage.color)
    }
  }, [selectedStage])

  useFrame(() => {
    currentColor.current.lerp(targetColor.current, 0.03)
    if (lightRef.current) {
      lightRef.current.color.copy(currentColor.current)
    }
  })

  return (
    <pointLight
      ref={lightRef}
      position={[0, 2, 3]}
      intensity={1.2}
      distance={12}
    />
  )
}

/* ---------------------------------------------------------------------------
   Main Scene
--------------------------------------------------------------------------- */

function Scene({
  selectedStage,
  onSelectStage,
  autoRotate,
  dnaLiftY,
}: {
  selectedStage: ProvenanceStage | null
  onSelectStage: (stage: ProvenanceStage | null) => void
  autoRotate: boolean
  dnaLiftY: number
}) {
  const dnaGroup = useRef<THREE.Group>(null!)
  const { scene } = useThree()

  useEffect(() => {
    scene.fog = new THREE.FogExp2('#020701', 0.022)
    return () => { scene.fog = null }
  }, [scene])

  return (
    <>
      {/* ── 3-Point Botanical Lighting ── */}

      {/* Ambient — very subtle, deep forest */}
      <ambientLight intensity={0.14} color="#0d1f08" />
      <hemisphereLight color="#2a5018" groundColor="#020501" intensity={0.55} />

      {/* KEY light — warm botanical upper-front-left, casts shadows */}
      <directionalLight
        position={[4, 10, 5]}
        intensity={2.4}
        color="#c2f080"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />

      {/* FILL light — cool blue-grey opposite side, low intensity */}
      <directionalLight
        position={[-6, -2, -5]}
        intensity={0.35}
        color="#2040a0"
      />

      {/* RIM / BACK light — separates strand silhouette from dark bg */}
      <directionalLight
        position={[0, -3, -8]}
        intensity={0.70}
        color="#88ffaa"
      />

      {/* Under glow */}
      <pointLight position={[0, -3.5, 1]} intensity={0.30} color="#0c1f06" distance={12} />

      {/* Node accent spotlights at DNA helix waypoints */}
      <pointLight position={[-5.5,  1.2, 1.5]} intensity={0.65} color="#7ec85a" distance={6} />
      <pointLight position={[-1.8, -1.2, 1.5]} intensity={0.50} color="#4ea8d2" distance={6} />
      <pointLight position={[ 0.2,  1.2, 1.5]} intensity={0.50} color="#c8922e" distance={6} />
      <pointLight position={[ 3.2, -1.2, 1.5]} intensity={0.50} color="#8b6cd4" distance={6} />
      <pointLight position={[ 5.5,  1.2, 1.5]} intensity={0.50} color="#7ec85a" distance={6} />

      {/* Reactive stage light */}
      <StageLighting selectedStage={selectedStage} />

      {/* ── DNA ── */}
      <BotanicalDNA groupRef={dnaGroup} liftY={dnaLiftY} />

      {/* ── Nodes ── */}
      {PRODUCT.stages.map((stage) => (
        <ProvenanceNode
          key={stage.id}
          stage={stage}
          isSelected={selectedStage?.id === stage.id}
          isAnySelected={selectedStage !== null}
          onSelect={(s) => onSelectStage(selectedStage?.id === s.id ? null : s)}
        />
      ))}

      {/* ── Botanical Environment ── */}
      <BotanicalBackground />
      <BotanicalParticles />

      {/* ── Camera ── */}
      <CameraController selectedStage={selectedStage} />
      <OrbitControls
        autoRotate={autoRotate && !selectedStage}
        autoRotateSpeed={0.35}
        enableDamping
        dampingFactor={0.06}
        minDistance={4.0}
        maxDistance={16.0}
        minPolarAngle={Math.PI * 0.22}
        maxPolarAngle={Math.PI * 0.78}
      />

      {/* ── Post processing ── */}
      <EffectComposer>
        {/* Bloom: tight threshold catches only bright emissive areas (rim-lit ridges, glow shells) */}
        <Bloom
          luminanceThreshold={0.22}
          luminanceSmoothing={0.85}
          intensity={1.10}
          radius={0.55}
        />
        {/* Vignette: darker edges push eye toward DNA center */}
        <Vignette
          offset={0.28}
          darkness={0.88}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  )
}

/* ---------------------------------------------------------------------------
   ProvenanceScene — root Canvas
--------------------------------------------------------------------------- */

interface ProvenanceSceneProps {
  selectedStage: ProvenanceStage | null
  onSelectStage: (stage: ProvenanceStage | null) => void
  autoRotate: boolean
  dnaLiftY?: number
}

export default function ProvenanceScene({
  selectedStage,
  onSelectStage,
  autoRotate,
  dnaLiftY = 0,
}: ProvenanceSceneProps) {
  return (
    <Canvas
      id="r3f-canvas"
      camera={{ fov: 38, near: 0.1, far: 80, position: [0, 1.4, 11.5] }}
      shadows={{ type: THREE.PCFShadowMap }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.8]}
      style={{ background: '#030a02' }}
    >
      <Scene
        selectedStage={selectedStage}
        onSelectStage={onSelectStage}
        autoRotate={autoRotate}
        dnaLiftY={dnaLiftY}
      />
    </Canvas>
  )
}
