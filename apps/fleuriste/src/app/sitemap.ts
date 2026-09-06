import { construireSitemap } from '@websparks/core/seo'
import type { MetadataRoute } from 'next'

import { clientPayload } from '@/lib/contexte'
import { site } from '@/site.config'

/**
 * Sitemap genere depuis le CMS.
 *
 * En cas de base injoignable au moment du build, on renvoie la seule page
 * d'accueil : un sitemap minimal vaut mieux qu'un deploiement en echec.
 */
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  try {
    const payload = await clientPayload()
    return await construireSitemap({ config: site, payload })
  } catch {
    return [{ url: site.urlSite, changeFrequency: 'weekly', priority: 1 }]
  }
}

export default sitemap
