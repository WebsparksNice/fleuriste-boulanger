import { fusionnerTheme } from './fusionnerTheme'
import { variablesCss } from './variablesCss'
import type { ThemePartiel } from './tokens'

/**
 * Injecte les jetons du client sur `:root`.
 *
 * Server Component : la feuille de style part dans le HTML, il n'y a ni
 * hydratation ni bascule de theme au chargement. Zero JS client.
 *
 * `href` et `precedence` demandent a React de remonter la balise dans le
 * `<head>` et de la dedoublonner. Sans cela, les couleurs seraient appliquees
 * apres le premier rendu et l'on verrait la page changer d'apparence.
 */
export const StyleTheme = ({ theme }: { theme?: ThemePartiel }) => (
  <style
    href="theme-client"
    precedence="high"
    // eslint-disable-next-line react/no-danger -- contenu genere depuis une config statique, jamais depuis le CMS
    dangerouslySetInnerHTML={{ __html: `:root{${variablesCss(fusionnerTheme(theme))}}` }}
  />
)
