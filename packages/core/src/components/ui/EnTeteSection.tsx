import type { ReactNode } from 'react'

import { cn } from '../../lib/cn'
import { Surtitre } from './Surtitre'
import { Titre } from './Titre'

type ProprietesEnTeteSection = {
  surtitre?: string | null
  titre?: string | null
  /** Niveau semantique du titre. Le h1 appartient a la banniere de la page. */
  niveau?: 1 | 2 | 3 | 4
  /** Texte d'introduction, deja rendu (texte riche ou simple paragraphe). */
  intro?: ReactNode
  /**
   * `empilee` : l'introduction suit le titre, en colonne.
   * `repartie` : titre a gauche, introduction a droite, filet de separation
   * dessous. Utile quand l'introduction est courte et que la section qui suit
   * est une grille — le filet donne son assise a la grille.
   */
  disposition?: 'empilee' | 'repartie'
  className?: string
}

/**
 * En-tete commun aux sections : surtitre, titre, introduction.
 *
 * Centralise pour que le rythme soit le meme d'un bloc a l'autre, quel que soit
 * l'ordre choisi par l'editeur.
 */
export const EnTeteSection = ({
  surtitre,
  titre,
  niveau = 2,
  intro,
  disposition = 'empilee',
  className,
}: ProprietesEnTeteSection) => {
  if (!surtitre && !titre && !intro) return null

  if (disposition === 'repartie') {
    return (
      <div
        className={cn(
          'flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-b border-bordure pb-6',
          className,
        )}
      >
        <div className="space-y-3">
          <Surtitre>{surtitre}</Surtitre>
          {titre ? <Titre niveau={niveau}>{titre}</Titre> : null}
        </div>
        {intro ? <div className="max-w-[42ch]">{intro}</div> : null}
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      <Surtitre>{surtitre}</Surtitre>
      {titre ? <Titre niveau={niveau}>{titre}</Titre> : null}
      {intro}
    </div>
  )
}
