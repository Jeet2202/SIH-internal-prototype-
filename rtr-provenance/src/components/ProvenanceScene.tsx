import { useRef, useState, useEffect } from 'react'
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
   CameraController — smooth cinematic zoom to selected node
--------------------------------------------------------------------------- */

const HELIX_LENGTH = 6.0
const NODE_Y_UP    =  0.80
const NODE_Y_DOWN  = -0.80

function getNodePos(stage: ProvenanceStage): THREE.Vector3 {
  const x = stage.tPosition * HELIX_LENGTH - HELIX_LENGTH / 2
  const y = stage.nodePosition === 'up' ? NODE_Y_UP : NODE_Y_DOWN
  return new THREE.Vector3(x, y, 0)
}

interface CameraControllerProps {
  selectedStage: ProvenanceStage | null
  onReady: () => void
}

function CameraController({ selectedStage, onReady }: CameraControllerProps) {
  const { camera } = useThree()
  const targetPos    = useRef(new THREE.Vector3(0, 0.3, 5.5))
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))

  useEffect(() => {
    camera.position.set(0, 0.3, 5.5)
    onReady()
  }, [])

  useEffect(() => {
    if (selectedStage) {
      const np = getNodePos(selectedStage)
      // Move camera toward the selected node's X position, slightly
      targetPos.current.set(np.x * 0.3, np.y * 0.25 + (np.y > 0 ? 0.5 : -0.5), 4.0)
      targetLookAt.current.set(np.x * 0.4, np.y * 0.3, 0)
    } else {
      targetPos.current.set(0, 0.3, 5.5)
      targetLookAt.current.set(0, 0, 0)
    }
  }, [selectedStage])

  useFrame((_, delta) => {
    const speed = Math.min(delta * 2.2, 0.08)
    camera.position.lerp(targetPos.current, speed)
    currentLookAt.current.lerp(targetLookAt.current, speed)
    camera.lookAt(currentLookAt.current)
  })

  return null
}

/* ---------------------------------------------------------------------------
   BotanicalBackground — dark forest environment (replaces stars!)
   Creates:
   - Large blurred botanical silhouette planes at varying depths
   - Atmospheric fog already set on scene
   - Floating pollen particles
--------------------------------------------------------------------------- */

function BotanicalLeafPlane({ pos, rot, scale, opacity }: {
  pos: [number, number, number]
  rot: [number, number, number]
  scale: number
  opacity: number
}) {
  // Large dark leaf silhouette
  return (
    <mesh position={pos} rotation={rot} scale={scale}>
      <planeGeometry args={[2.2, 3.0]} />
      <meshBasicMaterial
        color={new THREE.Color('#0d1f08')}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

function BotanicalBackground() {
  /* Large background silhouette leaves at various distances */
  const bgLeaves = [
    { pos: [-5.5, 1.5,  -4.5] as [number,number,number], rot: [0.1, 0.3, 0.5]  as [number,number,number], scale: 3.2, opacity: 0.88 },
    { pos: [ 5.0, 2.0,  -4.0] as [number,number,number], rot: [0.2,-0.2, 1.2]  as [number,number,number], scale: 2.8, opacity: 0.82 },
    { pos: [-4.0,-1.5,  -3.5] as [number,number,number], rot: [0.3, 0.1,-0.6]  as [number,number,number], scale: 2.4, opacity: 0.75 },
    { pos: [ 4.5,-1.0,  -4.2] as [number,number,number], rot: [-0.1,0.4, 0.8]  as [number,number,number], scale: 3.0, opacity: 0.78 },
    { pos: [ 0.5, 3.2,  -5.0] as [number,number,number], rot: [0.05,-0.1,0.2]  as [number,number,number], scale: 4.0, opacity: 0.60 },
    { pos: [-0.5,-3.0,  -4.8] as [number,number,number], rot: [0.1, 0.05,-0.3] as [number,number,number], scale: 3.5, opacity: 0.65 },
    { pos: [-6.5, 0.5,  -6.0] as [number,number,number], rot: [0.0, 0.5, 1.1]  as [number,number,number], scale: 4.5, opacity: 0.55 },
    { pos: [ 6.0, 0.0,  -6.5] as [number,number,number], rot: [0.1,-0.4, 0.7]  as [number,number,number], scale: 4.0, opacity: 0.50 },
    /* Medium distance */
    { pos: [-3.0, 2.5,  -2.5] as [number,number,number], rot: [0.4, 0.2, 1.8]  as [number,number,number], scale: 1.6, opacity: 0.45 },
    { pos: [ 3.5,-2.2,  -2.8] as [number,number,number], rot: [0.3,-0.3,-1.2]  as [number,number,number], scale: 1.8, opacity: 0.40 },
    { pos: [ 2.2, 2.8,  -3.2] as [number,number,number], rot: [0.5, 0.1, 2.0]  as [number,number,number], scale: 2.0, opacity: 0.38 },
    { pos: [-2.8,-2.5,  -3.0] as [number,number,number], rot: [0.2, 0.4,-1.5]  as [number,number,number], scale: 1.9, opacity: 0.35 },
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
   BotanicalParticles — organic pollen/dust (NOT stars)
--------------------------------------------------------------------------- */

function BotanicalParticles() {
  const count = 160
  const posBase = useRef<Float32Array>(null!)
  const pointsRef = useRef<THREE.Points>(null!)

  if (!posBase.current) {
    posBase.current = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      posBase.current[i * 3 + 0] = (Math.random() - 0.5) * 14
      posBase.current[i * 3 + 1] = (Math.random() - 0.5) * 6
      posBase.current[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1
    }
  }

  useFrame((state) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      const t = state.clock.elapsedTime * 0.07 + i * 0.28
      ;(pos.array as Float32Array)[i * 3 + 1] = posBase.current[i * 3 + 1] + Math.sin(t) * 0.12
      ;(pos.array as Float32Array)[i * 3 + 0] = posBase.current[i * 3 + 0] + Math.cos(t * 0.7) * 0.05
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={posBase.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#6ab832"
        size={0.022}
        sizeAttenuation
        transparent
        opacity={0.30}
        depthWrite={false}
      />
    </points>
  )
}

/* ---------------------------------------------------------------------------
   Stage-reactive lighting — subtle color shift when a stage is focused
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
      position={[0, 2, 2]}
      intensity={0.8}
      distance={8}
    />
  )
}

/* ---------------------------------------------------------------------------
   Main Scene
--------------------------------------------------------------------------- */

function Scene({ selectedStage, onSelectStage, autoRotate }: {
  selectedStage: ProvenanceStage | null
  onSelectStage: (stage: ProvenanceStage | null) => void
  autoRotate: boolean
}) {
  const dnaGroup = useRef<THREE.Group>(null!)
  const { scene } = useThree()

  useEffect(() => {
    scene.fog = new THREE.FogExp2('#050f03', 0.055)
    return () => { scene.fog = null }
  }, [scene])

  return (
    <>
      {/* ── Botanical Lighting ── */}
      <ambientLight intensity={0.18} color="#162a0c" />
      <hemisphereLight color="#2a5018" groundColor="#050f03" intensity={0.6} />

      {/* Key light — warm botanical */}
      <directionalLight
        position={[4, 5, 2]}
        intensity={1.6}
        color="#b0e070"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Rim light — cool blue */}
      <directionalLight
        position={[-4, -1, -3]}
        intensity={0.4}
        color="#204060"
      />
      {/* Under glow */}
      <pointLight position={[0, -2.5, 1]} intensity={0.35} color="#1a3a0c" distance={6} />

      {/* Node accent lights */}
      <pointLight position={[-2.5,  0.8, 0.8]} intensity={0.55} color="#7ec85a" distance={3} />
      <pointLight position={[ 0.8, -0.8, 0.8]} intensity={0.45} color="#4ea8d2" distance={3} />
      <pointLight position={[ 2.8,  0.8, 0.8]} intensity={0.45} color="#c8922e" distance={3} />

      {/* Reactive stage light */}
      <StageLighting selectedStage={selectedStage} />

      {/* ── DNA ── */}
      <BotanicalDNA groupRef={dnaGroup} />

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
      <CameraController
        selectedStage={selectedStage}
        onReady={() => {}}
      />
      <OrbitControls
        autoRotate={autoRotate && !selectedStage}
        autoRotateSpeed={0.45}
        enableDamping
        dampingFactor={0.06}
        minDistance={2.5}
        maxDistance={8.0}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.75}
      />

      {/* ── Post processing ── */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.32}
          luminanceSmoothing={0.9}
          intensity={0.65}
          radius={0.7}
        />
        <Vignette
          offset={0.3}
          darkness={0.72}
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
}

export default function ProvenanceScene({ selectedStage, onSelectStage, autoRotate }: ProvenanceSceneProps) {
  return (
    <Canvas
      id="r3f-canvas"
      camera={{ fov: 46, near: 0.1, far: 60, position: [0, 0.3, 5.5] }}
      shadows={{ type: THREE.PCFShadowMap }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.8]}
      style={{ background: '#050f03' }}
    >

      <Scene
        selectedStage={selectedStage}
        onSelectStage={onSelectStage}
        autoRotate={autoRotate}
      />
    </Canvas>
  )
}
