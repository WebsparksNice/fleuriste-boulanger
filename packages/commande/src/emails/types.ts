export type LigneEmail = {
  nom: string
  quantite: number
  totalLigneCentimes: number
}

export type DonneesEmail = {
  numero: string
  lignes: LigneEmail[]
  totalCentimes: number
  creneauDebut: Date
  creneauFin: Date
  client: { nom: string; telephone: string; email: string }
  notes?: string | null
  modePaiement: 'en_ligne' | 'sur_place'
  paye: boolean
  commerce: {
    nom: string
    adresse?: string | null
    telephone?: string | null
  }
  /** Message libre saisi dans les réglages des commandes. */
  messageConfirmation?: string | null
  /** Lien de suivi de la commande. */
  lienSuivi?: string | null
  langue: string
  fuseau: string
}

export type Courriel = {
  sujet: string
  html: string
  texte: string
}

export type GabaritsEmail = {
  confirmationClient: (donnees: DonneesEmail) => Courriel
  notificationCommercant: (donnees: DonneesEmail) => Courriel
}
