import type { ConfigSiteResolue } from '@websparks/core'
import type { SanitizedConfig } from 'payload'

import { gabaritsParDefaut } from './emails/gabarits'
import type { GabaritsEmail } from './emails/types'

export type OptionsModuleCommande = {
  /** Configuration du site cliente, telle que produite par `definirSite`. */
  site: ConfigSiteResolue
  /** Configuration Payload de l'app, importée depuis `@payload-config`. */
  payloadConfig: Promise<SanitizedConfig> | SanitizedConfig
  /**
   * Expéditeur des e-mails, au format `Nom <adresse@domaine>`.
   * Le domaine doit être vérifié chez Resend.
   */
  expediteur?: string
  /** Gabarits d'e-mail à remplacer, partiellement ou en totalité. */
  emails?: Partial<GabaritsEmail>
}

export type ModuleCommande = {
  site: ConfigSiteResolue
  payloadConfig: Promise<SanitizedConfig> | SanitizedConfig
  expediteur?: string
  emails: GabaritsEmail
}

/**
 * Configure le module de commande pour un client.
 *
 * Appelée dans l'app, jamais dans le socle : c'est ce qui rend le module
 * réellement optionnel. Un client qui ne commande pas n'installe pas le paquet,
 * n'ajoute pas les routes, et rien de tout ceci n'entre dans son bundle.
 */
export const definirCommande = (options: OptionsModuleCommande): ModuleCommande => ({
  site: options.site,
  payloadConfig: options.payloadConfig,
  expediteur: options.expediteur,
  emails: { ...gabaritsParDefaut, ...options.emails },
})
