import type { ReactNode } from 'react'

import { cn } from '../../lib/cn'
import type { ApparenceDoc } from '../../types'

const fonds = {
  defaut: 'bg-fond text-texte',
  attenue: 'bg-surface-attenuee text-texte',
  primaire: 'bg-primaire text-primaire-contraste',
} as const

const espacements = {
  compact: 'py-section-compact',
  normal: 'py-section',
  large: 'py-section-large',
} as const

type ProprietesSection = {
  children: ReactNode
  apparence?: ApparenceDoc | null
  className?: string
}

/**
 * Enveloppe commune a tous les blocs : fond, espacement vertical et ancre.
 *
 * Centraliser ces trois reglages garantit le meme rythme vertical d'un bloc a
 * l'autre, quel que soit l'ordre choisi par l'editeur.
 */
export const Section = ({ children, apparence, className }: ProprietesSection) => {
  const fond = fonds[apparence?.fond ?? 'defaut']
  const espacement = espacements[apparence?.espacement ?? 'normal']
  const ancre = apparence?.ancre?.replace(/^#/, '') || undefined

  return (
    <section id={ancre} className={cn(fond, espacement, className)}>
      {children}
    </section>
  )
}
