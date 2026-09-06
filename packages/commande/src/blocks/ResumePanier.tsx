import Link from 'next/link'

import type { ConfigSiteResolue } from '@websparks/core'
import { lienListeProduits } from '@websparks/core'

import { CHEMIN_PANIER } from '../chemins'
import { formaterEuros } from '../domaine/formats'
import { dictionnaireCommande } from '../i18n'
import type { PanierResolu } from '../serveur/panier'

type ProprietesResumePanier = {
  panier: PanierResolu
  config: ConfigSiteResolue
  langue: string
  /** Affiche les commandes d'édition. Faux pour un simple récapitulatif. */
  modifiable?: boolean
}

const CLASSES_COMPTEUR =
  'inline-flex size-9 items-center justify-center rounded-md border border-bordure bg-fond text-lg leading-none transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-bordure disabled:hover:text-current'

/**
 * Contenu du panier.
 *
 * Chaque ligne porte ses propres formulaires — changer la quantité, retirer.
 * Ils vivent donc en dehors du formulaire de commande : le HTML interdit
 * d'imbriquer deux formulaires, et la page de commande contient déjà le sien.
 *
 * Les boutons « − » et « + » sont des `submit` qui portent la quantité visée
 * dans leur propre `value` : un clic, un envoi, aucune ligne de JavaScript.
 * Descendre à zéro retire la ligne, ce dont la route se charge déjà.
 */
export const ResumePanier = ({
  panier,
  config,
  langue,
  modifiable = true,
}: ProprietesResumePanier) => {
  const t = dictionnaireCommande(langue)

  if (panier.lignes.length === 0) {
    return (
      <div className="text-center">
        <p className="font-medium">{t.panierVide}</p>
        <p className="mt-1 text-texte-attenue">{t.panierVideAide}</p>
        <p className="mt-5">
          <Link
            href={lienListeProduits(config, langue as never)}
            className="inline-flex min-h-11 items-center rounded-md bg-primaire px-5 font-medium text-primaire-contraste"
          >
            {t.voirLesProduits}
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div>
      {panier.ignores > 0 ? (
        <p
          role="status"
          className="mb-4 rounded-md border border-bordure bg-surface-attenuee p-3 text-sm"
        >
          {t.lignesRetirees(panier.ignores)}
        </p>
      ) : null}

      <ul className="divide-y divide-bordure border-b border-bordure">
        {panier.lignes.map((ligne) => {
          const maximum = ligne.produit.quantiteMaxParCommande ?? 10

          return (
            <li
              key={ligne.produit.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-3 py-4 first:pt-0"
            >
              {/*
                Sur mobile, le nom occupe sa propre ligne : partager la rangee
                avec le compteur et le total le comprimait sous sa largeur de
                texte, et il debordait de sa colonne.
              */}
              <span className="min-w-full sm:min-w-0 sm:flex-1">
                <span className="block font-medium">{ligne.produit.nom}</span>
                <span className="block text-sm text-texte-attenue">
                  {formaterEuros(ligne.produit.prixCentimes, langue)}
                  {ligne.produit.noteCommande ? ` — ${ligne.produit.noteCommande}` : ''}
                </span>
              </span>

              {modifiable ? (
                <form method="post" action={CHEMIN_PANIER} className="flex items-center gap-1.5">
                  <input type="hidden" name="action" value="definir" />
                  <input type="hidden" name="produit" value={String(ligne.produit.id)} />

                  <button
                    type="submit"
                    name="quantite"
                    value={ligne.quantite - 1}
                    className={CLASSES_COMPTEUR}
                  >
                    <span aria-hidden="true">−</span>
                    <span className="sr-only">{t.diminuerQuantite(ligne.produit.nom)}</span>
                  </button>

                  <span className="min-w-8 text-center tabular-nums">
                    <span className="sr-only">{t.quantitePour(ligne.produit.nom)} : </span>
                    {ligne.quantite}
                  </span>

                  <button
                    type="submit"
                    name="quantite"
                    value={ligne.quantite + 1}
                    disabled={ligne.quantite >= maximum}
                    className={CLASSES_COMPTEUR}
                  >
                    <span aria-hidden="true">+</span>
                    <span className="sr-only">{t.augmenterQuantite(ligne.produit.nom)}</span>
                  </button>
                </form>
              ) : (
                <span className="tabular-nums">× {ligne.quantite}</span>
              )}

              <span className="prix ml-auto w-24 shrink-0 text-right font-titres tabular-nums">
                {formaterEuros(ligne.totalLigneCentimes, langue)}
              </span>

              {modifiable ? (
                <form method="post" action={CHEMIN_PANIER}>
                  <input type="hidden" name="action" value="retirer" />
                  <input type="hidden" name="produit" value={String(ligne.produit.id)} />
                  <button
                    type="submit"
                    className="inline-flex min-h-11 items-center text-sm text-texte-attenue underline underline-offset-4 hover:no-underline"
                  >
                    {t.retirer}
                    <span className="sr-only"> — {ligne.produit.nom}</span>
                  </button>
                </form>
              ) : null}
            </li>
          )
        })}
      </ul>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="mention text-texte-attenue">{t.sousTotal}</p>
        <p className="prix font-titres text-2xl tabular-nums">
          {formaterEuros(panier.totalCentimes, langue)}
        </p>
      </div>
      <p className="mt-2 text-sm text-texte-attenue">{t.totalIndicatif}</p>

      {modifiable ? (
        <div className="mt-4">
          <form method="post" action={CHEMIN_PANIER}>
            <input type="hidden" name="action" value="vider" />
            <button
              type="submit"
              className="inline-flex min-h-11 items-center text-sm text-texte-attenue underline underline-offset-4 hover:no-underline"
            >
              {t.viderLePanier}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  )
}
