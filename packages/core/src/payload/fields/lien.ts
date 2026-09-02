import type { ArrayField, Field, GroupField } from 'payload'

import { requisSi } from './validations'

const champsLien = (avecStyle: boolean): Field[] => [
  {
    type: 'row',
    fields: [
      {
        name: 'type',
        type: 'radio',
        label: 'Type de lien',
        defaultValue: 'interne',
        options: [
          { label: 'Page du site', value: 'interne' },
          { label: 'Adresse externe', value: 'externe' },
          { label: 'Telephone', value: 'telephone' },
          { label: 'E-mail', value: 'email' },
          { label: 'Ancre sur la page', value: 'ancre' },
        ],
        admin: { layout: 'horizontal', width: '60%' },
      },
      ...(avecStyle
        ? ([
            {
              name: 'style',
              type: 'select',
              label: 'Apparence',
              defaultValue: 'primaire',
              options: [
                { label: 'Bouton principal', value: 'primaire' },
                { label: 'Bouton secondaire', value: 'secondaire' },
                { label: 'Lien simple', value: 'discret' },
              ],
              admin: { width: '40%' },
            },
          ] satisfies Field[])
        : []),
    ],
  },
  {
    name: 'libelle',
    type: 'text',
    label: 'Texte du lien',
    required: true,
    localized: true,
  },
  {
    name: 'reference',
    type: 'relationship',
    relationTo: 'pages',
    label: 'Page',
    admin: { condition: (_, donnees) => donnees?.type === 'interne' },
    validate: requisSi('type', 'interne', 'Choisissez la page vers laquelle pointe ce lien.'),
  },
  {
    name: 'url',
    type: 'text',
    label: 'Adresse (https://...)',
    admin: { condition: (_, donnees) => donnees?.type === 'externe' },
    validate: requisSi('type', 'externe', "Indiquez l'adresse complete du lien."),
  },
  {
    name: 'telephone',
    type: 'text',
    label: 'Numero de telephone',
    admin: {
      condition: (_, donnees) => donnees?.type === 'telephone',
      description: 'Laisser vide pour reprendre le numero de la fiche Etablissement.',
    },
  },
  {
    name: 'email',
    type: 'email',
    label: 'Adresse e-mail',
    admin: {
      condition: (_, donnees) => donnees?.type === 'email',
      description: "Laisser vide pour reprendre l'e-mail de la fiche Etablissement.",
    },
  },
  {
    name: 'ancre',
    type: 'text',
    label: 'Ancre',
    admin: {
      condition: (_, donnees) => donnees?.type === 'ancre',
      description: "Identifiant defini dans l'apparence d'un bloc, sans le #.",
    },
    validate: requisSi('type', 'ancre', "Indiquez l'ancre visee, sans le #."),
  },
  {
    name: 'nouvelOnglet',
    type: 'checkbox',
    label: 'Ouvrir dans un nouvel onglet',
    defaultValue: false,
    admin: { condition: (_, donnees) => donnees?.type === 'externe' },
  },
]

type OptionsLien = {
  name?: string
  label?: string
  avecStyle?: boolean
}

/** Lien unique reutilisable (CTA d'en-tete, bouton d'un bloc...). */
export const champLien = ({
  name = 'lien',
  label = 'Lien',
  avecStyle = true,
}: OptionsLien = {}): GroupField => ({
  name,
  type: 'group',
  label,
  interfaceName: 'Lien',
  fields: champsLien(avecStyle),
})

type OptionsLiens = {
  name?: string
  label?: string
  labelSingulier?: string
  maxRows?: number
  avecStyle?: boolean
}

/** Liste de liens : boutons d'un bloc, entrees d'un menu. */
export const champLiens = ({
  name = 'boutons',
  label = 'Boutons',
  labelSingulier = 'Bouton',
  maxRows = 2,
  avecStyle = true,
}: OptionsLiens = {}): ArrayField => ({
  name,
  type: 'array',
  label,
  labels: { singular: labelSingulier, plural: label },
  maxRows,
  fields: champsLien(avecStyle),
})
