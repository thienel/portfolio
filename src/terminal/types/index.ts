export interface Change {
  type: 'add' | 'del' | 'none'
  loc: number | 'end' | 'none'
  str: string
}

export interface FileSystemNode {
  name: string
  type: 'file' | 'directory'
  content?: string
  children?: FileSystemNode[]
}

export interface FileSystemPath {
  p: FileSystemNode[]
}

export interface ApplicationDefinition {
  app: (args: string[], options: string[]) => void
  docs: {
    name: string
    short: string
    description?: string
  }
}

export interface TerminalState {
  currentPath: FileSystemPath
  inputValue: string
  selectionPosition: number
  isReadOnly: boolean
}

export interface BashConfig {
  prompt: string
  homeDirectory: string
}

export type PrintFunction = (s: string, md?: boolean) => void
export type CommandFunction = (args: string[], options: string[]) => void
export type ApplicationRegistry = Record<string, ApplicationDefinition>

export interface StringEditResult {
  type: 'add' | 'del' | 'none'
  loc: number | 'end' | 'none'
  str: string
}

export interface ScrollOptions {
  updateMaxScroll: boolean
  moveView: boolean
}

export interface TerminalEngine {
  tick: (deltaTime: number, elapsedTime: number) => void
  userInput: (change: Change, selectionPos: number) => void
  placeMarkdown: (md: string) => number
  placeText: (str: string) => number
  scroll: (val: number, units: 'lines' | 'px', options?: ScrollOptions) => void
  scrollToEnd: () => void
  freezeInput: () => void
}
