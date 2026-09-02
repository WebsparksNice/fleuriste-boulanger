import type { ReactNode } from 'react'

import { cn } from '../../lib/cn'

type NiveauTitre = 1 | 2 | 3 | 4

const tailles: Record<NiveauTitre, string> = {
  1: 'text-3xl sm:text-4xl lg:text-5xl',
  2: 'text-2xl sm:text-3xl',
  3: 'text-xl sm:text-2xl',
  4: 'text-lg sm:text-xl',
}

type ProprietesTitre = {
  children: ReactNode
  /** Niveau semantique. Le h1 appartient a la banniere de la page. */
  niveau?: NiveauTitre
  className?: string
}

export const Titre = ({ children, niveau = 2, className }: ProprietesTitre) => {
  const Balise = `h${niveau}` as const
  return <Balise className={cn(tailles[niveau], className)}>{children}</Balise>
}
