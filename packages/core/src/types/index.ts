import type { Payload } from 'payload'
import type { ReactNode } from 'react'

import type { Langue } from '../i18n'

/**
 * Formes de donnees telles que Payload les renvoie.
 *
 * Le socle ne peut pas importer `payload-types.ts` : ce fichier est genere dans
 * chaque app cliente. On decrit donc ici la structure attendue, que les types
 * generes satisfont naturellement. C'est aussi ce qui garde le socle compilable
 * seul, sans base de donnees ni app.
 */

export type Reference<T> = T | string | number

/** Un document lie peut arriver peuple ou reduit a son identifiant, selon la profondeur demandee. */
export const estPeuple = <T extends object>(valeur: Reference<T> | null | undefined): valeur is T =>
  typeof valeur === 'object' && valeur !== null

export type TailleMedia = {
  url?: string | null
  width?: number | null
  height?: number | null
}

export type MediaDoc = {
  id: string | number
  url?: string | null
  alt?: string | null
  legende?: string | null
  width?: number | null
  height?: number | null
  mimeType?: string | null
  focalX?: number | null
  focalY?: number | null
  sizes?: Record<string, TailleMedia | undefined> | null
}

export type TypeLien = 'interne' | 'externe' | 'telephone' | 'email' | 'ancre'
export type StyleLien = 'primaire' | 'secondaire' | 'discret'

export type LienDoc = {
  type?: TypeLien | null
  style?: StyleLien | null
  libelle?: string | null
  reference?: Reference<{ slug?: string | null }> | null
  url?: string | null
  telephone?: string | null
  email?: string | null
  ancre?: string | null
  nouvelOnglet?: boolean | null
  id?: string | null
}

export type FondBloc = 'defaut' | 'attenue' | 'primaire'
export type EspacementBloc = 'compact' | 'normal' | 'large'

export type ApparenceDoc = {
  fond?: FondBloc | null
  espacement?: EspacementBloc | null
  ancre?: string | null
}

export type CleJourDoc =
  | 'lundi'
  | 'mardi'
  | 'mercredi'
  | 'jeudi'
  | 'vendredi'
  | 'samedi'
  | 'dimanche'

export type CreneauDoc = {
  ouvre?: string | null
  ferme?: string | null
  id?: string | null
}

export type JourHoraireDoc = {
  jour?: CleJourDoc | null
  ferme?: boolean | null
  creneaux?: CreneauDoc[] | null
  id?: string | null
}

export type FermetureDoc = {
  du?: string | null
  au?: string | null
  motif?: string | null
  id?: string | null
}

export type ReseauSocialDoc = {
  plateforme?: string | null
  url?: string | null
  id?: string | null
}

export type AdresseDoc = {
  rue?: string | null
  complement?: string | null
  codePostal?: string | null
  ville?: string | null
  pays?: string | null
}

export type EtablissementDoc = {
  nom?: string | null
  typeCommerce?: string | null
  slogan?: string | null
  description?: string | null
  logo?: Reference<MediaDoc> | null
  telephone?: string | null
  email?: string | null
  adresse?: AdresseDoc | null
  geo?: { latitude?: number | null; longitude?: number | null } | null
  lienItineraire?: string | null
  accessibilitePmr?: boolean | null
  moyensPaiement?: string | null
  horaires?: JourHoraireDoc[] | null
  fermeturesExceptionnelles?: FermetureDoc[] | null
  reseauxSociaux?: ReseauSocialDoc[] | null
}

export type NavigationDoc = {
  menuPrincipal?: LienDoc[] | null
  ctaEnTete?: { actif?: boolean | null; lien?: LienDoc | null } | null
  menuPied?: LienDoc[] | null
  mentionPied?: string | null
}

export type ReglagesSeoDoc = {
  suffixeTitre?: string | null
  descriptionParDefaut?: string | null
  imagePartage?: Reference<MediaDoc> | null
  autoriserIndexation?: boolean | null
  verificationGoogle?: string | null
}

export type MetaSeoDoc = {
  titre?: string | null
  description?: string | null
  image?: Reference<MediaDoc> | null
  noindex?: boolean | null
}

/** Le contenu Lexical est opaque cote socle : seul le convertisseur JSX le lit. */
export type TexteRiche = { root: unknown } & Record<string, unknown>

export type CategorieDoc = {
  id: string | number
  nom?: string | null
  slug?: string | null
  ordre?: number | null
}

export type ProduitDoc = {
  id: string | number
  nom?: string | null
  slug?: string | null
  imagePrincipale?: Reference<MediaDoc> | null
  description?: TexteRiche | null
  resume?: string | null
  prixIndicatif?: string | null
  disponibilite?: 'permanent' | 'saisonnier' | 'surCommande' | null
  categorie?: Reference<CategorieDoc> | null
  allergenes?: string[] | null
  galerie?: { image?: Reference<MediaDoc> | null; id?: string | null }[] | null
  miseEnAvant?: boolean | null
  ordre?: number | null
  seo?: MetaSeoDoc | null
  updatedAt?: string | null
}

/** Vignette nue (defaut) ou posee sur une surface, avec son propre appel a l'action. */
export type VarianteCarteProduit = 'sobre' | 'carte'

export type TemoignageDoc = {
  id: string | number
  auteur?: string | null
  texte?: string | null
  note?: number | null
  date?: string | null
  source?: string | null
  visible?: boolean | null
}

export type FaqDoc = {
  id: string | number
  question?: string | null
  reponse?: TexteRiche | null
  ordre?: number | null
}

export type PageDoc = {
  id: string | number
  titre?: string | null
  slug?: string | null
  contenu?: BlocContenu[] | null
  seo?: MetaSeoDoc | null
  updatedAt?: string | null
  _status?: 'draft' | 'published' | null
}

/* --- Blocs --- */

type BaseBloc = {
  id?: string | null
  apparence?: ApparenceDoc | null
}

export type BlocHeroDoc = BaseBloc & {
  blockType: 'hero'
  surtitre?: string | null
  variante?: 'couverture' | 'lateral' | 'texte' | null
  titre?: string | null
  sousTitre?: string | null
  image?: Reference<MediaDoc> | null
  alignement?: 'gauche' | 'centre' | null
  opaciteVoile?: number | null
  boutons?: LienDoc[] | null
}

export type BlocGalerieDoc = BaseBloc & {
  blockType: 'galerie'
  titre?: string | null
  images?: { image?: Reference<MediaDoc> | null; legende?: string | null; id?: string | null }[] | null
  colonnes?: '2' | '3' | '4' | null
  format?: 'carre' | 'portrait' | 'paysage' | 'naturel' | null
  agrandissement?: boolean | null
}

export type BlocTexteImageDoc = BaseBloc & {
  blockType: 'texteImage'
  surtitre?: string | null
  positionImage?: 'gauche' | 'droite' | null
  formatImage?: 'paysage' | 'carre' | 'portrait' | null
  image?: Reference<MediaDoc> | null
  titre?: string | null
  texte?: TexteRiche | null
  boutons?: LienDoc[] | null
}

export type BlocHorairesDoc = BaseBloc & {
  blockType: 'horaires'
  titre?: string | null
  source?: 'etablissement' | 'personnalise' | null
  horairesPersonnalises?: JourHoraireDoc[] | null
  afficherFermetures?: boolean | null
  note?: string | null
}

export type BlocProduitsDoc = BaseBloc & {
  blockType: 'produits'
  surtitre?: string | null
  dispositionEntete?: DispositionEntete | null
  variante?: VarianteCarteProduit | null
  titre?: string | null
  intro?: TexteRiche | null
  mode?: 'misesEnAvant' | 'categorie' | 'selection' | 'tous' | null
  categorie?: Reference<CategorieDoc> | null
  selection?: Reference<ProduitDoc>[] | null
  limite?: number | null
  colonnes?: '2' | '3' | '4' | null
  afficherPrix?: boolean | null
  afficherLienVoirTout?: boolean | null
}

export type BlocTemoignagesDoc = BaseBloc & {
  blockType: 'temoignages'
  surtitre?: string | null
  titre?: string | null
  mode?: 'recents' | 'selection' | null
  limite?: number | null
  selection?: Reference<TemoignageDoc>[] | null
  afficherNotes?: boolean | null
}

export type BlocFaqDoc = BaseBloc & {
  blockType: 'faq'
  titre?: string | null
  mode?: 'toutes' | 'selection' | null
  selection?: Reference<FaqDoc>[] | null
  genererJsonLd?: boolean | null
}

export type BlocContactDoc = BaseBloc & {
  blockType: 'contact'
  titre?: string | null
  intro?: TexteRiche | null
  afficherCoordonnees?: boolean | null
  afficherHoraires?: boolean | null
  afficherReseaux?: boolean | null
  afficherCarte?: boolean | null
  imageCarte?: Reference<MediaDoc> | null
}

export type DispositionEntete = 'empilee' | 'repartie'

export type BlocEtapesDoc = BaseBloc & {
  blockType: 'etapes'
  surtitre?: string | null
  titre?: string | null
  intro?: TexteRiche | null
  numerotation?: 'chiffres' | 'aucune' | null
  colonnes?: '2' | '3' | '4' | null
  dispositionEntete?: DispositionEntete | null
  elements?: { titre?: string | null; texte?: string | null; id?: string | null }[] | null
}

export type BlocCtaDoc = BaseBloc & {
  blockType: 'cta'
  surtitre?: string | null
  titre?: string | null
  texte?: string | null
  boutons?: LienDoc[] | null
}

/**
 * Bloc apporte par un module optionnel.
 *
 * Le socle n'en connait ni les champs ni le rendu : il se contente de le
 * transmettre au composant enregistre pour ce `blockType`. C'est ce qui permet
 * a un module d'ajouter des blocs sans que le socle ait a l'importer, et donc
 * sans qu'il pese sur les clients qui ne l'activent pas.
 */
export type BlocExterne = {
  blockType: string
  id?: string | null
  apparence?: ApparenceDoc | null
  [champ: string]: unknown
}

export type BlocContenu =
  | BlocHeroDoc
  | BlocGalerieDoc
  | BlocTexteImageDoc
  | BlocHorairesDoc
  | BlocProduitsDoc
  | BlocTemoignagesDoc
  | BlocFaqDoc
  | BlocContactDoc
  | BlocEtapesDoc
  | BlocCtaDoc

/**
 * Contexte transmis a chaque bloc.
 *
 * Les blocs sont des Server Components : ils recuperent eux-memes ce dont ils
 * ont besoin (produits, temoignages) plutot que d'attendre que la page le fasse
 * pour eux.
 */
export type ContexteRendu = {
  langue: Langue
  payload: Payload
  /** Vrai quand la page est rendue depuis la previsualisation de l'admin. */
  brouillon: boolean
  etablissement: EtablissementDoc | null
  /**
   * Action posee sous chaque produit par un module optionnel : ajout au panier,
   * demande de devis, ce que le module decide.
   *
   * Le socle ne sait pas ce qu'elle contient et n'importe rien pour l'afficher ;
   * absente, les fiches et les vignettes restent purement informatives.
   */
  actionProduit?: (produit: ProduitDoc) => ReactNode
}
