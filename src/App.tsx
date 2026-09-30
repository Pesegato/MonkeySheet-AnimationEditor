import { useState, useCallback } from 'react'
import './App.css'
import FrameLoader from './components/FrameLoader'
import PaletteList from './components/PaletteList'
import AnimationPreview from './components/AnimationPreview'
import AnimationConfig from './components/AnimationConfig'
import ExportPanel from './components/ExportPanel'
import { Frame, AnimationConfig as AnimConfig } from './types'

const generateUniqueId = () => `animation${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

function App() {
  const [palette, setPalette] = useState<Frame[]>([])
  const [animations, setAnimations] = useState<AnimConfig[]>([
    { id: generateUniqueId(), frames: [], centerX: 0, centerY: 0 },
  ])
  const [selectedAnimationIdx, setSelectedAnimationIdx] = useState<number>(0)
  const [playingPreview, setPlayingPreview] = useState(false)

  const handleAddToPalette = (newFrames: Frame[]) => {
    setPalette((prev) => [...prev, ...newFrames])
  }

  const addFrameFromPalette = useCallback(
    (paletteIndex: number) => {
      if (
        palette.length === 0 ||
        paletteIndex < 0 ||
        paletteIndex >= palette.length
      )
        return
      setAnimations((prev) => {
        const next = [...prev]
        const anim = next[selectedAnimationIdx]
        next[selectedAnimationIdx] = {
          ...anim,
          frames: [...anim.frames, paletteIndex],
        }
        return next
      })
    },
    [selectedAnimationIdx, palette.length],
  )

  const removeFrameFromAnimation = useCallback(
    (framePosition: number) => {
      if (
        framePosition < 0 ||
        framePosition >=
          animations[selectedAnimationIdx].frames.length
      )
        return
      setAnimations((prev) => {
        const next = [...prev]
        const anim = { ...next[selectedAnimationIdx] }
        anim.frames = anim.frames.filter((_, i) => i !== framePosition)
        next[selectedAnimationIdx] = anim
        return next
      })
    },
    [
      selectedAnimationIdx,
      animations[selectedAnimationIdx]?.frames?.length ?? 0,
    ],
  )

  const getAnimationFrames = () => {
    const anim = animations[selectedAnimationIdx]
    if (!anim || !anim.frames) return []
    return anim.frames
      .map((paletteIdx) => palette[paletteIdx])
      .filter(Boolean)
  }

  const addAnimation = useCallback(() => {
    const newAnim: AnimConfig = {
      id: generateUniqueId(),
      frames: [],
      centerX: 0,
      centerY: 0,
    }
    setAnimations((prev) => [...prev, newAnim])
    setSelectedAnimationIdx(animations.length)
  }, [animations.length])

  const removeAnimation = useCallback(
    (idx: number) => {
      setAnimations((prev) => {
        const next = prev.filter((_, i) => i !== idx)
        if (selectedAnimationIdx >= next.length || selectedAnimationIdx === idx) {
          setSelectedAnimationIdx(Math.max(0, idx - 1))
        }
        return next
      })
    },
    [selectedAnimationIdx],
  )

  const handleConfigChange = (idx: number, config: Partial<AnimConfig>) => {
    setAnimations((prev) =>
      prev.map((anim, i) => (i === idx ? { ...anim, ...config } : anim)),
    )
  }

  const currentAnim =
    animations[selectedAnimationIdx] ??
    animations[0] ?? { id: '', frames: [], centerX: 0, centerY: 0 }

  const animationFrames = getAnimationFrames()

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎬 MonkeySheet Animation Editor</h1>
        <p>
          Create and export sprite animations — [{animations.length} animation
          {animations.length !== 1 ? 's' : ''}]
        </p>
      </header>

      <div className="app-container">
        {/* LEFT PANEL: Palette */}
        <aside className="left-panel">
          <section className="panel">
            <h2>Load Images</h2>
            <FrameLoader onAddToPalette={handleAddToPalette} />
          </section>

          <section className="panel">
            <h2>Image Palette ({palette.length})</h2>
            <PaletteList
              items={palette}
              onAddToAnimation={addFrameFromPalette}
            />
          </section>
        </aside>

        {/* CENTER PANEL: Preview + Animation Frames */}
        <main className="center-panel">
          <section className="panel">
            <h2>Animation Preview</h2>
            <AnimationPreview
              frames={animationFrames}
              isPlaying={playingPreview}
              onPlayToggle={setPlayingPreview}
            />
          </section>

          <section className="panel">
            <h2>Animation Frames ({animationFrames.length})</h2>
            <div className="animation-frames-list">
              {animationFrames.map((frame, frameIdx) => (
                <div key={frame.id} className="anim-frame-item">
                  <div className="anim-frame-thumbnail">
                    <img src={frame.imageUrl} alt={`Frame ${frameIdx + 1}`} />
                    <span className="frame-pos-badge">{frameIdx + 1}</span>
                  </div>
                  <div className="anim-frame-info">
                    <span className="frame-name">{frame.name}</span>
                    <button
                      className="btn-remove-frame"
                      onClick={() => removeFrameFromAnimation(frameIdx)}
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
          </section>
        </main>

        {/* RIGHT PANEL: Animations list, Config, Export */}
        <aside className="right-panel">
          <section className="panel">
            <h2>Animations</h2>
            <div className="animations-list">
              {animations.map((anim, idx) => (
                <div
                  key={anim.id}
                  className={`anim-item ${
                    idx === selectedAnimationIdx ? 'selected' : ''
                  }`}
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
            <button className="btn-add-animation" onClick={addAnimation}>
              + Add Animation
            </button>
          </section>

          <section className="panel">
            <h2>Edit Animation</h2>
            <AnimationConfig
              config={currentAnim}
              onChange={(cfg) => handleConfigChange(selectedAnimationIdx, cfg)}
            />
          </section>

          <section className="panel">
            <h2>Export All</h2>
            <ExportPanel
              animations={animations}
              paletteLength={palette.length}
            />
          </section>
        </aside>
      </div>
    </div>
  )
}

export default App
