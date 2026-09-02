import type { GroupField } from 'payload'

/**
 * Reglages visuels communs a tous les blocs.
 *
 * Ce sont des choix fermes, pas des styles libres : l'editeur peut rythmer la
 * page sans pouvoir sortir de la charte du client.
 */
export const champApparence = (): GroupField => ({
  name: 'apparence',
  type: 'group',
  label: 'Apparence',
  interfaceName: 'ApparenceBloc',
  admin: {
    description: 'Reglages de fond, d espacement et d ancrage de ce bloc.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'fond',
          type: 'select',
          label: 'Fond',
          defaultValue: 'defaut',
          options: [
            { label: 'Normal', value: 'defaut' },
            { label: 'Grise', value: 'attenue' },
            { label: 'Couleur principale', value: 'primaire' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'espacement',
          type: 'select',
          label: 'Espacement vertical',
          defaultValue: 'normal',
          options: [
            { label: 'Compact', value: 'compact' },
            { label: 'Normal', value: 'normal' },
            { label: 'Large', value: 'large' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'ancre',
          type: 'text',
          label: 'Ancre',
          admin: {
            width: '34%',
            description: 'Permet de pointer un lien vers ce bloc. Ex. : horaires.',
          },
        },
      ],
    },
  ],
})
