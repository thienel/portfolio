export type FileBash = { name: string; data: string }
export type FolderBash = { name: string; children: (FolderBash | FileBash)[] }
export type FileSystemType = { p: (FolderBash | FileBash)[] }

const disk: FolderBash = {
  name: '/',
  children: [
    { name: 'bin', children: [] },
    { name: 'dev', children: [] },
    { name: 'lib64', children: [] },
    { name: 'media', children: [] },
  ],
}

function generateFS(fileMap: Record<string, string>) {
  for (const path in fileMap) {
    const virtualFsPath = path.split('/').slice(2)
    let currentFolder = disk
    virtualFsPath.forEach((name, i, arr) => {
      const isFile = i === arr.length - 1
      if (isFile) {
        currentFolder.children.push({ name, data: fileMap[path] })
      } else {
        let next = currentFolder.children.find(f => f.name === name) as FolderBash | undefined
        if (!next) {
          next = { name, children: [] }
          currentFolder.children.push(next)
        }

        currentFolder = next
      }
    })
  }
}

generateFS(
  import.meta.glob('~/file-system/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }),
)

generateFS(
  import.meta.glob('~/file-system/**/*.png', {
    query: '?url',
    import: 'default',
    eager: true,
  }),
)

console.log(disk)

export default function FileSystemBash() {
  function _pathStrToArr(p: string) {
    const pathArray = p.split('/')
    if (pathArray.length > 0 && pathArray[pathArray.length - 1] === '') {
      pathArray.pop()
    }
    return pathArray
  }

  function _buildPath(path: (FolderBash | FileBash)[], newPathArray: string[]) {
    for (const p of newPathArray) {
      switch (p) {
        case '':
          path = [disk]
          break
        case '..':
          if (path.length > 1) path.pop()
          break
        case '~':
          path = goHome()
          break
        case '.':
          break
        default: {
          const currentFolder = path.length > 0 ? path[path.length - 1] : undefined
          if (!currentFolder || !('children' in currentFolder)) return undefined

          const next = currentFolder.children.find(f => f.name === p)
          if (!next) return undefined

          path.push(next)
          break
        }
      }
    }
    return path
  }

  function getChildren(path: (FolderBash | FileBash)[]) {
    return (path[path.length - 1] as FolderBash).children
  }

  function goHome() {
    const home = disk.children.find(m => m.name === 'home') as FolderBash
    const user = home.children.find(m => m.name === 'user') as FolderBash
    return [disk, home, user]
  }

  function goto(path: (FolderBash | FileBash)[], newPath: string) {
    return _buildPath([...path], _pathStrToArr(newPath))
  }
  function make(path: (FolderBash | FileBash)[], newPath: string, type: 'file' | 'folder') {
    const newPathArray = _pathStrToArr(newPath)
    const name = newPathArray.pop()

    if (name === undefined) return 'bad_args'

    const currentPath = _buildPath([...path], newPathArray)
    const currentFolder =
      currentPath && currentPath.length > 0 ? currentPath[currentPath.length - 1] : undefined

    if (!currentFolder || !('children' in currentFolder)) return 'bad_path'

    if (currentFolder.children.find(m => m.name === name)) return 'file_exists'

    currentFolder.children.push(type === 'folder' ? { name, children: [] } : { name, data: '' })
    return 'ok'
  }

  return { getChildren, goHome, goto, make }
}
