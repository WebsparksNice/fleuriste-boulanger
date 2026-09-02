import type { Block } from 'payload'

import { champApparence } from '../fields/apparence'
import { champImage } from '../fields/media'
import { editeurTexteSimple } from '../editeur'

export const blocContact: Block = {
  slug: 'contact',
  interfaceName: 'BlocContact',
  labels: { singular: 'Contact', plural: 'Contacts' },
  fields: [
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
          name: 'afficherCoordonnees',
          type: 'checkbox',
          label: 'Adresse, telephone et e-mail',
          defaultValue: true,
          admin: { width: '50%' },
        },
        {
          name: 'afficherHoraires',
          type: 'checkbox',
          label: 'Horaires d ouverture',
          defaultValue: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'afficherReseaux',
          type: 'checkbox',
          label: 'Reseaux sociaux',
          defaultValue: true,
          admin: { width: '50%' },
        },
        {
          name: 'afficherCarte',
          type: 'checkbox',
          label: 'Plan d acces',
          defaultValue: true,
          admin: { width: '50%' },
        },
      ],
    },
    champImage({
      name: 'imageCarte',
      label: 'Image du plan',
      description:
        "Capture de la carte, cliquable vers l'itineraire. Une image evite la carte interactive, lourde et bourree de traceurs.",
    }),
    champApparence(),
  ],
}
