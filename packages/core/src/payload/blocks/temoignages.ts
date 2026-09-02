import type { Block } from 'payload'

import { champApparence } from '../fields/apparence'
import { requisSi } from '../fields/validations'

export const blocTemoignages: Block = {
  slug: 'temoignages',
  interfaceName: 'BlocTemoignages',
  labels: { singular: 'Temoignages', plural: 'Temoignages' },
  fields: [
    {
      name: 'titre',
      type: 'text',
      label: 'Titre',
      localized: true,
    },
    {
      name: 'mode',
      type: 'radio',
      label: 'Temoignages affiches',
      defaultValue: 'recents',
      options: [
        { label: 'Les plus recents', value: 'recents' },
        { label: 'Une selection manuelle', value: 'selection' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'limite',
      type: 'number',
      label: 'Nombre affiche',
      defaultValue: 3,
      min: 1,
      max: 12,
      admin: { condition: (_, donnees) => donnees?.mode === 'recents' },
    },
    {
      name: 'selection',
      type: 'relationship',
      relationTo: 'temoignages',
      hasMany: true,
      label: 'Temoignages',
      admin: { condition: (_, donnees) => donnees?.mode === 'selection' },
      validate: requisSi('mode', 'selection', 'Selectionnez au moins un temoignage.'),
    },
    {
      name: 'afficherNotes',
      type: 'checkbox',
      label: 'Afficher les etoiles',
      defaultValue: true,
    },
    champApparence(),
  ],
}
