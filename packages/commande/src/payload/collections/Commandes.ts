import type { CollectionConfig } from 'payload'

import { attribuerJeton, attribuerNumero } from '../hooks/numeroCommande'
import { STATUTS_COMMANDE, STATUTS_PAIEMENT } from '../statuts'

/**
 * Commandes de click & collect.
 *
 * Chaque ligne porte une **copie** du nom et du prix du produit au moment de la
 * commande, et non une simple référence. Changer le prix d'une baguette demain
 * ne doit pas réécrire le montant d'une commande déjà payée hier : c'est une
 * pièce comptable, elle ne bouge plus.
 */
export const Commandes: CollectionConfig = {
  slug: 'commandes',
  labels: { singular: 'Commande', plural: 'Commandes' },
  access: {
    read: ({ req }) => Boolean(req.user),
    // Les commandes ne sont créées que par le serveur, jamais par l'API publique.
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === 'administrateur',
  },
  admin: {
    useAsTitle: 'numero',
    defaultColumns: ['numero', 'creneauDebut', 'statutCommande', 'statutPaiement', 'totalCentimes'],
    group: 'Commandes',
    description: 'Commandes passées depuis le site. Le détail des lignes n’est pas modifiable.',
  },
  defaultSort: '-creneauDebut',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'numero',
          type: 'text',
          label: 'Numéro',
          unique: true,
          index: true,
          admin: { readOnly: true, width: '50%' },
          hooks: { beforeValidate: [attribuerNumero] },
        },
        {
          name: 'creneauDebut',
          type: 'date',
          label: 'Créneau de retrait',
          required: true,
          index: true,
          admin: {
            width: '50%',
            readOnly: true,
            date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
          },
        },
      ],
    },
    {
      name: 'creneauFin',
      type: 'date',
      label: 'Fin du créneau',
      required: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'statutCommande',
          type: 'select',
          label: 'Statut',
          required: true,
          defaultValue: 'nouvelle',
          index: true,
          options: [...STATUTS_COMMANDE],
          admin: { width: '50%' },
        },
        {
          name: 'statutPaiement',
          type: 'select',
          label: 'Paiement',
          required: true,
          defaultValue: 'en_attente',
          index: true,
          options: [...STATUTS_PAIEMENT],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'client',
      type: 'group',
      label: 'Client',
      interfaceName: 'ClientCommande',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'nom', type: 'text', label: 'Nom', required: true, admin: { width: '34%' } },
            {
              name: 'telephone',
              type: 'text',
              label: 'Téléphone',
              required: true,
              admin: { width: '33%' },
            },
            { name: 'email', type: 'email', label: 'E-mail', required: true, admin: { width: '33%' } },
          ],
        },
      ],
    },
    {
      name: 'lignes',
      type: 'array',
      label: 'Lignes',
      labels: { singular: 'Ligne', plural: 'Lignes' },
      required: true,
      minRows: 1,
      admin: {
        readOnly: true,
        description: 'Copie figée du produit et de son prix au moment de la commande.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'nomProduit', type: 'text', label: 'Produit', required: true, admin: { width: '40%' } },
            { name: 'quantite', type: 'number', label: 'Quantité', required: true, min: 1, admin: { width: '15%' } },
            {
              name: 'prixUnitaireCentimes',
              type: 'number',
              label: 'Prix unitaire',
              required: true,
              admin: { width: '22%' },
            },
            {
              name: 'totalLigneCentimes',
              type: 'number',
              label: 'Total ligne',
              required: true,
              admin: { width: '23%' },
            },
          ],
        },
        {
          name: 'produit',
          type: 'relationship',
          relationTo: 'produits',
          label: 'Fiche produit',
          admin: {
            description: 'Lien de confort vers la fiche. Le montant facturé reste celui ci-dessus.',
          },
        },
      ],
    },
    {
      name: 'totalCentimes',
      type: 'number',
      label: 'Total (centimes)',
      required: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description:
          'En centimes, recalculé côté serveur depuis la base. Jamais lu depuis la requête du navigateur.',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      admin: { description: 'Message du client, complété si besoin par le commerçant.' },
    },
    {
      name: 'jeton',
      type: 'text',
      label: 'Jeton de consultation',
      index: true,
      admin: {
        hidden: true,
        readOnly: true,
      },
      hooks: { beforeValidate: [attribuerJeton] },
    },
    {
      name: 'stripeSessionId',
      type: 'text',
      label: 'Session Stripe',
      index: true,
      admin: { readOnly: true, position: 'sidebar', condition: (donnees) => Boolean(donnees?.stripeSessionId) },
    },
    {
      name: 'expireLe',
      type: 'date',
      label: 'Réservation valable jusqu’au',
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description:
          'Passé ce délai, une commande non payée libère sa place dans le créneau.',
        condition: (donnees) => donnees?.statutPaiement === 'en_attente',
      },
    },
  ],
}
