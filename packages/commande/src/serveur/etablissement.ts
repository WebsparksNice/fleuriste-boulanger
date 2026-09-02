import type { Payload } from 'payload'

type AdresseBrute = {
  rue?: string | null
  complement?: string | null
  codePostal?: string | null
  ville?: string | null
}

export type CommerceEmail = {
  nom: string
  adresse?: string | null
  telephone?: string | null
  email?: string | null
}

/** Coordonnées du commerce, mises en forme pour les e-mails. */
export const lireCommerce = async (payload: Payload): Promise<CommerceEmail> => {
  const globale = (await payload.findGlobal({
    slug: 'etablissement',
    depth: 0,
    overrideAccess: true,
  })) as {
    nom?: string | null
    telephone?: string | null
    email?: string | null
    adresse?: AdresseBrute | null
  }

  const adresse = globale.adresse
  const ligneAdresse = adresse
    ? [adresse.rue, adresse.complement, [adresse.codePostal, adresse.ville].filter(Boolean).join(' ')]
        .filter((partie) => partie && partie.trim())
        .join(', ')
    : null

  return {
    nom: globale.nom ?? '',
    adresse: ligneAdresse || null,
    telephone: globale.telephone ?? null,
    email: globale.email ?? null,
  }
}
