import type { ConfigSiteResolue } from '../config'
import { estPeuple } from '../types'

/**
 * Rend absolue l'URL d'un media.
 *
 * Payload renvoie deja une URL absolue lorsque `serverURL` est configure, mais
 * relative sinon. Prefixer sans verifier produirait des adresses doublees du
 * type `https://site.frhttps://site.fr/api/media/...`, invisibles a l'oeil nu
 * dans le HTML mais qui cassent les apercus de partage et les donnees
 * structurees.
 */
export const urlAbsolueMedia = (
  config: ConfigSiteResolue,
  media: unknown,
): string | undefined => {
  if (!estPeuple(media as object)) return undefined

  const url = (media as { url?: string | null }).url
  if (!url) return undefined
  if (/^https?:\/\//i.test(url)) return url

  return `${config.urlSite}${url.startsWith('/') ? '' : '/'}${url}`
}

/**
 * Chemin d'un media, toujours relatif a l'origine du site.
 *
 * Payload prefixe les URL de media avec `serverURL`. `next/image` verrait alors
 * une image distante : il exigerait une entree dans `images.remotePatterns` et
 * irait chercher le fichier par une requete HTTP vers le site lui-meme, au lieu
 * de le lire sur le disque. Les medias etant toujours servis par cette meme
 * application, on ne garde que le chemin.
 */
export const cheminMedia = (url: string | null | undefined): string | undefined => {
  if (!url) return undefined
  if (!/^https?:\/\//i.test(url)) return url.startsWith('/') ? url : `/${url}`

  try {
    const analysee = new URL(url)
    return `${analysee.pathname}${analysee.search}`
  } catch {
    return url
  }
}
