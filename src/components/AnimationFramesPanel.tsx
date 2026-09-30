import React from 'react'
import './AnimationFramesPanel.css'
import { Frame } from '../types'

interface AnimationFramesPanelProps {
  animation: {
    id: string
    frames: number[]
    centerX: number
    centerY: number
  }
  palette: Frame[]
  onRemoveFrame: (frameIdx: number) => void
}

const AnimationFramesPanel: React.FC<AnimationFramesPanelProps> = ({ animation, palette, onRemoveFrame }) => {
  const animationFrames = animation.frames.map((paletteIdx) => palette[paletteIdx]).filter(Boolean)

  return (
    <div className="animation-frames-panel">
      <h2>Animation Frames ({animationFrames.length})</h2>
      <div className="animation-frames-list">
        {animationFrames.map((frame, frameIdx) => (
          <div key={`${animation.id}-${frameIdx}`} className="frame-item">
            <div className="frame-thumbnail">
              <img src={frame.src} alt={`Frame ${frameIdx + 1}`} />
              <span className="frame-pos-badge">{frameIdx + 1}</span>
            </div>
            <div className="frame-info">
              <button
                className="btn-remove-frame"
                onClick={() => onRemoveFrame(frameIdx)}
                title="Remove this frame"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        {animationFrames.length === 0 && (
          <p className="empty-hint">
            Click an image in the palette to add frames
          </p>
        )}
      </div>
    </div>
  )
}

export default AnimationFramesPanel