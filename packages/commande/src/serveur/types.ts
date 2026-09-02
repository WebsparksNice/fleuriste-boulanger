import type { ConfigSiteResolue } from '@websparks/core'
import type { Payload } from 'payload'

import type { ReglesCreneaux } from '../domaine/creneaux'
import type { StatutCommande, StatutPaiement } from '../payload/statuts'

export type ProduitCommandable = {
  id: string | number
  nom: string
  slug?: string | null
  prixCentimes: number
  disponible: boolean
  delaiPreparationHeures: number
  quantiteMaxParCommande: number
  noteCommande?: string | null
  imagePrincipale?: unknown
  allergenes?: string[] | null
}

export type LigneDemandee = {
  produitId: string | number
  quantite: number
}

export type LigneCalculee = {
  produit: ProduitCommandable
  quantite: number
  prixUnitaireCentimes: number
  totalLigneCentimes: number
}

export type PanierCalcule = {
  lignes: LigneCalculee[]
  totalCentimes: number
  /** Délai de préparation à respecter, en heures : le plus long du panier. */
  delaiPreparationHeures: number
}

export type ReglagesCommande = {
  regles: ReglesCreneaux
  minutesAvantExpiration: number
  paiementEnLigne: boolean
  paiementSurPlace: boolean
  messageConfirmation?: string | null
  emailCommercant?: string | null
}

export type ContexteCommande = {
  payload: Payload
  site: ConfigSiteResolue
  langue: string
}

export type SuccesCommande = {
  ok: true
  commande: CommandeCreee
  reglages: ReglagesCommande
  panier: PanierCalcule
}

export type EchecCommande = {
  ok: false
  erreur: CodeErreurCommande
  details?: string
  /** Présents dès que la lecture des réglages a abouti. */
  reglages?: ReglagesCommande
}

export type ResultatCommande = SuccesCommande | EchecCommande

export type CommandeCreee = {
  id: string | number
  numero: string
  jeton: string
  totalCentimes: number
  creneauDebut: string
  creneauFin: string
  statutPaiement: StatutPaiement
  statutCommande: StatutCommande
}

export type CodeErreurCommande =
  | 'panier_vide'
  | 'produit_indisponible'
  | 'quantite_invalide'
  | 'creneau_invalide'
  | 'creneau_complet'
  | 'creneau_trop_tot'
  | 'coordonnees_invalides'
  | 'paiement_indisponible'
  | 'erreur_interne'
