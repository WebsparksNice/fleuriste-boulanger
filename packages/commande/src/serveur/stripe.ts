import Stripe from 'stripe'

import type { PanierCalcule } from './types'

/**
 * Client Stripe du site.
 *
 * Les clés sont propres à chaque client de l'agence et vivent dans ses
 * variables d'environnement : rien de tout cela n'est écrit dans le dépôt ni
 * dans le CMS.
 */
export const clientStripe = (): Stripe | null => {
  const cle = process.env.STRIPE_SECRET_KEY
  if (!cle) return null
  return new Stripe(cle)
}

export const stripeConfigure = (): boolean =>
  Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET)

type OptionsSession = {
  stripe: Stripe
  panier: PanierCalcule
  numero: string
  commandeId: string | number
  emailClient: string
  urlSucces: string
  urlAnnulation: string
  langue: string
  minutesAvantExpiration: number
}

/**
 * Session Stripe Checkout.
 *
 * Les lignes sont construites depuis le panier **recalculé en base**, pas
 * depuis la requête : c'est le seul montant que Stripe verra, et il ne peut
 * donc pas être influencé par le navigateur.
 *
 * `expires_at` est aligné sur l'expiration de la réservation de créneau, pour
 * que Stripe cesse d'accepter le paiement au moment précis où la place est
 * rendue à quelqu'un d'autre.
 */
export const creerSessionCheckout = async ({
  stripe,
  panier,
  numero,
  commandeId,
  emailClient,
  urlSucces,
  urlAnnulation,
  langue,
  minutesAvantExpiration,
}: OptionsSession): Promise<Stripe.Checkout.Session> => {
  // Stripe impose une expiration comprise entre 30 minutes et 24 heures.
  const secondes = Math.min(Math.max(minutesAvantExpiration, 30), 1440) * 60

  return stripe.checkout.sessions.create({
    mode: 'payment',
    client_reference_id: String(commandeId),
    customer_email: emailClient,
    locale: langue === 'fr' ? 'fr' : 'auto',
    expires_at: Math.floor(Date.now() / 1000) + secondes,
    metadata: {
      commandeId: String(commandeId),
      numero,
    },
    line_items: panier.lignes.map((ligne) => ({
      quantity: ligne.quantite,
      price_data: {
        currency: 'eur',
        unit_amount: ligne.prixUnitaireCentimes,
        product_data: { name: ligne.produit.nom },
      },
    })),
    success_url: urlSucces,
    cancel_url: urlAnnulation,
  })
}
