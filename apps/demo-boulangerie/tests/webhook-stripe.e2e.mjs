/**
 * Webhooks Stripe, de bout en bout, contre un serveur qui tourne.
 *
 * Les événements sont signés localement avec STRIPE_WEBHOOK_SECRET : on peut
 * donc exercer le traitement réel — vérification de signature, filtrage par
 * compte, idempotence, confirmation de commande — sans compte Stripe.
 *
 * Prérequis :
 *   pnpm --filter demo-boulangerie seed
 *   PORT=3000 pnpm --filter demo-boulangerie start
 * Usage :
 *   pnpm --filter demo-boulangerie exec payload run tests/webhook-stripe.e2e.mjs
 */
import { createHmac, randomUUID } from 'node:crypto'
import { getPayload } from 'payload'

import config from '../src/payload.config.ts'

const BASE = process.env.URL_TEST ?? 'http://localhost:3000'
const SECRET = process.env.STRIPE_WEBHOOK_SECRET
const COMPTE = 'acct_test_webhook'
const CHEMIN = '/api/commande/webhook-stripe'

if (!SECRET) throw new Error('STRIPE_WEBHOOK_SECRET absent du .env')

let echecs = 0
const verifier = (nom, ok, detail = '') => {
  if (!ok) echecs++
  console.log(`${ok ? '  ok  ' : ' ECHEC'} ${nom}${detail ? ` — ${detail}` : ''}`)
}

/** Reproduit la signature de Stripe : t=<horodatage>,v1=<HMAC de "t.corps">. */
const signer = (corps) => {
  const horodatage = Math.floor(Date.now() / 1000)
  const signature = createHmac('sha256', SECRET).update(`${horodatage}.${corps}`).digest('hex')
  return `t=${horodatage},v1=${signature}`
}

const envoyer = async (evenement, signatureForcee) => {
  const corps = JSON.stringify(evenement)
  const reponse = await fetch(`${BASE}${CHEMIN}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'stripe-signature': signatureForcee ?? signer(corps),
    },
    body: corps,
  })
  return { statut: reponse.status, message: await reponse.text() }
}

const evenement = (type, objet, compte = COMPTE) => ({
  id: `evt_${randomUUID().replaceAll('-', '').slice(0, 20)}`,
  object: 'event',
  api_version: '2025-01-27.acacia',
  created: Math.floor(Date.now() / 1000),
  livemode: false,
  type,
  account: compte,
  data: { object: objet },
})

const payload = await getPayload({ config })

// Point de départ : un compte lié, pas encore apte à encaisser.
await payload.updateGlobal({
  slug: 'config-commande',
  overrideAccess: true,
  data: {
    stripeCompteId: COMPTE,
    stripeCompteNom: 'Compte de test',
    stripeChargesActives: false,
    paiementEnLigne: true,
  },
})

const globale = async () =>
  payload.findGlobal({ slug: 'config-commande', depth: 0, overrideAccess: true })

console.log('— Signature —')
const malSigne = await envoyer(evenement('account.updated', { charges_enabled: true }), 't=1,v1=faux')
verifier('signature invalide : refusée', malSigne.statut === 400, String(malSigne.statut))

console.log('\n— Filtrage par compte —')
const autreCompte = await envoyer(
  evenement('account.updated', { charges_enabled: true }, 'acct_quelqu_un_d_autre'),
)
verifier('événement d’un autre compte : ignoré', autreCompte.message.includes('autre compte'), autreCompte.message)
verifier('rien changé en base', (await globale()).stripeChargesActives === false)

console.log('\n— Le compte devient apte à encaisser —')
const majCompte = evenement('account.updated', {
  charges_enabled: true,
  business_profile: { name: 'Boulangerie Martin' },
})
const miseAJour = await envoyer(majCompte)
verifier('accepté', miseAJour.statut === 200, miseAJour.message)

const apres = await globale()
verifier('encaissement activé en base', apres.stripeChargesActives === true)
verifier('nom rafraîchi', apres.stripeCompteNom === 'Boulangerie Martin', String(apres.stripeCompteNom))

console.log('\n— Idempotence —')
const rejeu = await envoyer(majCompte)
verifier('même événement rejoué : non retraité', rejeu.message.includes('déjà traité'), rejeu.message)

console.log('\n— Confirmation d’une commande payée —')
const produit = (
  await payload.find({ collection: 'produits', limit: 1, overrideAccess: true, where: { disponible: { equals: true } } })
).docs[0]

const debut = new Date(Date.now() + 48 * 3600_000)
const commande = await payload.create({
  collection: 'commandes',
  overrideAccess: true,
  data: {
    client: { nom: 'Client Webhook', telephone: '0478123456', email: 'webhook@example.com' },
    lignes: [
      {
        produit: produit.id,
        nomProduit: produit.nom,
        quantite: 2,
        prixUnitaireCentimes: 130,
        totalLigneCentimes: 260,
      },
    ],
    creneauDebut: debut.toISOString(),
    creneauFin: new Date(debut.getTime() + 900_000).toISOString(),
    totalCentimes: 260,
    statutPaiement: 'en_attente',
    statutCommande: 'nouvelle',
    expireLe: new Date(Date.now() + 1800_000).toISOString(),
  },
})

const reservation = await payload.create({
  collection: 'reservations-creneaux',
  overrideAccess: true,
  data: {
    creneau: debut.toISOString(),
    position: 0,
    commande: commande.id,
    expireLe: new Date(Date.now() + 1800_000).toISOString(),
  },
})

const paiement = evenement('checkout.session.completed', {
  id: 'cs_test_webhook',
  object: 'checkout_session',
  metadata: { commandeId: String(commande.id), numero: commande.numero },
})

const confirmation = await envoyer(paiement)
verifier('accepté', confirmation.statut === 200, confirmation.message)

const relue = await payload.findByID({ collection: 'commandes', id: commande.id, overrideAccess: true })
verifier('paiement marqué payé', relue.statutPaiement === 'payee', String(relue.statutPaiement))
verifier('commande confirmée', relue.statutCommande === 'confirmee', String(relue.statutCommande))
verifier('session Stripe enregistrée', relue.stripeSessionId === 'cs_test_webhook', String(relue.stripeSessionId))
verifier('la commande n’expire plus', !relue.expireLe, String(relue.expireLe))

const reservationRelue = await payload.findByID({
  collection: 'reservations-creneaux',
  id: reservation.id,
  overrideAccess: true,
})
verifier('la place est acquise', !reservationRelue.expireLe, String(reservationRelue.expireLe))

console.log('\n— Double encaissement —')
const rejeuPaiement = await envoyer({ ...paiement, id: `evt_${randomUUID().replaceAll('-', '').slice(0, 20)}` })
verifier('commande déjà payée : pas retraitée', rejeuPaiement.message.includes('déjà payée'), rejeuPaiement.message)

console.log('\n— Révocation depuis Stripe —')
const revocation = await envoyer(evenement('account.application.deauthorized', { id: 'ca_test' }))
verifier('accepté', revocation.statut === 200, revocation.message)

const finale = await globale()
verifier('compte oublié', !finale.stripeCompteId, String(finale.stripeCompteId))
verifier('paiement en ligne éteint', finale.paiementEnLigne === false)

// Nettoyage
await payload.delete({ collection: 'reservations-creneaux', id: reservation.id, overrideAccess: true })
await payload.delete({ collection: 'commandes', id: commande.id, overrideAccess: true })

console.log(`\n${echecs === 0 ? 'TOUS LES CONTRÔLES PASSENT' : `${echecs} ÉCHEC(S)`}`)
process.exit(echecs === 0 ? 0 : 1)
