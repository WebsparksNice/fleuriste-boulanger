import { creerRouteRetourStripe } from '@websparks/commande/routes'

import { commande } from '@/commande.config'

/**
 * Adresse de retour déclarée chez Stripe.
 *
 * À enregistrer telle quelle dans les réglages Connect de la plateforme :
 * https://<domaine-du-client>/api/commande/stripe/retour
 */
export const GET = creerRouteRetourStripe(commande)
