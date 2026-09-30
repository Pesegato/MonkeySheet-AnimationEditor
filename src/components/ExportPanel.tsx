import './ExportPanel.css'
import { Frame, AnimationConfig as AnimConfig } from '../types'

interface ExportPanelProps {
  animations: AnimConfig[]
  frameCount: number
  frames: Frame[]
}

export default function ExportPanel({ animations, frameCount, frames }: ExportPanelProps) {
  const buildPayload = () => {
    return animations.map((anim) => ({
      id: anim.id,
      frames: Array.from({ length: anim.frames.length }, (_, i) => i + 1), // 1-based progressive indices
      centerX: anim.centerX,
      centerY: anim.centerY,
    }))
  }

  const exportJson = () => {
    const payload = buildPayload()
    const json = JSON.stringify(payload, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'animations.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyJson = async () => {
    const payload = buildPayload()
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
      alert('Animations JSON copied to clipboard')
    } catch (error) {
      console.error('Copy failed', error)
      alert('Unable to copy to clipboard')
    }
  }

  const generateSpritesheet = async () => {
    if (frames.length === 0) {
      alert('Please load frames first')
      return
    }

    // 1. Load all images in parallel
    const images = await Promise.all(
      frames.map((frame) => new Promise<HTMLImageElement>((resolve) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.src = frame.imageUrl
      }))
    )

    // 2. Use dimensions of first frame
    const cellW = images[0].naturalWidth
    const cellH = images[0].naturalHeight

    // 3. Create canvas with transparent background
    const gridCols = Math.ceil(Math.sqrt(images.length))
    const gridRows = Math.ceil(images.length / gridCols)
    const canvas = document.createElement('canvas')
    canvas.width = cellW * gridCols
    canvas.height = cellH * gridRows
    const ctx = canvas.getContext('2d')!

    // 4. Draw images (no background, no numbers)
    images.forEach((img, index) => {
      const col = index % gridCols
      const row = Math.floor(index / gridCols)
      const x = col * cellW
      const y = row * cellH
      const scale = Math.min(cellW / img.width, cellH / img.height)
      const dx = x + (cellW - img.width * scale) / 2
      const dy = y + (cellH - img.height * scale) / 2
      ctx.drawImage(img, dx, dy, img.width * scale, img.height * scale)
    })

    // 5. Download PNG
    const link = document.createElement('a')
    link.download = frames.length > 0 ? `${animations[0]?.id || 'spritesheet'}.png` : 'spritesheet.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="export-panel">
      <div className="export-summary">
        <p><strong>Animations:</strong> {animations.length}</p>
        <p><strong>Total Frames:</strong> {frameCount}</p>
        <p>
          <strong>Anim List:</strong> {animations.map(a => a.id).join(', ') || 'None'}
        </p>
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
