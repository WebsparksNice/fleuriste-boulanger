import { lienCommande } from '@websparks/core'
import { getPayload } from 'payload'

import { encoderPanier } from '../blocks/panierUrl'
import type { ModuleCommande } from '../config'
import { creerCommandeAvecCreneau } from '../serveur/creerCommande'
import { envoyerEmailsCommande } from '../serveur/envoi'
import { creerSessionCheckout, clientStripe } from '../serveur/stripe'
import type { LigneDemandee } from '../serveur/types'

export const SEGMENT_CONFIRMATION = 'confirmation'

const PREFIXE_QUANTITE = 'q_'

/** Extrait les couples produit/quantité du formulaire. */
const lireLignes = (donnees: FormData): { lignes: LigneDemandee[]; quantites: Record<string, number> } => {
  const lignes: LigneDemandee[] = []
  const quantites: Record<string, number> = {}

  for (const [champ, valeur] of donnees.entries()) {
    if (!champ.startsWith(PREFIXE_QUANTITE)) continue

    const produitId = champ.slice(PREFIXE_QUANTITE.length)
    const quantite = Number(valeur)

    if (!Number.isInteger(quantite) || quantite <= 0) continue

    lignes.push({ produitId, quantite })
    quantites[produitId] = quantite
  }

  return { lignes, quantites }
}

const texte = (donnees: FormData, champ: string): string => {
  const valeur = donnees.get(champ)
  return typeof valeur === 'string' ? valeur : ''
}

/**
 * Traite l'envoi du formulaire de commande.
 *
 * Rien de ce que poste le navigateur n'est cru sur parole : les prix, le total,
 * la disponibilité des produits et la validité du créneau sont tous relus en
 * base. Le formulaire n'apporte que des identifiants, des quantités et des
 * coordonnées.
 */
export const creerRoutePostCommande = (module: ModuleCommande) => {
  const { site } = module

  return async (requete: Request): Promise<Response> => {
    const donnees = await requete.formData()

    const langue = texte(donnees, 'langue') || site.langueParDefaut
    const cheminFormulaire = lienCommande(site, langue as never)
    const { lignes, quantites } = lireLignes(donnees)

    const versFormulaire = (erreur: string, detail?: string): Response => {
      const parametres = new URLSearchParams({ erreur })
      if (detail) parametres.set('detail', detail)

      const panier = encoderPanier(quantites)
      if (panier) parametres.set('panier', panier)

      // 303 : le navigateur repasse en GET, un rafraîchissement ne renvoie donc
      // pas le formulaire une seconde fois.
      return Response.redirect(`${site.urlSite}${cheminFormulaire}?${parametres}`, 303)
    }

    const modePaiement = texte(donnees, 'modePaiement')
    if (modePaiement !== 'en_ligne' && modePaiement !== 'sur_place') {
      return versFormulaire('paiement_indisponible')
    }

    const payload = await getPayload({ config: module.payloadConfig })

    const resultat = await creerCommandeAvecCreneau({
      payload,
      langue,
      fuseau: site.fuseau,
      lignes,
      client: {
        nom: texte(donnees, 'nom'),
        telephone: texte(donnees, 'telephone'),
        email: texte(donnees, 'email'),
      },
      creneau: texte(donnees, 'creneau'),
      modePaiement,
      notes: texte(donnees, 'notes'),
    })

    if (!resultat.ok) return versFormulaire(resultat.erreur, resultat.details)

    const { commande, reglages, panier } = resultat
    const urlConfirmation = `${site.urlSite}${cheminFormulaire}/${SEGMENT_CONFIRMATION}?numero=${encodeURIComponent(commande.numero)}&jeton=${encodeURIComponent(commande.jeton)}`

    if (modePaiement === 'sur_place') {
      await envoyerEmailsCommande({
        payload,
        gabarits: module.emails,
        expediteur: module.expediteur,
        reglages,
        donnees: {
          numero: commande.numero,
          lignes: panier.lignes.map((ligne) => ({
            nom: ligne.produit.nom,
            quantite: ligne.quantite,
            totalLigneCentimes: ligne.totalLigneCentimes,
          })),
          totalCentimes: commande.totalCentimes,
          creneauDebut: new Date(commande.creneauDebut),
          creneauFin: new Date(commande.creneauFin),
          client: {
            nom: texte(donnees, 'nom'),
            telephone: texte(donnees, 'telephone'),
            email: texte(donnees, 'email'),
          },
          notes: texte(donnees, 'notes') || null,
          modePaiement: 'sur_place',
          paye: false,
          messageConfirmation: reglages.messageConfirmation,
          lienSuivi: urlConfirmation,
          langue,
          fuseau: site.fuseau,
        },
      })

      return Response.redirect(urlConfirmation, 303)
    }

    const stripe = clientStripe()
    if (!stripe) {
      payload.logger.error('[commande] paiement en ligne demandé mais Stripe n’est pas configuré')
      return versFormulaire('paiement_indisponible')
    }

    try {
      const session = await creerSessionCheckout({
        stripe,
        panier,
        numero: commande.numero,
        commandeId: commande.id,
        emailClient: texte(donnees, 'email').trim().toLowerCase(),
        urlSucces: urlConfirmation,
        urlAnnulation: `${site.urlSite}${cheminFormulaire}?erreur=paiement_annule`,
        langue,
        minutesAvantExpiration: reglages.minutesAvantExpiration,
        compteConnecte: reglages.compteStripe,
      })

      await payload.update({
        collection: 'commandes',
        id: commande.id,
        data: { stripeSessionId: session.id },
        overrideAccess: true,
      })

      if (!session.url) return versFormulaire('erreur_interne')

      return Response.redirect(session.url, 303)
    } catch (erreur) {
      payload.logger.error(`[commande] session Stripe impossible : ${String(erreur)}`)
      return versFormulaire('erreur_interne')
    }
  }
}
