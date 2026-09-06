import {
  Conteneur,
  FilDAriane,
  ImageMedia,
  Section,
  TexteRiche,
  Titre,
} from '@websparks/core/ui'
import {
  lienListeProduits,
  numeroPourAppel,
  obtenirDictionnaire,
  obtenirProduit,
  estPeuple,
  type Langue,
} from '@websparks/core'
import type { ChampsProduitCommande } from '@websparks/commande'
import { BoutonAjouterPanier } from '@websparks/commande/blocks'
import { notFound } from 'next/navigation'

import { obtenirContexte } from '@/lib/contexte'
import { site } from '@/site.config'

const libellesAllergenes: Record<string, string> = {
  gluten: 'Gluten',
  oeufs: 'Œufs',
  lait: 'Lait',
  'fruits-a-coque': 'Fruits à coque',
  arachides: 'Arachides',
  soja: 'Soja',
  sesame: 'Sésame',
  sulfites: 'Sulfites',
  lupin: 'Lupin',
  moutarde: 'Moutarde',
  celeri: 'Céleri',
  poisson: 'Poisson',
  crustaces: 'Crustacés',
  mollusques: 'Mollusques',
}

/**
 * Fiche d'un produit presente en vitrine.
 *
 * Aucun bouton d'achat : le seul appel a l'action est le telephone du commerce.
 * Le prix reste une indication, telle que saisie dans l'admin.
 */
export const FicheProduit = async ({ langue, slug }: { langue: Langue; slug: string }) => {
  const contexte = await obtenirContexte(langue)
  const t = obtenirDictionnaire(langue, site.dictionnaires)

  const produit = await obtenirProduit({
    payload: contexte.payload,
    langue,
    brouillon: contexte.brouillon,
    slug,
  })

  if (!produit) notFound()

  // Les champs de vente viennent du module, que le socle ne connaît pas.
  const vendable = produit as typeof produit & ChampsProduitCommande

  const telephone = contexte.etablissement?.telephone
  const galerie = (produit.galerie ?? []).filter((entree) => estPeuple(entree.image))

  return (
    <Section>
      <Conteneur>
        {site.options.filDAriane ? (
          <FilDAriane
            etapes={[
              { libelle: t.produits.titre, href: lienListeProduits(site, langue) },
              { libelle: produit.nom ?? '' },
            ]}
            t={t}
            className="mb-8"
          />
        ) : null}

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <ImageMedia
              media={produit.imagePrincipale}
              format="carre"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priorite
              className="rounded-lg bg-surface-attenuee"
            />
            {galerie.length > 0 ? (
              <ul className="grid grid-cols-3 gap-3">
                {galerie.map((entree, position) => (
                  <li key={entree.id ?? position}>
                    <ImageMedia
                      media={entree.image}
                      format="carre"
                      sizes="20vw"
                      className="rounded-md bg-surface-attenuee"
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="space-y-6">
            <Titre niveau={1}>{produit.nom}</Titre>

            {produit.prixIndicatif ? (
              <p className="text-xl">
                <span className="sr-only">{t.produits.prixIndicatif} : </span>
                {produit.prixIndicatif}
              </p>
            ) : null}

            <TexteRiche contenu={produit.description} config={site} langue={langue} />

            <dl className="space-y-4 border-t border-bordure pt-6">
              {produit.disponibilite ? (
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-wide text-texte-attenue">
                    {t.produits.disponibilite}
                  </dt>
                  <dd className="mt-1">{t.produits.disponibilites[produit.disponibilite]}</dd>
                </div>
              ) : null}

              {produit.allergenes?.length ? (
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-wide text-texte-attenue">
                    {t.produits.allergenes}
                  </dt>
                  <dd className="mt-1">
                    {produit.allergenes
                      .map((code) => libellesAllergenes[code] ?? code)
                      .join(', ')}
                  </dd>
                </div>
              ) : null}
            </dl>

            {site.modules?.commande && vendable.disponible ? (
              <BoutonAjouterPanier
                produit={{
                  id: produit.id,
                  nom: produit.nom,
                  quantiteMaxParCommande: vendable.quantiteMaxParCommande,
                }}
                langue={langue}
                avecQuantite
              />
            ) : null}

            {telephone ? (
              <a
                href={`tel:${numeroPourAppel(telephone)}`}
                className="inline-flex min-h-11 items-center rounded-md bg-primaire px-5 py-3 font-medium text-primaire-contraste"
              >
                {t.contact.nousAppeler}
              </a>
            ) : null}
          </div>
        </div>
      </Conteneur>
    </Section>
  )
}
