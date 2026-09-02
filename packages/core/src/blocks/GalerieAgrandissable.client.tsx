'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '../lib/cn'

export type ImageGalerie = {
  url: string
  alt: string
  legende?: string
  largeur?: number
  hauteur?: number
}

type ProprietesGalerieAgrandissable = {
  images: ImageGalerie[]
  classesGrille: string
  classeFormat: string
  sizes: string
  libelles: {
    agrandir: (legende: string) => string
    fermer: string
    precedente: string
    suivante: string
  }
}

/**
 * Grille d'images avec agrandissement au clic.
 *
 * Le seul composant client de la galerie, et il n'est monte que si l'editeur a
 * coche l'option : une galerie ordinaire reste du HTML pur. On s'appuie sur
 * `<dialog>` natif, qui apporte gratuitement le piegeage du focus, la fermeture
 * par Echap et l'inertie du reste de la page.
 */
export const GalerieAgrandissable = ({
  images,
  classesGrille,
  classeFormat,
  sizes,
  libelles,
}: ProprietesGalerieAgrandissable) => {
  const dialogue = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState(0)

  const ouvrir = useCallback((position: number) => {
    setIndex(position)
    dialogue.current?.showModal()
  }, [])

  const deplacer = useCallback(
    (pas: number) => setIndex((actuel) => (actuel + pas + images.length) % images.length),
    [images.length],
  )

  useEffect(() => {
    const element = dialogue.current
    if (!element) return

    const surTouche = (evenement: KeyboardEvent) => {
      if (evenement.key === 'ArrowRight') deplacer(1)
      if (evenement.key === 'ArrowLeft') deplacer(-1)
    }

    element.addEventListener('keydown', surTouche)
    return () => element.removeEventListener('keydown', surTouche)
  }, [deplacer])

  const image = images[index]

  return (
    <>
      <ul className={cn('grid grid-cols-1 gap-4', classesGrille)}>
        {images.map((element, position) => (
          <li key={element.url}>
            <figure>
              <button
                type="button"
                onClick={() => ouvrir(position)}
                className={cn(
                  'relative block w-full overflow-hidden rounded-md bg-surface-attenuee',
                  classeFormat,
                )}
              >
                <span className="sr-only">
                  {libelles.agrandir(element.legende ?? element.alt)}
                </span>
                <Image src={element.url} alt={element.alt} fill sizes={sizes} className="object-cover" />
              </button>
              {element.legende ? (
                <figcaption className="mt-2 text-sm text-texte-attenue">{element.legende}</figcaption>
              ) : null}
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogue}
        className="m-auto max-h-[90dvh] w-[min(92vw,72rem)] rounded-lg bg-surface p-4 backdrop:bg-black/70"
        onClick={(evenement) => {
          // Un clic sur le fond (et non sur le contenu) ferme la fenetre.
          if (evenement.target === dialogue.current) dialogue.current?.close()
        }}
      >
        {image ? (
          <figure className="space-y-3">
            <div className="relative aspect-[3/2] w-full">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="92vw"
                className="object-contain"
              />
            </div>
            {image.legende ? (
              <figcaption className="text-center text-sm text-texte-attenue">
                {image.legende}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => deplacer(-1)}
            className="min-h-11 rounded-md border border-bordure px-4 py-2"
          >
            {libelles.precedente}
          </button>
          <button
            type="button"
            onClick={() => dialogue.current?.close()}
            className="min-h-11 rounded-md bg-primaire px-4 py-2 text-primaire-contraste"
          >
            {libelles.fermer}
          </button>
          <button
            type="button"
            onClick={() => deplacer(1)}
            className="min-h-11 rounded-md border border-bordure px-4 py-2"
          >
            {libelles.suivante}
          </button>
        </div>
      </dialog>
    </>
  )
}
