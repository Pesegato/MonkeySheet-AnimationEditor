export interface Frame {
  id: string
  name: string
  imageUrl: string
  duration: number // milliseconds
}

export interface AnimationConfig {
  id: string
  frames: number[] // progressive frame indices (1-based)
  centerX: number
  centerY: number
  hitbox?: number[]
}
