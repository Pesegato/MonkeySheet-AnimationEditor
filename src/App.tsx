import { useState, useCallback } from 'react'
import './App.css'
import FrameLoader from './components/FrameLoader'
import FrameList from './components/FrameList'
import AnimationPreview from './components/AnimationPreview'
import AnimationConfig from './components/AnimationConfig'
import ExportPanel from './components/ExportPanel'
import { Frame, AnimationConfig as AnimConfig } from './types'

const generateUniqueId = () => `animation${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

function App() {
  const [frames, setFrames] = useState<Frame[]>([])
  const [animations, setAnimations] = useState<AnimConfig[]>([
    { id: generateUniqueId(), frames: [], centerX: 0, centerY: 0 },
  ])
  const [selectedAnimationIdx, setSelectedAnimationIdx] = useState<number>(0)
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null)
  const [playingPreview, setPlayingPreview] = useState(false)

  const currentFrames = frames

  const updateFramesForAllAnimations = (updatedFrames: Frame[]) => {
    setAnimations((prev) => prev.map((anim) => ({
      ...anim,
      frames: updatedFrames.map((f) => f.duration),
    })))
  }

  const handleAddFrames = (newFrames: Frame[]) => {
    const updatedFrames = [...frames, ...newFrames]
      .sort((a, b) => a.name.localeCompare(b.name))
    setFrames(updatedFrames)
    updateFramesForAllAnimations(updatedFrames)
  }

  const handleRemoveFrame = (frameId: string) => {
    const updatedFrames = frames.filter((f) => f.id !== frameId)
    setFrames(updatedFrames)
    updateFramesForAllAnimations(updatedFrames)
    setSelectedFrameId(null)
  }

  const handleUpdateFrameDuration = (frameId: string, duration: number) => {
    const updatedFrames = frames.map((f) =>
      f.id === frameId ? { ...f, duration } : f,
    )
    setFrames(updatedFrames)
    updateFramesForAllAnimations(updatedFrames)
  }

  const addAnimation = useCallback(() => {
    const newAnim: AnimConfig = { id: generateUniqueId(), frames: [...currentFrames].map(f => f.duration), centerX: 0, centerY: 0 }
    setAnimations((prev) => [...prev, newAnim])
    setSelectedAnimationIdx(animations.length)
  }, [currentFrames, animations.length])

  const removeAnimation = useCallback((idx: number) => {
    setAnimations((prev) => {
      const next = prev.filter((_, i) => i !== idx)
      if (selectedAnimationIdx >= next.length || (selectedAnimationIdx === idx && idx > 0)) {
        setSelectedAnimationIdx(Math.max(0, idx - 1))
      }
      return next
    })
  }, [selectedAnimationIdx])

  const handleConfigChange = (idx: number, config: Partial<AnimConfig>) => {
    setAnimations((prev) => prev.map((anim, i) =>
      i === idx ? { ...anim, ...config } : anim
    ))
  }

  const currentAnim = animations[selectedAnimationIdx] ?? animations[0] ?? { id: '', frames: [], centerX: 0, centerY: 0 }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎬 MonkeySheet Animation Editor</h1>
        <p>Create and export sprite animations — [{animations.length} animation{animations.length !== 1 ? 's' : ''}]</p>
      </header>

      <div className="app-container">
        <aside className="left-panel">
          <section className="panel">
            <h2>Frame Library</h2>
            <FrameLoader onAddFrames={handleAddFrames} />
            <FrameList
              frames={frames}
              selectedFrameId={selectedFrameId}
              onSelectFrame={setSelectedFrameId}
              onRemoveFrame={handleRemoveFrame}
              onUpdateDuration={handleUpdateFrameDuration}
            />
          </section>
        </aside>

        <main className="center-panel">
          <section className="panel">
            <h2>Animation Preview</h2>
            <AnimationPreview
              frames={frames}
              isPlaying={playingPreview}
              onPlayToggle={setPlayingPreview}
            />
          </section>
        </main>

        <aside className="right-panel">
          {/* Animations List */}
          <section className="panel">
            <h2>Animations</h2>
            <div className="animations-list">
              {animations.map((anim, idx) => (
                <div
                  key={anim.id}
                  className={`anim-item ${idx === selectedAnimationIdx ? 'selected' : ''}`}
                >
                  <button
                    className="anim-select-btn"
                    onClick={() => setSelectedAnimationIdx(idx)}
                  >
                    {anim.id}
                  </button>
                  <button
                    className="anim-delete-btn"
                    onClick={() => removeAnimation(idx)}
                    disabled={animations.length === 1}
                    title="Delete animation"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button className="btn-add-animation" onClick={addAnimation}>+ Add Animation</button>
          </section>

          {/* Selected Animation Config */}
          <section className="panel">
            <h2>Edit Animation</h2>
            <AnimationConfig
              config={currentAnim}
              onChange={(cfg) => handleConfigChange(selectedAnimationIdx, cfg)}
            />
          </section>

          {/* Export */}
          <section className="panel">
            <h2>Export All</h2>
            <ExportPanel
              animations={animations}
              frameCount={frames.length}
              frames={frames}
            />
          </section>
        </aside>
      </div>
    </div>
  )
}

export default App
