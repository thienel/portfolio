import { Change } from '../types'

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
 * Parses command line arguments into args and options
 * @param args - Array of command line arguments
 * @returns Tuple of [args, options]
 */
export function parseCommandArgs(args: string[]): [string[], string[]] {
  const parsedArgs: string[] = []
  const options: string[] = []

  args.forEach(arg => {
    if (arg === '') return

    if (arg.charAt(0) === '-') {
      options.push(arg)
    } else {
      parsedArgs.push(arg)
    }
  })

  return [parsedArgs, options]
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
  let output = ''
  for (let i = 0; i < path.length; i++) {
    output += path[i].name
    if (i !== 0 && i < path.length - 1) {
      output += '/'
    }
  }

  output = output.replace(/^\/home\/user/, '~')
  if (output !== '~') {
    output += ' '
  }

  return output
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
 * Validates if a string is a valid filename
 * @param filename - Filename to validate
 * @returns True if valid filename
 */
export function isValidFilename(filename: string): boolean {
  // Basic filename validation - no special characters
  const invalidChars = /[<>:"/\\|?*]/
  const hasControlChars = filename.split('').some(char => char.charCodeAt(0) < 32)
  return (
    !invalidChars.test(filename) &&
    !hasControlChars &&
    filename.length > 0 &&
    filename.length <= 255
  )
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
