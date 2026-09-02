import type { Payload, PayloadRequest } from 'payload'

import { STATUTS_OCCUPANTS } from '../payload/statuts'
import { relation } from './relations'

/** Code Postgres d'une violation de contrainte d'unicité. */
const CONFLIT_UNICITE = '23505'

/** Champs de l'index unique qui porte la garantie de capacité. */
const CHAMPS_INDEX = ['creneau', 'position']

const enTexte = (valeur: unknown): string => {
  if (valeur === undefined || valeur === null) return ''
  if (typeof valeur === 'string') return valeur
  try {
    return JSON.stringify(valeur)
  } catch {
    return ''
  }
}

/**
 * Reconnaît la collision de deux réservations sur la même place.
 *
 * Payload n'expose pas la violation Postgres telle quelle : il l'intercepte et
 * la reformule en erreur de validation. Trois choses interdisent de la
 * reconnaître autrement que par les noms de champs de l'index :
 *
 * - le code SQL a disparu de l'erreur reformulée ;
 * - son message est traduit dans la langue de l'administration ;
 * - le nom de la classe d'erreur est illisible après minification du build de
 *   production, où `ValidationError` devient une lettre.
 *
 * D'où le couplage assumé avec `creneau` et `position`. Le code SQL brut reste
 * testé en premier : il remonte tel quel quand l'insertion échappe à la couche
 * de validation.
 */
export const estConflitUnicite = (erreur: unknown): boolean => {
  if (!erreur || typeof erreur !== 'object') return false

  const candidat = erreur as { code?: unknown; cause?: unknown; message?: unknown; data?: unknown }

  if (candidat.code === CONFLIT_UNICITE) return true

  const texte = `${enTexte(candidat.message)} ${enTexte(candidat.data)}`
  if (texte.includes('duplicate key')) return true
  if (CHAMPS_INDEX.every((champ) => texte.includes(champ))) return true

  return candidat.cause ? estConflitUnicite(candidat.cause) : false
}

type ContexteTransaction = {
  payload: Payload
  req: PayloadRequest
}

/**
 * Rend les places dont la réservation a expiré, pour un créneau donné.
 *
 * Une commande dont le paiement en ligne n'a jamais abouti ne doit pas bloquer
 * indéfiniment une place. On la marque annulée au passage, pour que le
 * commerçant comprenne pourquoi elle figure dans sa liste sans jamais avoir été
 * réglée.
 */
export const libererPlacesExpirees = async (
  { payload, req }: ContexteTransaction,
  creneau: string,
): Promise<void> => {
  const { docs } = await payload.find({
    collection: 'reservations-creneaux',
    depth: 0,
    limit: 100,
    pagination: false,
    overrideAccess: true,
    req,
    where: {
      and: [{ creneau: { equals: creneau } }, { expireLe: { less_than: new Date().toISOString() } }],
    },
  })

  for (const reservation of docs as { id: string | number; commande?: unknown }[]) {
    const commandeId =
      typeof reservation.commande === 'object' && reservation.commande !== null
        ? (reservation.commande as { id: string | number }).id
        : reservation.commande

    if (commandeId !== undefined && commandeId !== null) {
      await payload.update({
        collection: 'commandes',
        id: commandeId as string | number,
        data: { statutCommande: 'annulee' },
        overrideAccess: true,
        req,
      })
    }

    await payload.delete({
      collection: 'reservations-creneaux',
      id: reservation.id,
      overrideAccess: true,
      req,
    })
  }
}

/** Nombre de places réellement occupées sur un créneau. */
export const placesOccupees = async (
  { payload, req }: ContexteTransaction,
  creneau: string,
): Promise<number> => {
  const { totalDocs } = await payload.count({
    collection: 'reservations-creneaux',
    overrideAccess: true,
    req,
    where: { creneau: { equals: creneau } },
  })

  return totalDocs
}

/**
 * Places restantes sur une liste de créneaux, pour l'affichage.
 *
 * Cette vue est indicative : entre son calcul et la validation, une place peut
 * partir. La garantie tient à la contrainte d'unicité posée lors de la
 * réservation, pas à ce comptage.
 */
export const compterParCreneau = async (
  payload: Payload,
  creneaux: string[],
): Promise<Map<string, number>> => {
  const compte = new Map<string, number>()
  if (creneaux.length === 0) return compte

  const { docs } = await payload.find({
    collection: 'reservations-creneaux',
    depth: 1,
    limit: 5000,
    pagination: false,
    overrideAccess: true,
    where: {
      and: [
        { creneau: { in: creneaux } },
        {
          or: [
            { expireLe: { exists: false } },
            { expireLe: { greater_than: new Date().toISOString() } },
          ],
        },
      ],
    },
  })

  for (const reservation of docs as { creneau?: string; commande?: { statutCommande?: string } }[]) {
    // Une commande annulée n'occupe plus sa place, même si la ligne subsiste
    // jusqu'à la prochaine purge.
    const statut = reservation.commande?.statutCommande
    if (statut && !STATUTS_OCCUPANTS.includes(statut as never)) continue
    if (!reservation.creneau) continue

    const cle = new Date(reservation.creneau).toISOString()
    compte.set(cle, (compte.get(cle) ?? 0) + 1)
  }

  return compte
}

/**
 * Insère une place dans un créneau, à la première position libre.
 *
 * L'appelant doit être dans une transaction : si l'insertion échoue sur la
 * contrainte d'unicité, Postgres invalide toute la transaction en cours, et il
 * faut la rejouer entièrement plutôt que réessayer ici. C'est
 * `creerCommandeAvecCreneau` qui porte cette boucle de reprise.
 */
export const reserverPlace = async (
  contexte: ContexteTransaction,
  creneau: string,
  capacite: number,
  commandeId: string | number,
  expireLe: string | null,
): Promise<{ ok: true; position: number } | { ok: false; raison: 'complet' }> => {
  const occupees = await placesOccupees(contexte, creneau)
  if (occupees >= capacite) return { ok: false, raison: 'complet' }

  await contexte.payload.create({
    collection: 'reservations-creneaux',
    data: {
      creneau,
      position: occupees,
      commande: relation(commandeId),
      expireLe,
    },
    overrideAccess: true,
    req: contexte.req,
  })

  return { ok: true, position: occupees }
}
