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
6. générer et appliquer la migration : `migrate:create` puis `migrate`

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

## Paiement : Stripe Connect

Le commerçant relie son propre compte Stripe depuis l'administration, par un
bouton. **Aucune clé secrète de commerçant ne circule** : ni dans le CMS, ni
dans un fichier, ni dans une sauvegarde de base.

Les paiements sont des **charges directes** : ils sont créés au nom du compte
du commerçant, l'argent y arrive sans transiter par l'agence. Celle-ci n'est ni
encaisseur ni responsable des litiges et des remboursements.

### Mise en place, une fois pour toute l'agence

1. Créer une plateforme Connect dans le tableau de bord Stripe de l'agence.
2. Y déclarer l'adresse de retour de chaque site :
   `https://<domaine-du-client>/api/commande/stripe/retour`
3. Renseigner dans le `.env` de chaque site :
   - `STRIPE_SECRET_KEY` — clé de la **plateforme**, identique partout
   - `STRIPE_CONNECT_CLIENT_ID` — le `ca_...` de la plateforme
   - `STRIPE_WEBHOOK_SECRET` — secret du point de terminaison Connect

Le commerçant fait le reste seul : *Réglages des commandes → Connecter mon
compte Stripe*.

### Tester en local

Stripe n'exige HTTPS pour l'URL de retour **qu'en mode production**. En mode
test, `http://localhost` est accepté.

1. Dans les réglages Connect de la plateforme (mode test), ajouter l'URI de
   redirection : `http://localhost:3000/api/commande/stripe/retour`
2. `.env` :
   ```
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_CONNECT_CLIENT_ID=ca_...          # celui du mode test
   ```
3. Pour recevoir les webhooks, la CLI Stripe — Stripe ne peut pas appeler
   votre machine :
   ```bash
   stripe listen --forward-connect-to http://localhost:3000/api/commande/webhook-stripe
   ```
   Elle affiche un `whsec_...` **différent de celui du tableau de bord** : c'est
   lui qu'il faut mettre dans `STRIPE_WEBHOOK_SECRET`. `--forward-connect-to`
   et non `--forward-to` : les paiements ont lieu sur le compte connecté, leurs
   événements sont donc des événements Connect.

**Trois pièges, dans l'ordre où on les rencontre :**

- **L'URI doit correspondre au caractère près.** `http://localhost:3000` et
  `http://127.0.0.1:3000` sont deux adresses différentes pour Stripe, qui
  répondra `invalid_redirect_uri`.
- **Naviguez par la même adresse que `NEXT_PUBLIC_SITE_URL`.** Le socle
  configure `csrf` avec cette valeur ; ouvrir l'administration sur
  `127.0.0.1:3000` alors que la variable dit `localhost:3000` fait refuser la
  session par Payload, sans message clair.
- **Le port doit suivre.** `pnpm dev` écoute sur 3000 ; si vous en changez,
  changez aussi la variable et l'URI enregistrée chez Stripe.

Le mode test de Stripe fournit des comptes connectés de démonstration : vous
pouvez donc dérouler la liaison de bout en bout sans compte réel.

### Deux modes qui s'excluent

`STRIPE_CONNECT_CLIENT_ID` décide à lui seul :

| Renseigné | Mode | `STRIPE_SECRET_KEY` est… |
|---|---|---|
| oui | Connect | la clé de la plateforme de l'agence |
| non | clé directe | la clé du commerçant lui-même |

**Il n'y a pas de repli de l'un sur l'autre, et c'est délibéré.** En mode
Connect, si aucun compte n'est lié, le paiement en ligne reste indisponible
plutôt que de retomber sur la clé de plateforme — ce repli enverrait les
encaissements du commerçant sur le compte de l'agence.

### Ce qui protège la liaison

- Le paramètre `state` est un jeton signé (HMAC), lié à l'utilisateur qui a
  lancé la démarche et valable dix minutes.
- Le retour de Stripe **n'enregistre rien** : il arrive d'un autre domaine, où
  Payload refuse la session en cookie (`Sec-Fetch-Site: cross-site`). Il
  présente une page de confirmation dont le bouton repart en POST depuis notre
  domaine, seule requête où la session est vérifiable — et où lier le compte
  qui encaissera devient un geste explicite.
- Le webhook n'accepte que les événements dont le compte est celui du site : un
  point de terminaison Connect reçoit ceux de tous les comptes de la plateforme.
- L'état du compte est rafraîchi par `account.updated` plutôt que figé à la
  liaison : un commerçant qui termine son inscription chez Stripe devient
  encaissant sans avoir à délier puis relier. Un bouton **Vérifier l'état**
  refait la lecture à la demande, pour les cas où l'événement n'arrive pas.

### « Ce compte n'est pas autorisé à encaisser »

Un compte connecté ne peut encaisser qu'une fois son inscription Stripe
complétée. En mode test, le plus simple est de choisir **Créer un compte**
pendant la liaison plutôt qu'un compte existant : le formulaire d'inscription
s'ouvre alors, et le lien *Ignorer ce formulaire* le remplit avec des données
fictives, ce qui active l'encaissement immédiatement.

Attention : sur l'écran de sélection, *Ignorer ce formulaire* ne concerne que
la création d'un compte. Si vous sélectionnez un compte existant qui n'a jamais
terminé son inscription, il restera inapte à encaisser.

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
- Migrations : `pnpm --filter <app> migrate:create <nom>` en développement,
  `pnpm --filter <app> migrate` au déploiement. Le mode `push` automatique ne
  vaut qu'en développement — en production, une colonne manquante se traduit
  par une erreur 500 sur la page concernée.

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
| `pnpm --filter <app> test:stripe` | liaison Stripe Connect, serveur en marche requis |
| `pnpm --filter <app> test:webhook` | webhooks signés localement, serveur en marche requis |
| `pnpm --filter <app> test:vue-commandes` | rend la vue admin « commandes du jour » |
