import type { CollectionConfig } from 'payload'

import { authentifie, publieOuAuthentifie } from '../access'
import { blocsDeContenu } from '../blocks'
import { champSeo } from '../fields/seo'
import { champSlug } from '../fields/slug'
import { revaliderApresChangement, revaliderApresSuppression } from '../hooks/revalider'

type OptionsPages = {
  /** Slugs deja pris par une route dediee (listing produits, etc.). */
  slugsReserves?: string[]
  /** URL du bouton « Previsualiser », fournie par `creerConfigCore`. */
  previsualisation?: NonNullable<CollectionConfig['admin']>['preview']
  livePreview?: NonNullable<CollectionConfig['admin']>['livePreview']
}

export const Pages = ({
  slugsReserves = [],
  previsualisation,
  livePreview,
}: OptionsPages = {}): CollectionConfig => ({
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  access: {
    read: publieOuAuthentifie,
    create: authentifie,
    update: authentifie,
    delete: authentifie,
  },
  admin: {
    useAsTitle: 'titre',
    defaultColumns: ['titre', 'slug', '_status', 'updatedAt'],
    description: "La page dont le slug est « accueil » est servie a la racine du site.",
    preview: previsualisation,
    livePreview,
    group: 'Contenu',
  },
  hooks: {
    afterChange: [revaliderApresChangement],
    afterDelete: [revaliderApresSuppression],
  },
  versions: {
    drafts: {
      autosave: { interval: 800 },
      schedulePublish: true,
    },
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'titre',
      type: 'text',
      label: 'Titre de la page',
      required: true,
      localized: true,
    },
    champSlug({ champSource: 'titre', slugsReserves }),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contenu',
          fields: [
            {
              name: 'contenu',
              type: 'blocks',
              label: 'Blocs',
              labels: { singular: 'Bloc', plural: 'Blocs' },
              blocks: blocsDeContenu,
              admin: {
                description: 'Empilez les blocs pour composer la page. Ils se reordonnent par glisser-deposer.',
              },
            },
          ],
        },
        {
          label: 'Referencement',
          fields: [champSeo()],
        },
      ],
    },
  ],
})
