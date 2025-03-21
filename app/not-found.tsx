"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { useMemo, useRef, useState } from 'react'
import React from 'react'
import Link from 'next/link'

interface ShipProps {
  position: [number, number, number]
  rotation: [number, number, number]
  color: string
}

function FlyingSpaceship({ position, rotation, color }: ShipProps) {
  const ship = useRef<THREE.Group>(null)
  const [engineParticles, setEngineParticles] = useState<{position: [number, number, number], scale: number}[]>([])
  const lastParticle = useRef(0)
  
  useFrame((state, delta) => {
    if (ship.current) {
      // Move ship across the screen
      ship.current.position.x += delta * 2
      
      // Reset position when it goes off screen
      if (ship.current.position.x > 10) {
        ship.current.position.x = -10
      }
      
      // Add gentle wobble
      ship.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2
      ship.current.rotation.z = rotation[2] + Math.sin(state.clock.elapsedTime) * 0.1
      
      // Add engine particles
      if (state.clock.elapsedTime - lastParticle.current > 0.1) {
        lastParticle.current = state.clock.elapsedTime
        
        setEngineParticles(prev => [
          ...prev.filter(p => p.scale > 0.01).map(p => ({
            position: p.position,
            scale: p.scale * 0.9
          })),
          {
            position: [
              ship.current!.position.x - 0.5, 
              ship.current!.position.y, 
              ship.current!.position.z
            ],
            scale: 0.1
          }
        ])
      }
    }
  })

  return (
    <>
      <group ref={ship} position={position} rotation={rotation}>
        {/* Main body */}
        <mesh>
          <cylinderGeometry args={[0.15, 0.3, 0.8, 8]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.8}
            roughness={0.2}
            emissive={color}
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Cockpit */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.9}
            roughness={0.1}
            opacity={0.8}
            transparent={true}
          />
        </mesh>

        {/* Wings */}
        <mesh position={[0.3, -0.1, 0]} rotation={[0, 0, Math.PI * 0.15]}>
          <boxGeometry args={[0.4, 0.05, 0.2]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[-0.3, -0.1, 0]} rotation={[0, 0, -Math.PI * 0.15]}>
          <boxGeometry args={[0.4, 0.05, 0.2]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Engine */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 8]} />
          <meshStandardMaterial 
            color={color}
            emissive={color}
            emissiveIntensity={1}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Engine glow */}
        <pointLight position={[-0.2, -0.4, 0]} distance={0.8} intensity={2} color={color} />
      </group>
      
      {/* Engine particles */}
      {engineParticles.map((particle, index) => (
        <mesh key={index} position={particle.position} scale={particle.scale}>
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
      ))}
    </>
  )
}

function Galaxy() {
  const points = useRef<THREE.Points>(null)
  const count = 2000
  const galaxyRadius = 10
  const branches = 3
  const spin = 1
  const randomness = 0.5
  const randomnessPower = 3
  const insideColor = '#00ffff'
  const outsideColor = '#ff00ff'
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const colorInside = new THREE.Color(insideColor)
    const colorOutside = new THREE.Color(outsideColor)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Position
      const radius = Math.random() * galaxyRadius
      const spinAngle = radius * spin
      const branchAngle = ((i % branches) / branches) * Math.PI * 2

      const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness
      const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness
      const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
      positions[i3 + 1] = randomY
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

      // Color
      const mixedColor = colorInside.clone()
      mixedColor.lerp(colorOutside, radius / galaxyRadius)
      colors[i3] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b
    }

    return { positions, colors }
  }, [])

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.01
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={positions.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Memoize the SpaceShip component to prevent unnecessary re-renders
const MemoizedSpaceship = React.memo(FlyingSpaceship)

// 404 Page Component
export default function NotFound() {
  const shipProps = useMemo(() => ({
    position: [-8, 0, 0] as [number, number, number], 
    rotation: [0, 0, 0] as [number, number, number], 
    color: "#00ffff"
  }), [])

  return (
    <div className="h-screen w-full relative overflow-hidden max-w-[100vw]">
      {/* Transparent overlay for touch events */}
      <div className="absolute inset-0 z-10" />
      
      <div className="absolute inset-0 overflow-hidden">
        <Canvas 
          camera={{ position: [0, 0, 8] }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <React.Suspense fallback={null}>
            <Galaxy />
            <MemoizedSpaceship {...shipProps} />
          </React.Suspense>
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            autoRotate 
            autoRotateSpeed={0.1}
            enableDamping
            dampingFactor={0.05}
          />
        </Canvas>
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center px-6"
        >
          <h1 className="text-8xl font-extrabold mb-4 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.7)] tracking-wide">404</h1>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.7)] tracking-wide">Page Not Found</h2>
          <p className="text-lg md:text-xl text-white font-medium drop-shadow-[0_2px_6px_rgba(255,255,255,0.5)] mb-8 tracking-wide">You've ventured into uncharted space</p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link 
              href="/" 
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 inline-block"
            >
              Return Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 