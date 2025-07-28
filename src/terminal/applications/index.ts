import {
  ApplicationDefinition,
  ApplicationRegistry,
  FileSystemNode,
  FileSystemPath,
  PrintFunction,
} from '../types'
import cd from './cd'
import ls from './ls'
import cat from './cat'
import clear from './clear'
import help from './help'

export function registerApplications(
  registerApplication: (name: string, definition: ApplicationDefinition) => void,
  print: PrintFunction,
  path: FileSystemPath,
  rootNode: FileSystemNode,
  getApplications: () => ApplicationRegistry,
): void {
  registerApplication('cd', cd(print, path, rootNode))
  registerApplication('ls', ls(print, path))
  registerApplication('cat', cat(print, path, rootNode))
  registerApplication('clear', clear(print))
  registerApplication('help', help(print, getApplications))
}
