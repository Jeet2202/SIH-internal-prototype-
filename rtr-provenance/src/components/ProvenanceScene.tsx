import { useRef, useEffect, useState } from 'react'
import type React from 'react'
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

function getNodePos(stage: ProvenanceStage, isMobile: boolean): THREE.Vector3 {
  const origX = stage.tPosition * HELIX_LENGTH - HELIX_LENGTH / 2
  const origY = stage.nodePosition === 'up' ? NODE_Y_UP : NODE_Y_DOWN
  
  if (isMobile) {
    // Rotate -90 degrees around Z axis: x' = y, y' = -x
    // So the nodes align with the rotated DNA
    return new THREE.Vector3(origY, -origX, 0)
  }
  
  return new THREE.Vector3(origX, origY, 0)
}

/* ---------------------------------------------------------------------------
   CameraController — Cinematic zoom directly into the selected node
   
   Overview:  camera at [0, 1.4, 11.5], looking at [0, 0.1, 0]
   Selected:  camera travels smoothly to [np.x, np.y * 0.85, 4.2]
              looking directly at [np.x, np.y, 0]
              centering the node and zooming into it as a portal.
--------------------------------------------------------------------------- */

interface CameraControllerProps {
  isMobile: boolean
}

function CameraController({ isMobile }: CameraControllerProps) {
  const { camera } = useThree()
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      camera.position.set(0, isMobile ? 2.8 : 1.4, isMobile ? 11.5 : 11.5)
      camera.lookAt(0, isMobile ? 2.8 : 0.1, 0)
      initialized.current = true
    }
  }, [camera, isMobile])

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
  isMobile,
}: {
  selectedStage: ProvenanceStage | null
  onSelectStage: (stage: ProvenanceStage | null) => void
  autoRotate: boolean
  dnaLiftY: number
  isMobile: boolean
}) {
  const dnaGroup = useRef<THREE.Group>(null!)
  const { scene } = useThree()
  const controlsRef = useRef<any>(null)
  
  const [isIdle, setIsIdle] = useState(true)
  const idleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const onStart = () => {
      if (idleTimeout.current) clearTimeout(idleTimeout.current)
      setIsIdle(false)
    }
    const onEnd = () => {
      if (idleTimeout.current) clearTimeout(idleTimeout.current)
      idleTimeout.current = setTimeout(() => setIsIdle(true), 2500)
    }

    controls.addEventListener('start', onStart)
    controls.addEventListener('end', onEnd)
    return () => {
      controls.removeEventListener('start', onStart)
      controls.removeEventListener('end', onEnd)
      if (idleTimeout.current) clearTimeout(idleTimeout.current)
    }
  }, [])

  useEffect(() => {
    scene.fog = new THREE.FogExp2('#020701', 0.022)
    return () => { scene.fog = null }
  }, [scene])

  useEffect(() => {
    if (controlsRef.current && isMobile) {
      controlsRef.current.target.set(0, 2.8, 0)
      controlsRef.current.update()
    }
  }, [isMobile])

  // Direct wheel scroll — move camera Y and target Y together
  useEffect(() => {
    const canvas = document.getElementById('r3f-canvas')
    if (!canvas) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (!controlsRef.current) return
      const controls = controlsRef.current
      const delta = e.deltaY * 0.012
      const minY = -5, maxY = 8
      const newY = Math.max(minY, Math.min(maxY, controls.target.y + delta))
      const diff = newY - controls.target.y
      controls.target.y += diff
      controls.object.position.y += diff
      controls.update()
    }

    canvas.addEventListener('wheel', onWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', onWheel)
  }, [])

  // Mobile one-finger vertical swipe = scroll Y
  useEffect(() => {
    if (!isMobile) return
    const canvas = document.getElementById('r3f-canvas')
    if (!canvas) return

    let lastY: number | null = null

    const onTouchStart = (e: TouchEvent) => {
      if (selectedStage) return
      if (e.touches.length === 1) lastY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      if (selectedStage || e.touches.length !== 1 || lastY === null || !controlsRef.current) return
      e.preventDefault()
      const dy = (lastY - e.touches[0].clientY) * 0.025
      lastY = e.touches[0].clientY
      const controls = controlsRef.current
      const minY = -5, maxY = 8
      const newY = Math.max(minY, Math.min(maxY, controls.target.y + dy))
      const diff = newY - controls.target.y
      controls.target.y += diff
      controls.object.position.y += diff
      controls.update()
    }
    const onTouchEnd = () => { lastY = null }

    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd)
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [isMobile, selectedStage])

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
      <pointLight position={[-5.5,  1.2, 1.5]} intensity={0.65} color="#7CFF4F" distance={6} />
      <pointLight position={[-1.8, -1.2, 1.5]} intensity={0.50} color="#4ea8d2" distance={6} />
      <pointLight position={[ 0.2,  1.2, 1.5]} intensity={0.50} color="#c8922e" distance={6} />
      <pointLight position={[ 3.2, -1.2, 1.5]} intensity={0.50} color="#8b6cd4" distance={6} />
      <pointLight position={[ 5.5,  1.2, 1.5]} intensity={0.50} color="#7CFF4F" distance={6} />

      {/* Reactive stage light */}
      <StageLighting selectedStage={selectedStage} />

      {/* ── DNA ── */}
      <BotanicalDNA groupRef={dnaGroup} liftY={dnaLiftY} rotation={isMobile ? [0, 0, -Math.PI / 2] : [0, 0, 0]} />

      {/* ── Nodes ── */}
      {PRODUCT.stages.map((stage) => (
        <ProvenanceNode
          key={stage.id}
          stage={stage}
          isSelected={selectedStage?.id === stage.id}
          isAnySelected={selectedStage !== null}
          onSelect={(s) => onSelectStage(selectedStage?.id === s.id ? null : s)}
          position={getNodePos(stage, isMobile)}
          isMobile={isMobile}
        />
      ))}

      {/* ── Botanical Environment ── */}
      <BotanicalBackground />
      <BotanicalParticles />

      {/* ── Camera ── */}
      <CameraController isMobile={isMobile} />
      <OrbitControls
        ref={controlsRef}
        enabled={!selectedStage}
        autoRotate={autoRotate && !selectedStage && isIdle}
        autoRotateSpeed={1.2}
        enableDamping
        dampingFactor={0.06}
        enableZoom={true}
        minDistance={4.0}
        maxDistance={isMobile ? 16.0 : 16.0}
        minPolarAngle={0.01}
        maxPolarAngle={Math.PI - 0.01}
        minAzimuthAngle={-Infinity}
        maxAzimuthAngle={Infinity}
        enablePan={true}
        panSpeed={1.2}
        screenSpacePanning={true}
        // Workaround for missing THREE.TOUCH.NONE in TypeScript definitions
        touches={isMobile ? { ONE: 99 as unknown as THREE.TOUCH, TWO: THREE.TOUCH.DOLLY_ROTATE } : undefined}
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
  isMobile?: boolean
}

export default function ProvenanceScene({
  selectedStage,
  onSelectStage,
  autoRotate,
  dnaLiftY = 0,
  isMobile = false,
}: ProvenanceSceneProps) {
  return (
    <Canvas
      id="r3f-canvas"
      camera={{ fov: isMobile ? 55 : 38, near: 0.1, far: 80, position: [0, 1.4, isMobile ? 8.5 : 11.5] }}
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
        isMobile={isMobile}
      />
    </Canvas>
  )
}
