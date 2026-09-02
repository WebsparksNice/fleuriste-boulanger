import type { Metadata } from 'next'

import type { ConfigSiteResolue } from '../config'
import { urlAbsolue } from '../config'
import type { Langue } from '../i18n'
import { urlAbsolueMedia } from '../lib/urls'
import type { MetaSeoDoc, ReglagesSeoDoc } from '../types'

type OptionsMetadata = {
  config: ConfigSiteResolue
  langue: Langue
  /** Metadonnees saisies sur le document, prioritaires sur tout le reste. */
  seo?: MetaSeoDoc | null
  /** Titre du document, utilise si le champ SEO est vide. */
  titreParDefaut?: string | null
  descriptionParDefaut?: string | null
  reglages?: ReglagesSeoDoc | null
  /** Chemin de la page courante, deja prefixe de la langue. */
  chemin: string
  /** Chemin equivalent dans les autres langues, pour les balises hreflang. */
  alternatives?: Partial<Record<Langue, string>>
}

/**
 * Construit les metadonnees d'une page.
 *
 * L'ordre des reprises est toujours le meme : champ SEO du document, puis titre
 * du document, puis reglages globaux. L'editeur peut donc ne rien remplir et
 * obtenir malgre tout un resultat correct.
 *
 * `autoriserIndexation` decoche dans les reglages passe tout le site en
 * `noindex` : c'est le garde-fou qui evite qu'un site de preparation se retrouve
 * reference avant sa mise en ligne.
 */
export const construireMetadata = ({
  config,
  langue,
  seo,
  titreParDefaut,
  descriptionParDefaut,
  reglages,
  chemin,
  alternatives,
}: OptionsMetadata): Metadata => {
  const suffixe = reglages?.suffixeTitre?.trim()
  const titreBrut = seo?.titre?.trim() || titreParDefaut?.trim() || suffixe || ''

  /*
   * Le suffixe n'est ajoute que s'il apporte quelque chose. Une page d'accueil
   * porte souvent le nom du commerce, qui est aussi le debut du suffixe :
   * sans ce garde-fou, on obtiendrait « Boulangerie Martin — Boulangerie
   * Martin, Lyon 3e » dans l'onglet et dans les resultats de recherche.
   */
  const normaliser = (valeur: string) => valeur.toLowerCase().replace(/\s+/g, ' ').trim()
  const suffixeUtile =
    suffixe &&
    !normaliser(titreBrut).includes(normaliser(suffixe)) &&
    !normaliser(suffixe).startsWith(normaliser(titreBrut))

  const titre = seo?.titre?.trim()
    ? seo.titre
    : suffixeUtile
      ? `${titreBrut} — ${suffixe}`
      : titreBrut || suffixe || ''

  const description =
    seo?.description?.trim() ||
    descriptionParDefaut?.trim() ||
    reglages?.descriptionParDefaut?.trim() ||
    undefined

  const image =
    urlAbsolueMedia(config, seo?.image) ?? urlAbsolueMedia(config, reglages?.imagePartage)

  const indexable = reglages?.autoriserIndexation === true && !seo?.noindex && !config.options.bloquerIndexation

  const languesAlternatives =
    config.langues.length > 1 && alternatives
      ? Object.fromEntries(
          config.langues
            .filter((autre) => alternatives[autre])
            .map((autre) => [autre, urlAbsolue(config, alternatives[autre] as string)]),
        )
      : undefined

  return {
    metadataBase: new URL(config.urlSite),
    title: titre,
    description,
    alternates: {
      canonical: urlAbsolue(config, chemin),
      languages: languesAlternatives,
    },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      type: 'website',
      locale: langue,
      url: urlAbsolue(config, chemin),
      title: titre,
      description,
      siteName: suffixe || undefined,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: titre,
      description,
      images: image ? [image] : undefined,
    },
    verification: reglages?.verificationGoogle
      ? { google: reglages.verificationGoogle }
      : undefined,
  }
}
