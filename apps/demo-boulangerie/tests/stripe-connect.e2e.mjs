/**
 * Liaison Stripe Connect, de bout en bout, contre un serveur qui tourne.
 *
 * Ne touche pas à l'API Stripe : ce qui est vérifié ici, c'est ce qui nous
 * appartient — la signature du jeton `state`, le refus des requêtes non
 * authentifiées, l'adresse de retour, et le fait qu'aucun paiement en ligne ne
 * soit proposé tant qu'aucun compte n'est lié.
 *
 * Prérequis :
 *   STRIPE_CONNECT_CLIENT_ID renseigné dans .env (une valeur factice suffit)
 *   pnpm --filter demo-boulangerie seed
 *   PORT=3111 pnpm --filter demo-boulangerie start
 * Usage :
 *   node apps/demo-boulangerie/tests/stripe-connect.e2e.mjs [url]
 */
const BASE = process.argv[2] ?? process.env.URL_TEST ?? 'http://localhost:3000'
let echecs = 0

const verifier = (nom, ok, detail = '') => {
  if (!ok) echecs++
  console.log(`${ok ? '  ok  ' : ' ECHEC'} ${nom}${detail ? ` — ${detail}` : ''}`)
}

const connexionAdmin = await fetch(`${BASE}/api/utilisateurs/login`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'admin@example.com', password: 'motdepasse' }),
})
const cookie = (connexionAdmin.headers.getSetCookie?.() ?? []).map((e) => e.split(';')[0]).join('; ')
// L'en-tête Origin est indispensable : sans lui, Payload refuse la session en
// cookie au titre de sa protection CSRF.
const admin = { cookie, Origin: BASE }

console.log('— Démarrage de la liaison —')
const anonyme = await fetch(`${BASE}/api/commande/stripe/connexion`, { redirect: 'manual' })
verifier('anonyme refusé', anonyme.status === 401, String(anonyme.status))

const depart = await fetch(`${BASE}/api/commande/stripe/connexion`, {
  headers: admin,
  redirect: 'manual',
})
const cible = depart.headers.get('location') ?? ''
verifier(
  'admin redirigé vers Stripe',
  depart.status === 303 && cible.startsWith('https://connect.stripe.com/oauth/authorize'),
  cible.slice(0, 50),
)

const params = cible ? new URL(cible).searchParams : new URLSearchParams()
verifier('client_id de la plateforme transmis', params.get('client_id')?.startsWith('ca_') === true, params.get('client_id') ?? '')
verifier('portée read_write', params.get('scope') === 'read_write')
verifier(
  'adresse de retour sur notre domaine',
  params.get('redirect_uri') === `${BASE}/api/commande/stripe/retour`,
  params.get('redirect_uri') ?? '',
)
const etat = params.get('state') ?? ''
verifier('jeton state signé présent', etat.includes('.') && etat.length > 40)

console.log('\n— Retour depuis Stripe —')
const sansEtat = await fetch(`${BASE}/api/commande/stripe/retour?code=ac_faux`)
verifier('sans state : refusé', sansEtat.status === 400, String(sansEtat.status))
verifier('message explicite', (await sansEtat.text()).includes('expirée ou invalide'))

const etatFalsifie = `${etat.split('.')[0]}.signaturebidon`
const falsifie = await fetch(
  `${BASE}/api/commande/stripe/retour?code=ac_faux&state=${encodeURIComponent(etatFalsifie)}`,
)
verifier('signature falsifiée : refusée', falsifie.status === 400, String(falsifie.status))

const refus = await fetch(
  `${BASE}/api/commande/stripe/retour?error=access_denied&error_description=Refus%20du%20commercant`,
)
verifier('refus côté Stripe : message repris', (await refus.text()).includes('Refus du commercant'))

console.log('\n— Enregistrement de la liaison —')
const liaisonAnonyme = await fetch(`${BASE}/api/commande/stripe/liaison`, {
  method: 'POST',
  body: new URLSearchParams({ liaison: 'nimporte.quoi' }),
})
verifier('anonyme refusé', liaisonAnonyme.status === 401, String(liaisonAnonyme.status))

const liaisonBidon = await fetch(`${BASE}/api/commande/stripe/liaison`, {
  method: 'POST',
  headers: { ...admin, 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ liaison: 'nimporte.quoi' }),
})
verifier('jeton invalide refusé même connecté', liaisonBidon.status === 400, String(liaisonBidon.status))

// Un jeton de connexion n'est pas un jeton de liaison : les deux étapes sont
// distinctes, et rejouer le premier ne doit pas court-circuiter la seconde.
const liaisonAvecEtat = await fetch(`${BASE}/api/commande/stripe/liaison`, {
  method: 'POST',
  headers: { ...admin, 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ liaison: etat }),
})
verifier('jeton de l’étape précédente rejeté', liaisonAvecEtat.status === 400, String(liaisonAvecEtat.status))

console.log('\n— Page de confirmation et enregistrement —')
// Le jeton de liaison est signé avec PAYLOAD_SECRET, que le développeur
// connaît : on peut donc jouer l'étape qui suit l'échange OAuth sans compte
// Stripe réel, et vérifier tout ce qui nous appartient.
const { createHmac, randomUUID } = await import('node:crypto')
const secret = process.env.PAYLOAD_SECRET ?? 'cle-de-developpement-a-remplacer'
const signer = (contenu) => {
  const charge = Buffer.from(
    JSON.stringify({ ...contenu, _t: Date.now(), _z: randomUUID() }),
  ).toString('base64url')
  return `${charge}.${createHmac('sha256', secret).update(charge).digest('base64url')}`
}

const moi = await (await fetch(`${BASE}/api/utilisateurs/me`, { headers: admin })).json()
const jetonLiaison = signer({
  u: String(moi.user?.id),
  a: 'liaison',
  c: 'acct_test_local',
  nom: 'Boulangerie de test',
  actif: 1,
})

const pageConfirmation = await (await fetch(
  `${BASE}/api/commande/stripe/confirmer?liaison=${encodeURIComponent(jetonLiaison)}`,
)).text()
verifier('la confirmation affiche le nom du compte', pageConfirmation.includes('Boulangerie de test'))
verifier('un bouton de confirmation est proposé', pageConfirmation.includes('Confirmer la liaison'))

const confirmationInvalide = await fetch(`${BASE}/api/commande/stripe/confirmer?liaison=bidon.bidon`)
verifier('jeton invalide : page refusée', confirmationInvalide.status === 400, String(confirmationInvalide.status))

const enregistrement = await fetch(`${BASE}/api/commande/stripe/liaison`, {
  method: 'POST',
  headers: { ...admin, 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ liaison: jetonLiaison }),
  redirect: 'manual',
})
verifier('liaison enregistrée', enregistrement.status === 303, String(enregistrement.status))
verifier(
  'retour vers les réglages',
  (enregistrement.headers.get('location') ?? '').endsWith('/admin/globals/config-commande'),
  enregistrement.headers.get('location') ?? '',
)

// Un jeton signé par quelqu'un d'autre ne doit rien pouvoir enregistrer.
const jetonAutreUtilisateur = signer({ u: '999999', a: 'liaison', c: 'acct_pirate', nom: 'Pirate' })
const usurpation = await fetch(`${BASE}/api/commande/stripe/liaison`, {
  method: 'POST',
  headers: { ...admin, 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ liaison: jetonAutreUtilisateur }),
  redirect: 'manual',
})
verifier('jeton lancé par un autre compte : refusé', usurpation.status === 403, String(usurpation.status))

console.log('\n— Vérification de l’état à la demande —')
const etatAnonyme = await fetch(`${BASE}/api/commande/stripe/etat`, { method: 'POST' })
verifier('anonyme refusé', etatAnonyme.status === 401, String(etatAnonyme.status))

const etatLie = await fetch(`${BASE}/api/commande/stripe/etat`, { method: 'POST', headers: admin })
verifier('compte lié : état relu', etatLie.status === 200, String(etatLie.status))
if (etatLie.status === 200) {
  const corps = await etatLie.json()
  // La clé Stripe est factice : la lecture échoue et le compte est déclaré
  // inapte, ce qui est le comportement voulu — jamais une erreur 500.
  verifier('réponse exploitable', typeof corps.chargesActives === 'boolean', JSON.stringify(corps))
}

console.log('\n— Déconnexion —')
const dcAnonyme = await fetch(`${BASE}/api/commande/stripe/deconnexion`, { method: 'POST' })
verifier('anonyme refusé', dcAnonyme.status === 401, String(dcAnonyme.status))

const deconnexion = await fetch(`${BASE}/api/commande/stripe/deconnexion`, {
  method: 'POST',
  headers: admin,
})
verifier('compte délié', deconnexion.status === 200, String(deconnexion.status))

const etatSansCompte = await fetch(`${BASE}/api/commande/stripe/etat`, { method: 'POST', headers: admin })
verifier('sans compte lié : 409 explicite', etatSansCompte.status === 409, String(etatSansCompte.status))

console.log('\n— Sans compte lié, aucun paiement en ligne —')

/*
 * Le formulaire de commande n'apparaît qu'avec un panier garni : sans article,
 * il n'y a rien à régler, donc pas de choix de paiement à examiner.
 */
const listing = await (await fetch(`${BASE}/nos-pains`)).text()
const produitId = /name="produit" value="(\d+)"/.exec(listing)?.[1] ?? '1'
const misAuPanier = await fetch(`${BASE}/api/commande/panier`, {
  method: 'POST',
  redirect: 'manual',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ action: 'definir', produit: produitId, quantite: '1' }),
})
const cookiePanier = (misAuPanier.headers.getSetCookie?.() ?? [])
  .map((entree) => entree.split(';')[0])
  .find((paire) => paire.startsWith('panier=')) ?? ''

const formulaire = await (await fetch(`${BASE}/commander`, { headers: { cookie: cookiePanier } })).text()
// React n'ordonne pas les attributs : on isole la balise avant d'en lire la
// valeur, plutôt que de supposer que `name` et `value` se suivent.
const modes = [...formulaire.matchAll(/<input[^>]*name="modePaiement"[^>]*>/g)]
  .map((balise) => /value="([^"]+)"/.exec(balise[0])?.[1])
  .filter(Boolean)
verifier('« payer en ligne » absent du formulaire', !modes.includes('en_ligne'), modes.join(',') || 'aucun mode')
verifier('« payer au retrait » proposé', modes.includes('sur_place'))

const creneau = [...formulaire.matchAll(/<option value="([^"]+T[^"]+)"/g)][0]?.[1]
const force = await fetch(`${BASE}/api/commande`, {
  method: 'POST',
  redirect: 'manual',
  headers: { cookie: cookiePanier, 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    langue: 'fr',
    nom: 'Test Connect',
    telephone: '0478123456',
    email: 'connect@example.com',
    modePaiement: 'en_ligne',
    creneau: creneau ?? '',
  }),
})
const renvoi = new URL(force.headers.get('location')).searchParams.get('erreur')
verifier('paiement en ligne forcé par requête : refusé', renvoi === 'paiement_indisponible', renvoi ?? '')

console.log(`\n${echecs === 0 ? 'TOUS LES CONTRÔLES PASSENT' : `${echecs} ÉCHEC(S)`}`)
process.exit(echecs === 0 ? 0 : 1)
