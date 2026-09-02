import type { Payload } from 'payload'

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
    paiementEnLigne: Boolean(globale.paiementEnLigne),
    paiementSurPlace: globale.paiementSurPlace !== false,
    messageConfirmation: globale.messageConfirmation ?? null,
    emailCommercant: globale.emailCommercant ?? null,
  }
}
