import type { CollectionConfig } from 'payload'

import { authentifie, tousPeuventLire } from '../access'
import { editeurTexteRiche } from '../editeur'
import { revaliderApresChangement, revaliderApresSuppression } from '../hooks/revalider'

export const Faq: CollectionConfig = {
  slug: 'faq',
  labels: { singular: 'Question', plural: 'Questions frequentes' },
  access: {
    read: tousPeuventLire,
    create: authentifie,
    update: authentifie,
    delete: authentifie,
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'ordre', 'updatedAt'],
    group: 'Contenu',
  },
  hooks: {
    afterChange: [revaliderApresChangement],
    afterDelete: [revaliderApresSuppression],
  },
  defaultSort: ['ordre', 'question'],
  fields: [
    {
      name: 'question',
      type: 'text',
      label: 'Question',
      required: true,
      localized: true,
    },
    {
      name: 'reponse',
      type: 'richText',
      label: 'Reponse',
      required: true,
      localized: true,
      editor: editeurTexteRiche,
    },
    {
      name: 'ordre',
      type: 'number',
      label: 'Ordre d affichage',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Les petits nombres passent en premier.' },
    },
  ],
}
