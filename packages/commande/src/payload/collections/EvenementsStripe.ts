import type { CollectionConfig } from 'payload'

/**
 * Journal des événements Stripe déjà traités.
 *
 * Stripe réémet un webhook tant qu'il n'a pas reçu de réponse 2xx, et peut le
 * livrer plusieurs fois même après succès. L'identifiant d'événement est unique
 * en base : une seconde livraison échoue à l'insertion, ce qui sert de verrou
 * d'idempotence sans avoir à raisonner sur l'état de la commande.
 */
export const EvenementsStripe: CollectionConfig = {
  slug: 'evenements-stripe',
  labels: { singular: 'Événement Stripe', plural: 'Événements Stripe' },
  access: {
    read: ({ req }) => req.user?.role === 'administrateur',
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  admin: {
    useAsTitle: 'evenementId',
    defaultColumns: ['evenementId', 'type', 'createdAt'],
    group: 'Commandes',
    hidden: ({ user }) => user?.role !== 'administrateur',
  },
  fields: [
    {
      name: 'evenementId',
      type: 'text',
      label: 'Identifiant Stripe',
      required: true,
      unique: true,
      index: true,
    },
    { name: 'type', type: 'text', label: 'Type' },
  ],
}
