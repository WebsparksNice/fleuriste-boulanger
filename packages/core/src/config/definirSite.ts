import type { ConfigSite, ConfigSiteResolue } from './types'

/**
 * Point d'entree unique de la configuration d'un client.
 *
 * Un site client se resume a ce fichier plus son contenu dans Payload :
 * le socle ne contient aucune donnee propre a un commerce.
 */
export const definirSite = (config: ConfigSite): ConfigSiteResolue => {
  const [langueParDefaut] = config.langues

  return {
    ...config,
    urlSite: config.urlSite.replace(/\/$/, ''),
    langueParDefaut,
    fuseau: config.fuseau ?? 'Europe/Paris',
    options: {
      produitsParPage: config.options?.produitsParPage ?? 12,
      filDAriane: config.options?.filDAriane ?? true,
      bloquerIndexation: config.options?.bloquerIndexation ?? false,
    },
  }
}
