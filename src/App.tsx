import { useState } from 'react'
import './App.css'
import FrameLoader from './components/FrameLoader'
import FrameList from './components/FrameList'
import AnimationPreview from './components/AnimationPreview'
import AnimationConfig from './components/AnimationConfig'
import ExportPanel from './components/ExportPanel'
import { Frame, AnimationConfig as AnimConfig } from './types'

function App() {
  const [frames, setFrames] = useState<Frame[]>([])
  const [animConfig, setAnimConfig] = useState<AnimConfig>({
    id: 'idle',
    name: 'Idle',
    frames: [],
    centerX: 0,
    centerY: 0,
  })
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null)
  const [playingPreview, setPlayingPreview] = useState(false)

  const updateConfigFrames = (nextFrames: Frame[]) => {
    setAnimConfig((prev) => ({
      ...prev,
      frames: nextFrames.map((frame) => frame.duration),
    }))
  }

  const handleAddFrames = (newFrames: Frame[]) => {
    const updatedFrames = [...frames, ...newFrames]
    setFrames(updatedFrames)
    updateConfigFrames(updatedFrames)
  }

  const handleRemoveFrame = (frameId: string) => {
    const updatedFrames = frames.filter((f) => f.id !== frameId)
    setFrames(updatedFrames)
    updateConfigFrames(updatedFrames)
    setSelectedFrameId(null)
  }

  const handleUpdateFrameDuration = (frameId: string, duration: number) => {
    const updatedFrames = frames.map((f) =>
      f.id === frameId ? { ...f, duration } : f,
    )
    setFrames(updatedFrames)
    updateConfigFrames(updatedFrames)
  }

  const handleConfigChange = (config: Partial<AnimConfig>) => {
    setAnimConfig((prev) => ({ ...prev, ...config }))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎬 MonkeySheet Animation Editor</h1>
        <p>Create and export sprite animations in a JSON structure aligned with MonkeySheet</p>
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
          <section className="panel">
            <h2>Animation Settings</h2>
            <AnimationConfig
              config={animConfig}
              onChange={handleConfigChange}
            />
          </section>

          <section className="panel">
            <h2>Export</h2>
            <ExportPanel
              animConfig={animConfig}
              frameCount={frames.length}
            />
          </section>
        </aside>
      </div>
    </div>
  )
}

export default App
