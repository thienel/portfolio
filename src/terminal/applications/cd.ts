import { FileSystemNode, FileSystemPath, PrintFunction } from '../types'
import { resolveCurrentDir, getHomePath, expandHomePath } from '../utils'

export default function cd(print: PrintFunction, path: FileSystemPath, root: FileSystemNode) {
  const docs = {
    name: 'cd',
    short: 'change directory',
    description: 'Change to a directory (cd dir), parent (cd ..), or root (cd ~)',
  }

  const app = (args: string[]) => {
    if (args.length === 0 || args[0] === '~') {
      try {
        path.p = getHomePath(root)
      } catch {
        print('\nError: Home directory not found\n')
      }
      return
    }

    let targetPath = args[0]

    targetPath = expandHomePath(targetPath)

    const parts = targetPath.split('/').filter(Boolean)
    let newPath: FileSystemNode[]
    let current: FileSystemNode

    if (targetPath.startsWith('home/user/') || targetPath === 'home/user') {
      newPath = []
      current = root
    } else {
      newPath = [...path.p]
      try {
        current = resolveCurrentDir(root, path)
      } catch {
        print('\nError: Invalid current directory\n')
        return
      }
    }

    for (const part of parts) {
      if (part === '..') {
        if (newPath.length > 0) {
          newPath.pop()
          try {
            current = resolveCurrentDir(root, { p: newPath })
          } catch {
            print('\nError: Invalid path\n')
            return
          }
        }
        continue
      }

      if (!current.children) {
        print(`\nNot a directory\n`)
        return
      }

      const next = current.children.find(c => c.name === part && c.type === 'directory')
      if (!next) {
        print(`\n${part}: No such directory\n`)
        return
      }

      newPath.push(next)
      current = next
    }

    path.p = newPath
  }

  return { docs, app }
}
