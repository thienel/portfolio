/**
 * Maps a value from one range to another range with clamping
 * @param x - Input value
 * @param from - Input range [min, max]
 * @param to - Output range [min, max]
 * @returns Mapped and clamped value
 */
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

/**
 * Linear interpolation between two values
 * @param a - Start value
 * @param b - End value
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated value
 */
export function lerp(a: number, b: number, t: number): number {
  return a * (1 - t) + b * t
}

/**
 * Smoothstep function for smooth interpolation
 * @param edge0 - Lower edge
 * @param edge1 - Upper edge
 * @param x - Input value
 * @returns Smoothed value
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

/**
 * Clamps a value between min and max
 * @param value - Input value
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Checks if a value is within a range
 * @param value - Value to check
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns True if value is within range
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Normalizes a value from a range to 0-1
 * @param value - Input value
 * @param min - Minimum of range
 * @param max - Maximum of range
 * @returns Normalized value
 */
export function normalize(value: number, min: number, max: number): number {
  return (value - min) / (max - min)
}

/**
 * Converts degrees to radians
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Converts radians to degrees
 * @param radians - Angle in radians
 * @returns Angle in degrees
 */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI)
}
