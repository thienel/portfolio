declare module 'three' {
  export interface Texture {
    encoding: number
  }

  export interface CubeTexture {
    encoding: number
  }

  export const sRGBEncoding: number
}
