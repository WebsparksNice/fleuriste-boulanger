import type { CollectionConfig } from 'payload'

/**
 * Places réservées dans les créneaux de retrait.
 *
 * Une ligne = une place occupée. La contrainte d'unicité sur `(creneau,
 * position)` est ce qui garantit réellement la capacité : comme on n'insère que
 * des positions comprises entre 0 et capacité-1, la base ne peut pas contenir
 * plus de `capacité` lignes pour un même créneau, quel que soit le nombre de
 * commandes simultanées.
 *
 * Compter les commandes existantes avant d'insérer ne suffirait pas : deux
 * requêtes concurrentes liraient le même total et passeraient toutes les deux.
 * Ici, la seconde échoue sur l'index unique et retente à la position suivante,
 * jusqu'à ce que le créneau soit réellement plein.
 */
export const ReservationsCreneaux: CollectionConfig = {
  slug: 'reservations-creneaux',
  labels: { singular: 'Réservation de créneau', plural: 'Réservations de créneaux' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: () => false,
    delete: ({ req }) => req.user?.role === 'administrateur',
  },
  admin: {
    useAsTitle: 'creneau',
    defaultColumns: ['creneau', 'position', 'commande', 'expireLe'],
    group: 'Commandes',
    hidden: ({ user }) => user?.role !== 'administrateur',
    description:
      'Table technique : une ligne par place occupée. Elle se remplit et se vide toute seule.',
  },
  indexes: [{ fields: ['creneau', 'position'], unique: true }],
  fields: [
    {
      name: 'creneau',
      type: 'date',
      label: 'Début du créneau',
      required: true,
      index: true,
    },
    {
      name: 'position',
      type: 'number',
      label: 'Position dans le créneau',
      required: true,
      min: 0,
    },
    {
      name: 'commande',
      type: 'relationship',
      relationTo: 'commandes',
      label: 'Commande',
      required: true,
      index: true,
    },
    {
      name: 'expireLe',
      type: 'date',
      label: 'Expire le',
      index: true,
      admin: {
        description:
          'Renseigné tant que la commande n’est pas payée. Une fois dépassé, la place est rendue.',
      },
    },
  ],
}
