import { ParallaxState, MouseState } from '../types'
import { Change } from '../../terminal/types'
import { clampedMap } from '../utils/math'

export class InputManager {
  private canvas: HTMLCanvasElement
  private mouseState: MouseState | null = null
  private parallax: ParallaxState = { x: 0, y: 0 }
  private listeners: Map<string, EventListener> = new Map()
  private lastMoveTime: number = 0
  private moveThrottleDelay: number = 16 // ~60fps

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    // Mouse/Touch movement with manual throttling
    const handlePointerMove = (event: Event) => {
      const now = Date.now()
      if (now - this.lastMoveTime < this.moveThrottleDelay) {
        return
      }
      this.lastMoveTime = now

      const pointerEvent = event as PointerEvent
      this.checkTouchType(pointerEvent)
      if (this.mouseState) {
        this.updateParallax(pointerEvent)
      }
    }

    const handlePointerDown = (event: Event) => {
      const pointerEvent = event as PointerEvent
      this.checkTouchType(pointerEvent)
      this.mouseState = { x: pointerEvent.clientX, y: pointerEvent.clientY }
    }

    const handlePointerUp = (event: Event) => {
      const pointerEvent = event as PointerEvent
      this.checkTouchType(pointerEvent)
      this.mouseState = null
    }

    // Store references for cleanup
    this.listeners.set('pointermove', handlePointerMove)
    this.listeners.set('pointerdown', handlePointerDown)
    this.listeners.set('pointerup', handlePointerUp)

    // Add event listeners
    this.canvas.addEventListener('pointermove', handlePointerMove, { passive: true })
    this.canvas.addEventListener('pointerdown', handlePointerDown, { passive: true })
    document.addEventListener('pointerup', handlePointerUp, { passive: true })
  }

  private checkTouchType(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') {
      this.mouseState = null
      this.parallax.x = 0
      this.parallax.y = 0
    }
  }

  private updateParallax(event: PointerEvent): void {
    if (!this.mouseState) return

    const deltaX = (event.clientX - this.mouseState.x) / (window.innerWidth * 0.5)
    const deltaY = (event.clientY - this.mouseState.y) / (window.innerHeight * 0.5)

    this.parallax.x += deltaX
    this.parallax.x = clampedMap(this.parallax.x, [-1, 1], [-1, 1])

    this.parallax.y += deltaY
    this.parallax.y = clampedMap(this.parallax.y, [-1, 1], [-1, 1])

    this.mouseState = { x: event.clientX, y: event.clientY }
  }

  public getParallax(): ParallaxState {
    return { ...this.parallax }
  }

  public dispose(): void {
    // Remove event listeners
    this.listeners.forEach((listener, eventType) => {
      if (eventType === 'pointerup') {
        document.removeEventListener(eventType, listener)
      } else {
        this.canvas.removeEventListener(eventType, listener)
      }
    })
    this.listeners.clear()
  }
}

export class TerminalInputManager {
  private textarea: HTMLTextAreaElement
  private canvas: HTMLCanvasElement
  private lastSelection: number = 0
  private oldText: string = ''
  private onInputChange: (change: Change, selectionPos: number) => void
  private onCommand: (command: string) => void
  private onScroll: (direction: 'up' | 'down') => void
  private listeners: Map<string, EventListener> = new Map()

  constructor(
    textarea: HTMLTextAreaElement,
    canvas: HTMLCanvasElement,
    callbacks: {
      onInputChange: (change: Change, selectionPos: number) => void
      onCommand: (command: string) => void
      onScroll: (direction: 'up' | 'down') => void
    },
  ) {
    this.textarea = textarea
    this.canvas = canvas
    this.onInputChange = callbacks.onInputChange
    this.onCommand = callbacks.onCommand
    this.onScroll = callbacks.onScroll

    this.setupEventListeners()
    this.initializeTextarea()
  }

  private initializeTextarea(): void {
    this.textarea.value = ''
    this.textarea.readOnly = true
    this.textarea.blur()
  }

  private setupEventListeners(): void {
    const handleInput = () => {
      const change = this.calculateStringChange(this.oldText, this.textarea.value)
      this.oldText = this.textarea.value
      if (change) {
        this.onInputChange(change, this.textarea.selectionStart)
      }
    }

    const handleCanvasClick = (event: Event) => {
      const pointerEvent = event as PointerEvent
      if (pointerEvent.pointerType === 'mouse') {
        this.textarea.readOnly = false
        this.textarea.focus()
        this.textarea.setSelectionRange(this.lastSelection, this.lastSelection)
      } else {
        this.textarea.readOnly = true
        this.textarea.blur()
      }
    }

    const handleKeyPress = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent
      if (this.textarea.readOnly === true || document.activeElement?.id !== 'textarea') {
        this.textarea.readOnly = false
        this.textarea.focus()

        if (keyboardEvent.key.length === 1) {
          this.textarea.value =
            this.textarea.value.slice(0, this.lastSelection) +
            keyboardEvent.key +
            this.textarea.value.slice(this.lastSelection)
          this.lastSelection += 1
          handleInput()
        }
        this.textarea.setSelectionRange(this.lastSelection, this.lastSelection)
      }

      if (keyboardEvent.key === 'Enter') {
        this.onCommand(this.textarea.value)
        this.textarea.value = ''
        const change = this.calculateStringChange(this.oldText, this.textarea.value)
        this.oldText = this.textarea.value
        if (change) {
          this.onInputChange(change, this.textarea.selectionStart)
        }
      }
    }

    const handleKeyDown = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent
      switch (keyboardEvent.key) {
        case 'ArrowUp':
          keyboardEvent.preventDefault()
          this.onScroll('up')
          break
        case 'ArrowDown':
          keyboardEvent.preventDefault()
          this.onScroll('down')
          break
      }
    }

    const handleSelectionChange = () => {
      if (this.textarea.selectionStart !== this.textarea.selectionEnd) {
        this.textarea.setSelectionRange(this.lastSelection, this.lastSelection)
      }
      this.lastSelection = this.textarea.selectionStart
      this.onInputChange({ type: 'none', loc: 'none', str: '' }, this.textarea.selectionStart)
    }

    // Store references for cleanup
    this.listeners.set('input', handleInput)
    this.listeners.set('canvasClick', handleCanvasClick)
    this.listeners.set('keypress', handleKeyPress)
    this.listeners.set('keydown', handleKeyDown)
    this.listeners.set('selectionchange', handleSelectionChange)

    // Add event listeners
    this.textarea.addEventListener('input', handleInput)
    this.canvas.addEventListener('pointerup', handleCanvasClick)
    window.addEventListener('keypress', handleKeyPress)
    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('selectionchange', handleSelectionChange)
  }

  private calculateStringChange(oldStr: string, newStr: string): Change | null {
    // This is a simplified version - you may want to use the utility function
    const lenDiff = oldStr.length - newStr.length

    if (lenDiff === 0) return null

    return {
      type: lenDiff > 0 ? 'del' : 'add',
      loc: 'end',
      str: lenDiff > 0 ? oldStr.slice(newStr.length) : newStr.slice(oldStr.length),
    }
  }

  public dispose(): void {
    // Remove event listeners
    this.listeners.forEach((listener, eventType) => {
      switch (eventType) {
        case 'input':
          this.textarea.removeEventListener('input', listener)
          break
        case 'canvasClick':
          this.canvas.removeEventListener('pointerup', listener)
          break
        case 'keypress':
          window.removeEventListener('keypress', listener)
          break
        case 'keydown':
          window.removeEventListener('keydown', listener)
          break
        case 'selectionchange':
          document.removeEventListener('selectionchange', listener)
          break
      }
    })
    this.listeners.clear()
  }
}
