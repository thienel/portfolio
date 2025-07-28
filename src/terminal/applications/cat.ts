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
      // Expand home path if it starts with ~
      filePath = expandHomePath(filePath)

      // Parse the file path
      const pathParts = filePath.split('/').filter(Boolean)
      const filename = pathParts.pop() // Last part is the filename

      let currentDir: FileSystemNode

      // Determine starting directory
      if (pathParts.length === 0) {
        // No directory specified, default to /home/user
        const homePath = getHomePath(rootNode)
        currentDir = homePath[homePath.length - 1] // Get the user directory
      } else if (filePath.startsWith('home/user/') || path.p.length === 0) {
        // Absolute path or no current path set, start from root
        currentDir = rootNode
      } else {
        // Relative path, start from current directory
        currentDir = resolveCurrentDir(rootNode, path)
      }

      // Navigate through directories if path contains directories
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

      // Find the file in the final directory
      const file = currentDir.children.find(
        child => child.name === filename && child.type === 'file',
      )

      if (!file) {
        print(`\ncat: ${args[0]}: No such file or directory\n`)
        return
      }

      // Display file contents
      print(`\n${file.content || ''}\n`)
    } catch {
      print('\nError accessing file path\n')
    }
  }

  return { docs, app }
}
