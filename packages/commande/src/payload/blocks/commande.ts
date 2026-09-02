import { champApparence, editeurTexteSimple } from '@websparks/core/payload'
import type { Block } from 'payload'

/**
 * Bloc « commander » : insère le formulaire de click & collect dans une page.
 *
 * Le même formulaire est servi par la route dédiée. Le bloc permet de le poser
 * en bas d'une page de présentation, sans obliger le visiteur à changer de page.
 */
export const blocCommande: Block = {
  slug: 'commande',
  interfaceName: 'BlocCommande',
  labels: { singular: 'Commande en ligne', plural: 'Commandes en ligne' },
  fields: [
    {
      name: 'titre',
      type: 'text',
      label: 'Titre',
      localized: true,
    },
    {
      name: 'intro',
      type: 'richText',
      label: 'Texte d introduction',
      localized: true,
      editor: editeurTexteSimple,
    },
    champApparence(),
  ],
}
