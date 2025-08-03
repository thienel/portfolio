export function clampedMap(x: number, from: [number, number], to: [number, number]): number {
  const y = ((x - from[0]) / (from[1] - from[0])) * (to[1] - to[0]) + to[0]

  if (to[0] < to[1]) {
    if (y < to[0]) return to[0]
    if (y > to[1]) return to[1]
  } else {
    if (y > to[0]) return to[0]
    if (y < to[1]) return to[1]
  }

  return y
}

export function lerp(a: number, b: number, t: number): number {
  return a * (1 - t) + b * t
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

export function normalize(value: number, min: number, max: number): number {
  return (value - min) / (max - min)
}

export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI)
}
