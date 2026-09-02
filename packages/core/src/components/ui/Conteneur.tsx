import type { ReactNode } from 'react'

import { cn } from '../../lib/cn'

type ProprietesConteneur = {
  children: ReactNode
  /** Restreint la largeur au confort de lecture plutot qu'a la largeur du site. */
  etroit?: boolean
  className?: string
}

export const Conteneur = ({ children, etroit = false, className }: ProprietesConteneur) => (
  <div className={cn('conteneur', etroit && 'max-w-prose', className)}>{children}</div>
)
