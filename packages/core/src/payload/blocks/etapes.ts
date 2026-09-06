import type { Block } from 'payload'

import { champApparence } from '../fields/apparence'
import { champDispositionEntete, champSurtitre } from '../fields/entete'
import { editeurTexteSimple } from '../editeur'

export const blocEtapes: Block = {
  slug: 'etapes',
  interfaceName: 'BlocEtapes',
  labels: { singular: 'Etapes ou reperes', plural: 'Etapes ou reperes' },
  imageAltText: 'Suite de reperes en colonnes, numerotes ou non',
  fields: [
    champSurtitre(),
    {
      name: 'titre',
      type: 'text',
      label: 'Titre',
      localized: true,
    },
    {
      name: 'intro',
      type: 'richText',
      label: 'Texte d introduction',
      localized: true,
      editor: editeurTexteSimple,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'numerotation',
          type: 'select',
          label: 'Numerotation',
          defaultValue: 'chiffres',
          options: [
            { label: 'Numerotees (01, 02, 03...)', value: 'chiffres' },
            { label: 'Sans numero', value: 'aucune' },
          ],
          admin: {
            width: '50%',
            description: 'Numerotez quand l ordre compte : les etapes d une commande.',
          },
        },
        {
          name: 'colonnes',
          type: 'select',
          label: 'Colonnes sur ordinateur',
          defaultValue: '3',
          options: [
            { label: '2 colonnes', value: '2' },
            { label: '3 colonnes', value: '3' },
            { label: '4 colonnes', value: '4' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'elements',
      type: 'array',
      label: 'Reperes',
      labels: { singular: 'Repere', plural: 'Reperes' },
      minRows: 1,
      maxRows: 8,
      required: true,
      admin: { initCollapsed: false },
      fields: [
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
      ],
    },
    champDispositionEntete(),
    champApparence(),
  ],
}
