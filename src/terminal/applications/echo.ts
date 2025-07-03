import { FileSystemType } from '../fileSystemBash'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function echo(print: (s: string, md?: boolean) => void, path: FileSystemType) {
  const docs = {
    name: 'echo',
    short: 'display a line of text',
    long: '',
  }

  const app = (args: string[], options: string[]) => {
    if (options.find(o => o === '-h' || o === '-help')) {
      print(`\n${docs.name} – ${docs.short}`)
      return
    }

    const str = args.join(' ')
    print(`\n${str}`)
  }
  return { docs, app }
}
