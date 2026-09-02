import payloadConfig from '@payload-config'
import { definirCommande } from '@websparks/commande'

import { site } from './site.config'

/**
 * Branchement du module de commande pour ce client.
 *
 * Les gabarits d'e-mail peuvent être remplacés ici, un par un, sans toucher au
 * module : `emails: { confirmationClient: (donnees) => ({ sujet, html, texte }) }`.
 */
export const commande = definirCommande({
  site,
  payloadConfig,
  expediteur: process.env.EMAIL_EXPEDITEUR,
})
