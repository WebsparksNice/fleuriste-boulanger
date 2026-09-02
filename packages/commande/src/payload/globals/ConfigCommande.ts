import type { GlobalConfig } from 'payload'

const JOURS = [
  { label: 'Lundi', value: 'lundi' },
  { label: 'Mardi', value: 'mardi' },
  { label: 'Mercredi', value: 'mercredi' },
  { label: 'Jeudi', value: 'jeudi' },
  { label: 'Vendredi', value: 'vendredi' },
  { label: 'Samedi', value: 'samedi' },
  { label: 'Dimanche', value: 'dimanche' },
] as const

const FORMAT_HEURE = /^([01]\d|2[0-3]):([0-5]\d)$/

const validerHeure = (valeur: unknown) => {
  if (typeof valeur !== 'string' || valeur.length === 0) return 'Heure obligatoire.'
  return FORMAT_HEURE.test(valeur) ? true : 'Format attendu : HH:MM, par exemple 07:30.'
}

/**
 * Réglages du click & collect.
 *
 * Les horaires de retrait sont volontairement distincts des horaires
 * d'ouverture de la boutique : on peut vouloir n'accepter les retraits que le
 * matin, ou fermer le comptoir des commandes une heure avant la boutique.
 */
export const ConfigCommande: GlobalConfig = {
  slug: 'config-commande',
  label: 'Réglages des commandes',
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    group: 'Commandes',
    description: 'Créneaux de retrait, capacité et moyens de paiement acceptés.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Créneaux',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'dureeCreneauMinutes',
                  type: 'number',
                  label: 'Durée d’un créneau (minutes)',
                  required: true,
                  defaultValue: 15,
                  min: 5,
                  max: 240,
                  admin: { width: '33%' },
                },
                {
                  name: 'capaciteParCreneau',
                  type: 'number',
                  label: 'Commandes par créneau',
                  required: true,
                  defaultValue: 4,
                  min: 1,
                  max: 100,
                  admin: {
                    width: '33%',
                    description: 'Ce que vous pouvez préparer et remettre sans faire attendre.',
                  },
                },
                {
                  name: 'delaiMinimumHeures',
                  type: 'number',
                  label: 'Délai minimum avant retrait (heures)',
                  required: true,
                  defaultValue: 2,
                  min: 0,
                  max: 168,
                  admin: { width: '34%' },
                },
              ],
            },
            {
              name: 'horizonJours',
              type: 'number',
              label: 'Réservation possible sur (jours)',
              required: true,
              defaultValue: 7,
              min: 1,
              max: 60,
            },
            {
              name: 'minutesAvantExpiration',
              type: 'number',
              label: 'Validité d’une commande non payée (minutes)',
              required: true,
              defaultValue: 30,
              min: 5,
              max: 1440,
              admin: {
                description:
                  'Au-delà, la place est rendue au créneau si le paiement en ligne n’a pas abouti.',
              },
            },
          ],
        },
        {
          label: 'Horaires de retrait',
          fields: [
            {
              name: 'horairesRetrait',
              type: 'array',
              label: 'Horaires de retrait',
              labels: { singular: 'Jour', plural: 'Jours' },
              maxRows: 7,
              admin: {
                initCollapsed: false,
                description:
                  'Un jour absent de cette liste n’accepte aucun retrait. Ces horaires sont indépendants de ceux de la boutique.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'jour',
                      type: 'select',
                      label: 'Jour',
                      required: true,
                      options: [...JOURS],
                      admin: { width: '50%' },
                    },
                    {
                      name: 'ferme',
                      type: 'checkbox',
                      label: 'Aucun retrait ce jour-là',
                      defaultValue: false,
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'plages',
                  type: 'array',
                  label: 'Plages',
                  labels: { singular: 'Plage', plural: 'Plages' },
                  maxRows: 3,
                  admin: { condition: (_, donnees) => !donnees?.ferme },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'debut',
                          type: 'text',
                          label: 'De',
                          validate: validerHeure as never,
                          admin: { width: '50%', placeholder: '07:00' },
                        },
                        {
                          name: 'fin',
                          type: 'text',
                          label: 'À',
                          validate: validerHeure as never,
                          admin: { width: '50%', placeholder: '12:00' },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'joursFermes',
              type: 'array',
              label: 'Jours sans retrait',
              labels: { singular: 'Jour', plural: 'Jours' },
              admin: {
                description: 'Fermetures exceptionnelles : jours fériés, congés, inventaire.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'date',
                      type: 'date',
                      label: 'Date',
                      required: true,
                      admin: {
                        width: '50%',
                        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
                      },
                    },
                    {
                      name: 'motif',
                      type: 'text',
                      label: 'Motif',
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Paiement',
          fields: [
            {
              name: 'paiementEnLigne',
              type: 'checkbox',
              label: 'Accepter le paiement en ligne',
              defaultValue: false,
              admin: {
                description:
                  'Nécessite les clés Stripe dans les variables d’environnement du site.',
              },
            },
            {
              name: 'paiementSurPlace',
              type: 'checkbox',
              label: 'Accepter le paiement au retrait',
              defaultValue: true,
            },
            {
              name: 'messageConfirmation',
              type: 'textarea',
              label: 'Message affiché après commande',
              localized: true,
              admin: { placeholder: 'À tout bientôt en boutique !' },
            },
            {
              name: 'emailCommercant',
              type: 'email',
              label: 'Recevoir les commandes à cette adresse',
              admin: {
                description:
                  'Vide, l’adresse de la fiche Établissement est utilisée.',
              },
            },
          ],
        },
      ],
    },
  ],
}
