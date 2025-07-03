import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

type Assists = {
  screenMesh: THREE.Mesh
  shadowPlaneMesh: THREE.Mesh
  bakeTexture: THREE.Texture
  bakeFloorTexture: THREE.Texture
  publicPixelFont: Font
  chillFont: Font
  environmentMapTexture: THREE.CubeTexture
}

function loadAssists(callback: (assists: Assists) => void) {
  const assists: Assists = {} as Assists

  const loadingDOM = document.querySelector('#loading')
  const loadingItemsDOM = document.querySelector('#loading-items')
  const loadingBarDOM = document.querySelector('#loading-bar-progress')

  const manager = new THREE.LoadingManager()

  manager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log(
      'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.',
    )
  }

  manager.onLoad = function () {
    if (!loadingItemsDOM) return
    loadingItemsDOM.textContent = `Nearly There...`

    console.log('Loading complete!')
    window.setTimeout(() => {
      ;(loadingDOM as HTMLElement).style.opacity = '0'
      callback(assists as Assists)
    }, 200)
    window.setTimeout(() => {
      ;(loadingDOM as HTMLElement).style.display = 'none'
    }, 500)
  }

  manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    if (!loadingItemsDOM || !loadingBarDOM) return
    ;(loadingBarDOM as HTMLElement).style.transform = `scaleX(${itemsLoaded / itemsTotal})`
    loadingItemsDOM.textContent = `${itemsLoaded} of ${itemsTotal} File Loaded: ${url}`
    console.log(
      'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.',
    )
  }

  // Fonts
  const fontLoader = new FontLoader(manager)
  fontLoader.load('/fonts/public-pixel.json', font => {
    assists.publicPixelFont = font
  })
  fontLoader.load('/fonts/chill.json', font => {
    assists.chillFont = font
  })

  // Texture

  // Texture
  const textureLoader = new THREE.TextureLoader(manager)
  textureLoader.load('/textures/bake-quality-5.jpg', tex => {
    tex.flipY = false
    tex.colorSpace = THREE.SRGBColorSpace
    assists.bakeTexture = tex
  })

  textureLoader.load('/textures/bake_floor-quality-3.jpg', tex => {
    tex.flipY = false
    tex.colorSpace = THREE.SRGBColorSpace
    assists.bakeFloorTexture = tex
  })

  const cubeTextureLoader = new THREE.CubeTextureLoader(manager)

  cubeTextureLoader.load(
    [
      `/textures/environmentMap/px.jpg`,
      `/textures/environmentMap/nx.jpg`,
      `/textures/environmentMap/py.jpg`,
      `/textures/environmentMap/ny.jpg`,
      `/textures/environmentMap/pz.jpg`,
      `/textures/environmentMap/nz.jpg`,
    ],
    tex => {
      assists.environmentMapTexture = tex
    },
  )

  // Mesh
  const gltfLoader = new GLTFLoader(manager)
  gltfLoader.load('/models/Commodore710_33.5.glb', gltf => {
    const getMeshByName = (name: string): THREE.Mesh => {
      const obj = gltf.scene.children.find(m => m.name === name)
      if (!obj) throw new Error(`Mesh "${name}" not found`)
      if (!(obj instanceof THREE.Mesh)) throw new Error(`"${name}" is not a THREE.Mesh`)
      return obj
    }

    assists.screenMesh = getMeshByName('Screen')
    assists.shadowPlaneMesh = getMeshByName('ShadowPlane')
  })
}

export { loadAssists }
export type { Assists }
