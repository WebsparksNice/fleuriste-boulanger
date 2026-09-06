#!/usr/bin/env node
/**
 * Crée une app cliente à partir de la démonstration.
 *
 *   pnpm nouveau-client fleuriste-durand --metier fleuriste --nom "Fleurs Durand"
 *
 * Copie l'app, la débarrasse de tout ce qui appartient à la boulangerie de
 * démonstration, et écrit une configuration neutre. Ce qui reste à faire est
 * imprimé à la fin : ce sont les étapes qui exigent une base de données.
 */
import { execFileSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MODELE = path.join(RACINE, 'apps', 'demo-boulangerie')

/** Métiers reconnus, et si la liste des allergènes a du sens pour eux. */
const METIERS = {
  boulangerie: { label: 'Boulangerie', allergenes: true },
  patisserie: { label: 'Pâtisserie', allergenes: true },
  fleuriste: { label: 'Fleuriste', allergenes: false },
  boucherie: { label: 'Boucherie', allergenes: true },
  epicerie: { label: 'Épicerie', allergenes: true },
  cafe: { label: 'Café', allergenes: true },
  restaurant: { label: 'Restaurant', allergenes: true },
  autre: { label: 'Commerce', allergenes: false },
}

/* --- Lecture des arguments --- */

const arguments_ = process.argv.slice(2)
const slug = arguments_.find((valeur) => !valeur.startsWith('--'))

const option = (nom, defaut = null) => {
  const index = arguments_.indexOf(`--${nom}`)
  return index === -1 ? defaut : (arguments_[index + 1] ?? defaut)
}
const drapeau = (nom) => arguments_.includes(`--${nom}`)

const abandonner = (message) => {
  console.error(`\n  ${message}\n`)
  process.exit(1)
}

if (!slug || drapeau('help')) {
  console.log(`
  Usage : pnpm nouveau-client <slug> [options]

    --metier <type>     ${Object.keys(METIERS).join(' | ')}   (défaut : autre)
    --nom "<nom>"       Nom du commerce           (défaut : déduit du slug)
    --langues fr,en     Langues du site           (défaut : fr)
    --sans-commande     N'installe pas le module de click & collect
`)
  process.exit(drapeau('help') ? 0 : 1)
}

if (!/^[a-z][a-z0-9-]*$/.test(slug)) {
  abandonner(`Slug invalide : « ${slug} ». Minuscules, chiffres et tirets uniquement.`)
}

const metier = option('metier', 'autre')
if (!METIERS[metier]) {
  abandonner(`Métier inconnu : « ${metier} ». Au choix : ${Object.keys(METIERS).join(', ')}.`)
}

const langues = option('langues', 'fr')
  .split(',')
  .map((langue) => langue.trim())
  .filter(Boolean)

const avecCommande = !drapeau('sans-commande')
const nomCommerce =
  option('nom') ?? slug.split('-').map((mot) => mot[0].toUpperCase() + mot.slice(1)).join(' ')

const destination = path.join(RACINE, 'apps', slug)
if (existsSync(destination)) abandonner(`apps/${slug} existe déjà.`)
if (!existsSync(MODELE)) abandonner(`Modèle introuvable : ${MODELE}`)

/* --- Copie --- */

const EXCLUS = new Set(['node_modules', '.next', '.env', 'tests', 'migrations'])

console.log(`\n  Création de apps/${slug} — ${METIERS[metier].label}\n`)

cpSync(MODELE, destination, {
  recursive: true,
  filter: (source) => !EXCLUS.has(path.basename(source)),
})

const fichier = (relatif) => path.join(destination, relatif)
const lire = (relatif) => readFileSync(fichier(relatif), 'utf8')
const ecrire = (relatif, contenu) => {
  mkdirSync(path.dirname(fichier(relatif)), { recursive: true })
  writeFileSync(fichier(relatif), contenu)
}

/** Remplacement qui échoue bruyamment plutôt que de laisser passer un fichier à moitié modifié. */
const remplacer = (relatif, avant, apres) => {
  const contenu = lire(relatif)
  if (!contenu.includes(avant)) {
    abandonner(
      `Le modèle a changé : le repère suivant est introuvable dans ${relatif}.\n  ${avant.split('\n')[0]}\n\n  Mettez à jour scripts/nouveau-client.mjs.`,
    )
  }
  ecrire(relatif, contenu.replace(avant, apres))
}

/* --- package.json --- */

const paquet = JSON.parse(lire('package.json'))
paquet.name = slug
for (const script of ['test:e2e', 'test:stripe', 'test:webhook', 'test:vue-commandes']) {
  delete paquet.scripts[script]
}
if (!avecCommande) delete paquet.dependencies['@websparks/commande']
ecrire('package.json', `${JSON.stringify(paquet, null, 2)}\n`)

/* --- site.config.ts --- */

const segments = {
  produits: { fr: 'nos-produits', en: 'products' },
  commande: { fr: 'commander', en: 'order' },
}
const parLangue = (cle) =>
  langues.map((langue) => `${langue}: '${segments[cle][langue] ?? segments[cle].fr}'`).join(', ')

ecrire(
  'src/site.config.ts',
  `import { definirSite } from '@websparks/core'

/**
 * Configuration du site.
 *
 * C'est le seul fichier à reprendre pour habiller ce client : le reste vient du
 * socle (code) et de Payload (contenu saisi par le commerçant).
 */
export const site = definirSite({
  cle: '${slug}',
  urlSite: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',

  // La première langue est celle par défaut : ses URL ne sont pas préfixées.
  langues: [${langues.map((langue) => `'${langue}'`).join(', ')}],
  fuseau: 'Europe/Paris',

  routes: {
    produits: { ${parLangue('produits')} },${
      avecCommande ? `\n    commande: { ${parLangue('commande')} },` : ''
    }
  },
${
  avecCommande
    ? `
  modules: {
    commande: true,
  },
`
    : ''
}
  // À reprendre avec la charte du client. Tout jeton omis retombe sur la
  // valeur neutre du socle.
  theme: {
    couleurs: {
      primaire: '#1f2937',
      primaireSurvol: '#111827',
      primaireContraste: '#ffffff',
      secondaire: '#f3f4f6',
      secondaireSurvol: '#e5e7eb',
      secondaireContraste: '#111827',
      accent: '#b45309',
      fond: '#ffffff',
      surface: '#ffffff',
      surfaceAttenuee: '#f9fafb',
      texte: '#111827',
      texteAttenue: '#4b5563',
      bordure: '#e5e7eb',
    },
    polices: {
      titres: 'var(--police-titres), Georgia, serif',
      corps: 'var(--police-corps), system-ui, sans-serif',
    },
    espacements: {
      conteneur: '72rem',
    },
  },

  options: {
    produitsParPage: 12,
    // À passer à true tant que le site n'est pas livré : il sort alors des
    // moteurs de recherche, quoi que dise la case dans l'administration.
    bloquerIndexation: false,
  },
})
`,
)

/* --- payload.config.ts --- */

if (avecCommande) {
  remplacer(
    'src/payload.config.ts',
    `    optionsProduits: {
      allergenes: true,
      ongletSupplementaire: commande.ongletProduits,
    },`,
    `    optionsProduits: {
      allergenes: ${METIERS[metier].allergenes},
      ongletSupplementaire: commande.ongletProduits,
    },`,
  )
} else {
  let config = lire('src/payload.config.ts')
  const coupes = [
    ["import { creerModuleCommande } from '@websparks/commande/payload'\n", ''],
    [
      `
// Module optionnel : les collections, la globale, le bloc et l'onglet produit
// arrivent par les points d'extension du socle, qui n'en connaît aucun.
const commande = creerModuleCommande()`,
      '',
    ],
    [
      `    optionsProduits: {
      allergenes: true,
      ongletSupplementaire: commande.ongletProduits,
    },

    blocsSupplementaires: commande.blocs,
    collectionsSupplementaires: commande.collections,
    globalesSupplementaires: commande.globals,

    // Vue de travail du commercant, ajoutee par le module.
    vuesAdmin: {
      commandesDuJour: {
        Component: '/admin/CommandesDuJour#default',
        path: '/commandes-du-jour',
      },
    },
`,
      `    optionsProduits: { allergenes: ${METIERS[metier].allergenes} },
`,
    ],
  ]
  for (const [avant, apres] of coupes) {
    if (!config.includes(avant)) {
      abandonner(`Le modèle a changé : repère introuvable dans src/payload.config.ts.`)
    }
    config = config.replace(avant, apres)
  }
  ecrire('src/payload.config.ts', config)

  // Fichiers et routes qui n'ont plus d'objet
  for (const chemin of [
    'src/commande.config.ts',
    'src/admin',
    'src/app/(payload)/api/commande',
  ]) {
    rmSync(fichier(chemin), { recursive: true, force: true })
  }

  remplacer(
    'src/composants/PageCms.tsx',
    `import { rendusCommande } from '@websparks/commande/blocks'\n`,
    '',
  )
  remplacer(
    'src/composants/PageCms.tsx',
    `  return (
    <RenderBlocks
      contenu={page.contenu}
      config={site}
      contexte={contexte}
      // Rendus apportés par les modules activés pour ce client.
      rendus={rendusCommande}
    />
  )`,
    `  return <RenderBlocks contenu={page.contenu} config={site} contexte={contexte} />`,
  )

  remplacer('src/styles/globals.css', `@source '../../../../packages/commande/src';\n`, '')

  // Dispatch de routes : on retire la section commande
  let routes = lire('src/app/(site)/[locale]/[...slug]/page.tsx')
  routes = routes
    .replace(
      `import { FormulaireCommande, PageConfirmationCommande } from '@websparks/commande/blocks'\nimport { SEGMENT_CONFIRMATION } from '@websparks/commande/routes'\n`,
      '',
    )
    .replace('  segmentCommande,\n', '')
    .replace(/\n  \/\/ Section commande[\s\S]*?\n  }\n(?=\n  if \(segments\.length === 1)/, '\n')
    .replace(/\n  if \(route\.type === 'commande'[\s\S]*?\n  }\n(?=\n  return \{\})/, '\n')
    .replace(/\n    case 'commande': \{[\s\S]*?\n    \}\n    case 'confirmation-commande': \{[\s\S]*?\n    \}(?=\n    case 'page')/, '')
    .replace(', obtenirContexte,', ',')
  ecrire('src/app/(site)/[locale]/[...slug]/page.tsx', routes)

  let gabarit = lire('src/app/(site)/[locale]/layout.tsx')
  gabarit = gabarit
    .replace(`import { SiteLayout, lienCommande } from '@websparks/core'`, `import { SiteLayout } from '@websparks/core'`)
    .replace(`import Link from 'next/link'\n`, '')
    .replace(/\n          actionsEnTete=\{[\s\S]*?\n          \}/, '')
  ecrire('src/app/(site)/[locale]/layout.tsx', gabarit)
}

/* --- seed.ts : contenu minimal, pas la boulangerie de démonstration --- */

ecrire(
  'src/seed.ts',
  `import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Jeu de départ pour ${nomCommerce}.
 *
 * Le strict nécessaire pour que le site s'affiche et que le commerçant puisse
 * se connecter. Tout le reste — produits, photos, textes — se saisit dans
 * l'administration.
 *
 *   pnpm --filter ${slug} seed
 */
const seed = async () => {
  const payload = await getPayload({ config })

  payload.logger.info('Compte administrateur...')
  await payload.create({
    collection: 'utilisateurs',
    data: {
      nom: 'Administrateur',
      email: 'admin@${slug}.fr',
      password: 'motdepasse-a-changer',
      role: 'administrateur',
    },
  })

  payload.logger.info('Fiche établissement...')
  await payload.updateGlobal({
    slug: 'etablissement',
    data: {
      nom: '${nomCommerce}',
      typeCommerce: '${metier}',
      adresse: { pays: 'France' },
      horaires: [
        { jour: 'lundi', ferme: true, creneaux: [] },
        { jour: 'mardi', ferme: false, creneaux: [{ ouvre: '09:00', ferme: '19:00' }] },
        { jour: 'mercredi', ferme: false, creneaux: [{ ouvre: '09:00', ferme: '19:00' }] },
        { jour: 'jeudi', ferme: false, creneaux: [{ ouvre: '09:00', ferme: '19:00' }] },
        { jour: 'vendredi', ferme: false, creneaux: [{ ouvre: '09:00', ferme: '19:00' }] },
        { jour: 'samedi', ferme: false, creneaux: [{ ouvre: '09:00', ferme: '19:00' }] },
        { jour: 'dimanche', ferme: true, creneaux: [] },
      ],
    },
  })

  payload.logger.info('Page d’accueil...')
  const accueil = await payload.create({
    collection: 'pages',
    data: {
      titre: '${nomCommerce}',
      slug: 'accueil',
      _status: 'published',
      contenu: [
        {
          blockType: 'hero',
          variante: 'texte',
          titre: '${nomCommerce}',
          sousTitre: 'À compléter depuis l’administration.',
          apparence: { fond: 'attenue', espacement: 'normal' },
        },
        {
          blockType: 'contact',
          afficherCoordonnees: true,
          afficherHoraires: true,
          afficherReseaux: true,
          afficherCarte: false,
          apparence: { fond: 'defaut', espacement: 'normal' },
        },
      ] as never,
    },
  })
${
  langues.length > 1
    ? `
  /*
   * Le slug est localisé, et le repli de Payload ne s'applique qu'à la lecture
   * des valeurs, pas au filtre d'une requête : une page sans slug traduit est
   * introuvable dans cette langue, et l'URL correspondante renvoie 404. On sème
   * donc la page dans chaque langue activée.
   *
   * Le contenu est repris tel quel, identifiants de blocs compris. Sans eux,
   * Payload recréerait les blocs et les textes de la langue par défaut seraient
   * perdus ; et sans contenu du tout, les champs obligatoires des blocs —
   * le titre de la bannière — seraient vides dans la nouvelle langue.
   */
  for (const langue of ${JSON.stringify(langues.slice(1))}) {
    await payload.update({
      collection: 'pages',
      id: accueil.id,
      locale: langue as never,
      data: {
        titre: '${nomCommerce}',
        slug: 'accueil',
        contenu: accueil.contenu,
      },
    })
  }
`
    : ''
}
  await payload.updateGlobal({
    slug: 'reglages-seo',
    data: {
      suffixeTitre: '${nomCommerce}',
      // Reste décoché jusqu'à la mise en ligne : le site est alors invisible
      // des moteurs de recherche.
      autoriserIndexation: false,
    },
  })
${
  avecCommande
    ? `
  payload.logger.info('Réglages des commandes...')
  await payload.updateGlobal({
    slug: 'config-commande',
    data: {
      dureeCreneauMinutes: 15,
      capaciteParCreneau: 4,
      delaiMinimumHeures: 2,
      horizonJours: 7,
      minutesAvantExpiration: 30,
      horairesRetrait: [
        { jour: 'mardi', ferme: false, plages: [{ debut: '09:00', fin: '18:00' }] },
        { jour: 'mercredi', ferme: false, plages: [{ debut: '09:00', fin: '18:00' }] },
        { jour: 'jeudi', ferme: false, plages: [{ debut: '09:00', fin: '18:00' }] },
        { jour: 'vendredi', ferme: false, plages: [{ debut: '09:00', fin: '18:00' }] },
        { jour: 'samedi', ferme: false, plages: [{ debut: '09:00', fin: '18:00' }] },
      ],
      paiementEnLigne: false,
      paiementSurPlace: true,
    },
  })
`
    : ''
}
  payload.logger.info('Terminé. Connexion : admin@${slug}.fr / motdepasse-a-changer')
  process.exit(0)
}

await seed()
`,
)

/* --- Carte d'imports de l'administration --- */

/*
 * Elle liste les composants React personnalisés par chemin de paquet, et celle
 * du modèle référence ceux du module de commande. La copier telle quelle
 * casserait la compilation d'un client qui s'en passe. On pose une carte vide,
 * que « payload generate:importmap » remplira.
 */
ecrire(
  'src/app/(payload)/admin/importMap.js',
  `/** @type import('payload').ImportMap */
// Régénérée par « pnpm --filter ${slug} importmap ».
export const importMap = {}
`,
)

/* --- .env --- */

const baseDeDonnees = slug.replaceAll('-', '_')
ecrire(
  '.env',
  `DATABASE_URI=postgres://postgres:postgres@localhost:5432/${baseDeDonnees}
PAYLOAD_SECRET=${randomBytes(32).toString('base64')}
NEXT_PUBLIC_SITE_URL=http://localhost:3000
${
  avecCommande
    ? `
# Stripe Connect — voir le README. Laisser vide tant que le client n'encaisse pas.
STRIPE_SECRET_KEY=
STRIPE_CONNECT_CLIENT_ID=
STRIPE_WEBHOOK_SECRET=

# Resend, pour les e-mails de confirmation
RESEND_API_KEY=
EMAIL_EXPEDITEUR=
`
    : ''
}`,
)

/* --- Compte rendu --- */

const suite = [
  'pnpm install',
  `pnpm --filter ${slug} importmap`,
  `pnpm --filter ${slug} types`,
  `pnpm --filter ${slug} migrate:create initial`,
  `pnpm --filter ${slug} migrate`,
  `pnpm --filter ${slug} seed`,
  `pnpm --filter ${slug} dev`,
]

console.log(`  Fait. Module de commande : ${avecCommande ? 'activé' : 'absent'}`)
console.log(`  Allergènes sur les produits : ${METIERS[metier].allergenes ? 'oui' : 'non'}\n`)
console.log(`  D'abord, une base de données joignable, et son adresse dans
  apps/${slug}/.env :

    hébergée (Supabase, Neon, base gérée)  la base existe déjà, rien à créer
    Postgres local                         createdb ${baseDeDonnees}

  Puis :\n`)
for (const commande of suite) console.log(`    ${commande}`)
console.log(`
  Puis :
    apps/${slug}/src/site.config.ts   couleurs et polices du client
    apps/${slug}/src/polices.ts       polices next/font

  Les types et la migration sont régénérés parce qu'ils dépendent de la
  configuration : la liste des allergènes, par exemple, ajoute une colonne.
`)

try {
  execFileSync('git', ['check-ignore', '-q', path.join(destination, '.env')], { cwd: RACINE })
} catch {
  console.log('  Attention : apps/*/.env ne semble pas ignoré par git. Vérifiez .gitignore.\n')
}
