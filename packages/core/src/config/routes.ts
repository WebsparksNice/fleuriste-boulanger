import type { Langue } from '../i18n'
import type { ConfigSiteResolue } from './types'

/** Slug reserve dans la collection `pages` : il est servi par `/` . */
export const SLUG_ACCUEIL = 'accueil'

/** Segments par defaut de la section produits, si le client ne les surcharge pas. */
const segmentsProduitsParDefaut: Record<Langue, string> = {
  fr: 'produits',
  en: 'products',
  es: 'productos',
  de: 'produkte',
  it: 'prodotti',
  nl: 'producten',
}

/** Segment d'URL de la section produits pour une langue donnee. */
export const segmentProduits = (config: ConfigSiteResolue, langue: Langue): string =>
  config.routes?.produits?.[langue] ?? segmentsProduitsParDefaut[langue]

/**
 * Tous les segments produits, toutes langues confondues.
 * Sert a interdire ces slugs dans la collection `pages`.
 */
export const segmentsProduitsReserves = (config: ConfigSiteResolue): string[] =>
  config.langues.map((langue) => segmentProduits(config, langue))

/**
 * Construit un chemin interne, prefixe de la langue sauf pour la langue par defaut.
 * `lienVers(config, 'fr', 'contact')` -> `/contact`
 * `lienVers(config, 'en', 'contact')` -> `/en/contact`
 */
export const lienVers = (
  config: ConfigSiteResolue,
  langue: Langue,
  ...segments: (string | undefined | null)[]
): string => {
  const parties = segments
    .filter((segment): segment is string => Boolean(segment))
    .flatMap((segment) => segment.split('/'))
    .filter(Boolean)
    .filter((segment) => segment !== SLUG_ACCUEIL)

  if (langue !== config.langueParDefaut) parties.unshift(langue)

  return `/${parties.join('/')}`.replace(/\/$/, '') || '/'
}

/** Chemin de la fiche d'un produit. */
export const lienProduit = (config: ConfigSiteResolue, langue: Langue, slug: string): string =>
  lienVers(config, langue, segmentProduits(config, langue), slug)

/** Chemin du listing produits. */
export const lienListeProduits = (config: ConfigSiteResolue, langue: Langue): string =>
  lienVers(config, langue, segmentProduits(config, langue))

/** URL absolue, pour les balises canoniques, le sitemap et le JSON-LD. */
export const urlAbsolue = (config: ConfigSiteResolue, chemin: string): string =>
  `${config.urlSite}${chemin === '/' ? '' : chemin}` || config.urlSite
