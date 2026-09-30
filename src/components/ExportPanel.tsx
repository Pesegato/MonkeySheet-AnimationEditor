import './ExportPanel.css'
import { AnimationConfig as AnimConfig } from '../types'

interface ExportPanelProps {
  animations: AnimConfig[]
  paletteLength: number
}

export default function ExportPanel({ animations, paletteLength }: ExportPanelProps) {
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
    if (paletteLength === 0) {
      alert('Please load images into the palette first')
      return
    }

    // For spritesheet, we need actual image data from somewhere
    // Since we only have animation indices now, let's collect unique palette indices used by all animations
    const usedIndices = new Set<number>()
    animations.forEach((anim) => {
      anim.frames.forEach((idx) => usedIndices.add(idx))
    })

    // Load images - but we need the actual image sources
    // This is a limitation with the new architecture where we separate palette from animation frames
    alert(
      'Spritesheet generation requires access to palette images.\n' +
        'Consider exporting individual animations instead.',
    )
    return
  }

  return (
    <div className="export-panel">
      <div className="export-summary">
        <p><strong>Animations:</strong> {animations.length}</p>
        <p><strong>Palette Size:</strong> {paletteLength}</p>
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
