import { getPayload } from 'payload'

import type { ModuleCommande } from '../config'
import { lirePanier, ecrirePanier, viderPanier } from '../serveur/session'

type Action = 'ajouter' | 'definir' | 'retirer' | 'vider'

const ACTIONS = new Set<string>(['ajouter', 'definir', 'retirer', 'vider'])

const texte = (donnees: FormData, champ: string): string => {
  const valeur = donnees.get(champ)
  return typeof valeur === 'string' ? valeur : ''
}

/**
 * Modifie le panier.
 *
 * Un formulaire, une route, une redirection : le visiteur peut composer sa
 * commande sans que la page n'exécute la moindre ligne de JavaScript. Chaque
 * bouton « ajouter » est un formulaire à part entière.
 *
 * La quantité est bornée par ce que dit la fiche produit, pas par ce
 * qu'annonce le formulaire : le champ caché du navigateur ne fait pas foi.
 */
export const creerRoutePanier = (module: ModuleCommande) => {
  const { site } = module

  return async (requete: Request): Promise<Response> => {
    const donnees = await requete.formData()
    const action = texte(donnees, 'action')

    /*
     * Où renvoyer le visiteur. Le champ du formulaire prime, sinon on reprend
     * la page d'où il vient : cela évite d'avoir à connaître l'adresse courante
     * au moment de dessiner chaque bouton « ajouter ».
     *
     * Dans les deux cas la destination doit être interne. Suivre une adresse
     * arbitraire ferait de cette route un tremplin de hameçonnage, depuis le
     * domaine du commerce.
     */
    const interne = (chemin: string) => chemin.startsWith('/') && !chemin.startsWith('//')

    const provenance = requete.headers.get('referer')
    const cheminProvenance = (() => {
      if (!provenance) return null
      try {
        const url = new URL(provenance)
        return url.origin === new URL(site.urlSite).origin ? `${url.pathname}${url.search}` : null
      } catch {
        return null
      }
    })()

    const demande = texte(donnees, 'retour')
    const retour = interne(demande) ? demande : (cheminProvenance ?? '/')
    const versRetour = () => Response.redirect(`${site.urlSite}${retour}`, 303)

    if (!ACTIONS.has(action)) return versRetour()

    if ((action as Action) === 'vider') {
      await viderPanier()
      return versRetour()
    }

    const produitId = texte(donnees, 'produit')
    if (!produitId) return versRetour()

    const panier = await lirePanier()

    if ((action as Action) === 'retirer') {
      delete panier[produitId]
      await ecrirePanier(panier)
      return versRetour()
    }

    const demandee = Number(texte(donnees, 'quantite') || '1')
    if (!Number.isInteger(demandee) || demandee < 0) return versRetour()

    if (demandee === 0) {
      delete panier[produitId]
      await ecrirePanier(panier)
      return versRetour()
    }

    // On relit la fiche : disponibilité et quantité maximale appartiennent au
    // produit, pas au formulaire qui vient de nous être envoyé.
    const payload = await getPayload({ config: module.payloadConfig })
    const { docs } = await payload.find({
      collection: 'produits',
      depth: 0,
      limit: 1,
      pagination: false,
      overrideAccess: true,
      where: {
        and: [
          { id: { equals: produitId } },
          { _status: { equals: 'published' } },
          { disponible: { equals: true } },
        ],
      },
    })

    const produit = docs[0] as { quantiteMaxParCommande?: number | null } | undefined
    if (!produit) {
      // Produit retiré de la vente : on le sort du panier plutôt que de laisser
      // une ligne fantôme que le visiteur ne pourrait pas enlever.
      delete panier[produitId]
      await ecrirePanier(panier)
      return versRetour()
    }

    const maximum = produit.quantiteMaxParCommande ?? 10
    const actuelle = (action as Action) === 'ajouter' ? (panier[produitId] ?? 0) : 0

    panier[produitId] = Math.min(actuelle + demandee, maximum)
    await ecrirePanier(panier)

    return versRetour()
  }
}
