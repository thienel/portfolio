import { Change, FileSystemNode, FileSystemPath } from '../types'

/**
 * Calculates the difference between two strings and returns a Change object
 * @param oldStr - The original string
 * @param newStr - The new string
 * @returns Change object describing the difference
 */
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
    // Same length, no changes needed
    return null
  } else if (lenDiff > 0) {
    // Deletion occurred
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
    // Addition occurred
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

/**
 * Sanitizes command input by normalizing whitespace
 * @param command - Raw command input
 * @returns Sanitized command
 */
export function sanitizeCommand(command: string): string {
  return command.replace(/\s+/g, ' ').trim()
}

/**
 * Splits a command into command name and arguments
 * @param command - Full command string
 * @returns Tuple of [commandName, arguments]
 */
export function splitCommand(command: string): [string, string[]] {
  const sanitized = sanitizeCommand(command)
  const parts = sanitized.split(' ')
  const commandName = parts[0] || ''
  const args = parts.slice(1)

  return [commandName, args]
}

/**
 * Formats a file path for display (replaces /home/user with ~)
 * @param path - File path components
 * @returns Formatted path string
 */
export function formatPath(path: Array<{ name: string }>): string {
  const fullPath = path.map(p => p.name).join('/')
  const shortened = fullPath.replace(/^\/home/, '~')
  return shortened === '~' ? '~' : `${shortened} `
}

/**
 * Creates a command prompt string
 * @param path - Current path
 * @param user - Username (default: 'user')
 * @returns Formatted prompt string
 */
export function createPrompt(path: Array<{ name: string }>, user: string = 'user'): string {
  const formattedPath = formatPath(path)
  return `\n${user}:${formattedPath}$`
}

/**
 * Escapes special characters in a string for safe output
 * @param str - String to escape
 * @returns Escaped string
 */
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
