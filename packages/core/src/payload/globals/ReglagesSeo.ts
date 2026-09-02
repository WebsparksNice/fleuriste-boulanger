import type { GlobalConfig } from 'payload'

import { authentifie, tousPeuventLire } from '../access'
import { champImage } from '../fields/media'
import { revaliderGlobaleApresChangement } from '../hooks/revalider'

export const ReglagesSeo: GlobalConfig = {
  slug: 'reglages-seo',
  label: 'Referencement',
  access: {
    read: tousPeuventLire,
    update: authentifie,
  },
  admin: {
    description: 'Valeurs par defaut utilisees quand une page ne definit pas les siennes.',
    group: 'Reglages',
  },
  hooks: {
    afterChange: [revaliderGlobaleApresChangement],
  },
  fields: [
    {
      name: 'suffixeTitre',
      type: 'text',
      label: 'Suffixe des titres',
      localized: true,
      admin: {
        description:
          "Ajoute apres le titre de chaque page, separe par un tiret. Ex. : « Boulangerie Martin, Lyon 3e ».",
      },
    },
    {
      name: 'descriptionParDefaut',
      type: 'textarea',
      label: 'Description par defaut',
      localized: true,
      maxLength: 200,
    },
    champImage({
      name: 'imagePartage',
      label: 'Image de partage par defaut',
      description: 'Format ideal 1200 x 630 px.',
    }),
    {
      name: 'autoriserIndexation',
      type: 'checkbox',
      label: 'Autoriser les moteurs de recherche a indexer le site',
      defaultValue: false,
      admin: {
        description:
          "A cocher le jour de la mise en ligne. Decoche, le site entier est masque des moteurs : c'est le reglage a garder pendant la phase de preparation.",
      },
    },
    {
      name: 'verificationGoogle',
      type: 'text',
      label: 'Code de verification Google Search Console',
      admin: {
        description: "Contenu de l'attribut content de la balise fournie par Google.",
      },
    },
  ],
}
