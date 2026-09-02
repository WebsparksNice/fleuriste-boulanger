import type { Block } from 'payload'

import { champApparence } from '../fields/apparence'
import { champHorairesHebdomadaires } from '../fields/horaires'

export const blocHoraires: Block = {
  slug: 'horaires',
  interfaceName: 'BlocHoraires',
  labels: { singular: 'Horaires', plural: 'Horaires' },
  fields: [
    {
      name: 'titre',
      type: 'text',
      label: 'Titre',
      localized: true,
      admin: { description: "Vide, le titre « Horaires d'ouverture » est utilise." },
    },
    {
      name: 'source',
      type: 'radio',
      label: 'Horaires affiches',
      defaultValue: 'etablissement',
      options: [
        { label: "Ceux de la fiche Etablissement", value: 'etablissement' },
        { label: 'Des horaires specifiques a ce bloc', value: 'personnalise' },
      ],
      admin: {
        layout: 'horizontal',
        description:
          "Garder la fiche Etablissement evite d'avoir a mettre a jour les horaires a deux endroits.",
      },
    },
    {
      ...champHorairesHebdomadaires(),
      name: 'horairesPersonnalises',
      admin: {
        ...champHorairesHebdomadaires().admin,
        condition: (_, donnees) => donnees?.source === 'personnalise',
      },
    },
    {
      name: 'afficherFermetures',
      type: 'checkbox',
      label: 'Afficher les fermetures exceptionnelles a venir',
      defaultValue: true,
      admin: { condition: (_, donnees) => donnees?.source === 'etablissement' },
    },
    {
      name: 'note',
      type: 'textarea',
      label: 'Precision',
      localized: true,
      admin: { placeholder: 'Derniere fournee a 18h30' },
    },
    champApparence(),
  ],
}
