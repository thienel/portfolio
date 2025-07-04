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
    this.registerApplication('help', {
      app: () => this.showHelp(),
      docs: {
        name: 'help',
        short: 'Display available commands',
        description: 'Shows a list of all available commands and their descriptions',
      },
    })

    this.registerApplication('clear', {
      app: () => this.clearScreen(),
      docs: {
        name: 'clear',
        short: 'Clear the terminal screen',
        description: 'Clears all content from the terminal screen',
      },
    })

    registerApplications(
      (name, definition) => this.registerApplication(name, definition),
      this.printFunction,
      this.fileSystemPath,
      this.rootNode,
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

  private showHelp(): void {
    let helpText = '\n\n## Available Commands\n\n'

    Object.entries(this.applications).forEach(([name, definition]) => {
      helpText += `**${name}** - ${definition.docs.short}\n`
      if (definition.docs.description) {
        helpText += `  ${definition.docs.description}\n`
      }
      helpText += '\n'
    })

    this.printFunction(helpText, true)
  }

  private clearScreen(): void {
    this.printFunction('\n'.repeat(20))
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
