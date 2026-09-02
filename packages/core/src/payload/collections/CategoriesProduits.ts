import type { CollectionConfig } from 'payload'

import { authentifie, tousPeuventLire } from '../access'
import { champSlug } from '../fields/slug'
import { revaliderApresChangement, revaliderApresSuppression } from '../hooks/revalider'

export const CategoriesProduits: CollectionConfig = {
  slug: 'categories-produits',
  labels: { singular: 'Categorie', plural: 'Categories de produits' },
  access: {
    read: tousPeuventLire,
    create: authentifie,
    update: authentifie,
    delete: authentifie,
  },
  admin: {
    useAsTitle: 'nom',
    defaultColumns: ['nom', 'slug', 'ordre'],
    group: 'Contenu',
  },
  hooks: {
    afterChange: [revaliderApresChangement],
    afterDelete: [revaliderApresSuppression],
  },
  defaultSort: ['ordre', 'nom'],
  fields: [
    {
      name: 'nom',
      type: 'text',
      label: 'Nom',
      required: true,
      localized: true,
    },
    champSlug({ champSource: 'nom' }),
    {
      name: 'ordre',
      type: 'number',
      label: 'Ordre d affichage',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
