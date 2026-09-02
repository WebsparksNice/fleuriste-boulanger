import type { MetadataRoute } from 'next'

import type { ConfigSiteResolue } from '../config'
import { urlAbsolue } from '../config'
import type { ReglagesSeoDoc } from '../types'

type OptionsRobots = {
  config: ConfigSiteResolue
  reglages?: ReglagesSeoDoc | null
}

/**
 * robots.txt pilote depuis le CMS.
 *
 * Tant que la case « autoriser l'indexation » n'est pas cochee, tout le site est
 * interdit aux robots. C'est volontairement l'etat par defaut : un site de
 * preparation indexe par erreur met des semaines a sortir des resultats.
 */
export const construireRobots = ({ config, reglages }: OptionsRobots): MetadataRoute.Robots => {
  const autorise = reglages?.autoriserIndexation === true && !config.options.bloquerIndexation

  if (!autorise) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // L'admin et les routes techniques n'ont rien a faire dans l'index.
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: urlAbsolue(config, '/sitemap.xml'),
  }
}
