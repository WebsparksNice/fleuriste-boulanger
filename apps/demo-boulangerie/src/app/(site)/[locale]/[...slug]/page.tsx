import { FormulaireCommande, PageConfirmationCommande } from '@websparks/commande/blocks'
import { SEGMENT_CONFIRMATION } from '@websparks/commande/routes'
import {
  SLUG_ACCUEIL,
  lienProduit,
  listerPagesPubliees,
  segmentCommande,
  segmentProduits,
} from '@websparks/core'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { FicheProduit } from '@/composants/FicheProduit'
import { ListeProduits } from '@/composants/ListeProduits'
import { PageCms } from '@/composants/PageCms'
import { clientPayload, obtenirContexte, resoudreLangue } from '@/lib/contexte'
import { metadonneesPage, metadonneesProduit } from '@/lib/metadonnees'
import { site } from '@/site.config'

type Parametres = {
  params: Promise<{ locale: string; slug?: string[] }>
  searchParams: Promise<{
    categorie?: string
    page?: string
    erreur?: string
    detail?: string
    panier?: string
    numero?: string
    jeton?: string
  }>
}

/**
 * Route attrape-tout du site public.
 *
 * La section produits n'a pas de dossier dedie parce que son segment d'URL est
 * configurable et traduit (`/nos-pains`, `/en/our-breads`) : un dossier fige ne
 * pourrait pas suivre. On dispatche donc ici, apres avoir compare le premier
 * segment a celui declare dans `site.config.ts`.
 */
const analyser = (langue: ReturnType<typeof resoudreLangue>, segments: string[]) => {
  const segment = segmentProduits(site, langue)

  if (segments[0] === segment) {
    if (segments.length === 1) return { type: 'liste-produits' as const }
    if (segments.length === 2) return { type: 'produit' as const, slug: segments[1] as string }
    return { type: 'inconnu' as const }
  }

  // Section commande, présente uniquement si le module est activé.
  if (site.modules?.commande && segments[0] === segmentCommande(site, langue)) {
    if (segments.length === 1) return { type: 'commande' as const }
    if (segments.length === 2 && segments[1] === SEGMENT_CONFIRMATION) {
      return { type: 'confirmation-commande' as const }
    }
    return { type: 'inconnu' as const }
  }

  if (segments.length === 1 && segments[0] !== SLUG_ACCUEIL) {
    return { type: 'page' as const, slug: segments[0] as string }
  }

  return { type: 'inconnu' as const }
}

/**
 * Chemins pre-rendus au build.
 *
 * En cas de base indisponible (build sans acces Postgres), on renvoie une liste
 * vide : les pages sont alors rendues a la demande puis mises en cache, plutot
 * que de faire echouer tout le deploiement.
 */
export const generateStaticParams = async () => {
  try {
    const payload = await clientPayload()
    const parametres: { locale: string; slug: string[] }[] = []

    for (const locale of site.langues) {
      const pages = await listerPagesPubliees({ payload, langue: locale })
      for (const page of pages) {
        if (page.slug && page.slug !== SLUG_ACCUEIL) {
          parametres.push({ locale, slug: [page.slug] })
        }
      }
      parametres.push({ locale, slug: [segmentProduits(site, locale)] })
    }

    return parametres
  } catch {
    return []
  }
}

export const generateMetadata = async ({ params }: Parametres): Promise<Metadata> => {
  const { locale, slug = [] } = await params
  const langue = resoudreLangue(locale)
  const route = analyser(langue, slug)

  if (route.type === 'produit') {
    return metadonneesProduit(langue, route.slug, lienProduit(site, langue, route.slug))
  }

  if (route.type === 'liste-produits') {
    return metadonneesPage(langue, segmentProduits(site, langue))
  }

  if (route.type === 'page') return metadonneesPage(langue, route.slug)

  if (route.type === 'commande' || route.type === 'confirmation-commande') {
    // Une page de commande n'a rien à faire dans un index de recherche : son
    // contenu dépend de l'heure, et la confirmation est propre à un client.
    return { robots: { index: false, follow: false } }
  }

  return {}
}

const PageDynamique = async ({ params, searchParams }: Parametres) => {
  const { locale, slug = [] } = await params
  const langue = resoudreLangue(locale)
  const route = analyser(langue, slug)

  switch (route.type) {
    case 'liste-produits': {
      const { categorie, page } = await searchParams
      return <ListeProduits langue={langue} categorie={categorie} page={page} />
    }
    case 'produit':
      return <FicheProduit langue={langue} slug={route.slug} />
    case 'commande': {
      // Lire les paramètres suffit à sortir du rendu statique : les créneaux
      // dépendent de l'instant et ne doivent jamais être servis depuis un cache.
      const { erreur, detail, panier } = await searchParams
      const contexte = await obtenirContexte(langue)
      return (
        <FormulaireCommande
          config={site}
          contexte={contexte}
          erreur={erreur}
          detail={detail}
          panier={panier}
        />
      )
    }
    case 'confirmation-commande': {
      const { numero, jeton } = await searchParams
      const contexte = await obtenirContexte(langue)
      return (
        <PageConfirmationCommande
          config={site}
          contexte={contexte}
          numero={numero}
          jeton={jeton}
        />
      )
    }
    case 'page':
      return <PageCms langue={langue} slug={route.slug} />
    default:
      notFound()
  }
}

export default PageDynamique
