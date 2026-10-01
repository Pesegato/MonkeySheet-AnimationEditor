import { useState, useCallback } from 'react'
import { Frame, AnimationConfig as AnimConfig } from '../types'

export const useAnimationEditor = () => {
  const generateUniqueId = () => `animation${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

  const [palette, setPalette] = useState<Frame[]>([])
  const [animations, setAnimations] = useState<AnimConfig[]>([
    { id: generateUniqueId(), frames: [], centerX: 0, centerY: 0 },
  ])
  const [selectedAnimationIdx, setSelectedAnimationIdx] = useState<number>(0)
  const [playingPreview, setPlayingPreview] = useState(false)

  const handleAddToPalette = useCallback((newFrames: Frame[]) => {
    setPalette((prevPalette) => {
      const combined = [...prevPalette, ...newFrames]
      const sorted = [...combined].sort((a, b) => a.name.localeCompare(b.name))

      // Aggiorna gli indici nelle animazioni esistenti
      setAnimations((prevAnims) =>
        prevAnims.map((anim) => ({
          ...anim,
          frames: anim.frames.map((oldIdx) => {
            const oldFrame = combined[oldIdx]
            if (!oldFrame) return oldIdx
            return sorted.findIndex((f) => f.id === oldFrame.id)
          }),
        }))
      )

      return sorted
    })
  }, [])

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
    [selectedAnimationIdx, palette.length]
  )

  const removeFrameFromAnimation = useCallback(
    (framePosition: number) => {
      if (
        framePosition < 0 ||
        framePosition >= animations[selectedAnimationIdx].frames.length
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
    [selectedAnimationIdx, animations[selectedAnimationIdx]?.frames?.length ?? 0]
  )

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

  const handleImportAnimations = (animations: AnimConfig[]) => {
    setAnimations(animations)
    setSelectedAnimationIdx(0)
  }

  const removeAnimation = useCallback(
    (idx: number) => {
      setAnimations((prev) => {
        const next = prev.filter((_, i) => i !== idx)
        if (selectedAnimationIdx >= next.length || selectedAnimationIdx === idx) {
          setSelectedAnimationIdx(next.length - 1)
        }
        return next
      })
    },
    [selectedAnimationIdx, animations.length]
  )

  const getAnimationFrames = () => {
    const anim = animations[selectedAnimationIdx]
    if (!anim || !anim.frames) return []
    return anim.frames
      .map((paletteIdx) => palette[paletteIdx])
      .filter(Boolean)
  }

  const handleConfigChange = useCallback(
    (idx: number, config: Partial<AnimConfig>) => {
      setAnimations((prev) => {
        const next = [...prev]
        next[idx] = { ...next[idx], ...config }
        return next
      })
    },
    []
  )

  return {
    palette,
    setPalette,
    animations,
    setAnimations,
    selectedAnimationIdx,
    setSelectedAnimationIdx,
    playingPreview,
    setPlayingPreview,
    handleAddToPalette,
    addFrameFromPalette,
    removeFrameFromAnimation,
    addAnimation,
    handleImportAnimations,
    removeAnimation,
    getAnimationFrames,
    handleConfigChange,
  }
}
