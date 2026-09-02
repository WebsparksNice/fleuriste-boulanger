import type { Block } from 'payload'

import { champApparence } from '../fields/apparence'
import { champImage } from '../fields/media'
import { champLiens } from '../fields/lien'

export const blocHero: Block = {
  slug: 'hero',
  interfaceName: 'BlocHero',
  labels: { singular: 'Banniere', plural: 'Bannieres' },
  imageAltText: 'Grande banniere de haut de page',
  fields: [
    {
      name: 'variante',
      type: 'select',
      label: 'Mise en page',
      defaultValue: 'couverture',
      required: true,
      options: [
        { label: 'Image en couverture, texte par-dessus', value: 'couverture' },
        { label: 'Image a cote du texte', value: 'lateral' },
        { label: 'Texte seul, sans image', value: 'texte' },
      ],
    },
    {
      name: 'titre',
      type: 'text',
      label: 'Titre',
      required: true,
      localized: true,
      admin: { description: 'Titre principal de la page (h1). Un seul par page.' },
    },
    {
      name: 'sousTitre',
      type: 'textarea',
      label: 'Sous-titre',
      localized: true,
    },
    champImage({
      name: 'image',
      label: 'Image',
      description: "Format paysage recommande, au moins 1600 px de large.",
    }),
    {
      type: 'row',
      fields: [
        {
          name: 'alignement',
          type: 'select',
          label: 'Alignement du texte',
          defaultValue: 'gauche',
          options: [
            { label: 'A gauche', value: 'gauche' },
            { label: 'Centre', value: 'centre' },
          ],
          admin: { width: '50%', condition: (_, donnees) => donnees?.variante !== 'lateral' },
        },
        {
          name: 'opaciteVoile',
          type: 'number',
          label: 'Assombrissement de l image (%)',
          defaultValue: 35,
          min: 0,
          max: 80,
          admin: {
            width: '50%',
            condition: (_, donnees) => donnees?.variante === 'couverture',
            description: 'Necessaire pour garder le texte lisible sur une photo claire.',
          },
        },
      ],
    },
    champLiens({ maxRows: 2 }),
    champApparence(),
  ],
}
