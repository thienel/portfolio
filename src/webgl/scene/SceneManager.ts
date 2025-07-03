import * as THREE from 'three'
import { Assists, ViewportSizes, CameraControls } from '../types'
import { clampedMap } from '../utils/math'

export class SceneManager {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private computerGroup: THREE.Group
  private controlProps: CameraControls
  private sizes: ViewportSizes
  private canvas: HTMLCanvasElement

  constructor(
    canvas: HTMLCanvasElement,
    sizes: ViewportSizes,
    controlProps: CameraControls,
    assists: Assists,
  ) {
    this.canvas = canvas
    this.sizes = sizes
    this.controlProps = controlProps

    this.scene = new THREE.Scene()
    this.camera = this.createCamera()
    this.renderer = this.createRenderer()
    this.computerGroup = this.createComputerGroup(assists)

    this.setupLighting()
    this.setupResizeListener()
  }

  private createCamera(): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(50, this.sizes.width / this.sizes.height, 0.1, 100)
    camera.position.set(0, 0, -2.5)
    camera.rotation.set(-Math.PI, 0, Math.PI)
    this.scene.add(camera)
    return camera
  }

  private createRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    })
    renderer.setSize(this.sizes.width, this.sizes.height)
    renderer.setPixelRatio(2)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    return renderer
  }

  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55)
    this.scene.add(ambientLight)
    this.scene.background = new THREE.Color(0x0d0d0d)
  }

  private createComputerGroup(assists: Assists): THREE.Group {
    const group = new THREE.Group()

    group.add(assists.screenMesh)

    // Shadow plane
    assists.shadowPlaneMesh.material = new THREE.MeshBasicMaterial({
      map: assists.bakeFloorTexture,
    })
    group.add(assists.shadowPlaneMesh)

    // Initial positioning
    group.position.x = this.controlProps.computerHorizontal
    group.position.y = this.controlProps.computerHeight
    group.rotation.y = this.controlProps.computerAngle

    this.scene.add(group)
    return group
  }

  private setupResizeListener(): void {
    window.addEventListener(
      'resize',
      () => {
        this.updateSize()
      },
      { passive: true },
    )
  }

  private updateSize(): void {
    this.sizes.width = document.documentElement.clientWidth
    this.sizes.height = window.innerHeight
    this.sizes.portraitOffset = clampedMap(
      this.sizes.height / this.sizes.width,
      [0.8, 1.8],
      [0, 2.5],
    )

    // Update camera
    this.camera.aspect = this.sizes.width / this.sizes.height
    this.camera.updateProjectionMatrix()

    // Update renderer
    this.renderer.setSize(this.sizes.width, this.sizes.height)
  }

  public updateCamera(scroll: number, parallax: { x: number; y: number }): void {
    // Update camera position based on scroll
    this.camera.position.z = clampedMap(
      scroll,
      [0, 1],
      [-2.5 - this.sizes.portraitOffset, -10 - this.sizes.portraitOffset],
    )

    // Apply parallax effect
    this.camera.position.x =
      parallax.x * clampedMap(scroll, [0, 1], [0.2, 5]) * 0.1 + this.camera.position.x * 0.9
    this.camera.position.y =
      parallax.y * clampedMap(scroll, [0, 1], [0.2, 1.5]) * 0.1 + this.camera.position.y * 0.9

    this.camera.lookAt(new THREE.Vector3(0, 0, 0))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public updateComputerGroup(scroll: number, assists: Assists): void {
    const zoomFac = clampedMap(scroll, [0, 1], [0, 1])

    // Update computer group positioning
    this.computerGroup.position.x = this.controlProps.computerHorizontal * zoomFac
    this.computerGroup.position.y = clampedMap(
      scroll,
      [0, 1],
      [0, this.controlProps.computerHeight],
    )
    this.computerGroup.rotation.y = this.controlProps.computerAngle * zoomFac

    // Handle portrait mode rotation
    if (this.sizes.portraitOffset > 0.5) {
      this.computerGroup.rotation.z = clampedMap(scroll, [0, 1], [-Math.PI / 2, 0])
    } else {
      this.computerGroup.rotation.z = 0
    }

    // CRT morphing effect
  }

  public updateCanvasOpacity(scroll: number): void {
    this.canvas.style.opacity = `${clampedMap(scroll, [1.25, 1.75], [1, 0])}`
  }

  public render(): void {
    this.renderer.setRenderTarget(null)
    this.renderer.render(this.scene, this.camera)
  }

  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer
  }

  public getScene(): THREE.Scene {
    return this.scene
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera
  }

  public getComputerGroup(): THREE.Group {
    return this.computerGroup
  }

  public dispose(): void {
    this.renderer.dispose()
    this.scene.clear()
  }
}
