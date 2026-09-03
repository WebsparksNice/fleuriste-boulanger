import type { Payload } from 'payload'
import { Resend } from 'resend'

import type { DonneesEmail, GabaritsEmail } from '../emails/types'
import { lireCommerce } from './etablissement'
import type { ReglagesCommande } from './types'

/**
 * Envoi des e-mails de commande.
 *
 * Un échec d'envoi ne doit jamais faire échouer une commande déjà encaissée :
 * on journalise et on continue. Le commerçant retrouve la commande dans son
 * administration quoi qu'il arrive, et le client a vu la page de confirmation.
 */
export const envoyerEmailsCommande = async ({
  payload,
  gabarits,
  donnees,
  expediteur,
  reglages,
}: {
  payload: Payload
  gabarits: GabaritsEmail
  donnees: Omit<DonneesEmail, 'commerce'>
  expediteur?: string
  reglages: ReglagesCommande
}): Promise<void> => {
  const cle = process.env.RESEND_API_KEY

  if (!cle) {
    payload.logger.warn(
      `[commande ${donnees.numero}] RESEND_API_KEY absente : aucun e-mail envoyé.`,
    )
    return
  }

  const commerce = await lireCommerce(payload)
  const complet: DonneesEmail = { ...donnees, commerce }

  const de = expediteur ?? process.env.EMAIL_EXPEDITEUR
  if (!de) {
    payload.logger.warn(
      `[commande ${donnees.numero}] aucun expéditeur configuré : aucun e-mail envoyé.`,
    )
    return
  }

  const resend = new Resend(cle)
  const destinataireCommercant = reglages.emailCommercant ?? commerce.email

  const envois: Promise<unknown>[] = []

  const auClient = gabarits.confirmationClient(complet)
  envois.push(
    resend.emails.send({
      from: de,
      to: complet.client.email,
      subject: auClient.sujet,
      html: auClient.html,
      text: auClient.texte,
    }),
  )

  if (destinataireCommercant) {
    const auCommercant = gabarits.notificationCommercant(complet)
    envois.push(
      resend.emails.send({
        from: de,
        to: destinataireCommercant,
        subject: auCommercant.sujet,
        html: auCommercant.html,
        text: auCommercant.texte,
        // Le commerçant répond directement au client depuis sa boîte.
        replyTo: complet.client.email,
      }),
    )
  } else {
    payload.logger.warn(
      `[commande ${donnees.numero}] aucune adresse commerçant : notification non envoyée.`,
    )
  }

  const resultats = await Promise.allSettled(envois)
  for (const resultat of resultats) {
    if (resultat.status === 'rejected') {
      payload.logger.error(
        `[commande ${donnees.numero}] envoi d'e-mail en échec : ${String(resultat.reason)}`,
      )
    }
  }
}
