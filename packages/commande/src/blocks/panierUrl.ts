/**
 * Sérialisation compacte du panier pour le retour en erreur.
 *
 * Les quantités reviennent dans l'URL afin que le visiteur ne resaisisse pas
 * tout après un créneau qui vient d'être pris. Rien d'autre n'y transite : ni
 * nom, ni téléphone, ni e-mail. Une URL se retrouve dans l'historique, les
 * journaux du serveur et le référent de la page suivante — ce n'est pas un
 * endroit pour des données personnelles.
 */

export type QuantitesPanier = Record<string, number>

export const encoderPanier = (quantites: QuantitesPanier): string =>
  Object.entries(quantites)
    .filter(([, quantite]) => quantite > 0)
    .map(([identifiant, quantite]) => `${identifiant}x${quantite}`)
    .join('.')

export const decoderPanier = (valeur: string | null | undefined): QuantitesPanier => {
  if (!valeur) return {}

  const quantites: QuantitesPanier = {}
  for (const entree of valeur.split('.')) {
    const [identifiant, quantite] = entree.split('x')
    const nombre = Number(quantite)
    if (identifiant && Number.isInteger(nombre) && nombre > 0 && nombre < 1000) {
      quantites[identifiant] = nombre
    }
  }

  return quantites
}
