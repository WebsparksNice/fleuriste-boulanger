import type { Payload } from 'payload'
import type Stripe from 'stripe'

import type { GabaritsEmail } from '../emails/types'
import { modeConnect } from './connect'
import { envoyerEmailsCommande } from './envoi'
import { lireReglages } from './reglages'
import { clientStripe } from './stripe'

export type ResultatWebhook =
  | { statut: 200; message: string }
  | { statut: 400; message: string }
  | { statut: 500; message: string }

type OptionsWebhook = {
  payload: Payload
  /** Corps brut de la requête : la signature porte sur les octets exacts. */
  corpsBrut: string
  signature: string | null
  gabarits: GabaritsEmail
  expediteur?: string
  fuseau: string
  langue: string
}

type CommandeStockee = {
  id: string | number
  numero: string
  statutPaiement: string
  totalCentimes: number
  creneauDebut: string
  creneauFin: string
  notes?: string | null
  client: { nom: string; telephone: string; email: string }
  lignes: { nomProduit: string; quantite: number; totalLigneCentimes: number }[]
}

/**
 * Traite un webhook Stripe.
 *
 * Trois garde-fous, chacun pour une raison distincte :
 *
 * 1. la signature est vérifiée sur le corps brut — sans cela, n'importe qui
 *    pourrait déclarer une commande payée par un simple POST ;
 * 2. l'identifiant d'événement est inséré en base sous contrainte d'unicité —
 *    Stripe réémet ses webhooks, y compris après un succès, et un double
 *    traitement enverrait deux e-mails de confirmation ;
 * 3. l'état de la commande est revérifié — une commande déjà payée n'est pas
 *    repayée, même si le journal d'événements a été purgé.
 *
 * S'y ajoute, en mode Connect, un filtre sur le compte : un même point de
 * terminaison reçoit les événements de tous les comptes liés à la plateforme.
 * Un site ne doit traiter que les siens.
 */
export const traiterWebhookStripe = async ({
  payload,
  corpsBrut,
  signature,
  gabarits,
  expediteur,
  fuseau,
  langue,
}: OptionsWebhook): Promise<ResultatWebhook> => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const stripe = clientStripe()

  if (!stripe || !secret) {
    payload.logger.error('[stripe] webhook reçu mais Stripe n’est pas configuré')
    return { statut: 500, message: 'Stripe non configuré' }
  }

  if (!signature) return { statut: 400, message: 'Signature absente' }

  let evenement: Stripe.Event
  try {
    evenement = stripe.webhooks.constructEvent(corpsBrut, signature, secret)
  } catch (erreur) {
    payload.logger.warn(`[stripe] signature invalide : ${String(erreur)}`)
    return { statut: 400, message: 'Signature invalide' }
  }

  const reglages = await lireReglages(payload, fuseau)

  if (modeConnect()) {
    if (!reglages.compteStripe || evenement.account !== reglages.compteStripe) {
      return { statut: 200, message: 'Événement d’un autre compte, ignoré' }
    }
  }

  // Verrou d'idempotence : la seconde livraison du même événement échoue ici.
  try {
    await payload.create({
      collection: 'evenements-stripe',
      data: { evenementId: evenement.id, type: evenement.type },
      overrideAccess: true,
    })
  } catch {
    return { statut: 200, message: 'Événement déjà traité' }
  }

  if (evenement.type !== 'checkout.session.completed') {
    return { statut: 200, message: `Type ignoré : ${evenement.type}` }
  }

  const session = evenement.data.object as Stripe.Checkout.Session
  const commandeId = session.metadata?.commandeId ?? session.client_reference_id

  if (!commandeId) {
    payload.logger.error(`[stripe] session ${session.id} sans référence de commande`)
    return { statut: 200, message: 'Session sans commande' }
  }

  let commande: CommandeStockee
  try {
    commande = (await payload.findByID({
      collection: 'commandes',
      id: commandeId,
      depth: 0,
      overrideAccess: true,
    })) as unknown as CommandeStockee
  } catch {
    payload.logger.error(`[stripe] commande ${commandeId} introuvable`)
    return { statut: 200, message: 'Commande introuvable' }
  }

  if (commande.statutPaiement === 'payee') {
    return { statut: 200, message: 'Commande déjà payée' }
  }

  await payload.update({
    collection: 'commandes',
    id: commande.id,
    overrideAccess: true,
    data: {
      statutPaiement: 'payee',
      statutCommande: 'confirmee',
      stripeSessionId: session.id,
      // La place n'expire plus : elle est acquise.
      expireLe: null,
    },
  })

  const { docs: reservations } = await payload.find({
    collection: 'reservations-creneaux',
    depth: 0,
    limit: 5,
    pagination: false,
    overrideAccess: true,
    where: { commande: { equals: commande.id } },
  })

  for (const reservation of reservations as { id: string | number }[]) {
    await payload.update({
      collection: 'reservations-creneaux',
      id: reservation.id,
      data: { expireLe: null },
      overrideAccess: true,
    })
  }

  await envoyerEmailsCommande({
    payload,
    gabarits,
    expediteur,
    reglages,
    donnees: {
      numero: commande.numero,
      lignes: commande.lignes.map((ligne) => ({
        nom: ligne.nomProduit,
        quantite: ligne.quantite,
        totalLigneCentimes: ligne.totalLigneCentimes,
      })),
      totalCentimes: commande.totalCentimes,
      creneauDebut: new Date(commande.creneauDebut),
      creneauFin: new Date(commande.creneauFin),
      client: commande.client,
      notes: commande.notes,
      modePaiement: 'en_ligne',
      paye: true,
      messageConfirmation: reglages.messageConfirmation,
      langue,
      fuseau,
    },
  })

  return { statut: 200, message: 'Commande confirmée' }
}
