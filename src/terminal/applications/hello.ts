import { FileSystemType } from '../fileSystemBash'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function hello(print: (s: string, md?: boolean) => void, path: FileSystemType) {
  const docs = {
    name: 'hello',
    short: 'friendly greeting program',
    long: '',
  }

  const app = (_args: string[], options: string[]) => {
    if (options.find(o => o === '-h' || o === '-help')) {
      print(`\n${docs.name} – ${docs.short}`)
      return
    }

    print('\nHello, world!')
  }
  return { docs, app }
}
