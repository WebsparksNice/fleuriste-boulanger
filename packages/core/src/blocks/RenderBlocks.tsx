import type { ConfigSiteResolue } from '../config'
import type { BlocContenu, ContexteRendu } from '../types'
import { Contact } from './Contact'
import { Cta } from './Cta'
import { Faq } from './Faq'
import { Galerie } from './Galerie'
import { Hero } from './Hero'
import { Horaires } from './Horaires'
import { Produits } from './Produits'
import { Temoignages } from './Temoignages'
import { TexteImage } from './TexteImage'

type ProprietesRenderBlocks = {
  contenu?: BlocContenu[] | null
  config: ConfigSiteResolue
  contexte: ContexteRendu
}

/**
 * Rend la suite de blocs d'une page.
 *
 * Le `switch` est exhaustif : ajouter un bloc a la config Payload sans lui
 * donner de rendu ici provoque une erreur de compilation, pas un trou silencieux
 * dans la page.
 */
export const RenderBlocks = ({ contenu, config, contexte }: ProprietesRenderBlocks) => {
  if (!contenu?.length) return null

  return (
    <>
      {contenu.map((bloc, index) => {
        const cle = bloc.id ?? `${bloc.blockType}-${index}`
        const commun = { config, contexte, premier: index === 0 }

        switch (bloc.blockType) {
          case 'hero':
            return <Hero key={cle} bloc={bloc} {...commun} />
          case 'texteImage':
            return <TexteImage key={cle} bloc={bloc} {...commun} />
          case 'produits':
            return <Produits key={cle} bloc={bloc} {...commun} />
          case 'galerie':
            return <Galerie key={cle} bloc={bloc} {...commun} />
          case 'horaires':
            return <Horaires key={cle} bloc={bloc} {...commun} />
          case 'temoignages':
            return <Temoignages key={cle} bloc={bloc} {...commun} />
          case 'faq':
            return <Faq key={cle} bloc={bloc} {...commun} />
          case 'contact':
            return <Contact key={cle} bloc={bloc} {...commun} />
          case 'cta':
            return <Cta key={cle} bloc={bloc} {...commun} />
          default: {
            const jamais: never = bloc
            return jamais
          }
        }
      })}
    </>
  )
}
