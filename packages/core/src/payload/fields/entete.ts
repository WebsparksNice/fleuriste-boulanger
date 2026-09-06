import type { SelectField, TextField } from 'payload'

/**
 * Ligne d'annonce posee au-dessus du titre d'une section.
 *
 * Deux ou trois mots — « Le catalogue », « Notre approche ». C'est un repere
 * de lecture, pas un titre : il n'entre pas dans le plan du document.
 */
export const champSurtitre = (): TextField => ({
  name: 'surtitre',
  type: 'text',
  label: 'Surtitre',
  localized: true,
  admin: {
    description: 'Court intitule affiche au-dessus du titre. Ex. : Le catalogue.',
  },
})

/** Place l'introduction sous le titre, ou en regard a droite. */
export const champDispositionEntete = (): SelectField => ({
  name: 'dispositionEntete',
  type: 'select',
  label: 'Disposition de l en-tete',
  defaultValue: 'empilee',
  options: [
    { label: 'Introduction sous le titre', value: 'empilee' },
    { label: 'Introduction a droite du titre, avec filet', value: 'repartie' },
  ],
  admin: {
    description: 'La seconde disposition convient aux sections qui ouvrent sur une grille.',
  },
})
