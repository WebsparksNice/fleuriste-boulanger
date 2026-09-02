import type { ReactNode } from 'react'

import { EnTete } from '../components/navigation/EnTete'
import { LienEvitement } from '../components/navigation/LienEvitement'
import { PiedDePage } from '../components/navigation/PiedDePage'
import type { ConfigSiteResolue } from '../config'
import { obtenirDictionnaire, type Langue } from '../i18n'
import { JsonLd } from '../seo/JsonLd'
import { donneesLocalBusiness } from '../seo/localBusiness'
import type { EtablissementDoc, NavigationDoc } from '../types'

type ProprietesSiteLayout = {
  children: ReactNode
  config: ConfigSiteResolue
  langue: Langue
  etablissement?: EtablissementDoc | null
  navigation?: NavigationDoc | null
  /** Chemins equivalents dans les autres langues, pour le selecteur de langue. */
  alternatives?: Partial<Record<Langue, string>>
}

/**
 * Ossature commune a toutes les pages publiques.
 *
 * Le JSON-LD LocalBusiness est emis une fois ici, au niveau du gabarit : il
 * decrit le commerce, pas la page, et le dupliquer sur chaque page brouillerait
 * le signal envoye a Google.
 */
export const SiteLayout = ({
  children,
  config,
  langue,
  etablissement,
  navigation,
  alternatives,
}: ProprietesSiteLayout) => {
  const t = obtenirDictionnaire(langue, config.dictionnaires)

  return (
    <>
      <JsonLd donnees={donneesLocalBusiness(etablissement, config)} />
      <LienEvitement libelle={t.general.allerAuContenu} />

      <div className="flex min-h-dvh flex-col">
        <EnTete
          navigation={navigation}
          etablissement={etablissement}
          config={config}
          langue={langue}
          alternatives={alternatives}
          t={t}
        />

        <main id="contenu" className="flex-1">
          {children}
        </main>

        <PiedDePage
          navigation={navigation}
          etablissement={etablissement}
          config={config}
          langue={langue}
          t={t}
        />
      </div>
    </>
  )
}
