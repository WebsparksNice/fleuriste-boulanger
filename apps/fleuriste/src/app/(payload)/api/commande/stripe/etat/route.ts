import { creerRouteEtatStripe } from '@websparks/commande/routes'

import { commande } from '@/commande.config'

/**
 * Relit l'état du compte Stripe à la demande.
 *
 * Filet pour les cas où le webhook `account.updated` n'arrive pas : endpoint
 * pas encore déclaré, tunnel local fermé, événement manqué.
 */
export const POST = creerRouteEtatStripe(commande)
