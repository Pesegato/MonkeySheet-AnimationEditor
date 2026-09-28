import { useEffect, useRef, useState } from 'react'
import './AnimationPreview.css'
import { Frame } from '../types'

interface AnimationPreviewProps {
  frames: Frame[]
  isPlaying: boolean
  onPlayToggle: (playing: boolean) => void
}

export default function AnimationPreview({
  frames,
  isPlaying,
  onPlayToggle,
}: AnimationPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [fps, setFps] = useState(10)
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    if (!isPlaying || frames.length === 0) return

    const animate = () => {
      const now = Date.now()
      const deltaTime = now - lastTimeRef.current
      const frameDuration = frames[currentFrameIndex]?.duration || 100

      if (deltaTime >= frameDuration) {
        setCurrentFrameIndex((prev) => (prev + 1) % frames.length)
        lastTimeRef.current = now
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isPlaying, frames, currentFrameIndex])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (frames.length === 0) {
      ctx.fillStyle = '#cbd5e1'
      ctx.textAlign = 'center'
      ctx.font = '16px sans-serif'
      ctx.fillText('No frames loaded', canvas.width / 2, canvas.height / 2)
      return
    }

    const frame = frames[currentFrameIndex]
    const img = new Image()
    img.src = frame.imageUrl
    img.onload = () => {
      const scale = Math.min(
        (canvas.width * 0.8) / img.width,
        (canvas.height * 0.8) / img.height
      )
      const x = (canvas.width - img.width * scale) / 2
      const y = (canvas.height - img.height * scale) / 2
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale)

      // Draw frame info
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
      ctx.fillRect(10, 10, 200, 50)
      ctx.fillStyle = '#e2e8f0'
      ctx.font = 'bold 14px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`Frame: ${currentFrameIndex + 1}/${frames.length}`, 15, 30)
      ctx.font = '12px sans-serif'
      ctx.fillText(`Duration: ${frame.duration}ms`, 15, 45)
      ctx.fillText(`FPS: ${fps.toFixed(1)}`, 15, 60)
    }
  }, [currentFrameIndex, frames, fps])

  const calculateFPS = () => {
    if (frames.length === 0) return 0
    const totalTime = frames.reduce((sum, f) => sum + f.duration, 0)
    return (frames.length * 1000) / totalTime
  }

  useEffect(() => {
    setFps(calculateFPS())
  }, [frames])

  const handlePlayPause = () => {
    onPlayToggle(!isPlaying)
  }

  const handlePrevFrame = () => {
    if (frames.length > 0) {
      setCurrentFrameIndex((prev) => (prev - 1 + frames.length) % frames.length)
    }
  }

  const handleNextFrame = () => {
    if (frames.length > 0) {
      setCurrentFrameIndex((prev) => (prev + 1) % frames.length)
    }
  }

  return (
    <div className="animation-preview">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="preview-canvas"
      />
      <div className="preview-controls">
        <button
          className="btn-control"
          onClick={handlePrevFrame}
          disabled={frames.length === 0}
          title="Previous frame"
        >
          ⏮ Prev
        </button>
        <button
          className={`btn-control btn-play ${isPlaying ? 'playing' : ''}`}
          onClick={handlePlayPause}
          disabled={frames.length === 0}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button
          className="btn-control"
          onClick={handleNextFrame}
          disabled={frames.length === 0}
          title="Next frame"
        >
          Next ⏭
        </button>
      </div>
      {frames.length > 0 && (
        <div className="preview-info">
          <p><strong>Total Frames:</strong> {frames.length}</p>
          <p><strong>FPS:</strong> {fps.toFixed(2)}</p>
          <p><strong>Duration:</strong> {(frames.reduce((sum, f) => sum + f.duration, 0) / 1000).toFixed(2)}s</p>
        </div>
      )}
    </div>
  )
}
