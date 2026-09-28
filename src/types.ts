// MonkeySheet Animation structures

export interface Frame {
  id: string
  imageUrl: string
  duration: number // frame duration in milliseconds
}

export interface AnimationConfig {
  id: string
  name: string
  frames: number[] // array of frame durations
  centerX: number
  centerY: number
  hitbox?: number[] // optional hitbox data
}

export interface ContainerConfig {
  id: string
  size: number // spritesheet grid size (e.g., 3 for 3x3 grid)
}

export interface AnimationProject {
  containerName: string
  containerSize: number
  animations: AnimationConfig[]
}
