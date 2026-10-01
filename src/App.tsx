import './App.css'
import ImportPanel from './components/ImportPanel'
import FrameLoader from './components/FrameLoader'
import PaletteList from './components/PaletteList'
import AnimationPreview from './components/AnimationPreview'
import AnimationConfig from './components/AnimationConfig'
import ExportPanel from './components/ExportPanel'
import { useAnimationEditor } from './hooks/useAnimationEditor'

function App() {
  const {
    palette,
    animations,
    selectedAnimationIdx,
    setSelectedAnimationIdx,
    playingPreview,
    setPlayingPreview,
    handleAddToPalette,
    removeFrameFromAnimation,
    addAnimation,
    handleImportAnimations,
    removeAnimation,
    getAnimationFrames,
    handleConfigChange,
  } = useAnimationEditor()

  const animationFrames = getAnimationFrames()
  const currentAnim = animations[selectedAnimationIdx] ?? { id: '', frames: [], centerX: 0, centerY: 0 }

  return (
    <div className="app">
      <header className="app-header">
        <h1>MonkeySheet Animation Editor</h1>
        <p>Create sprite sheet animations compatible with MonkeySheet</p>
      </header>
      <div className="app-container">
        {/* LEFT PANEL: Palette List */}
        <aside className="left-panel">
          <section className="panel">
            <h2>Frame Loader</h2>
            <FrameLoader onAddToPalette={handleAddToPalette} />
          </section>
          <section className="panel">
            <h2>Palette</h2>
            <PaletteList
              palette={palette}
              onAddToPalette={handleAddToPalette}
            />
          </section>
        </aside>

        {/* CENTER PANEL: Animation Preview, Animation Frames */}
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
              {animationFrames.map((frame, frameIdx) => {
                if (!frame) return null
                return (
                  <div key={`${selectedAnimationIdx}-${frameIdx}`} className="anim-frame-item">
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
                )
              })}
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
            <button className="btn-add-animation" onClick={addAnimation}>
              + Add Animation
            </button>
          </section>

          <section className="panel">
            <h2>Import Animations</h2>
            <ImportPanel onImport={handleImportAnimations} />
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
              palette={palette}
            />
          </section>
        </aside>
      </div>
    </div>
  )
}

export default App
