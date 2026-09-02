import type { ConfigSiteResolue } from '../config'
import { lienVers } from '../config'
import type { Langue } from '../i18n'
import { estPeuple, type EtablissementDoc, type LienDoc } from '../types'

export type LienResolu = {
  href: string
  libelle: string
  nouvelOnglet: boolean
  style: 'primaire' | 'secondaire' | 'discret'
}

/** Retire espaces, points et tirets d'un numero pour en faire un `tel:` valide. */
export const numeroPourAppel = (numero: string): string => numero.replace(/[^\d+]/g, '')

/**
 * Transforme un lien saisi dans l'admin en href utilisable.
 *
 * Retourne `null` quand le lien est inexploitable (page supprimee, champ vide) :
 * mieux vaut ne rien afficher qu'un bouton qui ne mene nulle part.
 */
export const resoudreLien = (
  lien: LienDoc | null | undefined,
  config: ConfigSiteResolue,
  langue: Langue,
  etablissement?: EtablissementDoc | null,
): LienResolu | null => {
  if (!lien) return null

  const libelle = lien.libelle?.trim()
  if (!libelle) return null

  const commun = {
    libelle,
    nouvelOnglet: Boolean(lien.nouvelOnglet),
    style: lien.style ?? 'primaire',
  }

  switch (lien.type ?? 'interne') {
    case 'interne': {
      if (!estPeuple(lien.reference)) return null
      const slug = lien.reference.slug
      if (!slug) return null
      return { ...commun, href: lienVers(config, langue, slug) }
    }
    case 'externe': {
      if (!lien.url) return null
      return { ...commun, href: lien.url }
    }
    case 'telephone': {
      const numero = lien.telephone ?? etablissement?.telephone
      if (!numero) return null
      return { ...commun, href: `tel:${numeroPourAppel(numero)}` }
    }
    case 'email': {
      const email = lien.email ?? etablissement?.email
      if (!email) return null
      return { ...commun, href: `mailto:${email}` }
    }
    case 'ancre': {
      if (!lien.ancre) return null
      return { ...commun, href: `#${lien.ancre.replace(/^#/, '')}` }
    }
    default:
      return null
  }
}

/** Resout une liste de liens en ecartant silencieusement ceux qui sont casses. */
export const resoudreLiens = (
  liens: LienDoc[] | null | undefined,
  config: ConfigSiteResolue,
  langue: Langue,
  etablissement?: EtablissementDoc | null,
): LienResolu[] =>
  (liens ?? []).flatMap((lien) => {
    const resolu = resoudreLien(lien, config, langue, etablissement)
    return resolu ? [resolu] : []
  })
