import { useState } from 'react'
import './FrameLoader.css'
import { Frame } from '../types'

interface FrameLoaderProps {
  onAddFrames: (frames: Frame[]) => void
}

export default function FrameLoader({ onAddFrames }: FrameLoaderProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleFiles = (files: FileList) => {
    const newFrames: Frame[] = []
    let loadedCount = 0

    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string
          newFrames.push({
            id: `frame_${Date.now()}_${index}`,
            imageUrl,
            duration: 100, // default 100ms per frame
          })
          loadedCount++

          if (loadedCount === Array.from(files).filter(f => f.type.startsWith('image/')).length) {
            onAddFrames(newFrames)
          }
        }
        reader.readAsDataURL(file)
      }
    })
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
    <div className="frame-loader">
      <div
        className={`drag-area ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="drag-content">
          <div className="drag-icon">📸</div>
          <p className="drag-text">Drag images here</p>
          <p className="drag-subtext">or click to select</p>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="file-input"
        />
      </div>
    </div>
  )
}
