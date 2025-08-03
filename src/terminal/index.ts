export { TerminalController } from './core/TerminalController'
export { BashEmulator } from './core/BashEmulator'
export * from './types'
export * from './utils'

import { TerminalController } from './core/TerminalController'
import { TerminalEngine } from './types'

export default function Terminal(screenTextEngine: TerminalEngine) {
  const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement
  const textarea = document.getElementById('textarea') as HTMLTextAreaElement

  return new TerminalController(screenTextEngine, textarea, canvas)
}
