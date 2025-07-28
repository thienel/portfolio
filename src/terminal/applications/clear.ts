import { PrintFunction } from '../types'

export default function clear(print: PrintFunction) {
  const docs = {
    name: 'clear',
    short: 'Clear the terminal screen',
    description: 'Clears all content from the terminal screen',
  }

  const app = () => {
    print('\n'.repeat(20))
  }

  return { docs, app }
}
