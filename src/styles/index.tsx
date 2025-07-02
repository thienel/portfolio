import './reset.scss'
import { type ReactNode } from 'react'

function GlobalStyles({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export default GlobalStyles
