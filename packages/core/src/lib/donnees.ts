import { cache } from 'react'
import type { Payload, Where } from 'payload'

import type { Langue } from '../i18n'
import type {
  CategorieDoc,
  EtablissementDoc,
  FaqDoc,
  NavigationDoc,
  PageDoc,
  ProduitDoc,
  ReglagesSeoDoc,
  TemoignageDoc,
} from '../types'

/**
 * Acces aux donnees via l'API locale de Payload.
 *
 * Aucun appel HTTP : Payload tourne dans le meme processus que Next, la requete
 * part directement en base. Les fonctions sont enveloppees dans `cache()` de
 * React, ce qui dedoublonne les appels a l'interieur d'un meme rendu (l'en-tete,
 * le pied de page et un bloc Contact ne lisent la fiche Etablissement qu'une fois).
 *
 * `overrideAccess: false` est explicite partout : l'API locale contourne le
 * controle d'acces par defaut, ce qui exposerait les brouillons au public.
 */

type Contexte = {
  payload: Payload
  langue: Langue
  brouillon?: boolean
}

/**
 * Payload derive le type de `locale` des langues declarees dans l'app cliente.
 * Le socle, lui, est ecrit pour n'importe quelle combinaison de langues : on
 * convertit donc explicitement, plutot que de contraindre le socle aux langues
 * d'un client particulier.
 */
type LocalePayload = Parameters<Payload['find']>[0]['locale']

const enLocale = (langue: Langue): LocalePayload => langue as unknown as LocalePayload

/** Ne renvoyer que le contenu publie, sauf en previsualisation. */
const filtrePublication = (brouillon?: boolean): Where | undefined =>
  brouillon ? undefined : { _status: { equals: 'published' } }

const fusionner = (...clauses: (Where | undefined)[]): Where | undefined => {
  const retenues = clauses.filter((clause): clause is Where => Boolean(clause))
  if (retenues.length === 0) return undefined
  if (retenues.length === 1) return retenues[0]
  return { and: retenues }
}

/* --- Globales --- */

export const obtenirEtablissement = cache(
  async ({ payload, langue }: Contexte): Promise<EtablissementDoc | null> =>
    (await payload.findGlobal({
      slug: 'etablissement',
      locale: enLocale(langue),
      depth: 1,
      overrideAccess: false,
    })) as EtablissementDoc | null,
)

export const obtenirNavigation = cache(
  async ({ payload, langue }: Contexte): Promise<NavigationDoc | null> =>
    (await payload.findGlobal({
      slug: 'navigation',
      locale: enLocale(langue),
      // Profondeur 2 : les liens internes portent une relation vers `pages`,
      // dont on a besoin du slug pour construire les href.
      depth: 2,
      overrideAccess: false,
    })) as NavigationDoc | null,
)

export const obtenirReglagesSeo = cache(
  async ({ payload, langue }: Contexte): Promise<ReglagesSeoDoc | null> =>
    (await payload.findGlobal({
      slug: 'reglages-seo',
      locale: enLocale(langue),
      depth: 1,
      overrideAccess: false,
    })) as ReglagesSeoDoc | null,
)

/* --- Pages --- */

export const obtenirPage = cache(
  async ({ payload, langue, brouillon, slug }: Contexte & { slug: string }): Promise<PageDoc | null> => {
    const { docs } = await payload.find({
      collection: 'pages',
      locale: enLocale(langue),
      draft: Boolean(brouillon),
      overrideAccess: Boolean(brouillon),
      depth: 2,
      limit: 1,
      pagination: false,
      where: fusionner({ slug: { equals: slug } }, filtrePublication(brouillon)),
    })

    return (docs[0] as PageDoc | undefined) ?? null
  },
)

/** Slugs de toutes les pages publiees, pour `generateStaticParams` et le sitemap. */
export const listerPagesPubliees = cache(
  async ({ payload, langue }: Contexte): Promise<PageDoc[]> => {
    const { docs } = await payload.find({
      collection: 'pages',
      locale: enLocale(langue),
      depth: 0,
      limit: 500,
      pagination: false,
      overrideAccess: false,
      where: filtrePublication(false),
      select: { slug: true, updatedAt: true, seo: true, titre: true },
    })

    return docs as PageDoc[]
  },
)

/* --- Produits --- */

export const obtenirProduit = cache(
  async ({
    payload,
    langue,
    brouillon,
    slug,
  }: Contexte & { slug: string }): Promise<ProduitDoc | null> => {
    const { docs } = await payload.find({
      collection: 'produits',
      locale: enLocale(langue),
      draft: Boolean(brouillon),
      overrideAccess: Boolean(brouillon),
      depth: 2,
      limit: 1,
      pagination: false,
      where: fusionner({ slug: { equals: slug } }, filtrePublication(brouillon)),
    })

    return (docs[0] as ProduitDoc | undefined) ?? null
  },
)

export type FiltreProduits = Contexte & {
  /** Identifiant de categorie, ou slug. */
  categorie?: string | number | null
  misEnAvant?: boolean
  ids?: (string | number)[]
  limite?: number
  page?: number
}

export const listerProduits = cache(
  async ({
    payload,
    langue,
    brouillon,
    categorie,
    misEnAvant,
    ids,
    limite = 12,
    page = 1,
  }: FiltreProduits): Promise<{ produits: ProduitDoc[]; total: number; pages: number }> => {
    const clauses: (Where | undefined)[] = [filtrePublication(brouillon)]
    if (categorie) clauses.push({ categorie: { equals: categorie } })
    if (misEnAvant) clauses.push({ miseEnAvant: { equals: true } })
    if (ids?.length) clauses.push({ id: { in: ids } })

    const resultat = await payload.find({
      collection: 'produits',
      locale: enLocale(langue),
      draft: Boolean(brouillon),
      overrideAccess: Boolean(brouillon),
      depth: 1,
      limit: limite,
      page,
      sort: ['ordre', 'nom'],
      where: fusionner(...clauses),
    })

    const produits = resultat.docs as ProduitDoc[]

    // Une selection manuelle doit respecter l'ordre choisi par l'editeur,
    // que la base ne connait pas.
    const ordonnes = ids?.length
      ? ids.flatMap((id) => produits.filter((produit) => String(produit.id) === String(id)))
      : produits

    return { produits: ordonnes, total: resultat.totalDocs, pages: resultat.totalPages }
  },
)

export const listerCategories = cache(
  async ({ payload, langue }: Contexte): Promise<CategorieDoc[]> => {
    const { docs } = await payload.find({
      collection: 'categories-produits',
      locale: enLocale(langue),
      depth: 0,
      limit: 100,
      pagination: false,
      overrideAccess: false,
      sort: ['ordre', 'nom'],
    })

    return docs as CategorieDoc[]
  },
)

/* --- Temoignages et FAQ --- */

export const listerTemoignages = cache(
  async ({
    payload,
    langue,
    ids,
    limite = 3,
  }: Contexte & { ids?: (string | number)[]; limite?: number }): Promise<TemoignageDoc[]> => {
    const { docs } = await payload.find({
      collection: 'temoignages',
      locale: enLocale(langue),
      depth: 0,
      limit: ids?.length ? ids.length : limite,
      overrideAccess: false,
      sort: '-date',
      where: fusionner(
        { visible: { equals: true } },
        ids?.length ? { id: { in: ids } } : undefined,
      ),
    })

    const temoignages = docs as TemoignageDoc[]

    return ids?.length
      ? ids.flatMap((id) => temoignages.filter((doc) => String(doc.id) === String(id)))
      : temoignages
  },
)

export const listerFaq = cache(
  async ({ payload, langue, ids }: Contexte & { ids?: (string | number)[] }): Promise<FaqDoc[]> => {
    const { docs } = await payload.find({
      collection: 'faq',
      locale: enLocale(langue),
      depth: 0,
      limit: 100,
      pagination: false,
      overrideAccess: false,
      sort: ['ordre', 'question'],
      where: ids?.length ? { id: { in: ids } } : undefined,
    })

    const questions = docs as FaqDoc[]

    return ids?.length
      ? ids.flatMap((id) => questions.filter((doc) => String(doc.id) === String(id)))
      : questions
  },
)
