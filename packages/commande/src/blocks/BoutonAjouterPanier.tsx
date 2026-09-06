import { CHEMIN_PANIER } from '../chemins'
import { dictionnaireCommande } from '../i18n'

type ProprietesBoutonAjouter = {
  produit: { id: string | number; nom?: string | null; quantiteMaxParCommande?: number | null }
  langue: string
  /** Ajoute un champ de quantité à côté du bouton. Réservé aux fiches produit. */
  avecQuantite?: boolean
  className?: string
}

/**
 * Ajoute un produit au panier.
 *
 * Un formulaire HTML, pas un bouton piloté par du script : la page reste
 * utilisable sans JavaScript, et l'ajout survit à une connexion capricieuse.
 * L'absence de champ `retour` est volontaire — la route reprend la page d'où
 * vient la requête, ce qui évite de connaître l'adresse courante ici.
 */
export const BoutonAjouterPanier = ({
  produit,
  langue,
  avecQuantite = false,
  className,
}: ProprietesBoutonAjouter) => {
  const t = dictionnaireCommande(langue)
  const nom = produit.nom ?? ''
  const maximum = produit.quantiteMaxParCommande ?? 10
  const champQuantite = `quantite-${produit.id}`

  return (
    <form method="post" action={CHEMIN_PANIER} className={className}>
      <input type="hidden" name="action" value="ajouter" />
      <input type="hidden" name="produit" value={String(produit.id)} />

      <div className="flex items-center gap-2">
        {avecQuantite ? (
          <>
            <label htmlFor={champQuantite} className="sr-only">
              {t.quantitePour(nom)}
            </label>
            <input
              id={champQuantite}
              name="quantite"
              type="number"
              inputMode="numeric"
              min={1}
              max={maximum}
              step={1}
              defaultValue={1}
              className="h-11 w-20 rounded-md border border-bordure bg-surface px-3 text-center"
            />
          </>
        ) : (
          <input type="hidden" name="quantite" value="1" />
        )}

        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-primaire px-4 font-medium text-primaire transition-colors hover:bg-primaire hover:text-primaire-contraste"
        >
          {t.ajouterAuPanier}
          <span className="sr-only"> — {nom}</span>
        </button>
      </div>
    </form>
  )
}
