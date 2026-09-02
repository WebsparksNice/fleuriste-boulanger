import type { ConfigSiteResolue } from '../config'
import { estLangue, type Langue } from '../i18n'
import { lienProduit, lienVers, SLUG_ACCUEIL } from '../config'

/** Chemin de la route qui active le mode brouillon de Next. */
export const CHEMIN_PREVISUALISATION = '/api/previsualisation'

export const secretPrevisualisation = (): string =>
  process.env.PREVIEW_SECRET ?? process.env.PAYLOAD_SECRET ?? ''

type DocumentPrevisualisable = {
  slug?: string | null
}

/** Chemin public d'un document, selon sa collection et sa langue. */
export const cheminPublic = (
  config: ConfigSiteResolue,
  collection: string,
  slug: string,
  langue: Langue,
): string => {
  if (collection === 'produits') return lienProduit(config, langue, slug)
  return lienVers(config, langue, slug)
}

/**
 * Construit l'URL du bouton « Previsualiser » de l'admin.
 *
 * On ne pointe pas directement sur la page : on passe par une route qui active
 * `draftMode`, sans quoi le rendu statique renverrait la derniere version
 * publiee au lieu du brouillon en cours.
 */
export const construirePrevisualisation =
  (config: ConfigSiteResolue, collection: string) =>
  (doc: unknown, { locale }: { locale?: string } = {}): string => {
    const { slug } = (doc ?? {}) as DocumentPrevisualisable
    const langue = estLangue(locale) ? locale : config.langueParDefaut
    const chemin = cheminPublic(config, collection, slug ?? SLUG_ACCUEIL, langue)

    const parametres = new URLSearchParams({
      secret: secretPrevisualisation(),
      chemin,
      collection,
      slug: slug ?? SLUG_ACCUEIL,
    })

    return `${config.urlSite}${CHEMIN_PREVISUALISATION}?${parametres.toString()}`
  }

/** Tailles d'ecran proposees dans l'apercu en direct de l'admin. */
export const pointsDeRupture = [
  { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
  { label: 'Tablette', name: 'tablette', width: 834, height: 1112 },
  { label: 'Ordinateur', name: 'ordinateur', width: 1440, height: 900 },
]
