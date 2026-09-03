import type { ConfigSiteResolue } from '../config'
import type { BlocContenu, BlocExterne, ContexteRendu } from '../types'
import { Contact } from './Contact'
import { Cta } from './Cta'
import { Faq } from './Faq'
import { Galerie } from './Galerie'
import { Hero } from './Hero'
import { Horaires } from './Horaires'
import { Produits } from './Produits'
import { Temoignages } from './Temoignages'
import { TexteImage } from './TexteImage'
import type { RegistreBlocs } from './types'

/** Blocs rendus par le socle lui-meme. Tout le reste vient des modules. */
const TYPES_DU_SOCLE = new Set<BlocContenu['blockType']>([
  'hero',
  'texteImage',
  'produits',
  'galerie',
  'horaires',
  'temoignages',
  'faq',
  'contact',
  'cta',
])

const estBlocDuSocle = (bloc: BlocContenu | BlocExterne): bloc is BlocContenu =>
  TYPES_DU_SOCLE.has(bloc.blockType as BlocContenu['blockType'])

type ProprietesRenderBlocks = {
  contenu?: (BlocContenu | BlocExterne)[] | null
  config: ConfigSiteResolue
  contexte: ContexteRendu
  /**
   * Rendus apportes par les modules optionnels, indexes par `blockType`.
   * Absent, seuls les blocs du socle sont rendus.
   */
  rendus?: RegistreBlocs
}

/**
 * Rend la suite de blocs d'une page.
 *
 * Le `switch` reste exhaustif sur les blocs du socle : en ajouter un a la
 * configuration Payload sans lui donner de rendu provoque une erreur de
 * compilation, pas un trou silencieux dans la page.
 *
 * Les autres `blockType` sont cherches dans le registre fourni par les modules.
 * Un bloc sans rendu est ignore avec un avertissement plutot que de faire
 * tomber la page : le contenu appartient au commercant, et desactiver un module
 * apres coup ne doit pas rendre son site inaccessible.
 */
export const RenderBlocks = ({ contenu, config, contexte, rendus }: ProprietesRenderBlocks) => {
  if (!contenu?.length) return null

  return (
    <>
      {contenu.map((bloc, index) => {
        const cle = bloc.id ?? `${bloc.blockType}-${index}`
        const commun = { config, contexte, premier: index === 0 }

        if (!estBlocDuSocle(bloc)) {
          const Rendu = rendus?.[bloc.blockType]

          if (!Rendu) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn(
                `[RenderBlocks] aucun rendu enregistre pour le bloc « ${bloc.blockType} »`,
              )
            }
            return null
          }

          return <Rendu key={cle} bloc={bloc} {...commun} />
        }

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
