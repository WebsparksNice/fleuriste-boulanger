import Link from 'next/link'

import type { ConfigSiteResolue } from '../../config'
import { lienVers } from '../../config'
import type { Dictionnaire, Langue } from '../../i18n'
import { cn } from '../../lib/cn'

const etiquettes: Record<Langue, string> = {
  fr: 'FR',
  en: 'EN',
  es: 'ES',
  de: 'DE',
  it: 'IT',
  nl: 'NL',
}

const nomsNatifs: Record<Langue, string> = {
  fr: 'Francais',
  en: 'English',
  es: 'Espanol',
  de: 'Deutsch',
  it: 'Italiano',
  nl: 'Nederlands',
}

type ProprietesSelecteurLangue = {
  config: ConfigSiteResolue
  langueActive: Langue
  /**
   * Chemin equivalent dans chaque langue. Une page peut avoir un slug different
   * d'une langue a l'autre ; a defaut, on renvoie vers l'accueil de la langue
   * visee plutot que vers une URL qui n'existe pas.
   */
  alternatives?: Partial<Record<Langue, string>>
  t: Dictionnaire
  className?: string
}

export const SelecteurLangue = ({
  config,
  langueActive,
  alternatives,
  t,
  className,
}: ProprietesSelecteurLangue) => {
  if (config.langues.length < 2) return null

  return (
    <nav aria-label={t.navigation.changerDeLangue} className={className}>
      <ul className="flex items-center gap-2">
        {config.langues.map((langue) => {
          const actif = langue === langueActive
          const href = alternatives?.[langue] ?? lienVers(config, langue)

          return (
            <li key={langue}>
              <Link
                href={href}
                hrefLang={langue}
                lang={langue}
                aria-current={actif ? 'true' : undefined}
                className={cn(
                  'inline-flex min-h-11 items-center rounded-md px-2 text-sm',
                  actif ? 'font-semibold underline underline-offset-4' : 'text-texte-attenue',
                )}
              >
                <span aria-hidden="true">{etiquettes[langue]}</span>
                <span className="sr-only">{nomsNatifs[langue]}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
