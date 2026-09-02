import type { GlobalConfig } from 'payload'

import { authentifie, tousPeuventLire } from '../access'
import { champLien, champLiens } from '../fields/lien'
import { revaliderGlobaleApresChangement } from '../hooks/revalider'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Menus',
  access: {
    read: tousPeuventLire,
    update: authentifie,
  },
  admin: {
    description: "Menus de l'en-tete et du pied de page.",
    group: 'Reglages',
  },
  hooks: {
    afterChange: [revaliderGlobaleApresChangement],
  },
  fields: [
    {
      ...champLiens({
        name: 'menuPrincipal',
        label: 'Menu principal',
        labelSingulier: 'Entree',
        maxRows: 8,
        avecStyle: false,
      }),
      admin: { description: 'Au-dela de six entrees, le menu devient difficile a lire sur mobile.' },
    },
    {
      name: 'ctaEnTete',
      type: 'group',
      label: "Bouton d'appel dans l'en-tete",
      fields: [
        {
          name: 'actif',
          type: 'checkbox',
          label: 'Afficher un bouton dans l en-tete',
          defaultValue: false,
        },
        {
          ...champLien({ name: 'lien', label: 'Bouton' }),
          admin: { condition: (_, donnees) => Boolean(donnees?.actif) },
        },
      ],
    },
    champLiens({
      name: 'menuPied',
      label: 'Menu du pied de page',
      labelSingulier: 'Entree',
      maxRows: 12,
      avecStyle: false,
    }),
    {
      name: 'mentionPied',
      type: 'text',
      label: 'Mention du pied de page',
      localized: true,
      admin: { placeholder: 'Artisan boulanger depuis 1987' },
    },
  ],
}
