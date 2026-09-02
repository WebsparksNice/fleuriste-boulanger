import type { Block } from 'payload'

import { champApparence } from '../fields/apparence'
import { champImage } from '../fields/media'
import { champLiens } from '../fields/lien'
import { editeurTexteRiche } from '../editeur'

export const blocTexteImage: Block = {
  slug: 'texteImage',
  interfaceName: 'BlocTexteImage',
  labels: { singular: 'Texte et image', plural: 'Textes et images' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'positionImage',
          type: 'select',
          label: "Position de l'image",
          defaultValue: 'droite',
          options: [
            { label: 'A gauche du texte', value: 'gauche' },
            { label: 'A droite du texte', value: 'droite' },
          ],
          admin: { width: '50%', description: 'Sur mobile, l image passe toujours au-dessus du texte.' },
        },
        {
          name: 'formatImage',
          type: 'select',
          label: "Format de l'image",
          defaultValue: 'paysage',
          options: [
            { label: 'Paysage', value: 'paysage' },
            { label: 'Carre', value: 'carre' },
            { label: 'Portrait', value: 'portrait' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    champImage({ required: true }),
    {
      name: 'titre',
      type: 'text',
      label: 'Titre',
      localized: true,
    },
    {
      name: 'texte',
      type: 'richText',
      label: 'Texte',
      localized: true,
      editor: editeurTexteRiche,
    },
    champLiens({ maxRows: 2 }),
    champApparence(),
  ],
}
