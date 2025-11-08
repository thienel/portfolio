import { FC, SVGProps } from 'react'

import Cs from './dotnet.svg?react'
import Go from './go.svg?react'
import Js from './js.svg?react'
import MySQL from './mysql.svg?react'
import PostgreSQL from './postgresql.svg?react'
import SqlServer from './sqlserver.svg?react'
import Ts from './typescript.svg?react'
import WebGL from './webgl.svg?react'
import ReactIcon from './react.svg?react'
import Scss from './sass.svg?react'
import Nginx from './nginx.svg?react'
import Docker from './docker.svg?react'
import Google from './google.svg?react'
import Cloudinary from './cloudinary.svg?react'

const logoList = {
  Cs,
  Go,
  Js,
  MySQL,
  PostgreSQL,
  SqlServer,
  Ts,
  WebGL,
  Scss,
  Nginx,
  Docker,
  Google,
  Cloudinary,
  React: ReactIcon,
} as const satisfies Record<string, FC<SVGProps<SVGSVGElement>>>

export default logoList
