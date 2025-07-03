import { FileSystemType } from '../fileSystemBash'
import cd from './cd'
import echo from './echo'
import hello from './hello'
import ls from './ls'
import mkdir from './mkdir'
import pwd from './pwd'
import show from './show'
import touch from './touch'
import helpMD from './assets/help.md?raw'

export default function Applications(
  print: (s: string, md?: boolean) => void,
  path: FileSystemType,
) {
  const help = () => {
    let helpStr: string = helpMD
    Object.entries(apps).forEach(entry => {
      const [, value] = entry
      helpStr += `### ${value.docs.name} - ${value.docs.short}\n`
    })
    console.log(helpStr)
    print(helpStr, true)
  }
  const apps = {
    ls: ls(print, path),
    cd: cd(print, path),
    show: show(print, path),
    echo: echo(print, path),
    pwd: pwd(print, path),
    mkdir: mkdir(print, path),
    touch: touch(print, path),
    hello: hello(print, path),
  }
  const getApp = (appName: string): null | ((args: string[], options: string[]) => void) => {
    const app = (
      apps as Record<string, { app: (args: string[], options: string[]) => void } | undefined>
    )[appName]
    if (app) return app.app

    if (appName === 'help') return help

    return null
  }

  return getApp
}
