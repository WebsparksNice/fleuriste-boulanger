import { definirSite } from '@websparks/core'

/**
 * Configuration du site.
 *
 * C'est le seul fichier à reprendre pour habiller ce client : le reste vient du
 * socle (code) et de Payload (contenu saisi par le commerçant).
 */
export const site = definirSite({
  cle: 'fleuriste',
  urlSite: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',

  // La première langue est celle par défaut : ses URL ne sont pas préfixées.
  langues: ['fr'],
  fuseau: 'Europe/Paris',

  routes: {
    produits: { fr: 'nos-produits' },
    commande: { fr: 'commander' },
  },

  modules: {
    commande: true,
  },

  /*
   * Charte du client.
   *
   * Vert profond    #1B3A2A  en-tête, pied de page, titres, aplats
   * Blanc cassé     #F7F4ED  fond dominant
   * Sauge clair     #DCE4D7  cartes, séparateurs, fonds secondaires
   * Terracotta      #A85A2E  appels à l'action, prix, liens actifs
   * Encre           #14201A  texte courant
   *
   * Les deux endroits que les jetons ne savent pas exprimer — l'aplat vert de
   * l'en-tête et du pied de page, le terracotta des boutons d'action — sont
   * repris dans `styles/globals.css`, le socle y figeant la classe utilisée.
   */
  theme: {
    couleurs: {
      primaire: '#1B3A2A',
      primaireSurvol: '#142C20',
      primaireContraste: '#F7F4ED',
      secondaire: '#DCE4D7',
      secondaireSurvol: '#CBD6C4',
      secondaireContraste: '#14201A',
      accent: '#A85A2E',
      fond: '#F7F4ED',
      surface: '#DCE4D7',
      surfaceAttenuee: '#DCE4D7',
      texte: '#14201A',
      texteAttenue: '#4A5A50',
      // Sauge d'un cran plus soutenu : un séparateur de la couleur exacte de la
      // surface qu'il traverse ne sépare rien. Seule dérive à la charte, et
      // seulement là où l'appliquer telle quelle effacerait le trait.
      bordure: '#C2D0BA',
      succes: '#2F6B45',
      erreur: '#9B2C1E',
    },
    polices: {
      titres: 'var(--police-titres), Georgia, serif',
      corps: 'var(--police-corps), system-ui, sans-serif',
      // Fraunces porte deja son contraste dans le dessin : les titres se
      // composent en graisse normale, comme dans la maquette.
      graisseTitres: '400',
      interligneTitres: '1.1',
    },
    rayons: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.875rem',
      xl: '1.25rem',
      plein: '9999px',
    },
    espacements: {
      sectionCompact: '3rem',
      section: '5rem',
      sectionLarge: '7rem',
      gouttiere: '1.5rem',
      conteneur: '77.5rem',
      prose: '62ch',
    },
    // La charte tient par les aplats et les filets, pas par le relief : seul le
    // menu mobile, qui flotte au-dessus de la page, garde une ombre franche.
    ombres: {
      sm: '0 1px 2px 0 rgb(20 32 26 / 0.04)',
      md: '0 4px 14px -4px rgb(20 32 26 / 0.08)',
      lg: '0 18px 40px -12px rgb(20 32 26 / 0.22)',
    },
  },

  options: {
    produitsParPage: 12,
    // À passer à true tant que le site n'est pas livré : il sort alors des
    // moteurs de recherche, quoi que dise la case dans l'administration.
    bloquerIndexation: false,
  },
})
