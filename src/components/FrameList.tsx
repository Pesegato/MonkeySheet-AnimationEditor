import './FrameList.css'
import { Frame } from '../types'

interface FrameListProps {
  frames: Frame[]
  selectedFrameId: string | null
  onSelectFrame: (frameId: string) => void
  onRemoveFrame: (frameId: string) => void
  onUpdateDuration: (frameId: string, duration: number) => void
}

export default function FrameList({
  frames,
  selectedFrameId,
  onSelectFrame,
  onRemoveFrame,
  onUpdateDuration,
}: FrameListProps) {
  if (frames.length === 0) {
    return (
      <div className="frame-list-empty">
        <p>No frames loaded yet</p>
        <p className="empty-hint">Upload images to get started</p>
      </div>
    )
  }

  return (
    <div className="frame-list">
      {frames.map((frame, index) => (
        <div
          key={frame.id}
          className={`frame-item ${selectedFrameId === frame.id ? 'selected' : ''}`}
          onClick={() => onSelectFrame(frame.id)}
        >
          <div className="frame-thumbnail">
            <img src={frame.imageUrl} alt={`Frame ${index}`} />
            <span className="frame-number">{index + 1}</span>
          </div>
          <div className="frame-info">
            <div className="frame-duration">
              <label>Duration (ms):</label>
              <input
                type="number"
                min="10"
                max="5000"
                value={frame.duration}
                onChange={(e) => onUpdateDuration(frame.id, parseInt(e.target.value) || 100)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <button
              className="btn-remove"
              onClick={(e) => {
                e.stopPropagation()
                onRemoveFrame(frame.id)
              }}
              title="Remove frame"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
