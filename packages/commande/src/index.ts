/**
 * Module de commande — click & collect.
 *
 * Optionnel : un site qui ne le déclare pas n'installe pas ce paquet et n'en
 * embarque aucune ligne. Le socle ne l'importe jamais ; c'est l'app cliente qui
 * branche ses pièces sur les points d'extension prévus.
 */

/**
 * Champs que le module ajoute a la fiche produit du socle.
 *
 * Le socle type `ProduitDoc` sans eux : il ignore l'existence du module. Les
 * apps qui l'activent croisent les deux types plutot que de multiplier les
 * conversions au fil des composants.
 */
export type ChampsProduitCommande = {
  prix?: number | null
  disponible?: boolean | null
  delaiPreparationHeures?: number | null
  quantiteMaxParCommande?: number | null
  noteCommande?: string | null
}

export { definirCommande } from './config'
export type { ModuleCommande, OptionsModuleCommande } from './config'
export * from './chemins'
export { modeConnect } from './serveur/connect'
export { dictionnaireCommande } from './i18n'
export type { DictionnaireCommande } from './i18n'
export {
  bornesJourLocal,
  creneauProposable,
  dateLocaleIso,
  formaterCreneau,
  formaterEuros,
  genererCreneaux,
  grouperParJour,
  heureLocale,
  instantDepuisHeureLocale,
} from './domaine'
export type { Creneau, ReglesCreneaux } from './domaine'
