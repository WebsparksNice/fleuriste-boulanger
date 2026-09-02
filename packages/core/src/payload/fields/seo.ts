import type { GroupField } from 'payload'

import { champImage } from './media'

/**
 * Metadonnees de referencement, communes aux pages et aux fiches produit.
 * Tous les champs sont facultatifs : `construireMetadata` retombe sur le
 * titre du document et sur les reglages globaux.
 */
export const champSeo = (): GroupField => ({
  name: 'seo',
  type: 'group',
  label: 'Referencement',
  interfaceName: 'MetaSeo',
  fields: [
    {
      name: 'titre',
      type: 'text',
      label: 'Titre affiche dans Google',
      localized: true,
      admin: {
        description:
          'Vise 50 a 60 caracteres. Vide, le titre du document est repris et le suffixe du site ajoute.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description affichee dans Google',
      localized: true,
      maxLength: 200,
      admin: {
        description: 'Vise 120 a 160 caracteres. Vide, la description globale du site est reprise.',
      },
    },
    champImage({
      name: 'image',
      label: 'Image de partage',
      description:
        "Utilisee par Facebook, WhatsApp et LinkedIn. Format ideal 1200 x 630 px. Vide, l'image par defaut du site est reprise.",
    }),
    {
      name: 'noindex',
      type: 'checkbox',
      label: 'Masquer des moteurs de recherche',
      defaultValue: false,
      admin: {
        description: 'La page reste accessible par son adresse mais sort du sitemap et des resultats.',
      },
    },
  ],
})
