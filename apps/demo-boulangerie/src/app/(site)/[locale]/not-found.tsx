import { Conteneur, Section, Titre } from '@websparks/core/ui'
import { lienVers, obtenirDictionnaire } from '@websparks/core'
import Link from 'next/link'

import { site } from '@/site.config'

/**
 * Page 404.
 *
 * Rendue sans parametre de route : elle peut etre atteinte depuis n'importe
 * quelle URL, y compris une qui ne contient aucune langue exploitable. On
 * retombe donc sur la langue par defaut du site.
 */
const PageIntrouvable = () => {
  const langue = site.langueParDefaut
  const t = obtenirDictionnaire(langue, site.dictionnaires)

  return (
    <Section>
      <Conteneur etroit>
        <Titre niveau={1}>{t.general.pageIntrouvableTitre}</Titre>
        <p className="mt-4 text-texte-attenue">{t.general.pageIntrouvableTexte}</p>
        <p className="mt-8">
          <Link
            href={lienVers(site, langue)}
            className="inline-flex min-h-11 items-center rounded-md bg-primaire px-5 py-3 font-medium text-primaire-contraste"
          >
            {t.general.retourAccueil}
          </Link>
        </p>
      </Conteneur>
    </Section>
  )
}

export default PageIntrouvable
