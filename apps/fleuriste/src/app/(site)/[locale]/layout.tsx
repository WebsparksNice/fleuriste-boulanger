import '@/styles/globals.css'

import { IndicateurPanier } from '@websparks/commande/blocks'
import { SiteLayout } from '@websparks/core'
import { StyleTheme } from '@websparks/core/theme'
import type { ReactNode } from 'react'

import { classesPolices } from '@/polices'
import { obtenirDonneesGabarit, resoudreLangue } from '@/lib/contexte'
import { site } from '@/site.config'

/**
 * Gabarit racine du site public.
 *
 * Il vit sous `[locale]` et non a la racine du groupe : c'est le seul endroit
 * ou la langue est connue, et l'attribut `lang` de `<html>` doit etre juste
 * pour que les lecteurs d'ecran prononcent correctement le contenu.
 */
export const generateStaticParams = () => site.langues.map((locale) => ({ locale }))

// Les pages sont mises en cache et purgees a chaque publication dans l'admin.
// Le delai d'une heure sert de filet : il garantit qu'un changement de jour se
// reflete dans les horaires meme si aucune purge n'a eu lieu.
export const revalidate = 3600

const LayoutSite = async ({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params
  const langue = resoudreLangue(locale)
  const { etablissement, navigation } = await obtenirDonneesGabarit(langue)

  return (
    <html lang={langue} className={classesPolices}>
      <body className="antialiased">
        <StyleTheme theme={site.theme} />
        <SiteLayout
          config={site}
          langue={langue}
          etablissement={etablissement}
          navigation={navigation}
          actionsEnTete={
            site.modules?.commande ? (
              <IndicateurPanier config={site} langue={langue} />
            ) : null
          }
        >
          {children}
        </SiteLayout>
      </body>
    </html>
  )
}

export default LayoutSite
