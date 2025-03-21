"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { useMemo, useRef, useState, useEffect } from 'react'
import { FaChevronDown } from "react-icons/fa"
import React from 'react'

interface ShipProps {
  position: [number, number, number]
  rotation: [number, number, number]
  color: string
  teamId: number
}

interface LaserShotProps {
  position: [number, number, number]
  direction: [number, number, number]
  color: string
}

function Spaceship({ position, rotation, color, teamId }: ShipProps) {
  const ship = useRef<THREE.Group>(null)
  const [shots, setShots] = useState<LaserShotProps[]>([])
  const lastShot = useRef(0)
  
  useFrame((state, delta) => {
    if (ship.current) {
      // Slower rotation
      ship.current.rotation.z += delta * 0.2
      // Gentler wobble
      ship.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1

      // Less frequent shooting (every 2-3 seconds)
      if (state.clock.elapsedTime - lastShot.current > 2 + Math.random()) {
        lastShot.current = state.clock.elapsedTime
        const direction: [number, number, number] = teamId === 1 ? [1, -0.2, 0] : [-1, 0.2, 0]
        setShots(prev => [...prev.slice(-2), {
          position: [ship.current!.position.x, ship.current!.position.y, ship.current!.position.z],
          direction,
          color
        }])
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
        <pointLight position={[0, -0.4, 0]} distance={0.8} intensity={1} color={color} />
        
        {/* Side thrusters */}
        <mesh position={[0.15, -0.3, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
          <meshStandardMaterial 
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[-0.15, -0.3, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
          <meshStandardMaterial 
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>
      {shots.map((shot, index) => (
        <LaserShot key={index} {...shot} />
      ))}
    </>
  )
}

function LaserShot({ position, direction, color }: LaserShotProps) {
  const shot = useRef<THREE.Mesh>(null)
  
  useFrame((state, delta) => {
    if (shot.current) {
      shot.current.position.x += direction[0] * delta * 4
      shot.current.position.y += direction[1] * delta * 4
      shot.current.position.z += direction[2] * delta * 4
    }
  })

  return (
    <mesh ref={shot} position={position}>
      <sphereGeometry args={[0.02, 6, 6]} />
      <meshBasicMaterial color={color} />
      <pointLight distance={0.3} intensity={1} color={color} />
    </mesh>
  )
}

function BattleScene() {
  const ships = useMemo(() => [
    { position: [-3, 3, -2] as [number, number, number], rotation: [0, 0, Math.PI / 4] as [number, number, number], color: "#00ffff", teamId: 1 },
    { position: [3, -3, -2] as [number, number, number], rotation: [0, 0, -Math.PI / 4] as [number, number, number], color: "#ff3333", teamId: 2 },
    { position: [-2.5, -2.5, -3] as [number, number, number], rotation: [0, 0, Math.PI / 6] as [number, number, number], color: "#00ff66", teamId: 1 },
    { position: [2.5, 2.5, -3] as [number, number, number], rotation: [0, 0, -Math.PI / 6] as [number, number, number], color: "#ff00ff", teamId: 2 },
  ], [])

  return (
    <>
      {ships.map((ship, index) => (
        <Spaceship key={index} {...ship} />
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

// Memoize the BattleScene component to prevent unnecessary re-renders
const MemoizedBattleScene = React.memo(BattleScene)

// Function definition (no export keyword)
function HeroScene() {
  const handleScrollClick = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Add passive event listeners for scroll and touch events
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Your wheel event handling logic if needed
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      // Your touch event handling logic if needed
    };

    // Add event listeners with passive option
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    
    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return (
    <div className="h-screen w-full relative overflow-hidden max-w-[100vw]">
      {/* Transparent overlay for touch events */}
      <div className="absolute inset-0 z-10" />
      
      <div className="absolute inset-0 overflow-hidden">
          <Canvas 
            camera={{ position: [0, 2, 8] }}
            dpr={[1, 2]}
            performance={{ min: 0.5 }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <React.Suspense fallback={null}>
              <Galaxy />
              <MemoizedBattleScene />
            </React.Suspense>
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
              autoRotate 
              autoRotateSpeed={0.2}
              enableDamping
              dampingFactor={0.05}
            />
          </Canvas>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center px-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.7)] tracking-wide">João Coelho</h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white font-medium drop-shadow-[0_2px_6px_rgba(255,255,255,0.5)] tracking-wide">Software Engineer</p>
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 1,
          delay: 1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        onClick={handleScrollClick}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer"
        aria-label="Scroll to About section"
      >
        <FaChevronDown className="w-8 h-8 md:w-12 md:h-12 text-white opacity-75 hover:opacity-100 transition-opacity" />
      </motion.button>
    </div>
  )
}

// Default export for dynamic imports
export default HeroScene;