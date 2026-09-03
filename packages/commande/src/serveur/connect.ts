import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import Stripe from 'stripe'


/**
 * Liaison du compte Stripe du commerçant, via Stripe Connect.
 *
 * Deux modes s'excluent, et le choix se fait par la seule présence de
 * STRIPE_CONNECT_CLIENT_ID :
 *
 * - **Connect** : l'agence enregistre une plateforme chez Stripe, chaque
 *   commerçant lie son propre compte depuis l'administration. Les paiements
 *   sont créés « au nom de » son compte : l'argent y arrive directement, sans
 *   jamais transiter par l'agence.
 * - **Clé directe** : un seul site, une clé dans l'environnement. Utile en
 *   développement et pour un client isolé.
 *
 * Les deux ne peuvent pas cohabiter, et c'est délibéré. Si une plateforme
 * Connect est déclarée mais qu'un client n'a rien lié, retomber sur la clé de
 * plateforme enverrait ses encaissements sur le compte de l'agence. Mieux vaut
 * refuser le paiement en ligne que de le diriger vers le mauvais compte.
 */

export {
  CHEMIN_CONFIRMATION_STRIPE,
  CHEMIN_CONNEXION_STRIPE,
  CHEMIN_DECONNEXION_STRIPE,
  CHEMIN_LIAISON_STRIPE,
  CHEMIN_RETOUR_STRIPE,
} from '../chemins'

/** Durée de validité d'un jeton d'échange, en millisecondes. */
const VALIDITE_JETON = 10 * 60 * 1000

export const modeConnect = (): boolean => Boolean(process.env.STRIPE_CONNECT_CLIENT_ID)

export const clientIdConnect = (): string | null => process.env.STRIPE_CONNECT_CLIENT_ID ?? null

const secret = (): string => process.env.PAYLOAD_SECRET ?? ''

type ContenuJeton = Record<string, string | number>

/**
 * Jeton signé, sans stockage serveur.
 *
 * Sert de paramètre `state` dans l'aller-retour OAuth, puis de laissez-passer
 * entre la page de confirmation et l'enregistrement. La signature est liée à
 * l'utilisateur qui a lancé la démarche : un jeton intercepté ne vaut rien pour
 * quelqu'un d'autre.
 */
export const signerJeton = (contenu: ContenuJeton): string => {
  // `_t` et `_z` sont préfixés pour ne jamais entrer en collision avec une clé
  // du contenu : `n` avait discrètement écrasé le nom du compte par le grain
  // aléatoire, et la page de confirmation affichait un identifiant technique.
  const charge = Buffer.from(
    JSON.stringify({ ...contenu, _t: Date.now(), _z: randomUUID() }),
  ).toString('base64url')
  const signature = createHmac('sha256', secret()).update(charge).digest('base64url')
  return `${charge}.${signature}`
}

export const verifierJeton = (jeton: string | null): ContenuJeton | null => {
  if (!jeton) return null

  const [charge, signature] = jeton.split('.')
  if (!charge || !signature) return null

  const attendue = createHmac('sha256', secret()).update(charge).digest('base64url')

  const recue = Buffer.from(signature)
  const calculee = Buffer.from(attendue)
  if (recue.length !== calculee.length || !timingSafeEqual(recue, calculee)) return null

  try {
    const contenu = JSON.parse(Buffer.from(charge, 'base64url').toString()) as ContenuJeton & {
      _t: number
    }
    if (typeof contenu._t !== 'number' || Date.now() - contenu._t > VALIDITE_JETON) return null
    return contenu
  } catch {
    return null
  }
}

/** URL d'autorisation Stripe, construite à la main : elle est stable et documentée. */
export const urlAutorisationStripe = (etat: string, urlRetour: string): string | null => {
  const clientId = clientIdConnect()
  if (!clientId) return null

  const parametres = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: 'read_write',
    state: etat,
    redirect_uri: urlRetour,
  })

  return `https://connect.stripe.com/oauth/authorize?${parametres.toString()}`
}

export type CompteConnecte = {
  id: string
  nom: string | null
  chargesActives: boolean
}

/** Échange le code d'autorisation contre l'identifiant du compte du commerçant. */
export const echangerCodeStripe = async (
  stripe: Stripe,
  code: string,
): Promise<CompteConnecte | null> => {
  const reponse = await stripe.oauth.token({ grant_type: 'authorization_code', code })
  const identifiant = reponse.stripe_user_id
  if (!identifiant) return null

  return detailsCompte(stripe, identifiant)
}

/** Nom lisible et état du compte, pour l'afficher dans l'administration. */
export const detailsCompte = async (
  stripe: Stripe,
  identifiant: string,
): Promise<CompteConnecte> => {
  try {
    const compte = await stripe.accounts.retrieve(identifiant)
    return {
      id: identifiant,
      nom:
        compte.business_profile?.name ??
        compte.settings?.dashboard?.display_name ??
        compte.email ??
        null,
      chargesActives: Boolean(compte.charges_enabled),
    }
  } catch {
    // Le compte peut avoir été délié côté Stripe : on garde l'identifiant, on
    // signale simplement qu'il n'encaisse pas.
    return { id: identifiant, nom: null, chargesActives: false }
  }
}

/** Révoque l'accès de la plateforme au compte du commerçant. */
export const revoquerCompte = async (stripe: Stripe, identifiant: string): Promise<void> => {
  const clientId = clientIdConnect()
  if (!clientId) return

  try {
    await stripe.oauth.deauthorize({ client_id: clientId, stripe_user_id: identifiant })
  } catch {
    // Déjà révoqué côté Stripe : rien à faire, on nettoie quand même côté site.
  }
}
