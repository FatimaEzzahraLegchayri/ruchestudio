"use client"

import { useEffect, useRef } from "react"

export function HoneycombBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    let animationFrameId: number
    let time = 0

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Hexagon parameters
    const hexSize = 60
    const hexHeight = hexSize * Math.sqrt(3)
    const hexWidth = hexSize * 2

    const drawHexagon = (
      x: number,
      y: number,
      size: number,
      offset: number
    ) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + Math.PI / 6
        const wobble = prefersReducedMotion
          ? 0
          : Math.sin(time * 0.0008 + x * 0.01 + y * 0.01 + offset) * 2
        const px = x + (size + wobble) * Math.cos(angle)
        const py = y + (size + wobble) * Math.sin(angle)
        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }
      ctx.closePath()
    }

    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Wave offset for organic movement
      const waveTime = time * 0.0005

      // Calculate grid
      const cols = Math.ceil(rect.width / (hexWidth * 0.75)) + 2
      const rows = Math.ceil(rect.height / hexHeight) + 2

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const isOffset = row % 2 === 1
          const x = col * hexWidth * 0.75 + (isOffset ? hexWidth * 0.375 : 0)
          const y = row * hexHeight * 0.5

          // Wave distortion
          const waveX = prefersReducedMotion
            ? 0
            : Math.sin(waveTime + y * 0.008) * 8
          const waveY = prefersReducedMotion
            ? 0
            : Math.cos(waveTime + x * 0.006) * 6

          // Opacity variation for depth - increased for better visibility
          const opacityWave = prefersReducedMotion
            ? 0.35
            : 0.28 + Math.sin(waveTime * 2 + x * 0.01 + y * 0.01) * 0.12

          // Warm honey/gold color - darker tone for better contrast
          ctx.strokeStyle = `rgba(180, 145, 90, ${opacityWave})`
          ctx.lineWidth = 1.5

          drawHexagon(
            x + waveX,
            y + waveY,
            hexSize * 0.45,
            col * 0.5 + row * 0.3
          )
          ctx.stroke()
        }
      }

      time += 16
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
