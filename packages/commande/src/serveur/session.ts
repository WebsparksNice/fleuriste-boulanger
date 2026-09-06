import { cookies } from 'next/headers'

import { decoderPanier, encoderPanier, type QuantitesPanier } from '../blocks/panierUrl'

/**
 * Panier du visiteur, conservé dans un cookie.
 *
 * Le cookie ne contient que des identifiants de produits et des quantités —
 * jamais un prix, jamais un total. Tout ce qui touche à l'argent reste relu en
 * base au moment de commander : un cookie se fabrique à la main, et celui-ci ne
 * doit donner aucune prise.
 *
 * Cookie plutôt que stockage navigateur : le panier doit être lisible pendant
 * le rendu côté serveur, sans quoi il faudrait du JavaScript pour l'afficher.
 */
export const NOM_COOKIE_PANIER = 'panier'

/** Deux semaines : le temps qu'un client revienne finir sa commande, pas davantage. */
const DUREE_PANIER = 14 * 24 * 60 * 60

export const lirePanier = async (): Promise<QuantitesPanier> => {
  const magasin = await cookies()
  return decoderPanier(magasin.get(NOM_COOKIE_PANIER)?.value)
}

export const ecrirePanier = async (quantites: QuantitesPanier): Promise<void> => {
  const magasin = await cookies()
  const valeur = encoderPanier(quantites)

  if (!valeur) {
    magasin.delete(NOM_COOKIE_PANIER)
    return
  }

  magasin.set(NOM_COOKIE_PANIER, valeur, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: DUREE_PANIER,
    secure: process.env.NODE_ENV === 'production',
  })
}

export const viderPanier = async (): Promise<void> => {
  const magasin = await cookies()
  magasin.delete(NOM_COOKIE_PANIER)
}

/** Nombre d'articles, toutes lignes confondues. */
export const compterArticles = (quantites: QuantitesPanier): number =>
  Object.values(quantites).reduce((total, quantite) => total + quantite, 0)
