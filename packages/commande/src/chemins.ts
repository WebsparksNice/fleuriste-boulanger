/**
 * Chemins des routes du module.
 *
 * Isolés de tout code serveur : le bouton d'administration est un composant
 * client, et importer ces constantes depuis `serveur/connect.ts` entraînerait
 * `node:crypto` et le SDK Stripe dans le lot envoyé au navigateur.
 *
 * L'app cliente doit exposer ces chemins ; voir le README.
 */
export const CHEMIN_ENVOI_COMMANDE = '/api/commande'
export const CHEMIN_STATUT_COMMANDE = '/api/commande/statut'
export const CHEMIN_PANIER = '/api/commande/panier'
export const CHEMIN_WEBHOOK_STRIPE = '/api/commande/webhook-stripe'
export const CHEMIN_CONNEXION_STRIPE = '/api/commande/stripe/connexion'
export const CHEMIN_RETOUR_STRIPE = '/api/commande/stripe/retour'
export const CHEMIN_CONFIRMATION_STRIPE = '/api/commande/stripe/confirmer'
export const CHEMIN_LIAISON_STRIPE = '/api/commande/stripe/liaison'
export const CHEMIN_DECONNEXION_STRIPE = '/api/commande/stripe/deconnexion'
export const CHEMIN_ETAT_STRIPE = '/api/commande/stripe/etat'
