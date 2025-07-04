import { FileBash, FolderBash } from '../fileSystemBash'
import { FileSystemPath, PrintFunction } from '../types'

export default function ls(print: PrintFunction, path: FileSystemPath) {
  const docs = {
    name: 'ls',
    short: 'List directory contents',
    description: 'Show files and folders in the current directory.',
  }

  const app = () => {
    let out = '\n'
    if (!path.p[path.p.length - 1]) {
      out += 'No current directory set.\n'
      print(out)
      return
    }
    const files = path.p[path.p.length - 1].children as (FileBash | FolderBash)[]
    for (const f of files) {
      out += `${f.name}\n`
    }
    print(out)
  }
  return { docs, app }
}
