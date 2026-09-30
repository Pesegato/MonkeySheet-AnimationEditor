import './PaletteList.css'
import { Frame } from '../types'

interface PaletteListProps {
  items: Frame[]
  onAddToAnimation: (paletteIndex: number) => void
}

export default function PaletteList({
  items,
  onAddToAnimation,
}: PaletteListProps) {
  if (items.length === 0) {
    return (
      <div className="palette-empty">
        <p>No images in palette yet</p>
        <p className="empty-hint">Upload images to get started</p>
      </div>
    )
  }

  return (
    <div className="palette-grid">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="palette-item"
          onClick={() => onAddToAnimation(index)}
        >
          <div className="palette-thumbnail">
            <img src={item.imageUrl} alt={item.name} />
          </div>
          <div className="palette-info">
            <span className="palette-name">{item.name}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
