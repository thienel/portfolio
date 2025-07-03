import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { Assists, LoadingCallback, ProgressCallback, LoadingProgress } from '../types'

export class AssetLoader {
  private manager: THREE.LoadingManager
  private assists: Partial<Assists> = {}
  private loadingElements: {
    loadingDOM: Element | null
    itemsDOM: Element | null
    progressDOM: Element | null
  }

  constructor(
    private onComplete: LoadingCallback,
    private onProgress?: ProgressCallback,
  ) {
    this.loadingElements = {
      loadingDOM: document.querySelector('#loading'),
      itemsDOM: document.querySelector('#loading-items'),
      progressDOM: document.querySelector('#loading-bar-progress'),
    }

    this.manager = new THREE.LoadingManager()
    this.setupLoadingManager()
  }

  private setupLoadingManager(): void {
    this.manager.onStart = (url, itemsLoaded, itemsTotal) => {
      console.log(`Started loading: ${url}. ${itemsLoaded}/${itemsTotal} files.`)
    }

    this.manager.onLoad = () => {
      this.handleLoadingComplete()
    }

    this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress: LoadingProgress = { itemsLoaded, itemsTotal, url }
      this.onProgress?.(progress)
      console.log(`Loading: ${url}. ${itemsLoaded}/${itemsTotal} files.`)
    }

    this.manager.onError = url => {
      console.error(`Failed to load: ${url}`)
    }
  }

  private handleLoadingComplete(): void {
    if (this.loadingElements.itemsDOM) {
      this.loadingElements.itemsDOM.textContent = 'Nearly there...'
    }

    console.log('Loading complete!')

    // Smooth fadeout
    setTimeout(() => {
      if (this.loadingElements.loadingDOM) {
        ;(this.loadingElements.loadingDOM as HTMLElement).style.opacity = '0'
      }
      this.onComplete(this.assists as Assists)
    }, 200)

    setTimeout(() => {
      if (this.loadingElements.loadingDOM) {
        ;(this.loadingElements.loadingDOM as HTMLElement).style.display = 'none'
      }
    }, 500)
  }

  public async loadAssets(): Promise<void> {
    try {
      await Promise.all([this.loadFonts(), this.loadTextures(), this.loadModels()])
    } catch (error) {
      console.error('Error loading assets:', error)
      throw error
    }
  }

  private loadFonts(): Promise<void> {
    return new Promise((resolve, reject) => {
      const fontLoader = new FontLoader(this.manager)
      let fontsLoaded = 0
      const totalFonts = 2

      const checkComplete = () => {
        if (fontsLoaded === totalFonts) resolve()
      }

      fontLoader.load(
        '/fonts/public-pixel.json',
        font => {
          this.assists.publicPixelFont = font
          fontsLoaded++
          checkComplete()
        },
        undefined,
        error => {
          console.error('Error loading public pixel font:', error)
          reject(error)
        },
      )

      fontLoader.load(
        '/fonts/chill.json',
        font => {
          this.assists.chillFont = font
          fontsLoaded++
          checkComplete()
        },
        undefined,
        error => {
          console.error('Error loading chill font:', error)
          reject(error)
        },
      )
    })
  }

  private loadTextures(): Promise<void> {
    return new Promise((resolve, reject) => {
      const textureLoader = new THREE.TextureLoader(this.manager)
      const cubeTextureLoader = new THREE.CubeTextureLoader(this.manager)
      let texturesLoaded = 0
      const totalTextures = 3

      const checkComplete = () => {
        if (texturesLoaded === totalTextures) resolve()
      }

      // Bake texture
      textureLoader.load(
        '/textures/bake-quality-5.jpg',
        texture => {
          texture.flipY = false
          texture.colorSpace = THREE.SRGBColorSpace
          this.assists.bakeTexture = texture
          texturesLoaded++
          checkComplete()
        },
        undefined,
        error => {
          console.error('Error loading bake texture:', error)
          reject(error)
        },
      )

      // Floor texture
      textureLoader.load(
        '/textures/bake_floor-quality-3.jpg',
        texture => {
          texture.flipY = false
          texture.colorSpace = THREE.SRGBColorSpace
          this.assists.bakeFloorTexture = texture
          texturesLoaded++
          checkComplete()
        },
        undefined,
        error => {
          console.error('Error loading floor texture:', error)
          reject(error)
        },
      )

      // Environment map
      cubeTextureLoader.load(
        [
          '/textures/environmentMap/px.jpg',
          '/textures/environmentMap/nx.jpg',
          '/textures/environmentMap/py.jpg',
          '/textures/environmentMap/ny.jpg',
          '/textures/environmentMap/pz.jpg',
          '/textures/environmentMap/nz.jpg',
        ],
        texture => {
          this.assists.environmentMapTexture = texture
          texturesLoaded++
          checkComplete()
        },
        undefined,
        error => {
          console.error('Error loading environment map:', error)
          reject(error)
        },
      )
    })
  }

  private loadModels(): Promise<void> {
    return new Promise((resolve, reject) => {
      const gltfLoader = new GLTFLoader(this.manager)

      gltfLoader.load(
        '/models/Commodore710_33.5.glb',
        gltf => {
          try {
            this.assists.screenMesh = this.getMeshByName(gltf, 'Screen')
            this.assists.shadowPlaneMesh = this.getMeshByName(gltf, 'ShadowPlane')
            resolve()
          } catch (error) {
            console.error('Error processing GLTF model:', error)
            reject(error)
          }
        },
        undefined,
        error => {
          console.error('Error loading GLTF model:', error)
          reject(error)
        },
      )
    })
  }

  private getMeshByName(gltf: { scene: { children: THREE.Object3D[] } }, name: string): THREE.Mesh {
    const obj = gltf.scene.children.find((child: THREE.Object3D) => child.name === name)
    if (!obj) {
      throw new Error(`Mesh "${name}" not found in GLTF model`)
    }
    if (!(obj instanceof THREE.Mesh)) {
      throw new Error(`Object "${name}" is not a THREE.Mesh`)
    }
    return obj
  }
}

// Legacy function for backwards compatibility
export function loadAssists(callback: LoadingCallback): void {
  const loader = new AssetLoader(callback)
  loader.loadAssets().catch(console.error)
}
