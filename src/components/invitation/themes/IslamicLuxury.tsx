'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'

type Props = {
  enabled?: boolean
}

export default function AutoScrollControl({
  enabled = true,
}: Props) {
  const [playing, setPlaying] = useState(true)

  const animationRef = useRef<number | null>(null)

  const smoothScroll = () => {
    if (!playing) return

    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight

    // stop kalau sudah bawah
    if (window.scrollY >= maxScroll - 2) {
      setPlaying(false)
      return
    }

    // scroll halus
    window.scrollTo({
      top: window.scrollY + 1.8,
      behavior: 'auto',
    })

    animationRef.current =
      requestAnimationFrame(smoothScroll)
  }

  useEffect(() => {
    if (!enabled) return

    if (playing) {
      animationRef.current =
        requestAnimationFrame(smoothScroll)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [playing])

  if (!enabled) return null

  return (
    <div
      className="
        fixed
        bottom-6
        left-1/2
        -translate-x-1/2
        z-[999999]
        flex
        flex-col
        items-center
        gap-2
      "
    >
      <button
        onClick={() => setPlaying(!playing)}
        className="
          flex
          items-center
          gap-3
          rounded-full
          border
          border-yellow-400
          bg-black/85
          px-6
          py-3
          text-sm
          font-bold
          text-yellow-300
          shadow-2xl
          backdrop-blur-xl
          transition
          hover:scale-105
        "
      >
        {playing ? (
          <Pause size={18} />
        ) : (
          <Play size={18} />
        )}

        {playing
          ? 'JEDA AUTO SCROLL'
          : 'MULAI AUTO SCROLL'}
      </button>

      <div
        className="
          rounded-full
          bg-black/70
          px-4
          py-1
          text-[10px]
          font-bold
          tracking-[0.2em]
          text-white
        "
      >
        {playing
          ? 'SCROLL HALUS SEDANG JALAN'
          : 'AUTO SCROLL BERHENTI'}
      </div>
    </div>
  )
}