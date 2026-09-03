import { getPayload } from 'payload'

import type { ModuleCommande } from '../config'
import {
  CHEMIN_CONFIRMATION_STRIPE,
  CHEMIN_LIAISON_STRIPE,
  CHEMIN_RETOUR_STRIPE,
} from '../chemins'
import {
  clientIdConnect,
  detailsCompte,
  echangerCodeStripe,
  modeConnect,
  revoquerCompte,
  signerJeton,
  urlAutorisationStripe,
  verifierJeton,
} from '../serveur/connect'
import { clientStripe } from '../serveur/stripe'

const CHEMIN_ADMIN_REGLAGES = '/admin/globals/config-commande'

const echapper = (valeur: string): string =>
  valeur
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const page = (titre: string, corps: string, statut = 200): Response =>
  new Response(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${echapper(titre)}</title></head>
<body style="margin:0;padding:2rem;background:#f6f5f3;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#1f2937;line-height:1.6">
<main style="max-width:32rem;margin:3rem auto;background:#fff;border-radius:12px;padding:2rem">
${corps}
</main></body></html>`,
    { status: statut, headers: { 'content-type': 'text/html; charset=utf-8' } },
  )

const erreur = (message: string, statut = 400): Response =>
  page(
    'Liaison Stripe',
    `<h1 style="margin:0 0 1rem;font-size:1.4rem">Liaison impossible</h1>
<p style="margin:0 0 1.5rem">${echapper(message)}</p>
<p><a href="${CHEMIN_ADMIN_REGLAGES}" style="color:#635bff">Revenir aux réglages</a></p>`,
    statut,
  )

/**
 * Démarre la liaison OAuth.
 *
 * Navigation depuis l'administration, donc même origine : la session en cookie
 * est acceptée. Le jeton signé qui part dans `state` est lié à l'utilisateur,
 * ce qui interdit qu'un tiers reprenne la démarche à son compte.
 */
export const creerRouteConnexionStripe = (module: ModuleCommande) => {
  const { site } = module

  return async (requete: Request): Promise<Response> => {
    if (!modeConnect()) {
      return erreur(
        'Aucune plateforme Stripe Connect n’est configurée pour ce site (STRIPE_CONNECT_CLIENT_ID).',
        501,
      )
    }

    const payload = await getPayload({ config: module.payloadConfig })
    const { user } = await payload.auth({ headers: requete.headers })
    if (!user) return erreur('Connectez-vous à l’administration pour lier un compte.', 401)

    const etat = signerJeton({ u: String(user.id), a: 'connexion' })
    const url = urlAutorisationStripe(etat, `${site.urlSite}${CHEMIN_RETOUR_STRIPE}`)
    if (!url) return erreur('Configuration Stripe Connect incomplète.', 501)

    return Response.redirect(url, 303)
  }
}

/**
 * Retour depuis Stripe.
 *
 * Cette requête arrive d'un autre domaine : le navigateur annonce
 * `Sec-Fetch-Site: cross-site` et Payload refuse alors la session en cookie.
 * On ne peut donc pas authentifier ici, et on n'enregistre rien.
 *
 * Le code d'autorisation est échangé immédiatement, puis la page repart en
 * redirection vers une adresse qui ne le contient plus. C'est nécessaire :
 * Stripe révoque la connexion si un code d'autorisation est présenté deux
 * fois, et laisser le code dans la barre d'adresse suffirait à ce qu'un
 * rafraîchissement défasse la liaison qui vient d'être établie.
 */
export const creerRouteRetourStripe = (module: ModuleCommande) => {
  const { site } = module

  return async (requete: Request): Promise<Response> => {
    const parametres = new URL(requete.url).searchParams

    const refus = parametres.get('error')
    if (refus) {
      return erreur(
        parametres.get('error_description') ?? 'La liaison a été refusée côté Stripe.',
      )
    }

    const code = parametres.get('code')
    const contenu = verifierJeton(parametres.get('state'))

    if (!code || !contenu || contenu.a !== 'connexion') {
      return erreur('Demande expirée ou invalide. Relancez la liaison depuis les réglages.')
    }

    const stripe = clientStripe()
    if (!stripe) return erreur('Clé de plateforme Stripe absente.', 501)

    let compte
    try {
      compte = await echangerCodeStripe(stripe, code)
    } catch (probleme) {
      // Code déjà consommé, expiré, ou plateforme mal configurée : on le dit,
      // plutôt que de laisser remonter une erreur 500 opaque.
      return erreur(
        `Stripe a refusé l’échange : ${probleme instanceof Error ? probleme.message : 'erreur inconnue'}`,
      )
    }

    if (!compte) return erreur('Stripe n’a pas renvoyé de compte exploitable.')

    const liaison = signerJeton({
      u: String(contenu.u),
      a: 'liaison',
      c: compte.id,
      nom: compte.nom ?? '',
      actif: compte.chargesActives ? 1 : 0,
    })

    return Response.redirect(
      `${site.urlSite}${CHEMIN_CONFIRMATION_STRIPE}?liaison=${encodeURIComponent(liaison)}`,
      303,
    )
  }
}

/**
 * Page de confirmation.
 *
 * Ne fait aucun appel à Stripe : tout ce qu'elle affiche vient du jeton signé,
 * ce qui la rend librement rafraîchissable. Son bouton repart en POST depuis
 * notre domaine, seule requête où la session administrateur est vérifiable.
 */
export const creerRouteConfirmationStripe = () => {
  return async (requete: Request): Promise<Response> => {
    const liaison = new URL(requete.url).searchParams.get('liaison')
    const contenu = verifierJeton(liaison)

    if (!contenu || contenu.a !== 'liaison' || typeof contenu.c !== 'string') {
      return erreur('Demande expirée. Relancez la liaison depuis les réglages.')
    }

    const nom = typeof contenu.nom === 'string' && contenu.nom ? contenu.nom : contenu.c

    return page(
      'Confirmer la liaison',
      `<h1 style="margin:0 0 1rem;font-size:1.4rem">Lier ce compte Stripe ?</h1>
<p style="margin:0 0 0.5rem">Les paiements des commandes arriveront sur :</p>
<p style="margin:0 0 1.5rem;font-size:1.1rem"><strong>${echapper(nom)}</strong></p>
${
  contenu.actif === 1
    ? ''
    : '<p style="margin:0 0 1.5rem;color:#b45309">Ce compte n’est pas encore autorisé à encaisser. Vous pouvez le lier maintenant et terminer sa configuration sur Stripe ensuite.</p>'
}
<form method="post" action="${CHEMIN_LIAISON_STRIPE}">
<input type="hidden" name="liaison" value="${echapper(liaison ?? '')}">
<button type="submit" style="min-height:2.75rem;padding:0 1.25rem;border-radius:6px;border:0;background:#635bff;color:#fff;font-size:1rem;cursor:pointer">Confirmer la liaison</button>
</form>
<p style="margin:1.5rem 0 0"><a href="${CHEMIN_ADMIN_REGLAGES}" style="color:#6b7280">Annuler</a></p>`,
    )
  }
}

/**
 * Enregistre la liaison.
 *
 * POST depuis notre propre page : le navigateur envoie l'en-tête `Origin`, la
 * session en cookie est donc acceptée et le contrôle CSRF de Payload joue son
 * rôle. On revérifie que l'utilisateur connecté est bien celui qui a lancé la
 * démarche.
 */
export const creerRouteLiaisonStripe = (module: ModuleCommande) => {
  const { site } = module

  return async (requete: Request): Promise<Response> => {
    const payload = await getPayload({ config: module.payloadConfig })
    const { user } = await payload.auth({ headers: requete.headers })
    if (!user) return erreur('Connectez-vous à l’administration pour lier un compte.', 401)

    const donnees = await requete.formData()
    const contenu = verifierJeton(String(donnees.get('liaison') ?? ''))

    if (!contenu || contenu.a !== 'liaison' || typeof contenu.c !== 'string') {
      return erreur('Demande expirée. Relancez la liaison depuis les réglages.')
    }

    if (String(contenu.u) !== String(user.id)) {
      return erreur('Cette liaison a été lancée par un autre compte.', 403)
    }

    const stripe = clientStripe()
    if (!stripe) return erreur('Clé de plateforme Stripe absente.', 501)

    const compte = await detailsCompte(stripe, contenu.c)

    await payload.updateGlobal({
      slug: 'config-commande',
      overrideAccess: true,
      data: {
        stripeCompteId: compte.id,
        stripeCompteNom: compte.nom,
        stripeChargesActives: compte.chargesActives,
        stripeConnecteLe: new Date().toISOString(),
      },
    })

    return Response.redirect(`${site.urlSite}${CHEMIN_ADMIN_REGLAGES}`, 303)
  }
}

/**
 * Relit l'état du compte auprès de Stripe.
 *
 * Le webhook `account.updated` fait normalement ce travail tout seul. Ce bouton
 * existe pour les cas où il n'arrive pas : point de terminaison pas encore
 * déclaré, tunnel local fermé, événement manqué. Sans lui, un commerçant qui
 * vient de terminer son inscription n'a aucun moyen de le faire savoir au site.
 */
export const creerRouteEtatStripe = (module: ModuleCommande) => {
  return async (requete: Request): Promise<Response> => {
    const payload = await getPayload({ config: module.payloadConfig })
    const { user } = await payload.auth({ headers: requete.headers })
    if (!user) return new Response('Authentification requise.', { status: 401 })

    const globale = (await payload.findGlobal({
      slug: 'config-commande',
      depth: 0,
      overrideAccess: true,
    })) as { stripeCompteId?: string | null }

    if (!globale.stripeCompteId) {
      return new Response('Aucun compte lié.', { status: 409 })
    }

    const stripe = clientStripe()
    if (!stripe) return new Response('Clé de plateforme Stripe absente.', { status: 501 })

    const compte = await detailsCompte(stripe, globale.stripeCompteId)

    await payload.updateGlobal({
      slug: 'config-commande',
      overrideAccess: true,
      data: {
        stripeCompteNom: compte.nom,
        stripeChargesActives: compte.chargesActives,
      },
    })

    return Response.json({ nom: compte.nom, chargesActives: compte.chargesActives })
  }
}

/** Délie le compte : révocation côté Stripe, puis nettoyage côté site. */
export const creerRouteDeconnexionStripe = (module: ModuleCommande) => {
  return async (requete: Request): Promise<Response> => {
    const payload = await getPayload({ config: module.payloadConfig })
    const { user } = await payload.auth({ headers: requete.headers })
    if (!user) return new Response('Authentification requise.', { status: 401 })

    const globale = (await payload.findGlobal({
      slug: 'config-commande',
      depth: 0,
      overrideAccess: true,
    })) as { stripeCompteId?: string | null }

    const stripe = clientStripe()
    if (stripe && globale.stripeCompteId && clientIdConnect()) {
      await revoquerCompte(stripe, globale.stripeCompteId)
    }

    await payload.updateGlobal({
      slug: 'config-commande',
      overrideAccess: true,
      data: {
        stripeCompteId: null,
        stripeCompteNom: null,
        stripeChargesActives: false,
        stripeConnecteLe: null,
        // Sans compte lié, le paiement en ligne ne peut plus aboutir : on
        // éteint l'option plutôt que de laisser un choix qui échouerait.
        paiementEnLigne: false,
      },
    })

    return new Response('Compte délié.', { status: 200 })
  }
}
