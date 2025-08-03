'use client'

import * as THREE from 'three'
import React, { useRef, useEffect, useCallback } from 'react'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { UnrealBloomPass } from 'three/examples/jsm/Addons.js'
import { OutputPass } from 'three/examples/jsm/Addons.js'
import styles from './ParticleWaveBackground.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const ENHANCED_VERTEX_SHADER = `
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+10.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

uniform float uTime;

void main() {
  vec3 pos = position;

  float time = uTime * 5.0;

  float wave1 = sin(pos.x * 0.1) * cos(pos.y * 1.0) ;
  float wave2 = sin(pos.x * 0.1 + pos.y * 0.1);
  float wave3 = cos(pos.x * 2.0 + pos.y * 1.0);

  float waveHeight = (wave1 + wave2 + wave3) * 7.5;

  pos.x += sin(pos.y * 1.0 + time * 0.1) * 1.0;
  pos.y += cos(pos.x * 1.0 + time * 0.1) * 1.0;
  pos.z += waveHeight;

  float distanceFromCenter = length(pos.xy);
  float sizeFactor = 2.5;
  sizeFactor *= (1.75 - smoothstep(1.0, 1.0, distanceFromCenter));

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = sizeFactor * (5.0 / -mvPosition.z);

  gl_Position = projectionMatrix * mvPosition;
}
`

const ENHANCED_FRAGMENT_SHADER = `
uniform float uTime;

void main() {
  vec2 center = gl_PointCoord - vec2(0.5);
  float distance = length(center);

  float waveInfluence = sin(uTime * 2.0 + gl_FragCoord.x * 0.02 + gl_FragCoord.y * 0.02) * 0.3 + 0.7;

  float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
  alpha = pow(alpha, 1.2) * waveInfluence;

  float glow = 1.0 - smoothstep(0.0, 0.7, distance);
  glow = pow(glow, 2.5) * 0.4;

  alpha = max(alpha, glow);

  float colorWave = sin(uTime * 1.5 + distance * 8.0) * 0.5 + 0.5;
  vec3 color = mix(vec3(0.3, 0.6, 1.0), vec3(0.8, 0.9, 1.0), colorWave);

  gl_FragColor = vec4(color, alpha);
}
`

export interface ParticleWaveBackgroundProps {
  className?: string
  particleCount?: number
  animationSpeed?: number
  cameraPosition?: [number, number, number]
  cameraRotation?: [number, number, number]
  vertexShader?: string
  fragmentShader?: string
  bloomIntensity?: number
  bloomThreshold?: number
  bloomRadius?: number
  frameRate?: number
  onLoad?: (isLoading: boolean) => void
  enableStats?: boolean
  backgroundColor?: string
}

interface WaveUniforms {
  [uniform: string]: THREE.IUniform<unknown>
  uResolution: { value: THREE.Vector2 }
  uTime: { value: number }
  uCameraPos: { value: THREE.Vector3 }
  uLightPos: { value: THREE.Vector3 }
}

const ParticleWaveBackground: React.FC<ParticleWaveBackgroundProps> = ({
  particleCount,
  animationSpeed = 1.0,
  cameraPosition,
  cameraRotation,
  vertexShader = ENHANCED_VERTEX_SHADER,
  fragmentShader = ENHANCED_FRAGMENT_SHADER,
  bloomIntensity = 1.0,
  bloomThreshold = 1.0,
  bloomRadius = 1.0,
  frameRate = 60,
  onLoad,
  enableStats = false,
  backgroundColor = '#0D0D0D',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const getDeviceSettings = useCallback(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )

    if (isMobile) {
      return {
        count: particleCount || 8000,
        rotation: cameraRotation || ([1, 0, 6.15] as [number, number, number]),
        position: cameraPosition || ([3.8, -0.17, 0.9] as [number, number, number]),
      }
    } else {
      return {
        count: particleCount || 35000,
        rotation: cameraRotation || ([1.35, 5.5, 0.9] as [number, number, number]),
        position: cameraPosition || ([1.5, -0.55, 2.15] as [number, number, number]),
      }
    }
  }, [particleCount, cameraPosition, cameraRotation])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const settings = getDeviceSettings()

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })

    scene.background = new THREE.Color(backgroundColor)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace

    camera.position.set(...settings.position)
    camera.rotation.set(...settings.rotation)

    const uniforms: WaveUniforms = {
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uTime: { value: 0.0 },
      uCameraPos: { value: new THREE.Vector3() },
      uLightPos: { value: new THREE.Vector3(-5, 5, 5).normalize() },
    }

    const waveMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader,
      fragmentShader,
      wireframe: false,
      transparent: true,
      depthWrite: true,
      depthTest: true,
    })

    const pos = new Float32Array(settings.count * 3)
    const gridSize = Math.sqrt(settings.count)
    const spacing = 0.08
    const centerOffset = (gridSize * spacing) / 2

    for (let i = 0; i < settings.count; i++) {
      const i3 = i * 3
      const x = (i % gridSize) * spacing - centerOffset
      const y = Math.floor(i / gridSize) * spacing - centerOffset
      const randomOffset = 0.02
      const offsetX = (Math.random() - 0.5) * randomOffset
      const offsetY = (Math.random() - 0.5) * randomOffset

      pos[i3 + 0] = x + offsetX
      pos[i3 + 1] = y + offsetY
      pos[i3 + 2] = (Math.random() - 0.5) * 1.5
    }

    const waveGeo = new THREE.BufferGeometry()
    waveGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const wave = new THREE.Points(waveGeo, waveMat)
    scene.add(wave)

    const renderScene = new RenderPass(scene, camera)
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      bloomIntensity,
      bloomRadius,
      bloomThreshold,
    )
    const outputPass = new OutputPass()

    const composer = new EffectComposer(renderer)
    composer.addPass(renderScene)
    composer.addPass(bloomPass)
    composer.addPass(outputPass)

    composer.setSize(window.innerWidth, window.innerHeight)

    let stats: {
      begin: () => void
      end: () => void
      showPanel: (panel: number) => void
      dom: HTMLElement
    } | null = null
    if (enableStats && typeof window !== 'undefined') {
      try {
        import('stats.js')
          .then(Stats => {
            stats = new Stats.default()
            stats.showPanel(0)
            document.body.appendChild(stats.dom)
          })
          .catch(() => {
            console.warn('Stats.js not available')
          })
      } catch {
        console.warn('Stats.js not available')
      }
    }

    const handleResize = () => {
      composer.reset()
      renderer.resetState()
      renderer.setSize(window.innerWidth, window.innerHeight)
      composer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    let animationId: number
    let lastTime = 0
    const frameInterval = 1000 / frameRate

    const animate = (currentTime: number) => {
      if (stats) stats.begin()

      if (currentTime - lastTime >= frameInterval) {
        composer.render()
        uniforms.uTime.value += 0.005 * animationSpeed
        lastTime = currentTime
      }

      if (stats) stats.end()
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    if (onLoad) {
      onLoad(false)
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      window.removeEventListener('resize', handleResize)

      if (stats && stats.dom && stats.dom.parentNode) {
        stats.dom.parentNode.removeChild(stats.dom)
      }

      composer.dispose()
      renderer.dispose()

      if (wave) {
        scene.remove(wave)
        if (wave.geometry) wave.geometry.dispose()
        if (Array.isArray(wave.material)) {
          wave.material.forEach((material: THREE.Material) => material.dispose())
        } else if (wave.material) {
          wave.material.dispose()
        }
      }

      waveGeo.dispose()
      waveMat.dispose()
    }
  }, [
    getDeviceSettings,
    vertexShader,
    fragmentShader,
    bloomIntensity,
    bloomThreshold,
    bloomRadius,
    animationSpeed,
    frameRate,
    onLoad,
    enableStats,
    backgroundColor,
  ])

  return <canvas ref={canvasRef} className={cx('background')} />
}

export default React.memo(ParticleWaveBackground)
