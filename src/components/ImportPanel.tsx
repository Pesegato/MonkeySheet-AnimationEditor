import { useState } from 'react'
import './ImportPanel.css'
import { AnimationConfig as AnimConfig } from '../types'

interface ImportPanelProps {
  onImport: (animations: AnimConfig[]) => void
}

export default function ImportPanel({ onImport }: ImportPanelProps) {
  const [dragActive, setDragActive] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleFiles = (files: FileList) => {
    const file = files[0]
    if (file && file.type === 'application/json') {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string)
          if (Array.isArray(json)) {
            const animations: AnimConfig[] = json.map((anim, idx) => {
              const frames = anim.frames.reduce((acc, curr, i) => {
                acc.push((i === 0 ? 0 : acc[i - 1]) + curr)
                return acc
              }, [] as number[])
              return {
                ...anim,
                frames,
              }
            })
            onImport(animations)
            setErrorMessage(null)
          } else {
            setErrorMessage('Invalid JSON format. Expected an array of animations.')
          }
        } catch (error) {
          setErrorMessage('Failed to parse JSON file.')
        }
      }
      reader.readAsText(file)
    } else {
      setErrorMessage('File type not supported. Please upload a JSON file.')
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  return (
    <div className="import-panel">
      <div
        className={`drag-area ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="drag-content">
          <div className="drag-icon">📥</div>
          <p className="drag-text">Drag JSON here</p>
          <p className="drag-subtext">or click to select</p>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
        <input
          type="file"
          accept="application/json"
          onChange={handleChange}
          className="file-input"
        />
      </div>
    </div>
  )
}