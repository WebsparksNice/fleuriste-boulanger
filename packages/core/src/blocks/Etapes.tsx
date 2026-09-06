import { Conteneur } from '../components/ui/Conteneur'
import { EnTeteSection } from '../components/ui/EnTeteSection'
import { Section } from '../components/ui/Section'
import { TexteRiche } from '../components/richtext/TexteRiche'
import { cn } from '../lib/cn'
import type { BlocEtapesDoc } from '../types'
import { classesGrille, type ProprietesBloc } from './types'

/**
 * Suite de reperes en colonnes : les etapes d'une commande, les conditions de
 * livraison, les engagements de la maison.
 *
 * Numerote, le bloc sort une `<ol>` : l'ordre fait alors partie du sens, et un
 * lecteur d'ecran l'annonce sans avoir besoin du chiffre dessine. Celui-ci est
 * donc masque aux technologies d'assistance — sans quoi le numero serait lu
 * deux fois.
 */
export const Etapes = ({ bloc, config, contexte }: ProprietesBloc<BlocEtapesDoc>) => {
  const elements = bloc.elements ?? []
  if (elements.length === 0) return null

  const numerote = (bloc.numerotation ?? 'chiffres') === 'chiffres'
  const Liste = numerote ? 'ol' : 'ul'

  return (
    <Section apparence={bloc.apparence}>
      <Conteneur>
        <EnTeteSection
          surtitre={bloc.surtitre}
          titre={bloc.titre}
          intro={
            bloc.intro ? (
              <TexteRiche contenu={bloc.intro} config={config} langue={contexte.langue} />
            ) : null
          }
          disposition={bloc.dispositionEntete ?? 'empilee'}
          className="mb-10"
        />

        <Liste className={cn('grid grid-cols-1 gap-x-7 gap-y-10', classesGrille(bloc.colonnes ?? '3'))}>
          {elements.map((element, position) => (
            <li key={element.id ?? position} className="border-t border-bordure pt-6">
              {numerote ? (
                <p aria-hidden="true" className="chiffre-etape font-titres">
                  {String(position + 1).padStart(2, '0')}
                </p>
              ) : null}
              <h3 className="text-xl">{element.titre}</h3>
              {element.texte ? (
                <p className="mt-2.5 text-pretty text-texte-attenue">{element.texte}</p>
              ) : null}
            </li>
          ))}
        </Liste>
      </Conteneur>
    </Section>
  )
}
