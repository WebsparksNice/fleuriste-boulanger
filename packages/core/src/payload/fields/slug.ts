import type { TextField } from 'payload'

import { enSlug, formaterSlug } from '../hooks/formaterSlug'

type OptionsSlug = {
  /** Champ dont on derive le slug quand l'editeur ne le saisit pas. */
  champSource?: string
  /** Slugs interdits, par exemple les segments deja pris par une route dediee. */
  slugsReserves?: string[]
}

export const champSlug = ({ champSource = 'titre', slugsReserves = [] }: OptionsSlug = {}): TextField => ({
  name: 'slug',
  type: 'text',
  label: 'Slug (URL)',
  required: true,
  unique: true,
  index: true,
  localized: true,
  admin: {
    position: 'sidebar',
    description:
      "Partie de l'adresse qui identifie la page. Genere automatiquement, modifiable. Attention : le changer casse les liens existants.",
  },
  hooks: {
    beforeValidate: [formaterSlug(champSource)],
  },
  validate: (valeur: string | null | undefined) => {
    if (typeof valeur !== 'string' || valeur.length === 0) return 'Le slug est obligatoire.'
    if (slugsReserves.includes(valeur)) {
      return `« ${valeur} » est reserve par le site, choisissez un autre slug.`
    }
    if (enSlug(valeur) !== valeur) {
      return 'Le slug ne peut contenir que des minuscules, des chiffres et des tirets.'
    }
    return true
  },
})
