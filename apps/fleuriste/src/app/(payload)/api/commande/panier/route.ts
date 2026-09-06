import { creerRoutePanier } from '@websparks/commande/routes'

import { commande } from '@/commande.config'

/** Ajout, mise à jour et retrait d'articles dans le panier du visiteur. */
export const POST = creerRoutePanier(commande)
