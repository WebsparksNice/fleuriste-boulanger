import { creerRouteConfirmationStripe } from '@websparks/commande/routes'

/**
 * Page de confirmation de la liaison Stripe.
 *
 * Séparée du retour pour que le code d'autorisation ne reste pas dans la barre
 * d'adresse : Stripe révoque la connexion si un code lui est présenté deux fois.
 */
export const GET = creerRouteConfirmationStripe()
