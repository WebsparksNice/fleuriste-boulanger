import { heureLocale, partiesLocales } from './fuseau'

/** `350` -> `3,50 €`. Le calcul reste en centimes, l'euro n'apparaît qu'à l'affichage. */
export const formaterEuros = (centimes: number, langue = 'fr'): string =>
  new Intl.NumberFormat(langue, { style: 'currency', currency: 'EUR' }).format(centimes / 100)

/** `samedi 5 septembre` */
export const formaterJourLong = (instant: Date, langue: string, fuseau: string): string =>
  new Intl.DateTimeFormat(langue, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: fuseau,
  }).format(instant)

/** `samedi 5 septembre, 10:00 – 10:15` */
export const formaterCreneau = (
  debut: Date,
  fin: Date,
  langue: string,
  fuseau: string,
): string =>
  `${formaterJourLong(debut, langue, fuseau)}, ${heureLocale(debut, fuseau)} – ${heureLocale(fin, fuseau)}`

/** `10:00 – 10:15`, sans la date : utile quand elle est déjà portée par un titre. */
export const formaterPlage = (debut: Date, fin: Date, fuseau: string): string =>
  `${heureLocale(debut, fuseau)} – ${heureLocale(fin, fuseau)}`

/** Compare deux instants sur leur jour local. */
export const memeJourLocal = (a: Date, b: Date, fuseau: string): boolean => {
  const gauche = partiesLocales(a, fuseau)
  const droite = partiesLocales(b, fuseau)
  return (
    gauche.annee === droite.annee && gauche.mois === droite.mois && gauche.jour === droite.jour
  )
}
