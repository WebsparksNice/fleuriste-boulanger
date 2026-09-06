import { lienVers, obtenirPage, obtenirProduit, type Langue } from '@websparks/core'
import { construireMetadata } from '@websparks/core/seo'
import type { Metadata } from 'next'

import { clientPayload, obtenirReglages } from '@/lib/contexte'
import { site } from '@/site.config'

/** Metadonnees d'une page composee dans l'admin. */
export const metadonneesPage = async (langue: Langue, slug: string): Promise<Metadata> => {
  const payload = await clientPayload()
  const [page, reglages] = await Promise.all([
    obtenirPage({ payload, langue, slug }),
    obtenirReglages(langue),
  ])

  return construireMetadata({
    config: site,
    langue,
    seo: page?.seo,
    titreParDefaut: page?.titre,
    reglages,
    chemin: lienVers(site, langue, slug),
  })
}

/** Metadonnees d'une fiche produit. */
export const metadonneesProduit = async (
  langue: Langue,
  slug: string,
  chemin: string,
): Promise<Metadata> => {
  const payload = await clientPayload()
  const [produit, reglages] = await Promise.all([
    obtenirProduit({ payload, langue, slug }),
    obtenirReglages(langue),
  ])

  return construireMetadata({
    config: site,
    langue,
    seo: produit?.seo,
    titreParDefaut: produit?.nom,
    reglages,
    chemin,
  })
}
