import type { Payload } from 'payload'

import { modeConnect } from './connect'
import { dateLocaleIso } from '../domaine/fuseau'
import type { JourRetrait } from '../domaine/creneaux'
import type { ReglagesCommande } from './types'

type GlobaleConfigCommande = {
  dureeCreneauMinutes?: number | null
  capaciteParCreneau?: number | null
  delaiMinimumHeures?: number | null
  horizonJours?: number | null
  minutesAvantExpiration?: number | null
  horairesRetrait?: JourRetrait[] | null
  joursFermes?: { date?: string | null; motif?: string | null }[] | null
  paiementEnLigne?: boolean | null
  paiementSurPlace?: boolean | null
  stripeCompteId?: string | null
  stripeChargesActives?: boolean | null
  messageConfirmation?: string | null
  emailCommercant?: string | null
}

/**
 * Lit les réglages de commande et les traduit en règles exploitables.
 *
 * Les jours fermés sont convertis en dates locales `AAAA-MM-JJ` : stockés en
 * UTC, un congé du 15 août saisi à Paris ressortirait sinon au 14 août pour le
 * calcul, et le commerce se retrouverait ouvert le jour où il voulait fermer.
 */
export const lireReglages = async (
  payload: Payload,
  fuseau: string,
): Promise<ReglagesCommande> => {
  const globale = (await payload.findGlobal({
    slug: 'config-commande',
    depth: 0,
    overrideAccess: true,
  })) as GlobaleConfigCommande

  const joursFermes = (globale.joursFermes ?? []).flatMap((entree) => {
    if (!entree.date) return []
    const date = new Date(entree.date)
    return Number.isNaN(date.getTime()) ? [] : [dateLocaleIso(date, fuseau)]
  })

  const compteStripe = globale.stripeCompteId ?? null

  /*
   * Le paiement en ligne demande deux choses : que le commerçant l'ait voulu,
   * et qu'il soit techniquement possible. En mode Connect, cela suppose un
   * compte lié et autorisé à encaisser ; sinon, une clé dans l'environnement.
   *
   * Retomber sur la clé de plateforme quand aucun compte n'est lié enverrait
   * les encaissements sur le compte de l'agence : ce cas est explicitement
   * exclu, quitte à refuser le paiement en ligne.
   */
  const encaissementPossible = modeConnect()
    ? Boolean(compteStripe && globale.stripeChargesActives)
    : Boolean(process.env.STRIPE_SECRET_KEY)

  return {
    regles: {
      dureeMinutes: globale.dureeCreneauMinutes ?? 15,
      capaciteParCreneau: globale.capaciteParCreneau ?? 4,
      delaiMinimumHeures: globale.delaiMinimumHeures ?? 2,
      horizonJours: globale.horizonJours ?? 7,
      horaires: globale.horairesRetrait ?? [],
      joursFermes,
      fuseau,
    },
    minutesAvantExpiration: globale.minutesAvantExpiration ?? 30,
    compteStripe,
    paiementEnLigne: Boolean(globale.paiementEnLigne) && encaissementPossible,
    paiementSurPlace: globale.paiementSurPlace !== false,
    messageConfirmation: globale.messageConfirmation ?? null,
    emailCommercant: globale.emailCommercant ?? null,
  }
}
