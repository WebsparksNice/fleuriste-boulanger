import type { ArrayField } from 'payload'

export const JOURS = [
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
 * Horaires hebdomadaires.
 *
 * Chaque jour porte une liste de creneaux, ce qui couvre la coupure du midi
 * ("07:00-13:00" puis "16:00-19:30"), courante en boulangerie comme chez un
 * fleuriste. C'est aussi la forme attendue par schema.org, qui accepte
 * plusieurs OpeningHoursSpecification pour un meme jour.
 */
export const champHorairesHebdomadaires = (): ArrayField => ({
  name: 'horaires',
  type: 'array',
  label: "Horaires d'ouverture",
  labels: { singular: 'Jour', plural: 'Jours' },
  maxRows: 7,
  admin: {
    initCollapsed: false,
    description: 'Un jour absent de cette liste est considere comme ferme.',
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
          label: 'Ferme toute la journee',
          defaultValue: false,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'creneaux',
      type: 'array',
      label: 'Creneaux',
      labels: { singular: 'Creneau', plural: 'Creneaux' },
      maxRows: 3,
      admin: {
        condition: (_, donnees) => !donnees?.ferme,
        description: 'Ajoutez un second creneau pour une coupure a midi.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'ouvre',
              type: 'text',
              label: 'Ouverture',
              validate: validerHeure as never,
              admin: { width: '50%', placeholder: '07:00' },
            },
            {
              name: 'ferme',
              type: 'text',
              label: 'Fermeture',
              validate: validerHeure as never,
              admin: { width: '50%', placeholder: '13:00' },
            },
          ],
        },
      ],
    },
  ],
})

/**
 * Fermetures exceptionnelles : conges, jours feries, fermeture annuelle.
 * Alimente `specialOpeningHoursSpecification` dans le JSON-LD.
 */
export const champFermeturesExceptionnelles = (): ArrayField => ({
  name: 'fermeturesExceptionnelles',
  type: 'array',
  label: 'Fermetures exceptionnelles',
  labels: { singular: 'Fermeture', plural: 'Fermetures' },
  admin: {
    description:
      'Signalees sur le site et transmises a Google. Les periodes passees sont ignorees automatiquement.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'du',
          type: 'date',
          label: 'Du',
          required: true,
          admin: { width: '33%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
        },
        {
          name: 'au',
          type: 'date',
          label: 'Au (inclus)',
          required: true,
          admin: { width: '33%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
        },
        {
          name: 'motif',
          type: 'text',
          label: 'Motif',
          localized: true,
          admin: { width: '34%', placeholder: 'Conges annuels' },
        },
      ],
    },
  ],
})
