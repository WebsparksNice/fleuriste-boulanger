export const STATUTS_PAIEMENT = [
  { label: 'En attente de paiement', value: 'en_attente' },
  { label: 'Payée en ligne', value: 'payee' },
  { label: 'À régler sur place', value: 'sur_place' },
  { label: 'Remboursée', value: 'remboursee' },
] as const

export const STATUTS_COMMANDE = [
  { label: 'Nouvelle', value: 'nouvelle' },
  { label: 'Confirmée', value: 'confirmee' },
  { label: 'Prête', value: 'prete' },
  { label: 'Récupérée', value: 'recuperee' },
  { label: 'Annulée', value: 'annulee' },
] as const

export type StatutPaiement = (typeof STATUTS_PAIEMENT)[number]['value']
export type StatutCommande = (typeof STATUTS_COMMANDE)[number]['value']

/**
 * Statuts qui immobilisent une place dans un créneau.
 *
 * Une commande annulée libère sa place ; une commande en attente de paiement la
 * retient jusqu'à l'expiration de sa réservation.
 */
export const STATUTS_OCCUPANTS: StatutCommande[] = ['nouvelle', 'confirmee', 'prete', 'recuperee']
