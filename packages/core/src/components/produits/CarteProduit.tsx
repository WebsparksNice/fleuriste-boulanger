import Link from 'next/link'
import type { ReactNode } from 'react'

import type { ConfigSiteResolue } from '../../config'
import { lienProduit } from '../../config'
import { obtenirDictionnaire } from '../../i18n'
import type { Langue } from '../../i18n'
import { cn } from '../../lib/cn'
import type { ProduitDoc, VarianteCarteProduit } from '../../types'
import { ImageMedia } from '../media/ImageMedia'

type ProprietesCarteProduit = {
  produit: ProduitDoc
  config: ConfigSiteResolue
  langue: Langue
  afficherPrix?: boolean
  /**
   * `sobre` : vignette nue, toute la surface cliquable.
   * `carte` : vignette posee sur une surface, avec resume et bouton explicite.
   */
  variante?: VarianteCarteProduit
  sizes?: string
  className?: string
  /**
   * Action posee sous le produit par un module optionnel — ajouter au panier,
   * par exemple. Rendue hors de la zone cliquable de la vignette : un bouton
   * ne doit pas emmener vers la fiche produit.
   */
  action?: ReactNode
}

/**
 * Vignette d'un produit en vitrine.
 *
 * Deux presentations, et deux facons d'etre cliquable qui vont avec.
 *
 * En `sobre`, toute la carte est cliquable mais seul le nom porte le lien :
 * c'est lui que lit un lecteur d'ecran, plutot qu'un « lire la suite » sans
 * contexte. Le reste de la surface est rendu cliquable par un pseudo-element
 * etale sur la carte.
 *
 * En `carte`, le lien devient un bouton en pied de vignette. La surface, elle,
 * n'est plus cliquable : superposer un bouton visible et une zone cliquable qui
 * le deborde donne deux cibles pour une seule action, et l'on ne sait plus
 * laquelle on vient d'atteindre.
 */
export const CarteProduit = ({
  produit,
  config,
  langue,
  afficherPrix = true,
  variante = 'sobre',
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  className,
  action,
}: ProprietesCarteProduit) => {
  const t = obtenirDictionnaire(langue, config.dictionnaires)
  const href = produit.slug ? lienProduit(config, langue, produit.slug) : null
  const prix = afficherPrix && produit.prixIndicatif ? produit.prixIndicatif : null
  const disponibilite =
    produit.disponibilite && produit.disponibilite !== 'permanent'
      ? t.produits.disponibilites[produit.disponibilite]
      : null

  if (variante === 'carte') {
    return (
      <article
        className={cn(
          'flex h-full flex-col gap-4 rounded-lg bg-surface p-4 transition-transform duration-300 hover:-translate-y-1',
          className,
        )}
      >
        <ImageMedia
          media={produit.imagePrincipale}
          format="carre"
          sizes={sizes}
          className="rounded-md bg-surface-attenuee"
        />

        <div className="flex grow flex-col gap-2">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h3 className="text-xl">{produit.nom}</h3>
            {prix ? (
              <p className="prix font-titres text-lg whitespace-nowrap">
                <span className="sr-only">{t.produits.prixIndicatif} : </span>
                {prix}
              </p>
            ) : null}
          </div>
          {produit.resume ? (
            <p className="text-pretty text-sm text-texte-attenue">{produit.resume}</p>
          ) : null}
          {disponibilite ? (
            <p className="mention text-texte-attenue">{disponibilite}</p>
          ) : null}
        </div>

        {href ? (
          <Link
            href={href}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primaire px-5 py-3 font-medium text-primaire-contraste transition-colors hover:bg-primaire-survol"
          >
            {t.produits.voirLeProduit}
            <span className="sr-only"> — {produit.nom}</span>
          </Link>
        ) : null}
        {action}
      </article>
    )
  }

  return (
    <article className={cn('relative', className)}>
      <ImageMedia
        media={produit.imagePrincipale}
        format="carre"
        sizes={sizes}
        className="rounded-md bg-surface-attenuee"
      />
      <div className="mt-3 space-y-1">
        <h3 className="text-lg font-medium">
          {href ? (
            <Link href={href} className="after:absolute after:inset-0 hover:underline">
              {produit.nom}
            </Link>
          ) : (
            produit.nom
          )}
        </h3>
        {prix ? <p className="text-sm text-texte-attenue">{prix}</p> : null}
        {disponibilite ? <p className="text-sm text-texte-attenue">{disponibilite}</p> : null}
      </div>
      {action ? <div className="relative z-10 mt-3">{action}</div> : null}
    </article>
  )
}
