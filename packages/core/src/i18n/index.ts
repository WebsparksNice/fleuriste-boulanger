import { en } from './en'
import { fr } from './fr'
import type { Dictionnaire, Langue } from './types'

/**
 * Dictionnaires fournis par le socle.
 * Les autres langues de `languesDisponibles` doivent etre apportees par l'app
 * (cf. `dictionnaires` dans site.config.ts), sinon le francais sert de repli.
 */
const dictionnairesSocle: Partial<Record<Langue, Dictionnaire>> = { fr, en }

export type SurchargesDictionnaires = Partial<Record<Langue, Dictionnaire>>

/**
 * Retourne les libelles d'interface pour une langue.
 * Usage : `const t = obtenirDictionnaire(langue)` puis `t.horaires.ferme`.
 */
export const obtenirDictionnaire = (
  langue: Langue,
  surcharges?: SurchargesDictionnaires,
): Dictionnaire => surcharges?.[langue] ?? dictionnairesSocle[langue] ?? fr

export { fr, en }
export { languesDisponibles, estLangue } from './types'
export type { Dictionnaire, Langue, CleJour } from './types'
