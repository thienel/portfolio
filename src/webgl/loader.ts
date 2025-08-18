import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

type Assists = {
  screenMesh: THREE.Mesh
  bakeTexture: THREE.Texture
  bakeFloorTexture: THREE.Texture
  publicPixelFont: Font
  chillFont: Font
  environmentMapTexture: THREE.CubeTexture
}

function loadAssists(callback: (assists: Assists) => void) {
  const assists: Assists = {} as Assists

  const manager = new THREE.LoadingManager()

  manager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log(
      'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.',
    )
  }

  manager.onLoad = function () {
    console.log('Loading complete!')
    window.setTimeout(() => {
      callback(assists as Assists)
    }, 200)
  }

  manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log(
      'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.',
    )
  }

  const fontLoader = new FontLoader(manager)
  fontLoader.load('/fonts/public-pixel.json', font => {
    assists.publicPixelFont = font
  })
  fontLoader.load('/fonts/chill.json', font => {
    assists.chillFont = font
  })

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

  const gltfLoader = new GLTFLoader(manager)
  gltfLoader.load('/models/Screen.glb', gltf => {
    const getMeshByName = (name: string): THREE.Mesh => {
      const obj = gltf.scene.children.find(m => m.name === name)
      if (!obj) throw new Error(`Mesh "${name}" not found`)
      if (!(obj instanceof THREE.Mesh)) throw new Error(`"${name}" is not a THREE.Mesh`)
      return obj
    }

    assists.screenMesh = getMeshByName('Screen')
  })
}

export { loadAssists }
export type { Assists }
