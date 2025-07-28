import { FileSystemNode, FileSystemPath, PrintFunction } from '../types'
import { resolveCurrentDir, getHomePath, expandHomePath } from '../utils'

export default function cat(print: PrintFunction, path: FileSystemPath, rootNode: FileSystemNode) {
  const docs = {
    name: 'cat',
    short: 'Display file contents',
    description: 'Display the contents of a file. Usage: cat <filename> or cat <path/to/filename>.',
  }

  const app = (args: string[]) => {
    if (args.length === 0) {
      print(
        '\nUsage: cat <filename> or cat <path/to/filename>\nSupports ~ for home directory (e.g., ~/projects/file.md)\n',
      )
      return
    }

    let filePath = args[0]

    try {
      filePath = expandHomePath(filePath)

      const pathParts = filePath.split('/').filter(Boolean)
      const filename = pathParts.pop()

      let currentDir: FileSystemNode

      if (pathParts.length === 0) {
        if (path.p.length === 0) {
          const homePath = getHomePath(rootNode)
          currentDir = homePath[homePath.length - 1] // Get the user directory
        } else {
          currentDir = resolveCurrentDir(rootNode, path)
        }
      } else if (filePath.startsWith('home/user/')) {
        currentDir = rootNode
      } else {
        currentDir = resolveCurrentDir(rootNode, path)
      }

      for (const dirName of pathParts) {
        if (!currentDir.children) {
          print(`\ncat: ${args[0]}: Not a directory\n`)
          return
        }

        const nextDir = currentDir.children.find(
          child => child.name === dirName && child.type === 'directory',
        )
        if (!nextDir) {
          print(`\ncat: ${args[0]}: No such file or directory\n`)
          return
        }

        currentDir = nextDir
      }

      if (!currentDir.children) {
        print(`\ncat: ${args[0]}: Not a directory\n`)
        return
      }

      const file = currentDir.children.find(
        child => child.name === filename && child.type === 'file',
      )

      if (!file) {
        print(`\ncat: ${args[0]}: No such file or directory\n`)
        return
      }

      print(`\n${file.content || ''}\n`)
    } catch (error) {
      print(`\nError accessing file path: ${error}\n`)
    }
  }

  return { docs, app }
}
