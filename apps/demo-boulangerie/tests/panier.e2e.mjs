/**
 * Panier, de bout en bout, contre un serveur qui tourne.
 *
 * Le panier vit dans un cookie et se manipule par formulaires : ce test se
 * comporte comme un navigateur sans JavaScript, ce qui est précisément la
 * cible.
 *
 * Prérequis :
 *   pnpm --filter demo-boulangerie seed
 *   PORT=3000 pnpm --filter demo-boulangerie start
 * Usage :
 *   node apps/demo-boulangerie/tests/panier.e2e.mjs [url]
 */
const BASE = process.argv[2] ?? process.env.URL_TEST ?? 'http://localhost:3000'
let echecs = 0
const verifier = (nom, ok, detail = '') => { if (!ok) echecs++; console.log(`${ok ? '  ok  ' : ' ECHEC'} ${nom}${detail ? ` — ${detail}` : ''}`) }

let cookie = ''
const memoriser = (reponse) => {
  for (const entree of reponse.headers.getSetCookie?.() ?? []) {
    const [paire] = entree.split(';')
    if (paire.startsWith('panier=')) cookie = paire
    if (entree.startsWith('panier=;') || /Max-Age=0/.test(entree)) cookie = ''
  }
}

const poster = async (champs, referer = `${BASE}/nos-pains`) => {
  const r = await fetch(`${BASE}/api/commande/panier`, {
    method: 'POST', redirect: 'manual', headers: { cookie, referer, 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(champs),
  })
  memoriser(r)
  return r
}
const page = async (chemin) => (await fetch(`${BASE}${chemin}`, { headers: { cookie } })).text()

// Identifiants de produits depuis le listing
const listing = await page('/nos-pains')
const ids = [...listing.matchAll(/name="produit" value="(\d+)"/g)].map((m) => m[1])

console.log('— Boutons d’ajout sur le listing —')
verifier('un bouton par produit', ids.length >= 3, `${ids.length} boutons`)
verifier('formulaire vers la route panier', listing.includes('action="/api/commande/panier"'))

console.log('\n— Ajout —')
const ajout = await poster({ action: 'ajouter', produit: ids[0], quantite: '2' })
verifier('redirection 303', ajout.status === 303, String(ajout.status))
verifier('retour sur la page d’origine', (ajout.headers.get('location') ?? '').endsWith('/nos-pains'), ajout.headers.get('location') ?? '')
verifier('cookie de panier posé', cookie.startsWith('panier='), cookie.slice(0, 24))

console.log('\n— Le badge compte les articles —')
let accueil = await page('/')
verifier('badge visible', accueil.includes('Panier'))
verifier('compte à 2', /Panier<\/span>|>2</.test(accueil) && accueil.includes('>2<'), 'cherche « 2 »')

console.log('\n— Cumul —')
await poster({ action: 'ajouter', produit: ids[0], quantite: '1' })
await poster({ action: 'ajouter', produit: ids[1], quantite: '1' })
let commander = await page('/commander')
verifier('deux lignes au panier', (commander.match(/name="produit"/g) ?? []).length >= 4, 'ajout + retrait par ligne')
verifier('sous-total affiché', commander.includes('Sous-total'))

console.log('\n— Plafond par produit —')
await poster({ action: 'definir', produit: ids[0], quantite: '999' })
commander = await page('/commander')
const quantites = [...commander.matchAll(/id="panier-\d+"[^>]*value="(\d+)"/g)].map((m) => Number(m[1]))
verifier('quantité bornée au maximum du produit', quantites.every((q) => q <= 20), quantites.join(','))

console.log('\n— Retrait et vidage —')
await poster({ action: 'retirer', produit: ids[1] })
commander = await page('/commander')
verifier('une ligne en moins', (commander.match(/name="action" value="retirer"/g) ?? []).length === 1)
const vidage = await poster({ action: 'vider' })
verifier('vidage accepté', vidage.status === 303)
commander = await page('/commander')
verifier('panier vide annoncé', commander.includes('Votre panier est vide'))
verifier('pas de formulaire de commande sans panier', !commander.includes('action="/api/commande"'))

console.log('\n— Redirection ouverte —')
const evasion = await poster({ action: 'ajouter', produit: ids[0], quantite: '1', retour: 'https://exemple-malveillant.test/' })
verifier('retour externe refusé', !(evasion.headers.get('location') ?? '').includes('malveillant'), evasion.headers.get('location') ?? '')

console.log('\n— Produit inexistant —')
const fantome = await poster({ action: 'ajouter', produit: '999999', quantite: '1' })
verifier('ignoré sans erreur', fantome.status === 303, String(fantome.status))

console.log(`\n${echecs === 0 ? 'TOUS LES CONTRÔLES PASSENT' : `${echecs} ÉCHEC(S)`}`)
process.exit(echecs === 0 ? 0 : 1)
