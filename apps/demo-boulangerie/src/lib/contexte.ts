import config from '@payload-config'
import {
  estLangue,
  obtenirEtablissement,
  obtenirNavigation,
  obtenirReglagesSeo,
  type ContexteRendu,
  type Langue,
} from '@websparks/core'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

import { site } from '@/site.config'

/**
 * Instance Payload partagee.
 *
 * `getPayload` reutilise l'instance existante : Payload tourne dans le meme
 * processus que Next, sans passer par HTTP.
 */
export const clientPayload = async () => getPayload({ config })

/** Ramene un segment d'URL a une langue reellement activee pour ce client. */
export const resoudreLangue = (valeur?: string): Langue =>
  estLangue(valeur) && site.langues.includes(valeur) ? valeur : site.langueParDefaut

/** Contexte transmis aux blocs : instance Payload, langue, mode brouillon, fiche du commerce. */
export const obtenirContexte = async (langue: Langue): Promise<ContexteRendu> => {
  const payload = await clientPayload()
  const { isEnabled: brouillon } = await draftMode()
  const etablissement = await obtenirEtablissement({ payload, langue })

  return { payload, langue, brouillon, etablissement }
}

export const obtenirDonneesGabarit = async (langue: Langue) => {
  const payload = await clientPayload()
  const [etablissement, navigation] = await Promise.all([
    obtenirEtablissement({ payload, langue }),
    obtenirNavigation({ payload, langue }),
  ])

  return { etablissement, navigation }
}

export const obtenirReglages = async (langue: Langue) => {
  const payload = await clientPayload()
  return obtenirReglagesSeo({ payload, langue })
}
