import type { CollectionConfig } from 'payload'

import { authentifie, tousPeuventLire } from '../access'
import { revaliderApresChangement, revaliderApresSuppression } from '../hooks/revalider'

export const Temoignages: CollectionConfig = {
  slug: 'temoignages',
  labels: { singular: 'Temoignage', plural: 'Temoignages' },
  access: {
    read: tousPeuventLire,
    create: authentifie,
    update: authentifie,
    delete: authentifie,
  },
  admin: {
    useAsTitle: 'auteur',
    defaultColumns: ['auteur', 'note', 'date', 'visible'],
    group: 'Contenu',
  },
  hooks: {
    afterChange: [revaliderApresChangement],
    afterDelete: [revaliderApresSuppression],
  },
  defaultSort: '-date',
  fields: [
    {
      name: 'auteur',
      type: 'text',
      label: 'Auteur',
      required: true,
      admin: { description: 'Prenom et initiale suffisent : « Marie L. ».' },
    },
    {
      name: 'texte',
      type: 'textarea',
      label: 'Temoignage',
      required: true,
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'note',
          type: 'number',
          label: 'Note sur 5',
          min: 1,
          max: 5,
          admin: { width: '33%', step: 1 },
        },
        {
          name: 'date',
          type: 'date',
          label: 'Date',
          admin: {
            width: '33%',
            date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
          },
        },
        {
          name: 'source',
          type: 'select',
          label: 'Origine',
          defaultValue: 'boutique',
          options: [
            { label: 'Recueilli en boutique', value: 'boutique' },
            { label: 'Avis Google', value: 'google' },
            { label: 'Reseaux sociaux', value: 'reseaux' },
          ],
          admin: { width: '34%' },
        },
      ],
    },
    {
      name: 'visible',
      type: 'checkbox',
      label: 'Afficher sur le site',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
