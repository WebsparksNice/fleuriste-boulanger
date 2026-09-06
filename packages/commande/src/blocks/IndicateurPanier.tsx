import Link from 'next/link'

import type { ConfigSiteResolue } from '@websparks/core'
import { lienCommande } from '@websparks/core'

import { dictionnaireCommande } from '../i18n'
import { compterArticles, lirePanier } from '../serveur/session'

type ProprietesIndicateur = {
  config: ConfigSiteResolue
  langue: string
  className?: string
}

/**
 * Lien vers le panier, avec le nombre d'articles.
 *
 * Lit le cookie du visiteur : la page qui l'affiche est donc rendue à chaque
 * requête. C'est le prix d'un panier visible sans JavaScript — un compteur
 * juste ne peut pas sortir d'une page mise en cache pour tout le monde.
 */
export const IndicateurPanier = async ({ config, langue, className }: ProprietesIndicateur) => {
  const t = dictionnaireCommande(langue)
  const articles = compterArticles(await lirePanier())

  return (
    <Link
      href={lienCommande(config, langue as never)}
      className={
        className ??
        'inline-flex min-h-11 items-center gap-2 rounded-md border border-primaire px-4 font-medium text-primaire transition-colors hover:bg-primaire hover:text-primaire-contraste'
      }
    >
      {t.panier}
      {articles > 0 ? (
        <>
          <span
            aria-hidden="true"
            className="inline-flex min-w-6 items-center justify-center rounded-plein bg-primaire px-1.5 text-sm text-primaire-contraste"
          >
            {articles}
          </span>
          <span className="sr-only">— {t.articles(articles)}</span>
        </>
      ) : null}
    </Link>
  )
}
