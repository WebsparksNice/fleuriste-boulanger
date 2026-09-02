type DonneesVoisines = Record<string, unknown>

const estRempli = (valeur: unknown): boolean => {
  if (Array.isArray(valeur)) return valeur.length > 0
  if (typeof valeur === 'string') return valeur.trim().length > 0
  return valeur !== null && valeur !== undefined
}

/**
 * Rend un champ obligatoire uniquement lorsqu'un champ voisin vaut une valeur donnee.
 *
 * `admin.condition` ne masque un champ que dans l'interface : la validation
 * serveur, elle, s'applique toujours. Sans ce garde-fou, un lien interne serait
 * refuse parce que l'URL externe, pourtant invisible, est vide.
 *
 * Le `as never` final est necessaire : chaque type de champ Payload a sa propre
 * signature de `validate`, et aucune n'accepte une fonction generique.
 */
export const requisSi = (champVoisin: string, attendu: unknown, message: string) => {
  const valider = (valeur: unknown, { siblingData }: { siblingData?: DonneesVoisines }) => {
    if (siblingData?.[champVoisin] !== attendu) return true
    return estRempli(valeur) ? true : message
  }

  return valider as never
}
