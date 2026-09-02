import type { CleJour, Dictionnaire } from '../i18n'
import type { CreneauDoc, FermetureDoc, JourHoraireDoc } from '../types'

export const ORDRE_JOURS: CleJour[] = [
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
  'dimanche',
]

export type CreneauValide = { ouvre: string; ferme: string }

export type JourNormalise = {
  jour: CleJour
  ferme: boolean
  creneaux: CreneauValide[]
}

const creneauValide = (creneau: CreneauDoc): creneau is { ouvre: string; ferme: string } =>
  typeof creneau.ouvre === 'string' &&
  typeof creneau.ferme === 'string' &&
  creneau.ouvre.length === 5 &&
  creneau.ferme.length === 5

/**
 * Ramene les horaires du CMS a une semaine complete et ordonnee.
 *
 * Un jour absent de la saisie, sans creneau valide, ou explicitement coche
 * « ferme », ressort ferme : le rendu n'a plus a gerer ces trois cas.
 */
export const normaliserHoraires = (horaires?: JourHoraireDoc[] | null): JourNormalise[] => {
  const parJour = new Map<CleJour, JourHoraireDoc>()
  for (const entree of horaires ?? []) {
    if (entree.jour) parJour.set(entree.jour, entree)
  }

  return ORDRE_JOURS.map((jour) => {
    const saisie = parJour.get(jour)
    const creneaux = (saisie?.creneaux ?? []).filter(creneauValide)

    return {
      jour,
      ferme: Boolean(saisie?.ferme) || creneaux.length === 0,
      creneaux,
    }
  })
}

/** `{ ouvre: '07:00', ferme: '13:00' }` -> `07:00 – 13:00`. */
export const formaterCreneau = ({ ouvre, ferme }: CreneauValide): string =>
  `${ouvre} – ${ferme}`

/** `07:00 – 13:00 et 16:00 – 19:30`, ou « Ferme ». */
export const formaterJour = (jour: JourNormalise, t: Dictionnaire): string => {
  if (jour.ferme) return t.horaires.ferme
  return jour.creneaux
    .map(formaterCreneau)
    .join(` ${t.horaires.separateurCreneau} `)
}

/**
 * Jour de la semaine dans le fuseau du commerce.
 *
 * Le serveur peut tourner en UTC : sans conversion explicite, un site francais
 * changerait de jour a 1h ou 2h du matin, en pleine tournee du boulanger.
 */
export const jourActuel = (fuseau: string, maintenant = new Date()): CleJour => {
  const nomAnglais = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone: fuseau,
  }).format(maintenant)

  const correspondance: Record<string, CleJour> = {
    Monday: 'lundi',
    Tuesday: 'mardi',
    Wednesday: 'mercredi',
    Thursday: 'jeudi',
    Friday: 'vendredi',
    Saturday: 'samedi',
    Sunday: 'dimanche',
  }

  return correspondance[nomAnglais] ?? 'lundi'
}

export type FermetureNormalisee = {
  du: Date
  au: Date
  motif?: string
}

/**
 * Fermetures exceptionnelles encore a venir ou en cours.
 * Les periodes passees sont ecartees : personne n'a envie de relire en octobre
 * les conges de juillet.
 */
export const fermeturesAVenir = (
  fermetures?: FermetureDoc[] | null,
  maintenant = new Date(),
): FermetureNormalisee[] => {
  const aujourdhui = new Date(maintenant)
  aujourdhui.setHours(0, 0, 0, 0)

  return (fermetures ?? [])
    .flatMap((fermeture) => {
      if (!fermeture.du || !fermeture.au) return []
      const du = new Date(fermeture.du)
      const au = new Date(fermeture.au)
      if (Number.isNaN(du.getTime()) || Number.isNaN(au.getTime())) return []
      if (au < aujourdhui) return []
      return [{ du, au, motif: fermeture.motif ?? undefined }]
    })
    .sort((a, b) => a.du.getTime() - b.du.getTime())
}

/** Date lisible dans la langue du visiteur, ex. « 14 juillet 2026 ». */
export const formaterDate = (date: Date, langue: string, fuseau: string): string =>
  new Intl.DateTimeFormat(langue, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: fuseau,
  }).format(date)

/** `2026-07-14`, format attendu par schema.org. */
export const enDateIso = (date: Date): string => date.toISOString().slice(0, 10)
