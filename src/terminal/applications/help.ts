import { ApplicationRegistry, PrintFunction } from '../types'

export default function help(print: PrintFunction, getApplications: () => ApplicationRegistry) {
  const docs = {
    name: 'help',
    short: 'Display available commands',
    description: 'Shows a list of all available commands and their descriptions',
  }

  const app = () => {
    let helpText = '\n\n## Available Commands\n\n'

    const applications = getApplications()
    Object.entries(applications).forEach(([name, definition]) => {
      helpText += `**${name}** - ${definition.docs.short}\n`
      if (definition.docs.description) {
        helpText += `  ${definition.docs.description}\n`
      }
      helpText += '\n'
    })

    print(helpText, true)
  }

  return { docs, app }
}
