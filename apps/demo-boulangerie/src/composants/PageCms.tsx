import { rendusCommande } from '@websparks/commande/blocks'
import { RenderBlocks } from '@websparks/core/blocks'
import { obtenirPage } from '@websparks/core'
import type { Langue } from '@websparks/core'
import { notFound } from 'next/navigation'

import { obtenirContexte } from '@/lib/contexte'
import { site } from '@/site.config'

/** Rend une page composee de blocs dans l'admin. */
export const PageCms = async ({ langue, slug }: { langue: Langue; slug: string }) => {
  const contexte = await obtenirContexte(langue)
  const page = await obtenirPage({
    payload: contexte.payload,
    langue,
    brouillon: contexte.brouillon,
    slug,
  })

  if (!page) notFound()

  return (
    <RenderBlocks
      contenu={page.contenu}
      config={site}
      contexte={contexte}
      // Rendus apportés par les modules activés pour ce client.
      rendus={rendusCommande}
    />
  )
}
