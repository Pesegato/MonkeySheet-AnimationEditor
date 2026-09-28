import './ExportPanel.css'
import { AnimationConfig as AnimConfig } from '../types'

interface ExportPanelProps {
  animConfig: AnimConfig
  frameCount: number
}

export default function ExportPanel({ animConfig, frameCount }: ExportPanelProps) {
  const exportJson = () => {
    const payload = {
      id: animConfig.id || 'animation',
      name: animConfig.name || 'Animation',
      centerX: animConfig.centerX || 0,
      centerY: animConfig.centerY || 0,
      frames: animConfig.frames.length > 0 ? animConfig.frames : Array.from({ length: frameCount }, () => 100),
    }

    const json = JSON.stringify(payload, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${payload.id}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyJson = async () => {
    const payload = {
      id: animConfig.id || 'animation',
      name: animConfig.name || 'Animation',
      centerX: animConfig.centerX || 0,
      centerY: animConfig.centerY || 0,
      frames: animConfig.frames.length > 0 ? animConfig.frames : Array.from({ length: frameCount }, () => 100),
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
      alert('JSON copied to clipboard')
    } catch (error) {
      console.error('Copy failed', error)
      alert('Unable to copy to clipboard')
    }
  }

  return (
    <div className="export-panel">
      <div className="export-summary">
        <p><strong>Animation ID:</strong> {animConfig.id || 'animation'}</p>
        <p><strong>Frames:</strong> {frameCount}</p>
        <p><strong>Center:</strong> ({animConfig.centerX}, {animConfig.centerY})</p>
      </div>

      <div className="export-actions">
        <button className="btn-export" onClick={exportJson}>Download JSON</button>
        <button className="btn-copy" onClick={copyJson}>Copy JSON</button>
      </div>

      <pre className="json-preview">
        {JSON.stringify(
          {
            id: animConfig.id || 'animation',
            name: animConfig.name || 'Animation',
            centerX: animConfig.centerX || 0,
            centerY: animConfig.centerY || 0,
            frames: animConfig.frames.length > 0 ? animConfig.frames : Array.from({ length: frameCount }, () => 100),
          },
          null,
          2
        )}
      </pre>
    </div>
  )
}
