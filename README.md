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
