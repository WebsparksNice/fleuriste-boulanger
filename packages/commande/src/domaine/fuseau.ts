/**
 * Conversions entre heure locale du commerce et instants absolus.
 *
 * Tout est stocke en UTC et affiche dans le fuseau du commerce. Les seuls
 * endroits ou l'on manipule une « heure murale » (07:30) sont la saisie des
 * horaires de retrait et l'affichage : entre les deux, on ne raisonne qu'en
 * instants. C'est ce qui permet aux deux nuits de changement d'heure de se
 * comporter correctement sans cas particulier disperse dans le code.
 */

export type PartiesLocales = {
  annee: number
  mois: number
  jour: number
  heures: number
  minutes: number
}

const formateur = (fuseau: string) =>
  new Intl.DateTimeFormat('en-US', {
    timeZone: fuseau,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

/** Decompose un instant en date et heure locales du fuseau donne. */
export const partiesLocales = (instant: Date, fuseau: string): PartiesLocales => {
  const parties = formateur(fuseau).formatToParts(instant)
  const valeur = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parties.find((partie) => partie.type === type)?.value ?? '0')

  return {
    annee: valeur('year'),
    mois: valeur('month'),
    jour: valeur('day'),
    // `hour12: false` peut rendre 24 pour minuit selon les moteurs.
    heures: valeur('hour') % 24,
    minutes: valeur('minute'),
  }
}

/** Decalage du fuseau par rapport a UTC, en minutes, a cet instant precis. */
export const decalageMinutes = (instant: Date, fuseau: string): number => {
  const parties = formateur(fuseau).formatToParts(instant)
  const valeur = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parties.find((partie) => partie.type === type)?.value ?? '0')

  const commeUtc = Date.UTC(
    valeur('year'),
    valeur('month') - 1,
    valeur('day'),
    valeur('hour') % 24,
    valeur('minute'),
    valeur('second'),
  )

  // Le format ne porte pas les millisecondes : on tronque l'instant a la
  // seconde des deux cotes pour que la difference soit un multiple de 60 000.
  const instantALaSeconde = Math.floor(instant.getTime() / 1000) * 1000
  return (commeUtc - instantALaSeconde) / 60000
}

/**
 * Instant correspondant a une heure murale locale.
 *
 * Retourne `null` quand cette heure n'existe pas : la nuit du passage a l'heure
 * d'ete, l'horloge saute de 02:00 a 03:00 et 02:30 n'a jamais lieu. Un creneau
 * de retrait place la ne doit pas etre propose, et surtout pas glisse
 * silencieusement a 03:30.
 *
 * Lors du retour a l'heure d'hiver, 02:30 se produit deux fois ; on retient la
 * premiere occurrence, celle qui suit l'ordre naturel de la journee.
 */
export const instantDepuisHeureLocale = (
  annee: number,
  mois: number,
  jour: number,
  heures: number,
  minutes: number,
  fuseau: string,
): Date | null => {
  const heureMurale = Date.UTC(annee, mois - 1, jour, heures, minutes)
  const UN_JOUR = 86_400_000

  /*
   * On encadre la transition : le decalage de la veille et celui du lendemain
   * donnent les deux interpretations possibles de cette heure murale. Une seule
   * passe ne suffit pas — au retour a l'heure d'hiver, elle retombe toujours sur
   * la seconde occurrence de 02:30 et jamais sur la premiere.
   */
  const candidats = [
    heureMurale - decalageMinutes(new Date(heureMurale - UN_JOUR), fuseau) * 60000,
    heureMurale - decalageMinutes(new Date(heureMurale + UN_JOUR), fuseau) * 60000,
  ]

  const valides = candidats.filter((horodatage) => {
    const parties = partiesLocales(new Date(horodatage), fuseau)
    return (
      parties.annee === annee &&
      parties.mois === mois &&
      parties.jour === jour &&
      parties.heures === heures &&
      parties.minutes === minutes
    )
  })

  // Aucun candidat : l'heure n'existe pas ce jour-la (passage a l'heure d'ete).
  // Deux candidats : elle a lieu deux fois, on retient la premiere, celle qui
  // suit l'ordre naturel de la journee.
  return valides.length > 0 ? new Date(Math.min(...valides)) : null
}

/** `2026-09-02` dans le fuseau du commerce. */
export const dateLocaleIso = (instant: Date, fuseau: string): string => {
  const { annee, mois, jour } = partiesLocales(instant, fuseau)
  return `${annee}-${String(mois).padStart(2, '0')}-${String(jour).padStart(2, '0')}`
}

/** `07:30` dans le fuseau du commerce. */
export const heureLocale = (instant: Date, fuseau: string): string => {
  const { heures, minutes } = partiesLocales(instant, fuseau)
  return `${String(heures).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

const JOURS = [
  'dimanche',
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
] as const

export type CleJourSemaine = (typeof JOURS)[number]

/** Jour de la semaine tel qu'il est vecu dans le fuseau du commerce. */
export const jourSemaineLocal = (instant: Date, fuseau: string): CleJourSemaine => {
  const { annee, mois, jour } = partiesLocales(instant, fuseau)
  // Midi UTC : suffisamment loin des bords pour qu'aucun decalage ne change le jour.
  const index = new Date(Date.UTC(annee, mois - 1, jour, 12)).getUTCDay()
  return JOURS[index] as CleJourSemaine
}

/** Ajoute des jours a une date locale exprimee en `AAAA-MM-JJ`. */
export const ajouterJours = (dateIso: string, jours: number): string => {
  const [annee, mois, jour] = dateIso.split('-').map(Number) as [number, number, number]
  const decalee = new Date(Date.UTC(annee, mois - 1, jour + jours))
  return decalee.toISOString().slice(0, 10)
}

/**
 * Bornes d'une journée locale, en instants absolus.
 *
 * On ne peut pas ajouter 24 heures au début de la journée : les jours de
 * changement d'heure en durent 23 ou 25. On calcule donc les deux minuits.
 */
export const bornesJourLocal = (
  dateIso: string,
  fuseau: string,
): { debut: Date; fin: Date } | null => {
  const [annee, mois, jour] = dateIso.split('-').map(Number) as [number, number, number]
  const suivant = ajouterJours(dateIso, 1)
  const [anneeF, moisF, jourF] = suivant.split('-').map(Number) as [number, number, number]

  const debut = instantDepuisHeureLocale(annee, mois, jour, 0, 0, fuseau)
  const fin = instantDepuisHeureLocale(anneeF, moisF, jourF, 0, 0, fuseau)

  return debut && fin ? { debut, fin } : null
}
