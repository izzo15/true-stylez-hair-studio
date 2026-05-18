import { useEffect, useRef } from 'react'

export function useSound(src: string, volume = 0.5) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio(src)
    audioRef.current.volume = volume
  }, [src, volume])

  const play = () => {
    if (audioRef.current && typeof window !== 'undefined') {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }

  return { play }
}