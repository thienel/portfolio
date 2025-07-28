import { Change, FileSystemNode, FileSystemPath } from '../types'

export function calculateStringEditDistance(oldStr: string, newStr: string): Change | null {
  const lenDiff = oldStr.length - newStr.length

  const change: Change = {
    type: 'none',
    loc: 'none',
    str: '',
  }

  let oldPointer = 0
  let newPointer = 0

  if (lenDiff === 0) {
    return null
  } else if (lenDiff > 0) {
    change.type = 'del'
    while (oldPointer < oldStr.length || newPointer < newStr.length) {
      if (oldPointer >= oldStr.length) {
        console.error('Unexpected add and del operation')
        return null
      }
      if (oldStr.charAt(oldPointer) !== newStr.charAt(newPointer)) {
        if (change.loc === 'none') {
          change.loc = newPointer === newStr.length ? 'end' : newPointer
        }
        change.str += oldStr.charAt(oldPointer)
        oldPointer++
      } else {
        oldPointer++
        newPointer++
      }
    }
  } else if (lenDiff < 0) {
    change.type = 'add'
    while (oldPointer < oldStr.length || newPointer < newStr.length) {
      if (newPointer >= newStr.length) {
        console.error('Unexpected add and del operation')
        return null
      }
      if (oldStr.charAt(oldPointer) !== newStr.charAt(newPointer)) {
        if (change.loc === 'none') {
          change.loc = oldPointer === oldStr.length ? 'end' : oldPointer
        }
        change.str += newStr.charAt(newPointer)
        newPointer++
      } else {
        oldPointer++
        newPointer++
      }
    }
  }

  return change
}

export function sanitizeCommand(command: string): string {
  return command.replace(/\s+/g, ' ').trim()
}

export function splitCommand(command: string): [string, string[]] {
  const sanitized = sanitizeCommand(command)
  const parts = sanitized.split(' ')
  const commandName = parts[0] || ''
  const args = parts.slice(1)

  return [commandName, args]
}

export function formatPath(path: Array<{ name: string }>): string {
  const fullPath = path.map(p => p.name).join('/')
  // Replace home/user with ~ for a cleaner prompt
  const shortened = fullPath.replace(/^home\/user/, '~')
  return shortened === '~' ? '~' : shortened === '' ? '/' : `${shortened}`
}

export function createPrompt(path: Array<{ name: string }>, user: string = 'user'): string {
  const formattedPath = formatPath(path)
  return `\n${user}:${formattedPath}$`
}

export function escapeString(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function generateFS(files: Record<string, string>): FileSystemPath {
  const tree: FileSystemPath = { p: [] }

  for (const path in files) {
    const cleanPath = path.replace('/src/file-system/', '')
    const parts = cleanPath.split('/')

    let currentChildren = tree.p

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isLast = i === parts.length - 1

      if (isLast) {
        currentChildren.push({
          name: part,
          type: 'file',
          content: files[path],
        })
      } else {
        let dir = currentChildren.find(n => n.name === part && n.type === 'directory')

        if (!dir) {
          dir = {
            name: part,
            type: 'directory',
            children: [],
          }
          currentChildren.push(dir)
        }

        currentChildren = dir.children!
      }
    }
  }

  return tree
}

export function resolveCurrentDir(root: FileSystemNode, path: FileSystemPath): FileSystemNode {
  return path.p.reduce((dir, node) => {
    const next = dir.children?.find(c => c.name === node.name && c.type === 'directory')
    if (!next) throw new Error('Invalid path')
    return next
  }, root)
}

export function getHomePath(root: FileSystemNode): FileSystemNode[] {
  const home = root.children?.find(c => c.name === 'home' && c.type === 'directory')
  if (!home) throw new Error('Home directory not found')

  const user = home.children?.find(c => c.name === 'user' && c.type === 'directory')
  if (!user) throw new Error('User directory not found')

  return [home, user]
}

export function expandHomePath(pathStr: string): string {
  if (pathStr.startsWith('~/')) {
    return 'home/user/' + pathStr.slice(2)
  }
  if (pathStr === '~') {
    return 'home/user'
  }
  return pathStr
}
