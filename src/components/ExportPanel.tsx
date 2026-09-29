import './ExportPanel.css'
import { AnimationConfig as AnimConfig } from '../types'

interface ExportPanelProps {
  animConfig: AnimConfig
  frameCount: number
  frames: Frame[]
}

export default function ExportPanel({ animConfig, frameCount, frames }: ExportPanelProps) {
  const buildPayload = () => {
    const frameSequence =
      animConfig.frames.length > 0
        ? animConfig.frames
        : Array.from({ length: frameCount }, () => 100)

    const gridCols = Math.ceil(Math.sqrt(frameCount))
    const containerSize = gridCols

    return {
      containerName: animConfig.name || 'SpriteSheet',
      containerSize,
      animations: [
        {
          id: animConfig.id || 'animation',
          name: animConfig.name || 'Animation',
          frames: frameSequence,
          centerX: animConfig.centerX || 0,
          centerY: animConfig.centerY || 0,
        },
      ],
    }
  }

  const exportJson = () => {
    const payload = buildPayload()
    const json = JSON.stringify(payload, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${payload.animations[0].id}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyJson = async () => {
    const payload = buildPayload()
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
      alert('MonkeySheet JSON copied to clipboard')
    } catch (error) {
      console.error('Copy failed', error)
      alert('Unable to copy to clipboard')
    }
  }

  const generateSpritesheet = () => {
    if (frames.length === 0) {
      alert('Please load frames first')
      return
    }

    const firstFrame = frames[0]
    const cellSize = {
      width: firstFrame.imageUrl.match(/width=(d+)/)?.[1] || 128,
      height: firstFrame.imageUrl.match(/height=(d+)/)?.[1] || 128
    }

    const gridCols = Math.ceil(Math.sqrt(frames.length))
    const canvas = document.createElement('canvas')
    canvas.width = cellSize.width * gridCols
    canvas.height = cellSize.height * Math.ceil(frames.length / gridCols)
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    frames.forEach((frame, index) => {
      const row = Math.floor(index / gridCols)
      const col = index % gridCols
      const x = col * cellSize.width
      const y = row * cellSize.height

      // Draw cell background
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(x, y, cellSize.width, cellSize.height)

      // Draw frame image
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = frame.imageUrl
      img.onload = () => {
        const scale = Math.min(
          cellSize.width / img.width,
          cellSize.height / img.height
        )
        const dx = x + (cellSize.width - img.width * scale) / 2
        const dy = y + (cellSize.height - img.height * scale) / 2
        ctx.drawImage(img, dx, dy, img.width * scale, img.height * scale)

        // Draw frame number
        ctx.fillStyle = '#e2e8f0'
        ctx.font = '12px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText((index + 1).toString(), x + cellSize.width / 2, y + cellSize.height - 4)
      }
    })

    // Download canvas as PNG
    const link = document.createElement('a')
    link.download = `${animConfig.id || 'animation'}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="export-panel">
      <div className="export-summary">
        <p><strong>Container:</strong> {animConfig.name || 'SpriteSheet'}</p>
        <p><strong>Animation ID:</strong> {animConfig.id || 'animation'}</p>
        <p><strong>Frames:</strong> {frameCount}</p>
        <p><strong>Center:</strong> ({animConfig.centerX}, {animConfig.centerY})</p>
      </div>

      <div className="export-actions">
        <button className="btn-export" onClick={exportJson}>Download JSON</button>
        <button className="btn-copy" onClick={copyJson}>Copy JSON</button>
        <button className="btn-spritesheet" onClick={generateSpritesheet}>Download Spritesheet</button>
      </div>

      <pre className="json-preview">
        {JSON.stringify(buildPayload(), null, 2)}
      </pre>
    </div>
  )
}
