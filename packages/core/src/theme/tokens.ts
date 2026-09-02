/**
 * Jetons de design du socle.
 *
 * Chaque jeton devient une variable CSS injectee sur `:root` par <StyleTheme />,
 * puis exposee a Tailwind via `@theme inline` (voir styles/base.css).
 * Aucune valeur ici n'est propre a un client : ce sont les valeurs de repli.
 */

export type JetonsCouleurs = {
  /** Couleur d'identite, utilisee pour les actions principales. */
  primaire: string
  primaireSurvol: string
  /** Couleur de texte posee sur `primaire` (doit rester lisible : ratio >= 4.5:1). */
  primaireContraste: string
  secondaire: string
  secondaireSurvol: string
  secondaireContraste: string
  /** Ponctuation visuelle (badges, soulignements). */
  accent: string
  /** Fond general de la page. */
  fond: string
  /** Fond des cartes et blocs surelevés. */
  surface: string
  /** Fond des sections alternees. */
  surfaceAttenuee: string
  texte: string
  texteAttenue: string
  bordure: string
  succes: string
  erreur: string
}

export type JetonsPolices = {
  /** Pile de polices des titres. Une app passe ici la variable next/font, ex. `var(--police-titres)`. */
  titres: string
  corps: string
  graisseTitres: string
  graisseCorps: string
  /** Interlignage des titres. */
  interligneTitres: string
}

export type JetonsRayons = {
  sm: string
  md: string
  lg: string
  xl: string
  plein: string
}

export type JetonsEspacements = {
  /** Padding vertical d'une section, decline par la prop `espacement` des blocs. */
  sectionCompact: string
  section: string
  sectionLarge: string
  /** Marge laterale mobile. */
  gouttiere: string
  /** Largeur maximale du contenu. */
  conteneur: string
  /** Largeur maximale d'un paragraphe (confort de lecture). */
  prose: string
}

export type JetonsOmbres = {
  sm: string
  md: string
  lg: string
}

export type Theme = {
  couleurs: JetonsCouleurs
  polices: JetonsPolices
  rayons: JetonsRayons
  espacements: JetonsEspacements
  ombres: JetonsOmbres
}

export type ThemePartiel = {
  [K in keyof Theme]?: Partial<Theme[K]>
}

/**
 * Theme de repli : neutre, volontairement sans identite de marque.
 * Un client qui ne surcharge rien obtient un site sobre mais coherent.
 */
export const themeParDefaut: Theme = {
  couleurs: {
    primaire: '#1f2937',
    primaireSurvol: '#111827',
    primaireContraste: '#ffffff',
    secondaire: '#f3f4f6',
    secondaireSurvol: '#e5e7eb',
    secondaireContraste: '#111827',
    accent: '#b45309',
    fond: '#ffffff',
    surface: '#ffffff',
    surfaceAttenuee: '#f9fafb',
    texte: '#111827',
    texteAttenue: '#4b5563',
    bordure: '#e5e7eb',
    succes: '#15803d',
    erreur: '#b91c1c',
  },
  polices: {
    titres: 'ui-sans-serif, system-ui, sans-serif',
    corps: 'ui-sans-serif, system-ui, sans-serif',
    graisseTitres: '700',
    graisseCorps: '400',
    interligneTitres: '1.15',
  },
  rayons: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    plein: '9999px',
  },
  espacements: {
    sectionCompact: '2.5rem',
    section: '4rem',
    sectionLarge: '6rem',
    gouttiere: '1.25rem',
    conteneur: '72rem',
    prose: '65ch',
  },
  ombres: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 12px -2px rgb(0 0 0 / 0.08)',
    lg: '0 12px 32px -8px rgb(0 0 0 / 0.14)',
  },
}

/** Prefixe de variable CSS par famille de jetons. */
export const prefixes = {
  couleurs: '--c-',
  polices: '--f-',
  rayons: '--r-',
  espacements: '--e-',
  ombres: '--o-',
} as const satisfies Record<keyof Theme, string>
