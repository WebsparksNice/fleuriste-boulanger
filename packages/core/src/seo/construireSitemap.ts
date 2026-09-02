import type { MetadataRoute } from 'next'
import type { Payload } from 'payload'

import type { ConfigSiteResolue } from '../config'
import { SLUG_ACCUEIL, lienListeProduits, lienProduit, lienVers, urlAbsolue } from '../config'
import type { Langue } from '../i18n'

type OptionsSitemap = {
  config: ConfigSiteResolue
  payload: Payload
}

type Entree = MetadataRoute.Sitemap[number]

/** Voir `enLocale` dans lib/donnees.ts : meme raison. */
type LocalePayload = Parameters<Payload['find']>[0]['locale']
const enLocale = (langue: Langue): LocalePayload => langue as unknown as LocalePayload

/**
 * Sitemap construit depuis le CMS.
 *
 * Les pages marquees `noindex` en sont exclues : annoncer a Google une URL que
 * l'on demande par ailleurs de ne pas indexer est contradictoire, et signale un
 * site mal tenu.
 *
 * Chaque entree porte ses equivalents dans les autres langues via `alternates`,
 * ce qui evite que Google traite les traductions comme du contenu duplique.
 */
export const construireSitemap = async ({
  config,
  payload,
}: OptionsSitemap): Promise<MetadataRoute.Sitemap> => {
  const entrees: Entree[] = []

  const alternatives = (chemins: Partial<Record<Langue, string>>) =>
    config.langues.length > 1
      ? {
          languages: Object.fromEntries(
            Object.entries(chemins).map(([langue, chemin]) => [
              langue,
              urlAbsolue(config, chemin as string),
            ]),
          ),
        }
      : undefined

  /* --- Pages --- */

  const parIdentifiant = new Map<string, Partial<Record<Langue, { slug: string; maj?: string }>>>()

  for (const langue of config.langues) {
    const { docs } = await payload.find({
      collection: 'pages',
      locale: enLocale(langue),
      depth: 0,
      limit: 1000,
      pagination: false,
      overrideAccess: false,
      where: {
        and: [{ _status: { equals: 'published' } }, { 'seo.noindex': { not_equals: true } }],
      },
      select: { slug: true, updatedAt: true },
    })

    for (const doc of docs as { id: string | number; slug?: string | null; updatedAt?: string | null }[]) {
      if (!doc.slug) continue
      const cle = String(doc.id)
      const existant = parIdentifiant.get(cle) ?? {}
      existant[langue] = { slug: doc.slug, maj: doc.updatedAt ?? undefined }
      parIdentifiant.set(cle, existant)
    }
  }

  for (const traductions of parIdentifiant.values()) {
    const chemins = Object.fromEntries(
      Object.entries(traductions).map(([langue, valeur]) => [
        langue,
        lienVers(config, langue as Langue, valeur?.slug),
      ]),
    ) as Partial<Record<Langue, string>>

    const cheminDefaut = chemins[config.langueParDefaut]
    if (!cheminDefaut) continue

    const traduction = traductions[config.langueParDefaut]

    entrees.push({
      url: urlAbsolue(config, cheminDefaut),
      lastModified: traduction?.maj ? new Date(traduction.maj) : undefined,
      changeFrequency: traduction?.slug === SLUG_ACCUEIL ? 'weekly' : 'monthly',
      priority: traduction?.slug === SLUG_ACCUEIL ? 1 : 0.7,
      alternates: alternatives(chemins),
    })
  }

  /* --- Listing produits --- */

  const cheminsListe = Object.fromEntries(
    config.langues.map((langue) => [langue, lienListeProduits(config, langue)]),
  ) as Partial<Record<Langue, string>>

  entrees.push({
    url: urlAbsolue(config, cheminsListe[config.langueParDefaut] as string),
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: alternatives(cheminsListe),
  })

  /* --- Fiches produit --- */

  const produitsParIdentifiant = new Map<
    string,
    Partial<Record<Langue, { slug: string; maj?: string }>>
  >()

  for (const langue of config.langues) {
    const { docs } = await payload.find({
      collection: 'produits',
      locale: enLocale(langue),
      depth: 0,
      limit: 1000,
      pagination: false,
      overrideAccess: false,
      where: {
        and: [{ _status: { equals: 'published' } }, { 'seo.noindex': { not_equals: true } }],
      },
      select: { slug: true, updatedAt: true },
    })

    for (const doc of docs as { id: string | number; slug?: string | null; updatedAt?: string | null }[]) {
      if (!doc.slug) continue
      const cle = String(doc.id)
      const existant = produitsParIdentifiant.get(cle) ?? {}
      existant[langue] = { slug: doc.slug, maj: doc.updatedAt ?? undefined }
      produitsParIdentifiant.set(cle, existant)
    }
  }

  for (const traductions of produitsParIdentifiant.values()) {
    const chemins = Object.fromEntries(
      Object.entries(traductions).map(([langue, valeur]) => [
        langue,
        lienProduit(config, langue as Langue, valeur?.slug as string),
      ]),
    ) as Partial<Record<Langue, string>>

    const cheminDefaut = chemins[config.langueParDefaut]
    if (!cheminDefaut) continue

    const traduction = traductions[config.langueParDefaut]

    entrees.push({
      url: urlAbsolue(config, cheminDefaut),
      lastModified: traduction?.maj ? new Date(traduction.maj) : undefined,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: alternatives(chemins),
    })
  }

  return entrees
}
