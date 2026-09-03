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
const BASE = process.argv[2] ?? process.env.URL_TEST ?? 'http://127.0.0.1:3111'
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

console.log('\n— Déconnexion —')
const dcAnonyme = await fetch(`${BASE}/api/commande/stripe/deconnexion`, { method: 'POST' })
verifier('anonyme refusé', dcAnonyme.status === 401, String(dcAnonyme.status))

console.log('\n— Sans compte lié, aucun paiement en ligne —')
const formulaire = await (await fetch(`${BASE}/commander`)).text()
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
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    langue: 'fr',
    nom: 'Test Connect',
    telephone: '0478123456',
    email: 'connect@example.com',
    modePaiement: 'en_ligne',
    creneau: creneau ?? '',
    q_2: '1',
  }),
})
const renvoi = new URL(force.headers.get('location')).searchParams.get('erreur')
verifier('paiement en ligne forcé par requête : refusé', renvoi === 'paiement_indisponible', renvoi ?? '')

console.log(`\n${echecs === 0 ? 'TOUS LES CONTRÔLES PASSENT' : `${echecs} ÉCHEC(S)`}`)
process.exit(echecs === 0 ? 0 : 1)
