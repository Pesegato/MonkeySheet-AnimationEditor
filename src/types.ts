export interface Frame {
  id: string
  name: string
  imageUrl: string
  duration: number // milliseconds - default for animation frames
}

export interface AnimationConfig {
  id: string
  frames: number[] // indices pointing to palette items (0-based)
  centerX: number
  centerY: number
  hitbox?: number[]
}
