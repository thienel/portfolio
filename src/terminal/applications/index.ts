import { ApplicationDefinition, FileSystemNode, FileSystemPath, PrintFunction } from '../types'
import cd from './cd'
import ls from './ls'

export function registerApplications(
  registerApplication: (name: string, definition: ApplicationDefinition) => void,
  print: PrintFunction,
  path: FileSystemPath,
  rootNode: FileSystemNode,
): void {
  registerApplication('cd', cd(print, path, rootNode))
  registerApplication('ls', ls(print, path))
}
