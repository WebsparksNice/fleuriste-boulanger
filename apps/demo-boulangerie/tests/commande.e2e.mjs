/**
 * Parcours de commande, de bout en bout, contre un serveur qui tourne.
 *
 * Couvre ce que les tests unitaires du module ne peuvent pas voir : le
 * recalcul des prix côté serveur, le refus d'un créneau forgé, la capacité
 * sous requêtes simultanées et le rejet des webhooks mal signés.
 *
 * Prérequis :
 *   pnpm --filter demo-boulangerie seed
 *   PORT=3111 pnpm --filter demo-boulangerie start
 * Usage :
 *   node apps/demo-boulangerie/tests/commande.e2e.mjs [url]
 *
 * Le test écrit de vraies commandes en base : à réserver à un environnement
 * de développement.
 */
const BASE = process.argv[2] ?? process.env.URL_TEST ?? 'http://127.0.0.1:3111'
let echecs = 0

const verifier = (nom, condition, detail = '') => {
  if (!condition) echecs++
  console.log(`${condition ? '  ok  ' : ' ECHEC'} ${nom}${detail ? ` — ${detail}` : ''}`)
}

const creneauxDisponibles = async () => {
  // Le choix du créneau n'apparaît qu'avec un panier garni : sans article,
  // il n'y a rien à retirer, donc pas de formulaire de commande.
  const html = await (await fetch(`${BASE}/commander`, { headers: { cookie: cookiePanier } })).text()
  const options = [...html.matchAll(/<option value="([^"]+)"([^>]*)>([^<]*)<\/option>/g)]
  return options
    .filter(([, valeur, attributs]) => valeur.includes('T') && !attributs.includes('disabled'))
    .map(([, valeur, , texte]) => ({ cle: valeur, texte: texte.trim() }))
}

/*
 * Le panier vit dans un cookie : on en tient un ici, comme le ferait un
 * navigateur. Les quantités ne transitent plus par le formulaire de commande.
 */
let cookiePanier = ''

const memoriser = (reponse) => {
  for (const entree of reponse.headers.getSetCookie?.() ?? []) {
    if (entree.startsWith('panier=')) cookiePanier = entree.split(';')[0]
  }
}

const produits = async () => {
  const html = await (await fetch(`${BASE}/nos-pains`)).text()
  return [...html.matchAll(/<form[^>]*action="\/api\/commande\/panier"[\s\S]*?<\/form>/g)].flatMap(
    (bloc) => {
      const id = /name="produit" value="(\d+)"/.exec(bloc[0])?.[1]
      const nom = /Ajouter ([^"]+) au panier|— ([^<]+)<\/span>/.exec(bloc[0])
      return id ? [{ id, nom: (nom?.[1] ?? nom?.[2] ?? '').trim() }] : []
    },
  )
}

const mettreAuPanier = async (produitId, quantite) => {
  const reponse = await fetch(`${BASE}/api/commande/panier`, {
    method: 'POST',
    redirect: 'manual',
    headers: { cookie: cookiePanier, 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ action: 'definir', produit: String(produitId), quantite: String(quantite) }),
  })
  memoriser(reponse)
  return reponse
}

const viderLePanier = async () => {
  const reponse = await fetch(`${BASE}/api/commande/panier`, {
    method: 'POST',
    redirect: 'manual',
    headers: { cookie: cookiePanier, 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ action: 'vider' }),
  })
  memoriser(reponse)
  cookiePanier = ''
}

const commander = async ({ panier, cookie, ...champs } = {}) => {
  // `cookie` permet de forger un panier a la main, ou d'isoler des appels
  // concurrents qui ne doivent pas se partager le meme bocal.
  let jeton = cookie
  if (jeton === undefined) {
    await viderLePanier()
    for (const [produitId, quantite] of Object.entries(panier ?? {})) {
      await mettreAuPanier(produitId, quantite)
    }
    jeton = cookiePanier
  }

  const corps = new URLSearchParams({
    langue: 'fr',
    nom: 'Claude Test',
    telephone: '0478123456',
    email: 'test@example.com',
    modePaiement: 'sur_place',
    ...champs,
  })
  const reponse = await fetch(`${BASE}/api/commande`, {
    method: 'POST',
    body: corps,
    redirect: 'manual',
    headers: { cookie: jeton, 'content-type': 'application/x-www-form-urlencoded' },
  })
  memoriser(reponse)
  const destination = reponse.headers.get('location') ?? ''
  const url = destination ? new URL(destination) : null
  return {
    statut: reponse.status,
    succes: url?.pathname.endsWith('/confirmation') ?? false,
    erreur: url?.searchParams.get('erreur') ?? null,
    detail: url?.searchParams.get('detail') ?? null,
    panier: url?.searchParams.get('panier') ?? null,
    numero: url?.searchParams.get('numero') ?? null,
    jeton: url?.searchParams.get('jeton') ?? null,
    url: destination,
  }
}

const articles = await produits()
await mettreAuPanier(articles[0].id, 1)
const liste = await creneauxDisponibles()
console.log(`\nCréneaux libres : ${liste.length} — produits commandables : ${articles.length}\n`)

console.log('— Commande nominale —')
const baguette = articles[1]
const r1 = await commander({ creneau: liste[0].cle, panier: { [baguette.id]: 2 } })
verifier('redirection 303', r1.statut === 303, `reçu ${r1.statut}`)
verifier('mène à la confirmation', r1.succes, r1.url)
verifier('numéro attribué', /^\d{8}-[A-Z2-9]{4}$/.test(r1.numero ?? ''), r1.numero ?? '')
verifier('jeton attribué', (r1.jeton ?? '').length === 32)

const confirmation = await (await fetch(r1.url)).text()
verifier('page de confirmation lisible', confirmation.includes(r1.numero))
verifier('montant recalculé (2 × 1,30 €)', confirmation.includes('2,60') || confirmation.includes('2,60 €'),
  (confirmation.match(/>([\d,]+)\s*€</g) ?? []).join(' '))

console.log('\n— Le navigateur ne fixe pas les prix —')
const r2 = await commander({
  creneau: liste[1].cle,
  panier: { [baguette.id]: 1 },
  prix: '0.01',
  totalCentimes: '1',
  total: '1',
})
verifier('commande acceptée', r2.succes)
const conf2 = await (await fetch(r2.url)).text()
verifier('total ignoré au profit de la base', conf2.includes('1,30'), 'prix forgé à 0,01 € non retenu')

console.log('\n— Créneau forgé —')
const forge = new Date(Date.now() + 3 * 3600_000)
forge.setUTCSeconds(7, 0)
const r3 = await commander({ creneau: forge.toISOString(), panier: { [baguette.id]: 1 } })
verifier('refusé', !r3.succes && r3.erreur === 'creneau_invalide', r3.erreur ?? '')
// Le panier reste dans le cookie : nul besoin de le faire voyager dans l'URL.
verifier('le panier est conservé', cookiePanier.includes(`${baguette.id}x1`), cookiePanier)

console.log('\n— Délai de préparation du produit —')
const galette = articles[5]
const r4 = await commander({ creneau: liste[0].cle, panier: { [galette.id]: 1 } })
verifier('créneau trop proche refusé (24 h de préparation)', r4.erreur === 'creneau_trop_tot', r4.erreur ?? '')
const tardif = liste[liste.length - 1]
const r5 = await commander({ creneau: tardif.cle, panier: { [galette.id]: 1 } })
verifier('créneau lointain accepté', r5.succes, r5.erreur ?? '')

console.log('\n— Quantité maximum, par un cookie forgé —')
// Le panier plafonne déjà les quantités ; on court-circuite l'interface pour
// vérifier que la validation de commande ne s'en remet pas à lui.
const r6 = await commander({ creneau: liste[2].cle, cookie: `panier=${baguette.id}x999` })
verifier('au-delà du maximum, refusé', r6.erreur === 'quantite_invalide', r6.erreur ?? '')
verifier('le message nomme le produit', (r6.detail ?? '').includes('maximum'), r6.detail ?? '')

console.log('\n— Panier vide —')
const r7 = await commander({ creneau: liste[3].cle, cookie: '' })
verifier('refusé', r7.erreur === 'panier_vide', r7.erreur ?? '')

console.log('\n— Coordonnées invalides —')
const corpsInvalide = new URLSearchParams({
  langue: 'fr', nom: 'X', telephone: 'abc', email: 'pas-un-email',
  modePaiement: 'sur_place', creneau: liste[4].cle,
})
const r8 = await fetch(`${BASE}/api/commande`, {
  method: 'POST', body: corpsInvalide, redirect: 'manual',
  headers: { cookie: `panier=${baguette.id}x1`, 'content-type': 'application/x-www-form-urlencoded' },
})
verifier('refusé', new URL(r8.headers.get('location')).searchParams.get('erreur') === 'coordonnees_invalides')

console.log('\n— Concurrence sur un créneau (capacité 3) —')
const cible = liste[Math.floor(liste.length / 2)]
const tentatives = await Promise.all(
  Array.from({ length: 10 }, (_, i) =>
    // Chaque tentative porte son propre panier : un bocal partagé fausserait
    // la course en se réécrivant d'un appel à l'autre.
    commander({ creneau: cible.cle, cookie: `panier=${baguette.id}x1`, nom: `Client ${i}` }),
  ),
)
const reussies = tentatives.filter((t) => t.succes)
const completes = tentatives.filter((t) => t.erreur === 'creneau_complet')
verifier('exactement 3 commandes passent', reussies.length === 3, `${reussies.length} réussies`)
verifier('les 7 autres reçoivent « complet »', completes.length === 7, `${completes.length} refus`)
verifier('aucune autre erreur', reussies.length + completes.length === 10,
  tentatives.map((t) => t.erreur ?? 'ok').join(','))

console.log('\n— Webhook Stripe —')
const sansSignature = await fetch(`${BASE}/api/commande/webhook-stripe`, {
  method: 'POST', body: '{"id":"evt_1"}',
})
verifier('sans signature : 400', sansSignature.status === 400, String(sansSignature.status))
verifier('rien n’est traité sans signature', (await sansSignature.text()).includes('Signature'))
const mauvaiseSignature = await fetch(`${BASE}/api/commande/webhook-stripe`, {
  method: 'POST', body: '{"id":"evt_1"}', headers: { 'stripe-signature': 't=1,v1=faux' },
})
verifier('signature invalide : refusée', [400, 500].includes(mauvaiseSignature.status), String(mauvaiseSignature.status))

console.log('\n— Changement de statut sans session admin —')
const statut = await fetch(`${BASE}/api/commande/statut`, {
  method: 'POST',
  body: new URLSearchParams({ commande: '1', statut: 'prete', retour: '/admin' }),
  redirect: 'manual',
})
verifier('401 pour un anonyme', statut.status === 401, String(statut.status))

console.log(`\n${echecs === 0 ? 'TOUS LES CONTRÔLES PASSENT' : `${echecs} ÉCHEC(S)`}`)
process.exit(echecs === 0 ? 0 : 1)
