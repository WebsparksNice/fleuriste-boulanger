import { fr as adminFr } from '@payloadcms/translations/languages/fr'
import type { Block, CollectionConfig, Config, Field, GlobalConfig } from 'payload'

import type { ConfigSiteResolue } from '../config'
import { segmentsProduitsReserves } from '../config'
import type { Langue } from '../i18n'
import { CategoriesProduits } from './collections/CategoriesProduits'
import { Faq } from './collections/Faq'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Produits } from './collections/Produits'
import { Temoignages } from './collections/Temoignages'
import { Utilisateurs } from './collections/Utilisateurs'
import { editeurTexteRiche } from './editeur'
import { Etablissement } from './globals/Etablissement'
import { Navigation } from './globals/Navigation'
import { ReglagesSeo } from './globals/ReglagesSeo'
import { construirePrevisualisation, pointsDeRupture } from './previsualisation'

const nomsLangues: Record<Langue, string> = {
  fr: 'Francais',
  en: 'Anglais',
  es: 'Espagnol',
  de: 'Allemand',
  it: 'Italien',
  nl: 'Neerlandais',
}

export type OptionsConfigCore = {
  site: ConfigSiteResolue
  /** Adaptateur base de donnees, instancie par l'app (ex. `postgresAdapter({...})`). */
  db: Config['db']
  /** Instance de sharp, importee par l'app : Payload ne la resout pas lui-meme. */
  sharp: Config['sharp']
  secret: string
  /** Dossier de stockage des medias. Doit etre un volume persistant en production. */
  dossierMedia: string
  /** Repertoire racine de l'app, pour la generation de l'import map de l'admin. */
  baseDirImportMap: string
  /** Chemin du fichier de types genere par Payload. */
  cheminTypes?: string
  optionsProduits?: {
    allergenes?: boolean
    /** Onglet ajoute a la fiche produit par un module optionnel. */
    ongletSupplementaire?: { label: string; fields: Field[] }
  }
  /** Blocs de page apportes par les modules optionnels. */
  blocsSupplementaires?: Block[]
  /**
   * Vues d'administration ajoutees par les modules optionnels.
   * Chaque entree suit le format attendu par Payload : `{ Component, path }`.
   */
  vuesAdmin?: NonNullable<NonNullable<Config['admin']>['components']>['views']
  collectionsSupplementaires?: CollectionConfig[]
  globalesSupplementaires?: GlobalConfig[]
  /** Dernier mot pour l'app cliente : fusionne apres tout le reste. */
  surcharges?: Partial<Config>
}

/**
 * Assemble la configuration Payload d'un site vitrine.
 *
 * La localisation est activee meme pour un client monolingue : les colonnes de
 * traduction existent alors des le depart, et ajouter une langue plus tard se
 * reduit a une ligne dans `site.config.ts`, sans migration de donnees.
 */
export const creerConfigCore = ({
  site,
  db,
  sharp,
  secret,
  dossierMedia,
  baseDirImportMap,
  cheminTypes,
  optionsProduits,
  blocsSupplementaires = [],
  vuesAdmin,
  collectionsSupplementaires = [],
  globalesSupplementaires = [],
  surcharges = {},
}: OptionsConfigCore): Config => {
  const livePreview = { breakpoints: pointsDeRupture }

  return {
    serverURL: site.urlSite,
    secret,
    db,
    sharp,
    editor: editeurTexteRiche,

    // L'interface d'administration est en francais et seulement en francais :
    // les clients sont des commercants francophones, pas des editeurs multilingues.
    i18n: {
      fallbackLanguage: 'fr',
      supportedLanguages: { fr: adminFr },
    },

    localization: {
      locales: site.langues.map((code) => ({ code, label: nomsLangues[code] })),
      defaultLocale: site.langueParDefaut,
      fallback: true,
    },

    admin: {
      user: Utilisateurs.slug,
      importMap: { baseDir: baseDirImportMap },
      livePreview,
      meta: {
        titleSuffix: ' — Administration',
      },
      ...(vuesAdmin ? { components: { views: vuesAdmin } } : {}),
    },

    collections: [
      Pages({
        slugsReserves: segmentsProduitsReserves(site),
        blocsSupplementaires,
        previsualisation: construirePrevisualisation(site, 'pages'),
        livePreview,
      }),
      Produits({
        allergenes: optionsProduits?.allergenes,
        ongletSupplementaire: optionsProduits?.ongletSupplementaire,
        previsualisation: construirePrevisualisation(site, 'produits'),
        livePreview,
      }),
      CategoriesProduits,
      Temoignages,
      Faq,
      Media({ dossier: dossierMedia }),
      Utilisateurs,
      ...collectionsSupplementaires,
    ],

    globals: [Etablissement, Navigation, ReglagesSeo, ...globalesSupplementaires],

    // Le site vitrine consomme Payload en local API : l'API GraphQL n'a aucun
    // usage ici et allonge inutilement le demarrage.
    graphQL: { disable: true },

    upload: {
      limits: { fileSize: 12_000_000 },
    },

    cors: [site.urlSite],
    csrf: [site.urlSite],

    typescript: cheminTypes ? { outputFile: cheminTypes } : undefined,

    ...surcharges,
  }
}
