import type { Block, CollectionConfig, Field, GlobalConfig } from 'payload'

import { blocCommande } from './blocks/commande'
import { champsProduitsCommande } from './champsProduits'
import { Commandes } from './collections/Commandes'
import { EvenementsStripe } from './collections/EvenementsStripe'
import { ReservationsCreneaux } from './collections/ReservationsCreneaux'
import { ConfigCommande } from './globals/ConfigCommande'

export type PiecesModuleCommande = {
  collections: CollectionConfig[]
  globals: GlobalConfig[]
  blocs: Block[]
  ongletProduits: { label: string; fields: Field[] }
}

/**
 * Pièces Payload du module de commande.
 *
 * À passer aux points d'extension de `creerConfigCore`. Le socle ne connaît
 * aucune de ces collections : il reçoit des objets de configuration, comme il
 * en recevrait d'un module écrit par quelqu'un d'autre.
 */
export const creerModuleCommande = (): PiecesModuleCommande => ({
  collections: [Commandes, ReservationsCreneaux, EvenementsStripe],
  globals: [ConfigCommande],
  blocs: [blocCommande],
  ongletProduits: { label: 'Vente en ligne', fields: champsProduitsCommande },
})

export { Commandes, ConfigCommande, EvenementsStripe, ReservationsCreneaux, blocCommande }
export { champsProduitsCommande } from './champsProduits'
export { STATUTS_COMMANDE, STATUTS_OCCUPANTS, STATUTS_PAIEMENT } from './statuts'
export type { StatutCommande, StatutPaiement } from './statuts'
