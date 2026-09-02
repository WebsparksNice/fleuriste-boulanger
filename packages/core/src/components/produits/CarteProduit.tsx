import Link from 'next/link'

import type { ConfigSiteResolue } from '../../config'
import { lienProduit } from '../../config'
import { obtenirDictionnaire } from '../../i18n'
import type { Langue } from '../../i18n'
import { cn } from '../../lib/cn'
import type { ProduitDoc } from '../../types'
import { ImageMedia } from '../media/ImageMedia'

type ProprietesCarteProduit = {
  produit: ProduitDoc
  config: ConfigSiteResolue
  langue: Langue
  afficherPrix?: boolean
  sizes?: string
  className?: string
}

/**
 * Vignette d'un produit en vitrine.
 *
 * Toute la carte est cliquable, mais seul le nom porte le lien : c'est lui que
 * lit un lecteur d'ecran, plutot qu'un « lire la suite » sans contexte. Le reste
 * de la surface est rendu cliquable par un pseudo-element etale sur la carte.
 */
export const CarteProduit = ({
  produit,
  config,
  langue,
  afficherPrix = true,
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  className,
}: ProprietesCarteProduit) => {
  const t = obtenirDictionnaire(langue, config.dictionnaires)
  const href = produit.slug ? lienProduit(config, langue, produit.slug) : null

  const contenu = (
    <>
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
        {afficherPrix && produit.prixIndicatif ? (
          <p className="text-sm text-texte-attenue">{produit.prixIndicatif}</p>
        ) : null}
        {produit.disponibilite && produit.disponibilite !== 'permanent' ? (
          <p className="text-sm text-texte-attenue">
            {t.produits.disponibilites[produit.disponibilite]}
          </p>
        ) : null}
      </div>
    </>
  )

  return <article className={cn('relative', className)}>{contenu}</article>
}
