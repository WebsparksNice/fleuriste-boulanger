import type { Block } from 'payload'

import { champApparence } from '../fields/apparence'
import { champDispositionEntete, champSurtitre } from '../fields/entete'
import { editeurTexteSimple } from '../editeur'
import { requisSi } from '../fields/validations'

export const blocProduits: Block = {
  slug: 'produits',
  interfaceName: 'BlocProduits',
  labels: { singular: 'Produits', plural: 'Produits' },
  fields: [
    champSurtitre(),
    {
      name: 'titre',
      type: 'text',
      label: 'Titre',
      localized: true,
    },
    {
      name: 'intro',
      type: 'richText',
      label: 'Texte d introduction',
      localized: true,
      editor: editeurTexteSimple,
    },
    {
      name: 'mode',
      type: 'select',
      label: 'Produits affiches',
      defaultValue: 'misesEnAvant',
      required: true,
      options: [
        { label: 'Les produits mis en avant', value: 'misesEnAvant' },
        { label: 'Une categorie', value: 'categorie' },
        { label: 'Une selection manuelle', value: 'selection' },
        { label: 'Tous les produits', value: 'tous' },
      ],
      admin: {
        description:
          "« Mis en avant » suit la case cochee sur chaque produit : la page d'accueil se met a jour toute seule.",
      },
    },
    {
      name: 'categorie',
      type: 'relationship',
      relationTo: 'categories-produits',
      label: 'Categorie',
      admin: { condition: (_, donnees) => donnees?.mode === 'categorie' },
      validate: requisSi('mode', 'categorie', 'Choisissez la categorie a afficher.'),
    },
    {
      name: 'selection',
      type: 'relationship',
      relationTo: 'produits',
      hasMany: true,
      label: 'Produits',
      admin: {
        condition: (_, donnees) => donnees?.mode === 'selection',
        description: 'L ordre choisi ici est celui de l affichage.',
      },
      validate: requisSi('mode', 'selection', 'Selectionnez au moins un produit.'),
    },
    {
      type: 'row',
      fields: [
        {
          name: 'limite',
          type: 'number',
          label: 'Nombre maximum affiche',
          defaultValue: 6,
          min: 1,
          max: 24,
          admin: {
            width: '50%',
            condition: (_, donnees) => donnees?.mode !== 'selection',
          },
        },
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
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'variante',
      type: 'select',
      label: 'Presentation des vignettes',
      defaultValue: 'sobre',
      options: [
        { label: 'Sobre : image et nom, sans cadre', value: 'sobre' },
        { label: 'Carte : sur un fond, avec resume et bouton', value: 'carte' },
      ],
      admin: {
        description:
          'La presentation « carte » reprend le resume saisi sur chaque produit.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'afficherPrix',
          type: 'checkbox',
          label: 'Afficher le prix indicatif',
          defaultValue: true,
          admin: { width: '50%' },
        },
        {
          name: 'afficherLienVoirTout',
          type: 'checkbox',
          label: 'Afficher un lien vers tous les produits',
          defaultValue: true,
          admin: { width: '50%' },
        },
      ],
    },
    champDispositionEntete(),
    champApparence(),
  ],
}
