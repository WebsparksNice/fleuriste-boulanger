import { creerRoutePostCommande } from '@websparks/commande/routes'

import { commande } from '@/commande.config'

/**
 * Réception du formulaire de commande.
 *
 * Route serveur classique : le formulaire poste en HTML, sans JavaScript.
 */
export const POST = creerRoutePostCommande(commande)
