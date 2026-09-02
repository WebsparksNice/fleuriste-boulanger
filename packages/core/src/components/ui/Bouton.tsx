import Link from 'next/link'
import type { ReactNode } from 'react'

import { cn } from '../../lib/cn'
import type { LienResolu } from '../../lib/liens'

const styles = {
  primaire:
    'bg-primaire text-primaire-contraste hover:bg-primaire-survol border border-transparent',
  secondaire:
    'bg-secondaire text-secondaire-contraste hover:bg-secondaire-survol border border-bordure',
  discret: 'bg-transparent text-current underline underline-offset-4 hover:no-underline px-0 py-0',
} as const

const base =
  'inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-base font-medium transition-colors min-h-11'

type ProprietesBouton = {
  lien: LienResolu
  className?: string
  children?: ReactNode
}

/**
 * Rend un lien resolu.
 *
 * Les liens internes passent par `next/link` (navigation cote client, prefetch),
 * les autres restent de simples ancres. La hauteur minimale de 44 px correspond
 * a la cible tactile recommandee par les criteres d'accessibilite.
 */
export const Bouton = ({ lien, className, children }: ProprietesBouton) => {
  const classes = cn(base, styles[lien.style], className)
  const interne = lien.href.startsWith('/')

  if (interne && !lien.nouvelOnglet) {
    return (
      <Link href={lien.href} className={classes}>
        {children ?? lien.libelle}
      </Link>
    )
  }

  return (
    <a
      href={lien.href}
      className={classes}
      {...(lien.nouvelOnglet ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children ?? lien.libelle}
    </a>
  )
}

type ProprietesGroupeBoutons = {
  liens: LienResolu[]
  className?: string
}

export const GroupeBoutons = ({ liens, className }: ProprietesGroupeBoutons) => {
  if (liens.length === 0) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {liens.map((lien, index) => (
        <Bouton key={`${lien.href}-${index}`} lien={lien} />
      ))}
    </div>
  )
}
