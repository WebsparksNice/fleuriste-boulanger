import Image from 'next/image'

import { cn } from '../../lib/cn'
import { cheminMedia } from '../../lib/urls'
import { estPeuple, type MediaDoc, type Reference } from '../../types'

export type FormatImage = 'carre' | 'portrait' | 'paysage' | 'naturel'

const rapports: Record<Exclude<FormatImage, 'naturel'>, string> = {
  carre: 'aspect-square',
  portrait: 'aspect-[3/4]',
  paysage: 'aspect-[16/10]',
}

type ProprietesImageMedia = {
  media?: Reference<MediaDoc> | null
  /** Remplace l'alternative textuelle saisie dans le CMS. */
  alt?: string
  format?: FormatImage
  /** Indispensable au bon choix de resolution par le navigateur. */
  sizes?: string
  /** A reserver a l'image de la banniere : elle fait partie du premier ecran. */
  priorite?: boolean
  className?: string
  classNameImage?: string
}

/**
 * Affiche un media Payload via next/image.
 *
 * Le point d'interet defini dans l'admin devient `object-position`, ce qui evite
 * qu'un recadrage carre coupe la tete du boulanger ou le coeur du bouquet.
 */
export const ImageMedia = ({
  media,
  alt,
  format = 'paysage',
  sizes = '100vw',
  priorite = false,
  className,
  classNameImage,
}: ProprietesImageMedia) => {
  if (!estPeuple(media)) return null

  const source = cheminMedia(media.url)
  if (!source) return null

  const texteAlternatif = alt ?? media.alt ?? ''
  const positionObjet =
    typeof media.focalX === 'number' && typeof media.focalY === 'number'
      ? `${media.focalX}% ${media.focalY}%`
      : '50% 50%'

  if (format === 'naturel') {
    const largeur = media.width ?? 1200
    const hauteur = media.height ?? 800

    return (
      <Image
        src={source}
        alt={texteAlternatif}
        width={largeur}
        height={hauteur}
        sizes={sizes}
        priority={priorite}
        className={cn('h-auto w-full', className, classNameImage)}
      />
    )
  }

  return (
    <div className={cn('relative overflow-hidden', rapports[format], className)}>
      <Image
        src={source}
        alt={texteAlternatif}
        fill
        sizes={sizes}
        priority={priorite}
        style={{ objectPosition: positionObjet }}
        className={cn('object-cover', classNameImage)}
      />
    </div>
  )
}
