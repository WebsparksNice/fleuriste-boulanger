/**
 * Point d'entree du socle.
 *
 * Les sous-chemins (`@websparks/core/payload`, `/blocks`, `/seo`...) restent la
 * porte d'entree recommandee : ils evitent de tirer la configuration Payload
 * dans le bundle des pages publiques.
 */

export * from './config'
export * from './i18n'
export * from './theme'
export * from './lib'
export * from './types'
export { SiteLayout } from './layout'
