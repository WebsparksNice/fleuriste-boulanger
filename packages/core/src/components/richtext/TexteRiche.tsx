import {
  LinkJSXConverter,
  RichText as RichTextPayload,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'

import type { ConfigSiteResolue } from '../../config'
import { lienVers } from '../../config'
import { cn } from '../../lib/cn'
import type { Langue } from '../../i18n'
import type { TexteRiche as ContenuRiche } from '../../types'

type ProprietesTexteRiche = {
  contenu?: ContenuRiche | null
  config: ConfigSiteResolue
  langue: Langue
  className?: string
}

/**
 * Rend le contenu Lexical de l'editeur.
 *
 * Les liens internes sont stockes comme des relations vers `pages` : sans
 * `internalDocToHref`, ils seraient rendus vides. On reconstruit donc l'URL avec
 * la meme fonction que le reste du site, prefixe de langue compris.
 */
export const TexteRiche = ({ contenu, config, langue, className }: ProprietesTexteRiche) => {
  if (!contenu) return null

  const convertisseurs: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({
      internalDocToHref: ({ linkNode }) => {
        const valeur = linkNode.fields.doc?.value
        const slug = typeof valeur === 'object' && valeur !== null ? (valeur as { slug?: string }).slug : undefined
        return slug ? lienVers(config, langue, slug) : '/'
      },
    }),
  })

  return (
    <div className={cn('texte-riche', className)}>
      <RichTextPayload data={contenu as never} converters={convertisseurs} />
    </div>
  )
}
