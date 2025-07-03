import * as THREE from 'three'
import Stats from 'stats.js'
import DeltaTime from '../../DeltaTime'
import { AssetLoader } from './AssetLoader'
import { SceneManager } from '../scene/SceneManager'
import { InputManager } from '../input/InputManager'
import Screen from '../screen/'
import { Assists, ViewportSizes, CameraControls, WebGLConfig, ScreenEngine } from '../types'
import { clampedMap } from '../utils/math'

export class WebGLController {
  private stats: Stats
  private clock: THREE.Clock
  private sceneManager: SceneManager | null = null
  private inputManager: InputManager | null = null
  private screen: ScreenEngine | null = null
  private assists: Assists | null = null
  private config: WebGLConfig
  private animationId: number | null = null
  private scroll: number = 0
  private viewHeight: number = 0

  constructor(config: WebGLConfig) {
    this.config = config
    this.clock = new THREE.Clock()
    this.viewHeight = document.documentElement.clientHeight
    this.scroll = window.scrollY / this.viewHeight

    this.stats = new Stats()
    this.setupStats()
    this.setupScrollListener()
    this.loadAssets()
  }

  private setupStats(): void {
    if (this.config.debugMode) {
      this.stats.showPanel(0)
      document.body.appendChild(this.stats.dom)

      // Make textarea visible in debug mode
      const textarea = document.getElementById('textarea') as HTMLTextAreaElement
      if (textarea) {
        textarea.style.zIndex = '3'
        textarea.style.opacity = '1'
      }
    }
  }

  private setupScrollListener(): void {
    window.addEventListener(
      'scroll',
      () => {
        this.scroll = window.scrollY / this.viewHeight
      },
      { passive: true },
    )
  }

  private async loadAssets(): Promise<void> {
    const loader = new AssetLoader(
      (assists: Assists) => {
        this.assists = assists
        this.initializeScene()
        this.startAnimation()
      },
      progress => {
        console.log(`Loading progress: ${progress.itemsLoaded}/${progress.itemsTotal}`)
      },
    )

    try {
      await loader.loadAssets()
    } catch (error) {
      console.error('Failed to load assets:', error)
    }
  }

  private initializeScene(): void {
    if (!this.assists) {
      console.error('Cannot initialize scene: assets not loaded')
      return
    }

    this.sceneManager = new SceneManager(
      this.config.canvas,
      this.config.sizes,
      this.config.controlProps,
      this.assists,
    )

    this.inputManager = new InputManager(this.config.canvas)

    this.screen = Screen(this.assists, this.sceneManager.getRenderer())

    // Set screen material to the screen mesh
    this.sceneManager.getComputerGroup().children.forEach(child => {
      if (child.name === 'Screen' && this.screen) {
        ;(child as THREE.Mesh).material = this.screen.screenRenderEngine.material
      }
    })
  }

  private startAnimation(): void {
    this.animationId = window.requestAnimationFrame(() => this.tick())
  }

  private tick(): void {
    if (!this.sceneManager || !this.screen || !this.inputManager || !this.assists) return

    this.stats.begin()

    const deltaTime = DeltaTime()
    const elapsedTime = this.clock.getElapsedTime()

    // Update parallax from input
    const parallax = this.inputManager.getParallax()

    // Update camera position
    this.sceneManager.updateCamera(this.scroll, parallax)

    // Update computer group
    this.sceneManager.updateComputerGroup(this.scroll)

    // Update canvas opacity
    this.sceneManager.updateCanvasOpacity(this.scroll)

    // Update screen
    this.screen.tick(deltaTime, elapsedTime)

    // Render the scene
    this.sceneManager.render()

    this.stats.end()

    // Continue animation loop
    this.animationId = window.requestAnimationFrame(() => this.tick())
  }

  public dispose(): void {
    if (this.animationId) {
      window.cancelAnimationFrame(this.animationId)
      this.animationId = null
    }

    this.sceneManager?.dispose()
    this.inputManager?.dispose()

    if (this.config.debugMode && this.stats.dom.parentElement) {
      this.stats.dom.parentElement.removeChild(this.stats.dom)
    }
  }

  public getSceneManager(): SceneManager | null {
    return this.sceneManager
  }

  public getScreen(): ScreenEngine | null {
    return this.screen
  }

  public getAssists(): Assists | null {
    return this.assists
  }
}

// Main entry point function
export default function WebGL(): void {
  const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement
  if (!canvas) {
    console.error('Canvas with class "webgl" not found')
    return
  }

  // Check for debug mode
  const debugMode = window.location.hash.toLowerCase() === '#debug'

  // Initial viewport setup
  const sizes: ViewportSizes = {
    width: document.documentElement.clientWidth,
    height: window.innerHeight,
    portraitOffset: clampedMap(
      window.innerHeight / document.documentElement.clientWidth,
      [0.75, 1.75],
      [0, 2],
    ),
  }

  // Camera control properties
  const controlProps: CameraControls = {
    computerHeight: 0,
    computerAngle: Math.PI * 0.2,
    computerHorizontal: 0.5,
    minAzimuthAngleOffest: -Math.PI * 0.3,
    maxAzimuthAngleOffest: Math.PI * 0.3,
    minPolarAngleOffest: -Math.PI * 0.3,
    maxPolarAngleOffest: 0,
  }

  const config: WebGLConfig = {
    canvas,
    sizes,
    controlProps,
    debugMode,
  }

  // Create and initialize the WebGL controller
  const webglController = new WebGLController(config)

  // Expose globally for debugging
  if (debugMode) {
    ;(window as { webglController?: WebGLController }).webglController = webglController
  }
}
