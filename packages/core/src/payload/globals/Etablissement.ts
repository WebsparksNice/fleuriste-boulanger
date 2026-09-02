import type { GlobalConfig } from 'payload'

import { authentifie, tousPeuventLire } from '../access'
import { champFermeturesExceptionnelles, champHorairesHebdomadaires } from '../fields/horaires'
import { champImage } from '../fields/media'
import { revaliderGlobaleApresChangement } from '../hooks/revalider'

/**
 * Types de commerce proposes a l'editeur, et type schema.org correspondant.
 *
 * Le mapping vit ici parce que c'est la source de verite du JSON-LD : ajouter
 * un metier a cette liste suffit a ce que les donnees structurees suivent.
 */
export const TYPES_COMMERCE = [
  { label: 'Boulangerie', value: 'boulangerie', schema: 'Bakery' },
  { label: 'Patisserie', value: 'patisserie', schema: 'Bakery' },
  { label: 'Fleuriste', value: 'fleuriste', schema: 'Florist' },
  { label: 'Boucherie / Charcuterie', value: 'boucherie', schema: 'Store' },
  { label: 'Epicerie', value: 'epicerie', schema: 'GroceryStore' },
  { label: 'Cafe / Salon de the', value: 'cafe', schema: 'CafeOrCoffeeShop' },
  { label: 'Restaurant', value: 'restaurant', schema: 'Restaurant' },
  { label: 'Autre commerce', value: 'autre', schema: 'LocalBusiness' },
] as const

export type TypeCommerce = (typeof TYPES_COMMERCE)[number]['value']

const PLATEFORMES = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Fiche Google', value: 'google' },
  { label: 'Autre', value: 'autre' },
] as const

/**
 * Fiche d'identite du commerce.
 *
 * C'est la source unique des coordonnees : elles alimentent l'en-tete, le pied
 * de page, le bloc Contact et le JSON-LD. Un numero de telephone ne se saisit
 * donc qu'une seule fois, ce qui evite les incoherences de NAP (nom, adresse,
 * telephone) que Google penalise en referencement local.
 */
export const Etablissement: GlobalConfig = {
  slug: 'etablissement',
  label: 'Etablissement',
  access: {
    read: tousPeuventLire,
    update: authentifie,
  },
  admin: {
    description: 'Coordonnees et horaires du commerce, repris partout sur le site.',
    group: 'Reglages',
  },
  hooks: {
    afterChange: [revaliderGlobaleApresChangement],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identite',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'nom',
                  type: 'text',
                  label: 'Nom du commerce',
                  required: true,
                  admin: { width: '60%' },
                },
                {
                  name: 'typeCommerce',
                  type: 'select',
                  label: 'Type de commerce',
                  required: true,
                  defaultValue: 'autre',
                  options: TYPES_COMMERCE.map(({ label, value }) => ({ label, value })),
                  admin: {
                    width: '40%',
                    description: 'Determine la categorie transmise a Google.',
                  },
                },
              ],
            },
            {
              name: 'slogan',
              type: 'text',
              label: 'Slogan',
              localized: true,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description courte',
              localized: true,
              maxLength: 300,
              admin: {
                description:
                  'Deux ou trois phrases. Reprise dans les donnees structurees et comme description par defaut.',
              },
            },
            champImage({ name: 'logo', label: 'Logo' }),
          ],
        },
        {
          label: 'Coordonnees',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'telephone',
                  type: 'text',
                  label: 'Telephone',
                  admin: { width: '50%', placeholder: '01 23 45 67 89' },
                },
                {
                  name: 'email',
                  type: 'email',
                  label: 'E-mail',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'adresse',
              type: 'group',
              label: 'Adresse',
              interfaceName: 'Adresse',
              fields: [
                {
                  name: 'rue',
                  type: 'text',
                  label: 'Numero et rue',
                },
                {
                  name: 'complement',
                  type: 'text',
                  label: 'Complement',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'codePostal',
                      type: 'text',
                      label: 'Code postal',
                      admin: { width: '30%' },
                    },
                    {
                      name: 'ville',
                      type: 'text',
                      label: 'Ville',
                      admin: { width: '40%' },
                    },
                    {
                      name: 'pays',
                      type: 'text',
                      label: 'Pays',
                      defaultValue: 'France',
                      admin: { width: '30%' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'geo',
              type: 'group',
              label: 'Coordonnees GPS',
              interfaceName: 'CoordonneesGeo',
              admin: {
                description:
                  'Facultatif mais recommande : aide Google a placer le commerce sur la carte. Se releve dans Google Maps par un clic droit sur la boutique.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'latitude',
                      type: 'number',
                      label: 'Latitude',
                      admin: { width: '50%', placeholder: '48.8566' },
                    },
                    {
                      name: 'longitude',
                      type: 'number',
                      label: 'Longitude',
                      admin: { width: '50%', placeholder: '2.3522' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'lienItineraire',
              type: 'text',
              label: "Lien vers l'itineraire",
              admin: {
                description:
                  "Lien Google Maps ou Apple Plans utilise par le bouton « Obtenir l'itineraire ».",
              },
            },
            {
              name: 'accessibilitePmr',
              type: 'checkbox',
              label: 'Boutique accessible aux personnes a mobilite reduite',
              defaultValue: false,
            },
            {
              name: 'moyensPaiement',
              type: 'text',
              label: 'Moyens de paiement acceptes',
              localized: true,
              admin: { placeholder: 'Especes, carte bancaire, titres restaurant' },
            },
          ],
        },
        {
          label: 'Horaires',
          fields: [champHorairesHebdomadaires(), champFermeturesExceptionnelles()],
        },
        {
          label: 'Reseaux sociaux',
          fields: [
            {
              name: 'reseauxSociaux',
              type: 'array',
              label: 'Reseaux sociaux',
              labels: { singular: 'Reseau', plural: 'Reseaux' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'plateforme',
                      type: 'select',
                      label: 'Plateforme',
                      required: true,
                      options: [...PLATEFORMES],
                      admin: { width: '35%' },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: 'Adresse du profil',
                      required: true,
                      admin: { width: '65%', placeholder: 'https://...' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
