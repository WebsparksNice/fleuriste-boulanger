import type { CollectionConfig, Field } from 'payload'

import { authentifie, publieOuAuthentifie } from '../access'
import { champImage } from '../fields/media'
import { champSeo } from '../fields/seo'
import { champSlug } from '../fields/slug'
import { editeurTexteRiche } from '../editeur'
import { revaliderApresChangement, revaliderApresSuppression } from '../hooks/revalider'

/**
 * Liste d'allergenes du reglement INCO, pertinente pour les metiers de bouche.
 * Activee par client via `optionsProduits.allergenes`.
 */
const ALLERGENES = [
  { label: 'Gluten', value: 'gluten' },
  { label: 'Oeufs', value: 'oeufs' },
  { label: 'Lait', value: 'lait' },
  { label: 'Fruits a coque', value: 'fruits-a-coque' },
  { label: 'Arachides', value: 'arachides' },
  { label: 'Soja', value: 'soja' },
  { label: 'Sesame', value: 'sesame' },
  { label: 'Sulfites', value: 'sulfites' },
  { label: 'Lupin', value: 'lupin' },
  { label: 'Moutarde', value: 'moutarde' },
  { label: 'Celeri', value: 'celeri' },
  { label: 'Poisson', value: 'poisson' },
  { label: 'Crustaces', value: 'crustaces' },
  { label: 'Mollusques', value: 'mollusques' },
] as const

type OptionsProduits = {
  /** Affiche le champ allergenes : utile en boulangerie, hors sujet chez un fleuriste. */
  allergenes?: boolean
  previsualisation?: NonNullable<CollectionConfig['admin']>['preview']
  livePreview?: NonNullable<CollectionConfig['admin']>['livePreview']
}

/**
 * Produits presentes en vitrine.
 *
 * Aucune notion de stock, de panier ni de paiement : le prix est un texte libre
 * (« a partir de 3,50 € »), ce qui affiche une indication au visiteur sans
 * ouvrir la porte a une logique de vente.
 */
export const Produits = ({
  allergenes = false,
  previsualisation,
  livePreview,
}: OptionsProduits = {}): CollectionConfig => ({
  slug: 'produits',
  labels: { singular: 'Produit', plural: 'Produits' },
  access: {
    read: publieOuAuthentifie,
    create: authentifie,
    update: authentifie,
    delete: authentifie,
  },
  admin: {
    useAsTitle: 'nom',
    defaultColumns: ['nom', 'categorie', 'miseEnAvant', '_status', 'updatedAt'],
    preview: previsualisation,
    livePreview,
    group: 'Contenu',
  },
  hooks: {
    afterChange: [revaliderApresChangement],
    afterDelete: [revaliderApresSuppression],
  },
  versions: {
    drafts: { autosave: { interval: 800 }, schedulePublish: true },
    maxPerDoc: 10,
  },
  defaultSort: ['ordre', 'nom'],
  fields: [
    {
      name: 'nom',
      type: 'text',
      label: 'Nom du produit',
      required: true,
      localized: true,
    },
    champSlug({ champSource: 'nom' }),
    {
      name: 'miseEnAvant',
      type: 'checkbox',
      label: 'Mettre en avant',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: "Apparait dans les blocs « produits mis en avant », notamment sur la page d'accueil.",
      },
    },
    {
      name: 'ordre',
      type: 'number',
      label: 'Ordre d affichage',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Les petits nombres passent en premier.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Fiche',
          fields: [
            champImage({
              name: 'imagePrincipale',
              label: 'Photo principale',
              required: true,
            }),
            {
              name: 'description',
              type: 'richText',
              label: 'Description',
              localized: true,
              editor: editeurTexteRiche,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'prixIndicatif',
                  type: 'text',
                  label: 'Prix indicatif',
                  localized: true,
                  admin: {
                    width: '50%',
                    placeholder: 'a partir de 3,50 €',
                    description: "Texte libre : le site ne vend rien, il informe.",
                  },
                },
                {
                  name: 'disponibilite',
                  type: 'select',
                  label: 'Disponibilite',
                  defaultValue: 'permanent',
                  options: [
                    { label: "Toute l'annee", value: 'permanent' },
                    { label: 'De saison', value: 'saisonnier' },
                    { label: 'Sur commande', value: 'surCommande' },
                  ],
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'categorie',
              type: 'relationship',
              relationTo: 'categories-produits',
              label: 'Categorie',
            },
            ...(allergenes
              ? ([
                  {
                    name: 'allergenes',
                    type: 'select',
                    hasMany: true,
                    label: 'Allergenes',
                    options: [...ALLERGENES],
                    admin: {
                      description:
                        "Affiches sur la fiche produit. L'information reglementaire complete reste due en boutique.",
                    },
                  },
                ] satisfies Field[])
              : []),
            {
              name: 'galerie',
              type: 'array',
              label: 'Photos supplementaires',
              labels: { singular: 'Photo', plural: 'Photos' },
              maxRows: 8,
              fields: [champImage({ required: true })],
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
