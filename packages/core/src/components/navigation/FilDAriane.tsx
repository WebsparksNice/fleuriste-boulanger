import Link from 'next/link'

import type { Dictionnaire } from '../../i18n'
import { cn } from '../../lib/cn'

export type EtapeFilDAriane = {
  libelle: string
  href?: string
}

type ProprietesFilDAriane = {
  etapes: EtapeFilDAriane[]
  t: Dictionnaire
  className?: string
}

/**
 * Fil d'Ariane.
 *
 * La derniere etape n'est pas un lien et porte `aria-current="page"` : un lien
 * vers la page deja affichee n'apporte rien et brouille la navigation au clavier.
 */
export const FilDAriane = ({ etapes, t, className }: ProprietesFilDAriane) => {
  if (etapes.length < 2) return null

  return (
    <nav aria-label={t.navigation.filDAriane} className={cn('text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-texte-attenue">
        {etapes.map((etape, position) => {
          const derniere = position === etapes.length - 1

          return (
            <li key={position} className="flex items-center gap-2">
              {position > 0 ? <span aria-hidden="true">/</span> : null}
              {etape.href && !derniere ? (
                <Link href={etape.href} className="underline underline-offset-4 hover:no-underline">
                  {etape.libelle}
                </Link>
              ) : (
                <span aria-current={derniere ? 'page' : undefined} className={cn(derniere && 'text-texte')}>
                  {etape.libelle}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
