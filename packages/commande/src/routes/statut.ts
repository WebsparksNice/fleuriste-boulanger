import { getPayload } from 'payload'

import type { ModuleCommande } from '../config'
import { STATUTS_COMMANDE, type StatutCommande } from '../payload/statuts'

const STATUTS_VALIDES = new Set<string>(STATUTS_COMMANDE.map((statut) => statut.value))

const estStatutCommande = (valeur: string): valeur is StatutCommande => STATUTS_VALIDES.has(valeur)

/**
 * Changement de statut d'une commande depuis l'administration.
 *
 * Sert le tableau des commandes du jour : un bouton, un POST, un rechargement.
 * Pas de JavaScript, donc rien qui puisse échouer silencieusement quand le
 * commerçant est débordé derrière son comptoir.
 */
export const creerRouteStatutCommande = (module: ModuleCommande) => {
  const { site } = module

  return async (requete: Request): Promise<Response> => {
    const payload = await getPayload({ config: module.payloadConfig })
    const { user } = await payload.auth({ headers: requete.headers })

    if (!user) return new Response('Authentification requise.', { status: 401 })

    const donnees = await requete.formData()
    const commande = donnees.get('commande')
    const statut = donnees.get('statut')
    const retour = donnees.get('retour')

    if (typeof commande !== 'string' || typeof statut !== 'string') {
      return new Response('Requête incomplète.', { status: 400 })
    }

    if (!estStatutCommande(statut)) {
      return new Response('Statut inconnu.', { status: 400 })
    }

    await payload.update({
      collection: 'commandes',
      id: commande,
      data: { statutCommande: statut },
      user,
    })

    // Redirection interne uniquement : accepter une URL arbitraire ferait de
    // cette route un tremplin de hameçonnage depuis le domaine du commerce.
    const destination =
      typeof retour === 'string' && retour.startsWith('/') && !retour.startsWith('//')
        ? retour
        : '/admin'

    return Response.redirect(`${site.urlSite}${destination}`, 303)
  }
}
