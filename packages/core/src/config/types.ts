import type { Langue, SurchargesDictionnaires } from '../i18n'
import type { ThemePartiel } from '../theme'

/** Segments d'URL pilotes par le client, declines par langue. */
export type SegmentsRoutes = {
  /** Ex. `{ fr: 'nos-pains', en: 'our-breads' }`. */
  produits?: Partial<Record<Langue, string>>
  /** Section de commande, si le module est active. Ex. `{ fr: 'commander' }`. */
  commande?: Partial<Record<Langue, string>>
}

/**
 * Modules optionnels actives pour ce client.
 *
 * Le socle ne connait que le drapeau : il ne contient aucun code de module et
 * n'en importe aucun. Le drapeau sert uniquement a savoir s'il faut construire
 * un lien vers la section correspondante.
 */
export type ModulesActifs = {
  commande?: boolean
}

export type OptionsSite = {
  /** Nombre de produits par page sur la page listing. */
  produitsParPage?: number
  /** Affiche le fil d'Ariane sur les pages internes. */
  filDAriane?: boolean
  /**
   * Empeche toute indexation (robots.txt + meta robots).
   * A laisser a `true` tant que le site n'est pas livre.
   */
  bloquerIndexation?: boolean
}

export type ConfigSite = {
  /** Identifiant technique du client, utilise dans les logs et le cache. */
  cle: string
  /** URL canonique absolue, sans slash final. Ex. `https://boulangerie-martin.fr`. */
  urlSite: string
  /**
   * Langues du site, la premiere etant la langue par defaut.
   * La langue par defaut n'est pas prefixee dans les URL.
   */
  langues: readonly [Langue, ...Langue[]]
  theme?: ThemePartiel
  /** Surcharge des libelles d'interface du socle. */
  dictionnaires?: SurchargesDictionnaires
  /**
   * Fuseau horaire du commerce, pour savoir quel jour mettre en avant dans les
   * horaires. Par defaut `Europe/Paris`.
   */
  fuseau?: string
  routes?: SegmentsRoutes
  modules?: ModulesActifs
  /**
   * Classes a poser sur `<html>` : c'est la que l'app injecte les variables
   * next/font (next/font exige des appels statiques, impossible depuis le socle).
   */
  classesPolices?: string
  options?: OptionsSite
}

/** Config apres application des valeurs par defaut. */
export type ConfigSiteResolue = Omit<ConfigSite, 'options' | 'langues' | 'fuseau'> & {
  langues: readonly Langue[]
  langueParDefaut: Langue
  fuseau: string
  options: Required<OptionsSite>
}
