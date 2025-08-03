import titleText from '../../file-system/home/user/title/title.md?raw'
import { BashEmulator } from './BashEmulator'
import { FileSystemNode, FileSystemPath, TerminalEngine } from '../types'
import { calculateStringEditDistance, generateFS } from '../utils'

export class TerminalController {
  private bash: BashEmulator | null = null
  private textEngine: TerminalEngine
  private textarea: HTMLTextAreaElement
  private canvas: HTMLCanvasElement
  private lastSelection: number = 0
  private oldText: string = ''
  private isInitialized: boolean = false
  private rootNode: FileSystemNode | null = null

  constructor(
    textEngine: TerminalEngine,
    textarea: HTMLTextAreaElement,
    canvas: HTMLCanvasElement,
  ) {
    this.textEngine = textEngine
    this.textarea = textarea
    this.canvas = canvas

    this.initialize()
  }

  private initialize(): void {
    this.setupTextarea()
    this.setupBash()
    this.setupEventListeners()
    this.displayWelcome()
    this.isInitialized = true
  }

  private setupTextarea(): void {
    this.textarea.value = ''
    this.textarea.readOnly = true
    this.textarea.blur()
  }

  private setupBash(): void {
    const files = import.meta.glob('/src/file-system/**/*.md', {
      query: '?raw',
      import: 'default',
      eager: true,
    }) as Record<string, string>

    const fsTree = generateFS(files) as FileSystemPath
    this.rootNode = { name: 'root', type: 'directory', children: fsTree.p } as FileSystemNode

    const homeDir = this.rootNode.children?.find(c => c.name === 'home' && c.type === 'directory')
    const userDir = homeDir?.children?.find(c => c.name === 'user' && c.type === 'directory')

    if (homeDir && userDir) {
      fsTree.p = [homeDir, userDir]
    }

    this.bash = new BashEmulator(
      (text: string, isMarkdown: boolean = false) => {
        this.printToScreen(text, isMarkdown)
      },
      fsTree,
      this.rootNode,
    )
  }

  private setupEventListeners(): void {
    this.textarea.addEventListener('input', () => {
      this.handleInput()
    })

    this.canvas.addEventListener('pointerup', (event: PointerEvent) => {
      this.handleCanvasClick(event)
    })

    window.addEventListener('keypress', (event: KeyboardEvent) => {
      this.handleKeyPress(event)
    })

    window.addEventListener('keydown', (event: KeyboardEvent) => {
      this.handleKeyDown(event)
    })

    document.addEventListener('selectionchange', () => {
      this.handleSelectionChange()
    })
  }

  private displayWelcome(): void {
    this.textEngine.placeMarkdown(titleText)
    this.textEngine.placeText('\nuser:~$')
  }

  private printToScreen(text: string, isMarkdown: boolean): void {
    if (isMarkdown) {
      const numOfPixels = this.textEngine.placeMarkdown(text)
      this.textEngine.scroll(numOfPixels, 'px', {
        updateMaxScroll: true,
        moveView: false,
      })
      this.textEngine.scroll(12, 'lines', {
        updateMaxScroll: false,
        moveView: true,
      })
    } else {
      const numOfLines = this.textEngine.placeText(text)
      this.textEngine.scroll(numOfLines, 'lines')
    }
  }

  private handleInput(): void {
    const change = calculateStringEditDistance(this.oldText, this.textarea.value)
    this.oldText = this.textarea.value

    if (change) {
      this.textEngine.userInput(change, this.textarea.selectionStart)
    }

    this.textEngine.scrollToEnd()
  }

  private handleCanvasClick(event: PointerEvent): void {
    if (event.pointerType === 'mouse') {
      this.textarea.readOnly = false
      this.textarea.focus()
      this.textarea.setSelectionRange(this.lastSelection, this.lastSelection)
    } else {
      this.textarea.readOnly = true
      this.textarea.blur()
    }
  }

  private handleKeyPress(event: KeyboardEvent): void {
    if (this.textarea.readOnly === true || document.activeElement?.id !== 'textarea') {
      this.textarea.readOnly = false
      this.textarea.focus()

      if (event.key.length === 1) {
        event.preventDefault()
        this.textarea.value =
          this.textarea.value.slice(0, this.lastSelection) +
          event.key +
          this.textarea.value.slice(this.lastSelection)
        this.lastSelection += 1
        this.handleInput()
      }

      this.textarea.setSelectionRange(this.lastSelection, this.lastSelection)
    }

    if (event.key === 'Enter') {
      this.executeCommand()
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        this.textEngine.scroll(-1, 'lines', {
          moveView: true,
          updateMaxScroll: false,
        })
        break
      case 'ArrowDown':
        event.preventDefault()
        this.textEngine.scroll(1, 'lines', {
          moveView: true,
          updateMaxScroll: false,
        })
        break
    }
  }

  private handleSelectionChange(): void {
    if (this.textarea.selectionStart !== this.textarea.selectionEnd) {
      this.textarea.setSelectionRange(this.lastSelection, this.lastSelection)
    }

    this.lastSelection = this.textarea.selectionStart
    this.textEngine.userInput({ type: 'none', loc: 'none', str: '' }, this.textarea.selectionStart)
  }

  private executeCommand(): void {
    if (!this.bash) return

    this.textEngine.freezeInput()
    this.bash.input(this.textarea.value)

    this.textarea.value = ''
    const change = calculateStringEditDistance(this.oldText, this.textarea.value)
    this.oldText = this.textarea.value

    if (change) {
      this.textEngine.userInput(change, this.textarea.selectionStart)
    }
  }

  public getBash(): BashEmulator | null {
    return this.bash
  }

  public getTextEngine(): TerminalEngine {
    return this.textEngine
  }

  public isReady(): boolean {
    return this.isInitialized
  }

  public dispose(): void {
    this.isInitialized = false
  }
}
