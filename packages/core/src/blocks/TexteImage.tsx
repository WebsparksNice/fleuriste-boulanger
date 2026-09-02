import { Conteneur } from '../components/ui/Conteneur'
import { GroupeBoutons } from '../components/ui/Bouton'
import { ImageMedia } from '../components/media/ImageMedia'
import { Section } from '../components/ui/Section'
import { TexteRiche } from '../components/richtext/TexteRiche'
import { Titre } from '../components/ui/Titre'
import { cn } from '../lib/cn'
import { resoudreLiens } from '../lib/liens'
import type { BlocTexteImageDoc } from '../types'
import type { ProprietesBloc } from './types'

/**
 * Texte et image cote a cote.
 *
 * L'inversion se fait avec `lg:order-*` : sur mobile, l'image reste toujours
 * au-dessus du texte, et l'ordre du DOM suit l'ordre de lecture.
 */
export const TexteImage = ({ bloc, config, contexte, premier }: ProprietesBloc<BlocTexteImageDoc>) => {
  const boutons = resoudreLiens(bloc.boutons, config, contexte.langue, contexte.etablissement)
  const imageAGauche = bloc.positionImage === 'gauche'

  return (
    <Section apparence={bloc.apparence}>
      <Conteneur>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <ImageMedia
            media={bloc.image}
            format={bloc.formatImage ?? 'paysage'}
            sizes="(min-width: 1024px) 50vw, 100vw"
            priorite={premier}
            className={cn('rounded-lg bg-surface-attenuee', imageAGauche && 'lg:order-first')}
          />
          <div className="space-y-4">
            {bloc.titre ? <Titre>{bloc.titre}</Titre> : null}
            <TexteRiche contenu={bloc.texte} config={config} langue={contexte.langue} />
            <GroupeBoutons liens={boutons} />
          </div>
        </div>
      </Conteneur>
    </Section>
  )
}
