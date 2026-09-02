import {
  ajouterJours,
  dateLocaleIso,
  instantDepuisHeureLocale,
  jourSemaineLocal,
  type CleJourSemaine,
} from './fuseau'

/** Plage d'ouverture au retrait, en heure murale locale. */
export type PlageRetrait = {
  debut: string
  fin: string
}

export type JourRetrait = {
  jour: CleJourSemaine
  ferme?: boolean | null
  plages?: PlageRetrait[] | null
}

export type ReglesCreneaux = {
  /** Duree d'un creneau, en minutes. */
  dureeMinutes: number
  /** Nombre de commandes acceptees par creneau. */
  capaciteParCreneau: number
  /** Temps minimal entre la commande et le retrait, en heures. */
  delaiMinimumHeures: number
  /** Nombre de jours ouverts a la reservation, a partir d'aujourd'hui. */
  horizonJours: number
  horaires: JourRetrait[]
  /** Jours de fermeture exceptionnelle, en `AAAA-MM-JJ` local. */
  joursFermes: string[]
  fuseau: string
}

export type Creneau = {
  debut: Date
  fin: Date
  /** Identifiant stable du creneau : l'instant de debut en ISO. */
  cle: string
  /** Date locale `AAAA-MM-JJ`, pour le regroupement a l'affichage. */
  jour: string
}

const FORMAT_HEURE = /^([01]\d|2[0-3]):([0-5]\d)$/

/** `07:30` -> 450 minutes depuis minuit. `null` si la valeur est inexploitable. */
const enMinutes = (heure: string | null | undefined): number | null => {
  if (typeof heure !== 'string') return null
  const correspondance = FORMAT_HEURE.exec(heure)
  if (!correspondance) return null
  return Number(correspondance[1]) * 60 + Number(correspondance[2])
}

/**
 * Creneaux de retrait proposables.
 *
 * Le calcul est entierement serveur et ne depend d'aucune saisie du visiteur :
 * la meme fonction sert a afficher la liste et a valider la commande, ce qui
 * interdit qu'un creneau fabrique a la main passe la validation.
 *
 * La capacite n'est pas traitee ici : elle depend de l'etat de la base et se
 * verifie au moment de la reservation, dans une transaction.
 */
export const genererCreneaux = (regles: ReglesCreneaux, maintenant: Date): Creneau[] => {
  const { dureeMinutes, delaiMinimumHeures, horizonJours, fuseau } = regles

  if (dureeMinutes <= 0 || horizonJours <= 0) return []

  const parJour = new Map<CleJourSemaine, JourRetrait>()
  for (const entree of regles.horaires ?? []) {
    if (entree.jour) parJour.set(entree.jour, entree)
  }

  const fermes = new Set(regles.joursFermes ?? [])
  const premierRetraitPossible = new Date(
    maintenant.getTime() + delaiMinimumHeures * 3_600_000,
  )

  const creneaux: Creneau[] = []
  let jourCourant = dateLocaleIso(maintenant, fuseau)

  for (let decalage = 0; decalage < horizonJours; decalage++) {
    const jourIso = jourCourant
    jourCourant = ajouterJours(jourCourant, 1)

    if (fermes.has(jourIso)) continue

    const [annee, mois, jour] = jourIso.split('-').map(Number) as [number, number, number]

    // Midi : un point sur de la journee pour en deduire le jour de la semaine,
    // quel que soit le decalage du fuseau.
    const midi = instantDepuisHeureLocale(annee, mois, jour, 12, 0, fuseau)
    if (!midi) continue

    const reglage = parJour.get(jourSemaineLocal(midi, fuseau))
    if (!reglage || reglage.ferme) continue

    for (const plage of reglage.plages ?? []) {
      const ouverture = enMinutes(plage.debut)
      const fermeture = enMinutes(plage.fin)
      if (ouverture === null || fermeture === null || fermeture <= ouverture) continue

      for (let minute = ouverture; minute + dureeMinutes <= fermeture; minute += dureeMinutes) {
        const debut = instantDepuisHeureLocale(
          annee,
          mois,
          jour,
          Math.floor(minute / 60),
          minute % 60,
          fuseau,
        )

        // Heure murale inexistante : c'est la nuit du passage a l'heure d'ete.
        // Le creneau n'est simplement pas propose.
        if (!debut) continue

        if (debut < premierRetraitPossible) continue

        creneaux.push({
          debut,
          fin: new Date(debut.getTime() + dureeMinutes * 60_000),
          cle: debut.toISOString(),
          jour: jourIso,
        })
      }
    }
  }

  return creneaux.sort((a, b) => a.debut.getTime() - b.debut.getTime())
}

/**
 * Verifie qu'un creneau soumis fait bien partie de ceux que le serveur propose.
 *
 * Appelee a la validation de la commande : le creneau arrive du formulaire,
 * donc du visiteur, et ne merite aucune confiance.
 */
export const creneauProposable = (
  cle: string,
  regles: ReglesCreneaux,
  maintenant: Date,
): Creneau | null => genererCreneaux(regles, maintenant).find((creneau) => creneau.cle === cle) ?? null

/** Regroupe les creneaux par jour local, dans l'ordre chronologique. */
export const grouperParJour = (creneaux: Creneau[]): { jour: string; creneaux: Creneau[] }[] => {
  const groupes = new Map<string, Creneau[]>()

  for (const creneau of creneaux) {
    const existants = groupes.get(creneau.jour)
    if (existants) existants.push(creneau)
    else groupes.set(creneau.jour, [creneau])
  }

  return [...groupes.entries()].map(([jour, liste]) => ({ jour, creneaux: liste }))
}
