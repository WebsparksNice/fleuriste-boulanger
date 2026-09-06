import { creerRouteWebhookStripe } from '@websparks/commande/routes'

import { commande } from '@/commande.config'

/**
 * Webhook Stripe.
 *
 * À déclarer dans le tableau de bord Stripe sur l'événement
 * `checkout.session.completed`, avec le secret dans STRIPE_WEBHOOK_SECRET.
 */
export const POST = creerRouteWebhookStripe(commande)
