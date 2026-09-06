import { creerRouteConnexionStripe } from '@websparks/commande/routes'

import { commande } from '@/commande.config'

/** Démarre la liaison du compte Stripe du commerçant (Stripe Connect). */
export const GET = creerRouteConnexionStripe(commande)
