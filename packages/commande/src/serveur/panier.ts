import type { Payload } from 'payload'

import type { EchecCommande, LigneDemandee, PanierCalcule, ProduitCommandable } from './types'

type ProduitBrut = {
  id: string | number
  nom?: string | null
  slug?: string | null
  prix?: number | null
  disponible?: boolean | null
  delaiPreparationHeures?: number | null
  quantiteMaxParCommande?: number | null
  noteCommande?: string | null
  imagePrincipale?: unknown
  allergenes?: string[] | null
  _status?: string | null
}

const enCentimes = (prix: number): number => Math.round(prix * 100)

const normaliser = (brut: ProduitBrut): ProduitCommandable | null => {
  if (typeof brut.prix !== 'number' || brut.prix < 0) return null

  return {
    id: brut.id,
    nom: brut.nom ?? '',
    slug: brut.slug ?? null,
    prixCentimes: enCentimes(brut.prix),
    disponible: Boolean(brut.disponible),
    delaiPreparationHeures: brut.delaiPreparationHeures ?? 0,
    quantiteMaxParCommande: brut.quantiteMaxParCommande ?? 10,
    noteCommande: brut.noteCommande ?? null,
    imagePrincipale: brut.imagePrincipale,
    allergenes: brut.allergenes ?? null,
  }
}

/** Produits que le visiteur peut réellement commander, dans l'ordre du catalogue. */
export const listerProduitsCommandables = async (
  payload: Payload,
  langue: string,
): Promise<ProduitCommandable[]> => {
  const { docs } = await payload.find({
    collection: 'produits',
    locale: langue as never,
    depth: 1,
    limit: 200,
    pagination: false,
    overrideAccess: true,
    sort: ['ordre', 'nom'],
    where: {
      and: [
        { _status: { equals: 'published' } },
        { disponible: { equals: true } },
        { prix: { greater_than: 0 } },
      ],
    },
  })

  return (docs as ProduitBrut[]).flatMap((brut) => {
    const produit = normaliser(brut)
    return produit && produit.disponible ? [produit] : []
  })
}

/**
 * Recalcule le panier depuis la base.
 *
 * Le navigateur n'envoie que des identifiants de produit et des quantités : ni
 * prix, ni total. Tout ce qui touche à l'argent est relu ici, de sorte qu'une
 * requête forgée avec « prix: 0 » n'ait littéralement rien à modifier.
 */
export const calculerPanier = async (
  payload: Payload,
  langue: string,
  lignesDemandees: LigneDemandee[],
): Promise<{ ok: true; panier: PanierCalcule } | EchecCommande> => {
  const demandes = lignesDemandees.filter((ligne) => ligne.quantite > 0)
  if (demandes.length === 0) return { ok: false, erreur: 'panier_vide' }

  const { docs } = await payload.find({
    collection: 'produits',
    locale: langue as never,
    depth: 0,
    limit: demandes.length,
    pagination: false,
    overrideAccess: true,
    where: {
      and: [
        { id: { in: demandes.map((ligne) => ligne.produitId) } },
        { _status: { equals: 'published' } },
      ],
    },
  })

  const parIdentifiant = new Map<string, ProduitCommandable>()
  for (const brut of docs as ProduitBrut[]) {
    const produit = normaliser(brut)
    if (produit) parIdentifiant.set(String(produit.id), produit)
  }

  const lignes = []
  let totalCentimes = 0
  let delaiPreparationHeures = 0

  for (const demande of demandes) {
    const produit = parIdentifiant.get(String(demande.produitId))

    if (!produit || !produit.disponible) {
      return { ok: false, erreur: 'produit_indisponible', details: produit?.nom }
    }

    if (!Number.isInteger(demande.quantite) || demande.quantite < 1) {
      return { ok: false, erreur: 'quantite_invalide', details: produit.nom }
    }

    if (demande.quantite > produit.quantiteMaxParCommande) {
      return {
        ok: false,
        erreur: 'quantite_invalide',
        details: `${produit.nom} : ${produit.quantiteMaxParCommande} maximum par commande`,
      }
    }

    const totalLigneCentimes = produit.prixCentimes * demande.quantite
    totalCentimes += totalLigneCentimes
    delaiPreparationHeures = Math.max(delaiPreparationHeures, produit.delaiPreparationHeures)

    lignes.push({
      produit,
      quantite: demande.quantite,
      prixUnitaireCentimes: produit.prixCentimes,
      totalLigneCentimes,
    })
  }

  return { ok: true, panier: { lignes, totalCentimes, delaiPreparationHeures } }
}
