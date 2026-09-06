import { SLUG_ACCUEIL } from '@websparks/core'
import type { Metadata } from 'next'

import { PageCms } from '@/composants/PageCms'
import { metadonneesPage } from '@/lib/metadonnees'
import { resoudreLangue } from '@/lib/contexte'
import { site } from '@/site.config'

type Parametres = { params: Promise<{ locale: string }> }

export const generateStaticParams = () => site.langues.map((locale) => ({ locale }))

export const generateMetadata = async ({ params }: Parametres): Promise<Metadata> => {
  const { locale } = await params
  return metadonneesPage(resoudreLangue(locale), SLUG_ACCUEIL)
}

/** Accueil : la page dont le slug est `accueil`, servie a la racine. */
const PageAccueil = async ({ params }: Parametres) => {
  const { locale } = await params
  return <PageCms langue={resoudreLangue(locale)} slug={SLUG_ACCUEIL} />
}

export default PageAccueil
