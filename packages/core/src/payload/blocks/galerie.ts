import type { Block } from 'payload'

import { champApparence } from '../fields/apparence'
import { champImage } from '../fields/media'

export const blocGalerie: Block = {
  slug: 'galerie',
  interfaceName: 'BlocGalerie',
  labels: { singular: 'Galerie', plural: 'Galeries' },
  fields: [
    {
      name: 'titre',
      type: 'text',
      label: 'Titre',
      localized: true,
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      labels: { singular: 'Image', plural: 'Images' },
      minRows: 1,
      required: true,
      fields: [
        champImage({ required: true }),
        {
          name: 'legende',
          type: 'text',
          label: 'Legende',
          localized: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
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
          admin: { width: '50%', description: 'Le mobile affiche toujours une seule colonne.' },
        },
        {
          name: 'format',
          type: 'select',
          label: 'Format des vignettes',
          defaultValue: 'carre',
          options: [
            { label: 'Carre', value: 'carre' },
            { label: 'Portrait', value: 'portrait' },
            { label: 'Paysage', value: 'paysage' },
            { label: "Format d'origine", value: 'naturel' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'agrandissement',
      type: 'checkbox',
      label: 'Permettre d agrandir les images au clic',
      defaultValue: false,
      admin: {
        description:
          'Ajoute un petit script a la page. A laisser decoche si les images n ont pas besoin d etre vues en grand.',
      },
    },
    champApparence(),
  ],
}
