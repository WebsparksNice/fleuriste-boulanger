import type { ConfigSiteResolue } from '../config'
import { urlAbsolue } from '../config'
import type { CleJour } from '../i18n'
import { enDateIso, fermeturesAVenir, normaliserHoraires } from '../lib/horaires'
import { urlAbsolueMedia } from '../lib/urls'
import type { EtablissementDoc } from '../types'

/**
 * Type schema.org correspondant a chaque metier.
 * Doit rester aligne sur `TYPES_COMMERCE` dans la globale Etablissement.
 */
const typesSchema: Record<string, string> = {
  boulangerie: 'Bakery',
  patisserie: 'Bakery',
  fleuriste: 'Florist',
  boucherie: 'Store',
  epicerie: 'GroceryStore',
  cafe: 'CafeOrCoffeeShop',
  restaurant: 'Restaurant',
  autre: 'LocalBusiness',
}

const joursSchema: Record<CleJour, string> = {
  lundi: 'Monday',
  mardi: 'Tuesday',
  mercredi: 'Wednesday',
  jeudi: 'Thursday',
  vendredi: 'Friday',
  samedi: 'Saturday',
  dimanche: 'Sunday',
}

type Objet = Record<string, unknown>

/** Retire les cles vides : un JSON-LD truffe de `null` est refuse par les validateurs. */
const sansVide = (objet: Objet): Objet =>
  Object.fromEntries(
    Object.entries(objet).filter(([, valeur]) => {
      if (valeur === null || valeur === undefined || valeur === '') return false
      if (Array.isArray(valeur) && valeur.length === 0) return false
      return true
    }),
  )

/**
 * Donnees structurees LocalBusiness.
 *
 * C'est le levier le plus direct du referencement local : c'est ce fichier qui
 * dit a Google qu'il a affaire a une boulangerie situee a telle adresse, ouverte
 * a telles heures. Le type precis (`Bakery`, `Florist`) vaut mieux que
 * `LocalBusiness` seul, car il declenche des affichages specifiques.
 */
export const donneesLocalBusiness = (
  etablissement: EtablissementDoc | null | undefined,
  config: ConfigSiteResolue,
  maintenant = new Date(),
): Objet | null => {
  if (!etablissement?.nom) return null

  const horaires = normaliserHoraires(etablissement.horaires)

  // Un jour ferme n'a pas d'entree : l'absence vaut fermeture pour schema.org.
  const ouvertures = horaires.flatMap((jour) =>
    jour.creneaux.map((creneau) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${joursSchema[jour.jour]}`,
      opens: creneau.ouvre,
      closes: creneau.ferme,
    })),
  )

  // `opens` et `closes` identiques signalent une fermeture sur la periode.
  const fermetures = fermeturesAVenir(etablissement.fermeturesExceptionnelles, maintenant).map(
    (fermeture) => ({
      '@type': 'OpeningHoursSpecification',
      validFrom: enDateIso(fermeture.du),
      validThrough: enDateIso(fermeture.au),
      opens: '00:00',
      closes: '00:00',
    }),
  )

  const adresse = etablissement.adresse
  const geo = etablissement.geo
  const logo = urlAbsolueMedia(config, etablissement.logo)

  return sansVide({
    '@context': 'https://schema.org',
    '@type': typesSchema[etablissement.typeCommerce ?? 'autre'] ?? 'LocalBusiness',
    '@id': `${config.urlSite}/#etablissement`,
    name: etablissement.nom,
    description: etablissement.description ?? undefined,
    url: urlAbsolue(config, '/'),
    telephone: etablissement.telephone ?? undefined,
    email: etablissement.email ?? undefined,
    image: logo,
    logo,
    address: adresse
      ? sansVide({
          '@type': 'PostalAddress',
          streetAddress: [adresse.rue, adresse.complement].filter(Boolean).join(', ') || undefined,
          postalCode: adresse.codePostal ?? undefined,
          addressLocality: adresse.ville ?? undefined,
          addressCountry: adresse.pays ?? undefined,
        })
      : undefined,
    geo:
      typeof geo?.latitude === 'number' && typeof geo?.longitude === 'number'
        ? {
            '@type': 'GeoCoordinates',
            latitude: geo.latitude,
            longitude: geo.longitude,
          }
        : undefined,
    hasMap: etablissement.lienItineraire ?? undefined,
    openingHoursSpecification: ouvertures,
    specialOpeningHoursSpecification: fermetures,
    sameAs: (etablissement.reseauxSociaux ?? [])
      .map((reseau) => reseau.url)
      .filter((url): url is string => Boolean(url)),
    paymentAccepted: etablissement.moyensPaiement ?? undefined,
    isAccessibleForFree: undefined,
    publicAccess: etablissement.accessibilitePmr ? true : undefined,
  })
}

/** Donnees structurees d'une liste de questions/reponses. */
export const donneesFaq = (questions: { question: string; reponse: string }[]): Objet | null => {
  if (questions.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ question, reponse }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: reponse },
    })),
  }
}
