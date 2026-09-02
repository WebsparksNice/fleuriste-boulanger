import { construireRobots } from '@websparks/core/seo'
import type { MetadataRoute } from 'next'

import { obtenirReglages } from '@/lib/contexte'
import { site } from '@/site.config'

/**
 * robots.txt pilote depuis l'admin.
 *
 * Si les reglages sont inaccessibles, on interdit l'indexation : en cas de
 * doute, mieux vaut un site invisible qu'un site de preparation reference.
 */
const robots = async (): Promise<MetadataRoute.Robots> => {
  try {
    const reglages = await obtenirReglages(site.langueParDefaut)
    return construireRobots({ config: site, reglages })
  } catch {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }
}

export default robots
