import type { Payload, PayloadRequest } from 'payload'

import { creneauProposable } from '../domaine/creneaux'
import { calculerPanier } from './panier'
import { relation } from './relations'
import { estConflitUnicite, libererPlacesExpirees, reserverPlace } from './reservation'
import { lireReglages } from './reglages'
import type { CommandeCreee, LigneDemandee, ResultatCommande } from './types'

export type ClientCommande = {
  nom: string
  telephone: string
  email: string
}

export type DemandeCommande = {
  payload: Payload
  langue: string
  fuseau: string
  lignes: LigneDemandee[]
  client: ClientCommande
  /** Clé du créneau, telle que le serveur l'a émise. */
  creneau: string
  modePaiement: 'en_ligne' | 'sur_place'
  notes?: string | null
  maintenant?: Date
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const TELEPHONE = /^[+\d][\d\s.\-()]{7,}$/

const clientValide = (client: ClientCommande): boolean =>
  client.nom.trim().length >= 2 &&
  EMAIL.test(client.email.trim()) &&
  TELEPHONE.test(client.telephone.trim())

/** Nombre de reprises avant d'admettre que le créneau est réellement plein. */
const REPRISES_MAX = 5

type Transaction = { id: string | number | null; req: PayloadRequest }

const ouvrirTransaction = async (payload: Payload): Promise<Transaction> => {
  const id = (await payload.db.beginTransaction()) ?? null
  return { id, req: { transactionID: id ?? undefined } as unknown as PayloadRequest }
}

/**
 * Crée la commande et réserve sa place, ou n'en crée aucune.
 *
 * Toute la logique d'argent et de disponibilité est refaite ici à partir de la
 * base : le formulaire n'apporte que des identifiants de produits, des
 * quantités, un créneau et des coordonnées.
 *
 * La boucle de reprise entoure la transaction et ne s'exécute pas dedans :
 * quand deux clients visent la dernière place, le perdant heurte la contrainte
 * d'unicité, ce qui invalide sa transaction Postgres tout entière. La seule
 * issue correcte est de la rejouer depuis le début, pas de réessayer une
 * insertion dans une transaction déjà morte.
 */
export const creerCommandeAvecCreneau = async ({
  payload,
  langue,
  fuseau,
  lignes,
  client,
  creneau,
  modePaiement,
  notes,
  maintenant = new Date(),
}: DemandeCommande): Promise<ResultatCommande> => {
  if (!clientValide(client)) return { ok: false, erreur: 'coordonnees_invalides' }

  const reglages = await lireReglages(payload, fuseau)

  if (modePaiement === 'en_ligne' && !reglages.paiementEnLigne) {
    return { ok: false, erreur: 'paiement_indisponible' }
  }
  if (modePaiement === 'sur_place' && !reglages.paiementSurPlace) {
    return { ok: false, erreur: 'paiement_indisponible' }
  }

  const resultatPanier = await calculerPanier(payload, langue, lignes)
  if (!resultatPanier.ok) return resultatPanier

  const { panier } = resultatPanier

  // Le délai de préparation le plus long du panier prime sur le délai général.
  const delaiEffectif = Math.max(
    reglages.regles.delaiMinimumHeures,
    panier.delaiPreparationHeures,
  )

  const creneauRetenu = creneauProposable(
    creneau,
    { ...reglages.regles, delaiMinimumHeures: delaiEffectif },
    maintenant,
  )

  if (!creneauRetenu) {
    // Distinguer « trop tôt pour ce panier » de « créneau inexistant » évite un
    // message absurde quand le client a choisi un créneau valide en soi, mais
    // incompatible avec un produit long à préparer.
    const existeSansDelai = creneauProposable(
      creneau,
      { ...reglages.regles, delaiMinimumHeures: 0 },
      maintenant,
    )

    return {
      ok: false,
      erreur: existeSansDelai ? 'creneau_trop_tot' : 'creneau_invalide',
      details: existeSansDelai ? String(delaiEffectif) : undefined,
      reglages,
    }
  }

  const expireLe =
    modePaiement === 'en_ligne'
      ? new Date(maintenant.getTime() + reglages.minutesAvantExpiration * 60_000).toISOString()
      : null

  for (let essai = 0; essai <= REPRISES_MAX; essai++) {
    const transaction = await ouvrirTransaction(payload)

    try {
      await libererPlacesExpirees({ payload, req: transaction.req }, creneauRetenu.cle)

      const commande = (await payload.create({
        collection: 'commandes',
        overrideAccess: true,
        req: transaction.req,
        data: {
          client: {
            nom: client.nom.trim(),
            telephone: client.telephone.trim(),
            email: client.email.trim().toLowerCase(),
          },
          lignes: panier.lignes.map((ligne) => ({
            produit: relation(ligne.produit.id),
            nomProduit: ligne.produit.nom,
            quantite: ligne.quantite,
            prixUnitaireCentimes: ligne.prixUnitaireCentimes,
            totalLigneCentimes: ligne.totalLigneCentimes,
          })),
          creneauDebut: creneauRetenu.debut.toISOString(),
          creneauFin: creneauRetenu.fin.toISOString(),
          totalCentimes: panier.totalCentimes,
          statutPaiement: modePaiement === 'en_ligne' ? 'en_attente' : 'sur_place',
          statutCommande: 'nouvelle',
          notes: notes?.trim() || null,
          expireLe,
        },
      })) as unknown as CommandeCreee

      const reservation = await reserverPlace(
        { payload, req: transaction.req },
        creneauRetenu.cle,
        reglages.regles.capaciteParCreneau,
        commande.id,
        expireLe,
      )

      if (!reservation.ok) {
        if (transaction.id !== null) await payload.db.rollbackTransaction(transaction.id)
        return { ok: false, erreur: 'creneau_complet', reglages }
      }

      if (transaction.id !== null) await payload.db.commitTransaction(transaction.id)

      return { ok: true, commande, reglages, panier }
    } catch (erreur) {
      if (transaction.id !== null) await payload.db.rollbackTransaction(transaction.id)

      // Quelqu'un a pris la place pendant notre transaction : on rejoue.
      if (estConflitUnicite(erreur) && essai < REPRISES_MAX) continue

      if (estConflitUnicite(erreur)) return { ok: false, erreur: 'creneau_complet', reglages }

      console.error('[commande] création impossible', erreur)
      return { ok: false, erreur: 'erreur_interne', reglages }
    }
  }

  return { ok: false, erreur: 'creneau_complet', reglages }
}
