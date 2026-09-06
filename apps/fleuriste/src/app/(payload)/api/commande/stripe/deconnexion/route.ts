import { creerRouteDeconnexionStripe } from '@websparks/commande/routes'

import { commande } from '@/commande.config'

/** Délie le compte Stripe du commerçant. */
export const POST = creerRouteDeconnexionStripe(commande)
