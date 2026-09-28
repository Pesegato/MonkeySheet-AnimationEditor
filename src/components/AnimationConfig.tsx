import './AnimationConfig.css'
import { AnimationConfig as AnimConfig } from '../types'

interface AnimationConfigProps {
  config: AnimConfig
  onChange: (config: Partial<AnimConfig>) => void
}

export default function AnimationConfig({ config, onChange }: AnimationConfigProps) {
  return (
    <div className="animation-config">
      <div className="config-group">
        <label>Animation ID</label>
        <input
          type="text"
          value={config.id}
          onChange={(e) => onChange({ id: e.target.value })}
          placeholder="animation_id"
        />
      </div>

      <div className="config-group">
        <label>Animation Name</label>
        <input
          type="text"
          value={config.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="My Animation"
        />
      </div>

      <div className="config-row">
        <div className="config-group">
          <label>Center X</label>
          <input
            type="number"
            value={config.centerX}
            onChange={(e) => onChange({ centerX: parseInt(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>
        <div className="config-group">
          <label>Center Y</label>
          <input
            type="number"
            value={config.centerY}
            onChange={(e) => onChange({ centerY: parseInt(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="config-info">
        <p className="info-title">📋 Animation Data</p>
        <p className="info-item"><strong>Frames:</strong> {config.frames.length}</p>
        <p className="info-item"><strong>Frame Durations:</strong></p>
        <div className="durations-list">
          {config.frames.length === 0 ? (
            <span className="empty">No frames yet</span>
          ) : (
            config.frames.map((duration, idx) => (
              <span key={idx} className="duration-badge">{duration}ms</span>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
