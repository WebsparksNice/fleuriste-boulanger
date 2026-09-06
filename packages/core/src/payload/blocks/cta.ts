import type { Block } from 'payload'

import { champApparence } from '../fields/apparence'
import { champSurtitre } from '../fields/entete'
import { champLiens } from '../fields/lien'

export const blocCta: Block = {
  slug: 'cta',
  interfaceName: 'BlocCta',
  labels: { singular: 'Appel a l action', plural: 'Appels a l action' },
  fields: [
    champSurtitre(),
    {
      name: 'titre',
      type: 'text',
      label: 'Titre',
      required: true,
      localized: true,
    },
    {
      name: 'texte',
      type: 'textarea',
      label: 'Texte',
      localized: true,
    },
    champLiens({ maxRows: 2 }),
    champApparence(),
  ],
}
