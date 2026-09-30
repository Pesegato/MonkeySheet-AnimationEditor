import './ExportPanel.css'
import { AnimationConfig as AnimConfig, Frame } from '../types'

interface ExportPanelProps {
  animations: AnimConfig[]
  palette: Frame[]
}

export default function ExportPanel({ animations, palette }: ExportPanelProps) {
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
  if (palette.length === 0) {
    alert('Please load images into the palette first')
    return
  }

  // Carica tutte le immagini per ottenere le dimensioni
  const images = await Promise.all(
    palette.map(
      (frame) =>
        new Promise<HTMLImageElement>((resolve) => {
          const img = new Image()
          img.onload = () => resolve(img)
          img.src = frame.imageUrl
        })
    )
  )

  // Usa le dimensioni della prima immagine
  const frameWidth = images[0].width
  const frameHeight = images[0].height

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const maxCols = Math.ceil(Math.sqrt(palette.length))
  canvas.width = maxCols * frameWidth
  canvas.height = Math.ceil(palette.length / maxCols) * frameHeight

  images.forEach((img, idx) => {
    const col = idx % maxCols
    const row = Math.floor(idx / maxCols)
    ctx.drawImage(img, col * frameWidth, row * frameHeight)
  })

  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'spritesheet.png'
      link.click()
      URL.revokeObjectURL(url)
    }
  })
}

  return (
    <div className="export-panel">
      <div className="export-summary">
        <p><strong>Animations:</strong> {animations.length}</p>
        <p><strong>Palette Size:</strong> {palette.length}</p>
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
