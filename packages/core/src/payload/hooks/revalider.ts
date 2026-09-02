import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Purge le rendu statique apres une modification dans l'admin.
 *
 * On invalide tout le layout plutot que des chemins precis : un site vitrine
 * tient en quelques dizaines de pages, et le pied de page comme l'en-tete
 * dependent des globales, donc une modification isolee a presque toujours un
 * effet global. Cela evite surtout d'oublier une page (listing, sitemap,
 * JSON-LD) apres une republication.
 */
const purgerLeSite = (origine: string) => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Hors contexte de requete Next — script de seed, migration, tache planifiee —
    // il n'y a aucun cache a purger. Cas normal : on n'affiche pas de trace.
    console.debug(`[revalidation] hors requete Next, ignoree pour ${origine}`)
  }
}

export const revaliderApresChangement: CollectionAfterChangeHook = ({ collection, doc }) => {
  purgerLeSite(collection.slug)
  return doc
}

export const revaliderApresSuppression: CollectionAfterDeleteHook = ({ collection, doc }) => {
  purgerLeSite(collection.slug)
  return doc
}

export const revaliderGlobaleApresChangement: GlobalAfterChangeHook = ({ global, doc }) => {
  purgerLeSite(global.slug)
  return doc
}
