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

export type LignePanier = {
  produit: ProduitCommandable
  quantite: number
  totalLigneCentimes: number
}

export type PanierResolu = {
  lignes: LignePanier[]
  totalCentimes: number
  /** Produits du cookie devenus introuvables ou retirés de la vente. */
  ignores: number
}

/**
 * Résout le panier pour l'affichage, sans jamais échouer.
 *
 * Un produit retiré de la vente entre deux visites ne doit pas transformer la
 * page en erreur : la ligne disparaît, le visiteur en est informé, et il garde
 * le reste de son panier. La validation, elle, reste stricte — c'est
 * `calculerPanier` qui la porte.
 */
export const resoudrePanier = async (
  payload: Payload,
  langue: string,
  quantites: Record<string, number>,
): Promise<PanierResolu> => {
  const identifiants = Object.keys(quantites)
  if (identifiants.length === 0) return { lignes: [], totalCentimes: 0, ignores: 0 }

  const { docs } = await payload.find({
    collection: 'produits',
    locale: langue as never,
    depth: 1,
    limit: identifiants.length,
    pagination: false,
    overrideAccess: true,
    where: {
      and: [
        { id: { in: identifiants } },
        { _status: { equals: 'published' } },
        { disponible: { equals: true } },
      ],
    },
  })

  const parIdentifiant = new Map<string, ProduitCommandable>()
  for (const brut of docs as ProduitBrut[]) {
    const produit = normaliser(brut)
    if (produit?.disponible) parIdentifiant.set(String(produit.id), produit)
  }

  const lignes: LignePanier[] = []
  let totalCentimes = 0

  for (const [identifiant, quantite] of Object.entries(quantites)) {
    const produit = parIdentifiant.get(identifiant)
    if (!produit) continue

    // Le maximum a pu baisser depuis la mise au panier.
    const retenue = Math.min(quantite, produit.quantiteMaxParCommande)
    const totalLigneCentimes = produit.prixCentimes * retenue

    totalCentimes += totalLigneCentimes
    lignes.push({ produit, quantite: retenue, totalLigneCentimes })
  }

  return { lignes, totalCentimes, ignores: identifiants.length - lignes.length }
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
