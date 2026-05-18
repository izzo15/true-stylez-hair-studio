'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Html, useGLTF } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function BarberScene({ onObjectClick, onObjectHover }: { onObjectClick: (name: string) => void; onObjectHover: (name: string) => void }) {
  const { viewport } = useThree()

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
       <mesh 
         position={[0, -1, 0]}
         onClick={() => onObjectClick('chair')}
         onPointerOver={() => onObjectHover('chair')}
         onPointerOut={() => onObjectHover('')}
       >
        <cylinderGeometry args={[0.8, 1, 0.5, 32]} />
        <meshStandardMaterial color="#1a1f2e" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh 
        position={[1.5, 0, 0]}
        onClick={() => onObjectClick('clipper')}
        onPointerOver={() => onObjectHover('clipper')}
        onPointerOut={() => onObjectHover('')}
      >
        <boxGeometry args={[0.3, 0.1, 0.5]} />
        <meshStandardMaterial color="#d94600" emissive="#ff6600" emissiveIntensity={0.3} />
      </mesh>
      
      <mesh 
        position={[0, 2, 0]}
        onClick={() => onObjectClick('mirror')}
        onPointerOver={() => onObjectHover('mirror')}
        onPointerOut={() => onObjectHover('')}
      >
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshStandardMaterial color="#c9a66b" metalness={0.9} roughness={0.1} />
      </mesh>

      <OrbitControls enableZoom={true} enablePan={false} />
    </>
  )
}

export function ThreeDChair() {
  const [tooltip, setTooltip] = useState<{ show: boolean; text: string; position: [number, number, number] }>({ show: false, text: '', position: [0, 0, 0] })
  const [hoveredObject, setHoveredObject] = useState<string>('')

  const handleObjectClick = (name: string) => {
    const messages: Record<string, string> = {
      chair: 'Barber Chair - Rotate me!',
      clipper: 'Skin Fade - $40',
      mirror: 'True Stylez'
    }
    setTooltip({ show: true, text: messages[name] || '', position: getObjectPosition(name) })
    setTimeout(() => setTooltip({ show: false, text: '', position: [0, 0, 0] }), 3000)
  }

  const handleObjectHover = (name: string) => {
    setHoveredObject(name)
    // Scale up the object slightly on hover for feedback
    // This would be handled in the BarberScene component with pointer events
  }

  const getObjectPosition = (name: string): [number, number, number] => {
    const positions: Record<string, [number, number, number]> = {
      chair: [0, -1, 0],
      clipper: [1.5, 0, 0],
      mirror: [0, 2, 0]
    }
    return positions[name] || [0, 0, 0]
  }

  return (
    <div className="relative h-96 w-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Suspense fallback={
          <Html center>
            <div className="text-accent">Loading 3D Experience...</div>
          </Html>
        }>
          <BarberScene 
            onObjectClick={handleObjectClick} 
            onObjectHover={handleObjectHover} 
          />
        </Suspense>
      </Canvas>
      
      <AnimatePresence>
        {tooltip.show && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-2 rounded-full max-w-xs text-center"
            style={{ 
              left: `calc(50% + ${tooltip.position[0] * 20}px)`, 
              bottom: `calc(20% + ${tooltip.position[1] * 20}px)` 
            }}
          >
            {tooltip.text}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Object highlight on hover */}
      {hoveredObject && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ 
            border: '2px solid #d94600', 
            borderRadius: '20px',
            opacity: 0.3,
            pointerEvents: 'none'
          }}
        >
          {/* Highlight effect would go here - simplified for now */}
        </motion.div>
      )}
    </div>
  )
}