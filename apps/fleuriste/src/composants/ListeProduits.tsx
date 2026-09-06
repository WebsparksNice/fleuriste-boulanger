import { classesGrille, taillesGrille } from '@websparks/core/blocks'
import { CarteProduit, Conteneur, Section, Titre } from '@websparks/core/ui'
import {
  lienListeProduits,
  listerCategories,
  listerProduits,
  obtenirDictionnaire,
  type Langue,
} from '@websparks/core'
import Link from 'next/link'

import { obtenirContexte } from '@/lib/contexte'
import { site } from '@/site.config'

type ProprietesListeProduits = {
  langue: Langue
  categorie?: string
  page?: string
}

/**
 * Listing des produits.
 *
 * Le filtre par categorie et la pagination passent par des liens et des
 * parametres d'URL, jamais par du JavaScript : chaque combinaison a sa propre
 * adresse, partageable et indexable, et la page reste utilisable sans script.
 */
export const ListeProduits = async ({ langue, categorie, page }: ProprietesListeProduits) => {
  const contexte = await obtenirContexte(langue)
  const t = obtenirDictionnaire(langue, site.dictionnaires)

  const categories = await listerCategories({ payload: contexte.payload, langue })
  const categorieActive = categories.find((entree) => entree.slug === categorie)
  const pageCourante = Math.max(Number.parseInt(page ?? '1', 10) || 1, 1)
  const base = lienListeProduits(site, langue)

  const { produits, pages } = await listerProduits({
    payload: contexte.payload,
    langue,
    brouillon: contexte.brouillon,
    categorie: categorieActive?.id,
    limite: site.options.produitsParPage,
    page: pageCourante,
  })

  const lienFiltre = (slug?: string) => (slug ? `${base}?categorie=${slug}` : base)

  return (
    <Section>
      <Conteneur>
        <Titre niveau={1} className="mb-8">
          {categorieActive?.nom ?? t.produits.titre}
        </Titre>

        {categories.length > 0 ? (
          <nav aria-label={t.produits.filtrerParCategorie} className="mb-10">
            <ul className="flex flex-wrap gap-2">
              <li>
                <Link
                  href={lienFiltre()}
                  aria-current={!categorieActive ? 'page' : undefined}
                  className={`inline-flex min-h-11 items-center rounded-plein border px-4 ${
                    categorieActive
                      ? 'border-bordure'
                      : 'border-primaire bg-primaire text-primaire-contraste'
                  }`}
                >
                  {t.produits.toutesCategories}
                </Link>
              </li>
              {categories.map((entree) => {
                const actif = entree.slug === categorieActive?.slug
                return (
                  <li key={entree.id}>
                    <Link
                      href={lienFiltre(entree.slug ?? undefined)}
                      aria-current={actif ? 'page' : undefined}
                      className={`inline-flex min-h-11 items-center rounded-plein border px-4 ${
                        actif ? 'border-primaire bg-primaire text-primaire-contraste' : 'border-bordure'
                      }`}
                    >
                      {entree.nom}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        ) : null}

        {produits.length === 0 ? (
          <p className="text-texte-attenue">{t.produits.aucunProduit}</p>
        ) : (
          <ul className={`grid grid-cols-1 gap-x-6 gap-y-10 ${classesGrille('3')}`}>
            {produits.map((produit) => (
              <li key={produit.id}>
                <CarteProduit
                  produit={produit}
                  config={site}
                  langue={langue}
                  sizes={taillesGrille('3')}
                  action={contexte.actionProduit?.(produit)}
                />
              </li>
            ))}
          </ul>
        )}

        {pages > 1 ? (
          <nav aria-label={t.general.pageSurTotal(pageCourante, pages)} className="mt-12">
            <ul className="flex items-center justify-between gap-4">
              <li>
                {pageCourante > 1 ? (
                  <Link
                    href={`${lienFiltre(categorieActive?.slug ?? undefined)}${
                      categorieActive ? '&' : '?'
                    }page=${pageCourante - 1}`}
                    className="inline-flex min-h-11 items-center rounded-md border border-bordure px-4"
                  >
                    {t.general.precedent}
                  </Link>
                ) : null}
              </li>
              <li aria-hidden="true" className="text-sm text-texte-attenue">
                {t.general.pageSurTotal(pageCourante, pages)}
              </li>
              <li>
                {pageCourante < pages ? (
                  <Link
                    href={`${lienFiltre(categorieActive?.slug ?? undefined)}${
                      categorieActive ? '&' : '?'
                    }page=${pageCourante + 1}`}
                    className="inline-flex min-h-11 items-center rounded-md border border-bordure px-4"
                  >
                    {t.general.suivant}
                  </Link>
                ) : null}
              </li>
            </ul>
          </nav>
        ) : null}
      </Conteneur>
    </Section>
  )
}
