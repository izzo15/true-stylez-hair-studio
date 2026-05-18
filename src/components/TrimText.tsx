'use client'

import { useEffect, useState } from 'react'
import { gsap } from 'gsap'

export function TrimText({ text, alternate }: { text: string; alternate: string }) {
  const [isTrimmed, setIsTrimmed] = useState(false)

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 })
    
    tl.to('.trim-text', {
      duration: 1,
      ease: 'power2.inOut',
      onStart: () => setIsTrimmed(true),
      onComplete: () => setIsTrimmed(false)
    })

    return () => { tl.kill() }
    }, [])

  return (
    <span className="trim-text inline-block">
      <span className={`transition-all duration-500 ${isTrimmed ? 'opacity-0' : 'opacity-100'}`}>
        {text}
      </span>
      <span className={`absolute transition-all duration-500 ${isTrimmed ? 'opacity-100' : 'opacity-0'}`}>
        {alternate}
      </span>
    </span>
  )
}