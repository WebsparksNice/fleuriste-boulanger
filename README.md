# Sites vitrines pour commerçants locaux

Monorepo pnpm : un socle partagé (`packages/core`) et une app mince par client
(`apps/*`) qui ne contient que sa configuration et son contenu.

- **Next.js 16** (App Router, TypeScript)
- **Payload CMS 3** intégré dans la même app Next, admin en français
- **Postgres**
- **Tailwind CSS 4** (configuration CSS-first)

## Démarrer

```bash
pnpm install
cp apps/demo-boulangerie/.env.example apps/demo-boulangerie/.env
# renseigner DATABASE_URI et PAYLOAD_SECRET (openssl rand -base64 32)
pnpm --filter demo-boulangerie seed   # jeu de démonstration + compte admin
pnpm dev
```

Le site répond sur http://localhost:3000, l'administration sur `/admin`
(`admin@example.com` / `motdepasse` après le seed).

## Créer un nouveau client

```bash
cp -r apps/demo-boulangerie apps/fleuriste-durand
```

Puis, dans la copie :

1. `package.json` — changer le `name`
2. `src/site.config.ts` — **le seul fichier à retoucher** : couleurs, polices,
   rayons, espacements, langues, segments d'URL
3. `src/polices.ts` — les polices du client (`next/font` exige des appels
   statiques, le socle ne peut donc pas les charger lui-même)
4. `src/payload.config.ts` — retirer `optionsProduits: { allergenes: true }`
   pour un métier hors alimentaire
5. `.env` — base de données dédiée

Le reste vient du socle (code) et de Payload (contenu). **Aucune donnée client
n'est écrite en dur dans `packages/core`.**

## Modules optionnels

`packages/commande` — click & collect avec créneaux de retrait, paiement Stripe
ou sur place. Un client qui n'en veut pas ne déclare pas la dépendance : rien
de ce module n'entre alors dans son application.

Pour l'activer :

1. `pnpm --filter <app> add @websparks/commande --workspace`
2. `site.config.ts` — `modules: { commande: true }` et le segment d'URL
3. `payload.config.ts` — brancher `creerModuleCommande()` sur les points
   d'extension du socle
4. copier `src/commande.config.ts` et les routes `app/(payload)/api/commande/*`
5. renseigner `STRIPE_*` et `RESEND_API_KEY` dans `.env`

Voir `apps/demo-boulangerie` pour le branchement complet.

### Points d'extension du socle

Le module n'a rien modifié du socle ; il se greffe sur six points prévus pour
lui, tous facultatifs et sans effet quand ils ne sont pas renseignés :

| Point | Où | Sert à |
|---|---|---|
| `ConfigSite.modules` + `routes.commande` | `config/` | savoir si la section existe et sous quelle URL |
| `creerConfigCore({ blocsSupplementaires })` | `payload/` | ajouter des blocs de page |
| `optionsProduits.ongletSupplementaire` | `payload/` | ajouter un onglet à la fiche produit |
| `creerConfigCore({ vuesAdmin })` | `payload/` | ajouter une vue d'administration |
| `RenderBlocks({ rendus })` | `blocks/` | fournir le rendu React des blocs ajoutés |
| `SiteLayout({ actionsEnTete })` | `layout/` | poser un bouton dans l'en-tête |

Les deux points déjà présents en phase 1 — `collectionsSupplementaires` et
`globalesSupplementaires` — servaient déjà à cela.

## Le socle en bref

| Chemin | Contenu |
|---|---|
| `payload/` | collections, globales, blocs, champs partagés, `creerConfigCore` |
| `blocks/` | rendu React des 9 blocs + `RenderBlocks` |
| `components/` | UI, médias, navigation, texte riche |
| `seo/` | `construireMetadata`, JSON-LD, sitemap, robots |
| `theme/` | jetons de design → variables CSS |
| `i18n/` | libellés d'interface (fr, en) |
| `lib/` | accès aux données, horaires, liens |

### Thème

`site.config.ts` déclare des jetons typés. `<StyleTheme />` les écrit sur
`:root` en variables CSS, et `styles/base.css` les expose à Tailwind via
`@theme inline`. Le socle s'écrit une seule fois avec `bg-primaire` ou
`rounded-md` : changer de client ne recompile pas le paquet.

### Multilingue

La localisation Payload est **toujours active**, même pour un client
monolingue : les colonnes de traduction existent dès le départ, et ouvrir une
langue plus tard se réduit à une ligne dans `site.config.ts`, sans migration.

La langue par défaut n'est pas préfixée dans les URL (`/nos-pains`), les autres
le sont (`/en/our-breads`). C'est `src/proxy.ts` qui s'en charge, par réécriture.

### JavaScript client

Aucun composant client dans les pages, à une exception près : la visionneuse de
la galerie, chargée en différé et uniquement si l'éditeur coche
« permettre d'agrandir les images ». Le menu mobile utilise `<details>`, la FAQ
aussi, le filtre produits passe par des liens. Reste le socle Next lui-même
(~190 Ko gzip), qui n'est pas retirable en App Router.

## Commandes : ce sur quoi reposent les garanties

- **Les créneaux sont calculés côté serveur**, par la même fonction à
  l'affichage et à la validation. Un créneau fabriqué à la main ne passe pas.
- **La capacité tient à un index unique** sur `(creneau, position)`, pas à un
  comptage. Deux clients qui visent la dernière place ne peuvent pas la prendre
  tous les deux : le perdant heurte la contrainte et sa transaction est rejouée.
- **Les prix sont relus en base** à chaque commande. Le formulaire n'envoie que
  des identifiants et des quantités.
- **Le webhook Stripe est idempotent** : l'identifiant d'événement est unique en
  base, une seconde livraison n'a rien à refaire.
- **Tout est en Europe/Paris**, changements d'heure compris : une heure qui
  n'existe pas n'est jamais proposée, une heure vécue deux fois n'est pas
  dupliquée. Couvert par 25 tests unitaires.

## Points d'attention

- `src/app/robots.ts` et `src/app/sitemap.ts` doivent rester **à la racine de
  `app/`**. Next ne les détecte pas dans un groupe de routes.
- Les médias sont stockés sur disque (`public/media`). En production, ce chemin
  doit pointer vers un volume persistant.
- La case « autoriser l'indexation » (admin → Référencement) est **décochée par
  défaut**. Tant qu'elle l'est, `robots.txt` interdit tout le site.

## Déploiement (DigitalOcean)

Droplet + volume persistant monté sur `public/media`, Postgres managé ou sur le
même droplet, Cloudflare devant en DNS/CDN uniquement.

- **Ne pas** mettre le HTML en cache côté Cloudflare : la fraîcheur est gérée
  par la revalidation à la publication. Mettre en cache `/_next/static/*` et
  `/media/*` seulement.
- Laisser **Rocket Loader désactivé** : il casse l'hydratation Next.
- Migrations : `pnpm --filter <app> migrate:create` puis `migrate` au
  déploiement. Le mode `push` automatique ne vaut qu'en développement.

## Scripts

| Commande | Effet |
|---|---|
| `pnpm dev` | serveur de développement |
| `pnpm build` | build de production |
| `pnpm typecheck` | TypeScript sur tout le monorepo |
| `pnpm --filter <app> seed` | jeu de démonstration |
| `pnpm --filter <app> types` | régénère `payload-types.ts` |
| `pnpm --filter <app> importmap` | régénère l'import map de l'admin |
| `pnpm --filter @websparks/commande test` | tests unitaires des créneaux et du fuseau |
| `pnpm --filter <app> test:e2e` | parcours de commande, serveur en marche requis |
| `pnpm --filter <app> test:vue-commandes` | rend la vue admin « commandes du jour » |
