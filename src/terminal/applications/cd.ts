import { FileSystemNode, FileSystemPath, PrintFunction } from '../types'
import { resolveCurrentDir } from '../utils'

export default function cd(print: PrintFunction, path: FileSystemPath, root: FileSystemNode) {
  const docs = {
    name: 'cd',
    short: 'change directory',
    description: 'Change to a subdirectory or go back to root.',
  }

  const app = (args: string[]) => {
    if (args.length === 0 || args[0] === '~') {
      path.p = [] // về root
      return
    }

    const parts = args[0].split('/').filter(Boolean)
    const newPath: FileSystemNode[] = [...path.p]
    let current = resolveCurrentDir(root, path)

    for (const part of parts) {
      if (part === '..') {
        newPath.pop()
        current = resolveCurrentDir(root, { p: newPath })
        continue
      }

      if (!current.children) {
        print(`\nNot a directory`)
        return
      }

      const next = current.children.find(c => c.name === part && c.type === 'directory')
      if (!next) {
        print(`\n${part}: No such directory`)
        return
      }

      newPath.push(next)
      current = next
    }

    path.p = newPath
  }

  return { docs, app }
}
