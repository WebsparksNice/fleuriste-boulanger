import type { Block } from 'payload'

import { champApparence } from '../fields/apparence'
import { requisSi } from '../fields/validations'

export const blocFaq: Block = {
  slug: 'faq',
  interfaceName: 'BlocFaq',
  labels: { singular: 'Questions frequentes', plural: 'Questions frequentes' },
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
      label: 'Questions affichees',
      defaultValue: 'toutes',
      options: [
        { label: 'Toutes les questions', value: 'toutes' },
        { label: 'Une selection manuelle', value: 'selection' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'selection',
      type: 'relationship',
      relationTo: 'faq',
      hasMany: true,
      label: 'Questions',
      admin: { condition: (_, donnees) => donnees?.mode === 'selection' },
      validate: requisSi('mode', 'selection', 'Selectionnez au moins une question.'),
    },
    {
      name: 'genererJsonLd',
      type: 'checkbox',
      label: 'Transmettre ces questions a Google (donnees structurees)',
      defaultValue: true,
      admin: {
        description:
          "Permet a Google d'afficher les questions directement dans ses resultats. A n'activer qu'une fois par page.",
      },
    },
    champApparence(),
  ],
}
