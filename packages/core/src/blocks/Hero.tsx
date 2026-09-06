import { Conteneur } from '../components/ui/Conteneur'
import { GroupeBoutons } from '../components/ui/Bouton'
import { ImageMedia } from '../components/media/ImageMedia'
import { Section } from '../components/ui/Section'
import { Surtitre } from '../components/ui/Surtitre'
import { cn } from '../lib/cn'
import { resoudreLiens } from '../lib/liens'
import type { BlocHeroDoc } from '../types'
import type { ProprietesBloc } from './types'

/**
 * Banniere de haut de page. Porte le h1 : un seul par page.
 *
 * En variante « couverture », un voile sombre reglable est pose sur la photo.
 * Sans lui, un texte blanc sur une photo claire tombe sous le contraste minimal
 * exige pour rester lisible.
 */
export const Hero = ({ bloc, config, contexte, premier }: ProprietesBloc<BlocHeroDoc>) => {
  const boutons = resoudreLiens(bloc.boutons, config, contexte.langue, contexte.etablissement)
  const variante = bloc.variante ?? 'couverture'
  const centre = bloc.alignement === 'centre' && variante !== 'lateral'

  const texte = (
    <div className={cn('max-w-2xl space-y-5', centre && 'mx-auto text-center')}>
      <Surtitre>{bloc.surtitre}</Surtitre>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl">{bloc.titre}</h1>
      {bloc.sousTitre ? (
        <p className="text-lg text-pretty opacity-90 sm:text-xl">{bloc.sousTitre}</p>
      ) : null}
      <GroupeBoutons liens={boutons} className={cn(centre && 'justify-center')} />
    </div>
  )

  if (variante === 'texte') {
    return (
      <Section apparence={bloc.apparence}>
        <Conteneur>{texte}</Conteneur>
      </Section>
    )
  }

  if (variante === 'lateral') {
    return (
      <Section apparence={bloc.apparence}>
        <Conteneur>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {texte}
            <ImageMedia
              media={bloc.image}
              format="paysage"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priorite={premier}
              className="rounded-lg bg-surface-attenuee"
            />
          </div>
        </Conteneur>
      </Section>
    )
  }

  const opacite = Math.min(Math.max(bloc.opaciteVoile ?? 35, 0), 80) / 100

  return (
    <section
      id={bloc.apparence?.ancre?.replace(/^#/, '') || undefined}
      className="relative isolate flex min-h-[60vh] items-end py-section text-white sm:min-h-[70vh]"
    >
      <ImageMedia
        media={bloc.image}
        format="naturel"
        sizes="100vw"
        priorite={premier}
        className="absolute inset-0 -z-20 size-full object-cover"
        classNameImage="size-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-black"
        style={{ opacity: opacite }}
      />
      <Conteneur>{texte}</Conteneur>
    </section>
  )
}
