import dynamique from 'next/dynamic'

import { Conteneur } from '../components/ui/Conteneur'
import { ImageMedia } from '../components/media/ImageMedia'
import { Section } from '../components/ui/Section'
import { Titre } from '../components/ui/Titre'
import { obtenirDictionnaire } from '../i18n'
import { cn } from '../lib/cn'
import { cheminMedia } from '../lib/urls'
import { estPeuple, type BlocGalerieDoc } from '../types'
import type { ImageGalerie } from './GalerieAgrandissable.client'
import { classesGrille, taillesGrille, type ProprietesBloc } from './types'

/**
 * Import differe de la visionneuse.
 *
 * Avec un import statique, Next rattache le composant client au lot JavaScript
 * de toutes les pages qui contiennent une galerie, meme celles ou l'editeur n'a
 * pas active l'agrandissement. Le chargement differe le place dans un fichier a
 * part, telecharge uniquement quand le composant est reellement rendu.
 */
const GalerieAgrandissable = dynamique(() =>
  import('./GalerieAgrandissable.client').then((module) => module.GalerieAgrandissable),
)

const formats = {
  carre: 'aspect-square',
  portrait: 'aspect-[3/4]',
  paysage: 'aspect-[16/10]',
  naturel: '',
} as const

export const Galerie = ({ bloc, config, contexte }: ProprietesBloc<BlocGalerieDoc>) => {
  const t = obtenirDictionnaire(contexte.langue, config.dictionnaires)
  const colonnes = bloc.colonnes ?? '3'
  const format = bloc.format ?? 'carre'
  const sizes = taillesGrille(colonnes)
  const grille = classesGrille(colonnes)

  const entrees = (bloc.images ?? []).filter((entree) => estPeuple(entree.image))
  if (entrees.length === 0) return null

  return (
    <Section apparence={bloc.apparence}>
      <Conteneur>
        {bloc.titre ? <Titre className="mb-8">{bloc.titre}</Titre> : null}

        {bloc.agrandissement && format !== 'naturel' ? (
          <GalerieAgrandissable
            images={entrees.flatMap((entree): ImageGalerie[] => {
              const media = entree.image
              if (!estPeuple(media)) return []
              const source = cheminMedia(media.url)
              if (!source) return []
              return [
                {
                  url: source,
                  alt: media.alt ?? '',
                  legende: entree.legende ?? media.legende ?? undefined,
                  largeur: media.width ?? undefined,
                  hauteur: media.height ?? undefined,
                },
              ]
            })}
            classesGrille={grille}
            classeFormat={formats[format]}
            sizes={sizes}
            libelles={{
              agrandir: t.galerie.agrandir,
              fermer: t.galerie.fermer,
              precedente: t.galerie.imagePrecedente,
              suivante: t.galerie.imageSuivante,
            }}
          />
        ) : (
          <ul className={cn('grid grid-cols-1 gap-4', grille)}>
            {entrees.map((entree, position) => (
              <li key={entree.id ?? position}>
                <figure>
                  <ImageMedia
                    media={entree.image}
                    format={format}
                    sizes={sizes}
                    className="rounded-md bg-surface-attenuee"
                  />
                  {entree.legende ? (
                    <figcaption className="mt-2 text-sm text-texte-attenue">
                      {entree.legende}
                    </figcaption>
                  ) : null}
                </figure>
              </li>
            ))}
          </ul>
        )}
      </Conteneur>
    </Section>
  )
}
