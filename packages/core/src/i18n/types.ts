/** Langues que le socle sait router et decliner. */
export const languesDisponibles = ['fr', 'en', 'es', 'de', 'it', 'nl'] as const

export type Langue = (typeof languesDisponibles)[number]

export const estLangue = (valeur: unknown): valeur is Langue =>
  typeof valeur === 'string' && (languesDisponibles as readonly string[]).includes(valeur)

export type CleJour =
  | 'lundi'
  | 'mardi'
  | 'mercredi'
  | 'jeudi'
  | 'vendredi'
  | 'samedi'
  | 'dimanche'

/**
 * Libelles d'interface du socle.
 *
 * Rien ici ne provient du CMS : ce sont les mots que le code ecrit lui-meme.
 * Un client peut en surcharger une partie via `site.config.ts`.
 */
export type Dictionnaire = {
  general: {
    allerAuContenu: string
    chargement: string
    retourAccueil: string
    pageIntrouvableTitre: string
    pageIntrouvableTexte: string
    precedent: string
    suivant: string
    pageSurTotal: (page: number, total: number) => string
  }
  navigation: {
    menuPrincipal: string
    ouvrirMenu: string
    fermerMenu: string
    filDAriane: string
    menuPied: string
    changerDeLangue: string
  }
  horaires: {
    titre: string
    ferme: string
    fermeAujourdhui: string
    ouvertAujourdhui: string
    ouvreA: (heure: string) => string
    fermeA: (heure: string) => string
    jours: Record<CleJour, string>
    separateurCreneau: string
    fermeturesExceptionnelles: string
    duAu: (du: string, au: string) => string
    le: (date: string) => string
  }
  produits: {
    titre: string
    voirTous: string
    voirLeProduit: string
    aucunProduit: string
    toutesCategories: string
    filtrerParCategorie: string
    prixIndicatif: string
    allergenes: string
    disponibilite: string
    disponibilites: {
      permanent: string
      saisonnier: string
      surCommande: string
    }
  }
  contact: {
    titre: string
    nousAppeler: string
    nousEcrire: string
    itineraire: string
    adresse: string
    telephone: string
    email: string
    suivezNous: string
    voirSurLaCarte: string
  }
  temoignages: {
    titre: string
    noteSur: (note: number, max: number) => string
  }
  galerie: {
    agrandir: (legende: string) => string
    fermer: string
    imagePrecedente: string
    imageSuivante: string
  }
  faq: {
    titre: string
  }
}
