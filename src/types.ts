export interface Frame {
  id: string
  imageUrl: string
  duration: number // milliseconds
}

export interface AnimationConfig {
  id: string
  name: string
  frames: number[] // raw frame indexes or durations depending on editor mode
  centerX: number
  centerY: number
  hitbox?: number[]
}

export interface ContainerConfig {
  id: string
  size: number // spritesheet grid size, e.g. 3 for 3x3
}

export interface AnimationProject {
  containerName: string
  containerSize: number
  animations: AnimationConfig[]
}
