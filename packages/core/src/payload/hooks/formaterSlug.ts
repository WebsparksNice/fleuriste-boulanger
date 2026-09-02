import type { FieldHook } from 'payload'

/** `Pain au levain` -> `pain-au-levain`. Retire les accents et la ponctuation. */
export const enSlug = (valeur: string): string =>
  valeur
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Remplit le slug depuis un champ source tant que l'editeur ne l'a pas saisi
 * a la main. Un slug deja publie n'est jamais reecrit automatiquement :
 * changer une URL en ligne casserait le referencement.
 */
export const formaterSlug =
  (champSource: string): FieldHook =>
  ({ data, operation, originalDoc, value }) => {
    if (typeof value === 'string' && value.length > 0) return enSlug(value)

    if (operation === 'create' || !originalDoc?.slug) {
      const source = data?.[champSource]
      if (typeof source === 'string' && source.length > 0) return enSlug(source)
    }

    return value
  }
