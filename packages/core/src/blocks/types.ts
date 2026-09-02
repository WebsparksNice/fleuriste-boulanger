import type { ConfigSiteResolue } from '../config'
import type { ContexteRendu } from '../types'

export type ProprietesBloc<T> = {
  bloc: T
  config: ConfigSiteResolue
  contexte: ContexteRendu
  /**
   * Vrai pour le premier bloc de la page.
   * Sert a charger son image en priorite : c'est elle que mesure le Largest
   * Contentful Paint.
   */
  premier?: boolean
}

/** Attribut `sizes` adapte a une grille responsive, pour eviter de servir du 1920 px sur mobile. */
export const taillesGrille = (colonnes: '2' | '3' | '4'): string => {
  const largeurs = { '2': '50vw', '3': '33vw', '4': '25vw' } as const
  return `(min-width: 1024px) ${largeurs[colonnes]}, (min-width: 640px) 50vw, 100vw`
}

export const classesGrille = (colonnes: '2' | '3' | '4'): string => {
  const classes = {
    '2': 'sm:grid-cols-2',
    '3': 'sm:grid-cols-2 lg:grid-cols-3',
    '4': 'sm:grid-cols-2 lg:grid-cols-4',
  } as const
  return classes[colonnes]
}
