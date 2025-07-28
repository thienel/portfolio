import { registerApplications } from '../applications'
import {
  PrintFunction,
  FileSystemPath,
  ApplicationRegistry,
  ApplicationDefinition,
  FileSystemNode,
} from '../types'
import { sanitizeCommand, splitCommand, createPrompt } from '../utils'

export class CommandProcessor {
  private applications: ApplicationRegistry = {}
  private fileSystemPath: FileSystemPath
  private rootNode: FileSystemNode
  private printFunction: PrintFunction

  constructor(
    printFunction: PrintFunction,
    fileSystemPath: FileSystemPath,
    rootNode: FileSystemNode,
  ) {
    this.printFunction = printFunction
    this.fileSystemPath = fileSystemPath
    this.rootNode = rootNode
    this.setupBuiltinCommands()
  }

  private setupBuiltinCommands(): void {
    registerApplications(
      (name, definition) => this.registerApplication(name, definition),
      this.printFunction,
      this.fileSystemPath,
      this.rootNode,
      () => this.applications,
    )
  }

  public registerApplication(name: string, definition: ApplicationDefinition): void {
    this.applications[name] = definition
  }

  public processCommand(command: string): void {
    const sanitizedCommand = sanitizeCommand(command)

    if (!sanitizedCommand) {
      this.showPrompt()
      return
    }

    const [commandName, args] = splitCommand(sanitizedCommand)
    console.log('Processing command:', commandName, args)

    const application = this.applications[commandName]
    if (application) {
      try {
        application.app(args)
      } catch (error) {
        this.printFunction(`\nError executing ${commandName}: ${error}`)
      }
    } else {
      this.printFunction(`\n${commandName}: command not found`)
    }

    this.showPrompt()
  }

  private showPrompt(): void {
    const prompt = createPrompt(this.fileSystemPath.p)
    this.printFunction(prompt)
  }

  public getApplications(): ApplicationRegistry {
    return { ...this.applications }
  }

  public getApplication(name: string): ApplicationDefinition | null {
    return this.applications[name] || null
  }
}

export class BashEmulator {
  private commandProcessor: CommandProcessor
  private fileSystemPath: FileSystemPath

  constructor(
    printFunction: PrintFunction,
    fileSystemPath: FileSystemPath,
    rootNode: FileSystemNode,
  ) {
    this.fileSystemPath = fileSystemPath
    this.commandProcessor = new CommandProcessor(printFunction, fileSystemPath, rootNode)
  }

  public registerApplication(name: string, definition: ApplicationDefinition): void {
    this.commandProcessor.registerApplication(name, definition)
  }

  public input(command: string): void {
    this.commandProcessor.processCommand(command)
  }

  public getCurrentPath(): FileSystemPath {
    return this.fileSystemPath
  }

  public getCommandProcessor(): CommandProcessor {
    return this.commandProcessor
  }
}
