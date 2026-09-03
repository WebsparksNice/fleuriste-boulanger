import { getPayload } from 'payload'

import type { ModuleCommande } from '../config'
import { traiterWebhookStripe } from '../serveur/webhook'

/**
 * Point d'entrée du webhook Stripe.
 *
 * Le corps est lu en texte brut et non en JSON : la signature porte sur les
 * octets exacts reçus, et une désérialisation suivie d'une resérialisation la
 * rendrait invalide.
 */
export const creerRouteWebhookStripe = (module: ModuleCommande) => {
  const { site } = module

  return async (requete: Request): Promise<Response> => {
    const corpsBrut = await requete.text()
    const signature = requete.headers.get('stripe-signature')
    const payload = await getPayload({ config: module.payloadConfig })

    const resultat = await traiterWebhookStripe({
      payload,
      corpsBrut,
      signature,
      gabarits: module.emails,
      expediteur: module.expediteur,
      fuseau: site.fuseau,
      langue: site.langueParDefaut,
    })

    return new Response(resultat.message, { status: resultat.statut })
  }
}
