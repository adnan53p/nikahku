'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'

type AutoScrollControlProps = {
  enabled?: boolean | null
  autoStart?: boolean
  startDelay?: number
  pausePerSection?: number
  scrollDuration?: number
  scrollSpeedPxPerSecond?: number
}

function AutoScrollControlComponent({
  enabled = true,
  autoStart = false,
  startDelay = 500,
  scrollSpeedPxPerSecond = 180,
}: AutoScrollControlProps) {
  const [playing, setPlaying] = useState(false)
  const frameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)

  const stopScroll = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    frameRef.current = null
    lastTimeRef.current = null
    setPlaying(false)
  }, [])

  const tick = useCallback((time: number) => {
    if (lastTimeRef.current === null) lastTimeRef.current = time

    const delta = Math.min(time - lastTimeRef.current, 32)
    lastTimeRef.current = time

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const move = (scrollSpeedPxPerSecond * delta) / 1000
    const nextY = Math.min(window.scrollY + move, maxScroll)

    window.scrollTo(0, nextY)

    if (nextY >= maxScroll - 2) {
      stopScroll()
      return
    }

    frameRef.current = requestAnimationFrame(tick)
  }, [scrollSpeedPxPerSecond, stopScroll])

  const startScroll = useCallback(() => {
    if (enabled === false) return
    if (frameRef.current) cancelAnimationFrame(frameRef.current)

    document.documentElement.style.scrollBehavior = 'auto'
    lastTimeRef.current = null
    setPlaying(true)
    frameRef.current = requestAnimationFrame(tick)
  }, [enabled, tick])

  useEffect(() => {
    if (enabled === false) return

    if (autoStart) {
      const timer = setTimeout(startScroll, startDelay)
      return () => {
        clearTimeout(timer)
        if (frameRef.current) cancelAnimationFrame(frameRef.current)
      }
    }

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [autoStart, enabled, startDelay, startScroll])

  if (enabled === false) return null

  return (
    <div className="fixed bottom-6 left-1/2 z-[999999] -translate-x-1/2 flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={playing ? stopScroll : startScroll}
        className="flex items-center gap-3 rounded-full border border-yellow-400 bg-black/90 px-6 py-3 text-sm font-bold text-yellow-300 shadow-2xl backdrop-blur-xl transition hover:scale-105 active:scale-95"
      >
        {playing ? <Pause size={18} /> : <Play size={18} />}
        {playing ? 'JEDA AUTO SCROLL' : 'MULAI AUTO SCROLL'}
      </button>

      <div className="rounded-full bg-black/75 px-4 py-1 text-[10px] font-bold tracking-[0.2em] text-white">
        {playing ? 'SCROLL HALUS SEDANG JALAN' : 'TEKAN UNTUK PLAY'}
      </div>
    </div>
  )
}

export const AutoScrollControl = AutoScrollControlComponent
export default AutoScrollControlComponent