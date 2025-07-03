import * as THREE from 'three'
import { Font } from 'three/examples/jsm/loaders/FontLoader.js'
import { Change } from '../../terminal/types'

export interface Assists {
  screenMesh: THREE.Mesh
  bakeTexture: THREE.Texture
  bakeFloorTexture: THREE.Texture
  publicPixelFont: Font
  chillFont: Font
  environmentMapTexture: THREE.CubeTexture
}

export interface ViewportSizes {
  width: number
  height: number
  portraitOffset: number
}

export interface CameraControls {
  computerHeight: number
  computerAngle: number
  computerHorizontal: number
  minAzimuthAngleOffest: number
  maxAzimuthAngleOffest: number
  minPolarAngleOffest: number
  maxPolarAngleOffest: number
}

export interface ParallaxState {
  x: number
  y: number
}

export interface MouseState {
  x: number
  y: number
}

export interface WebGLConfig {
  canvas: HTMLCanvasElement
  sizes: ViewportSizes
  controlProps: CameraControls
  debugMode: boolean
}

export interface ScreenEngine {
  tick: (deltaTime: number, elapsedTime: number) => void
  screenRenderEngine: {
    material: THREE.Material
    tick: (deltaTime: number, elapsedTime: number) => void
  }
  screenTextEngine: {
    tick: (deltaTime: number, elapsedTime: number) => void
    userInput: (change: Change, selectionPos: number) => void
    placeMarkdown: (md: string) => number
    placeText: (str: string) => number
    scroll: (
      val: number,
      units: 'lines' | 'px',
      options?: {
        updateMaxScroll: boolean
        moveView: boolean
      },
    ) => void
    scrollToEnd: () => void
    freezeInput: () => void
  }
}

export interface LoadingProgress {
  itemsLoaded: number
  itemsTotal: number
  url: string
}

export type LoadingCallback = (assists: Assists) => void
export type ProgressCallback = (progress: LoadingProgress) => void
