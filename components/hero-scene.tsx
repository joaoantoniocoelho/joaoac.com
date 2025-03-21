"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { useMemo, useRef, useState, useCallback } from 'react'
import { ChevronDownIcon } from 'lucide-react'

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
      ship.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.05

      // Less frequent shooting (every 2-3 seconds)
      if (state.clock.elapsedTime - lastShot.current > 2 + Math.random()) {
        lastShot.current = state.clock.elapsedTime
        const direction: [number, number, number] = teamId === 1 ? [1, -0.2, 0] : [-1, 0.2, 0]
        setShots(prev => [...prev.slice(-2), { // Keep only last 2 shots
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
        <mesh>
          <coneGeometry args={[0.2, 0.5, 4]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.4} 
            roughness={0.2}
            emissive={color}
            emissiveIntensity={0.4}
          />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.3, 0.1, 0.1]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.4} 
            roughness={0.2}
            emissive={color}
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Reduced engine glow intensity */}
        <pointLight position={[0, -0.3, 0]} distance={0.5} intensity={0.5} color={color} />
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
    { position: [-2, 2.5, -2] as [number, number, number], rotation: [0, 0, Math.PI / 4] as [number, number, number], color: "#00ffff", teamId: 1 },
    { position: [2, -2.5, -2] as [number, number, number], rotation: [0, 0, -Math.PI / 4] as [number, number, number], color: "#ff3333", teamId: 2 },
    { position: [-1.5, -1.5, -3] as [number, number, number], rotation: [0, 0, Math.PI / 6] as [number, number, number], color: "#00ff66", teamId: 1 },
    { position: [1.5, 1.5, -3] as [number, number, number], rotation: [0, 0, -Math.PI / 6] as [number, number, number], color: "#ff00ff", teamId: 2 },
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
  const count = 5000
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
      points.current.rotation.y += delta * 0.1
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

function ParticleField({ mousePosition }) {
  const points = useRef()
  const count = 1000
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return positions
  }, [])

  useFrame((state, delta) => {
    if (points.current && mousePosition.current) {
      const { x, y } = mousePosition.current
      points.current.rotation.x = y * 0.2
      points.current.rotation.y = x * 0.2
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ffffff" sizeAttenuation />
    </points>
  )
}

function AnimatedSphere({ mousePosition }) {
  const sphere = useRef()

  useFrame((state, delta) => {
    if (sphere.current && mousePosition.current) {
      const { x, y } = mousePosition.current
      sphere.current.position.x = x * 0.3
      sphere.current.position.y = -y * 0.3
      sphere.current.rotation.x += delta * 0.2
      sphere.current.rotation.y += delta * 0.2
    }
  })

  return (
    <Sphere ref={sphere} args={[1, 32, 32]}>
      <meshStandardMaterial
        color="#000000"
        metalness={0.7}
        roughness={0.3}
      />
    </Sphere>
  )
}

export function HeroScene() {
  const mousePosition = useRef({ x: 0, y: 0 })

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event
    const { innerWidth, innerHeight } = window
    mousePosition.current = {
      x: (clientX / innerWidth) * 2 - 1,
      y: -(clientY / innerHeight) * 2 + 1
    }
  }

  const handleScrollClick = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div 
      className="h-screen w-full relative"
      onMouseMove={handleMouseMove}
    >
      <Canvas camera={{ position: [0, 2, 8] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Galaxy />
        <ParticleField mousePosition={mousePosition} />
        <BattleScene />
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.5}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
        />
      </Canvas>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-4">John Doe</h1>
        <p className="text-xl md:text-2xl text-gray-300">Full Stack Developer</p>
      </motion.div>

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
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer"
      >
        <ChevronDownIcon className="w-12 h-12 text-white opacity-75 hover:opacity-100 transition-opacity" />
      </motion.button>
    </div>
  )
}