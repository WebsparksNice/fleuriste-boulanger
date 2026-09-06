import config from '@payload-config'
import { secretPrevisualisation } from '@websparks/core/payload'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { getPayload } from 'payload'

/**
 * Active la previsualisation des brouillons.
 *
 * Deux verrous, et les deux sont necessaires : le secret empeche de forger
 * l'URL, et la verification de session empeche qu'un secret ayant fuite suffise
 * a lire les brouillons. Sans le second, toute personne connaissant le lien
 * verrait le contenu non publie.
 */
export const GET = async (requete: NextRequest) => {
  const parametres = requete.nextUrl.searchParams
  const chemin = parametres.get('chemin')
  const secret = parametres.get('secret')

  // Un chemin absolu et interne uniquement : sinon la route devient une
  // redirection ouverte, exploitable pour du hameconnage.
  if (!chemin || !chemin.startsWith('/') || chemin.startsWith('//')) {
    return new Response('Chemin de previsualisation invalide.', { status: 400 })
  }

  if (!secret || secret !== secretPrevisualisation()) {
    return new Response('Secret de previsualisation invalide.', { status: 401 })
  }

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: requete.headers })

  if (!user) {
    return new Response('Connectez-vous a l administration pour previsualiser.', { status: 401 })
  }

  const brouillon = await draftMode()
  brouillon.enable()

  redirect(chemin)
}
