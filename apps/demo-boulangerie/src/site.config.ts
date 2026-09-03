import { definirSite } from '@websparks/core'

/**
 * Configuration du site.
 *
 * C'est le seul fichier a reprendre pour habiller un nouveau client : le reste
 * du site vient du socle (code) et de Payload (contenu).
 */
export const site = definirSite({
  cle: 'demo-boulangerie',
  urlSite: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',

  // La premiere langue est celle par defaut : ses URL ne sont pas prefixees.
  // Ajouter 'en' ici suffit a ouvrir la traduction, sans migration de base.
  langues: ['fr'],
  fuseau: 'Europe/Paris',

  routes: {
    produits: { fr: 'nos-pains', en: 'our-breads' },
    commande: { fr: 'commander', en: 'order' },
  },

  // Modules optionnels. Retirer cette ligne suffit à faire disparaître la
  // section commande du site ; retirer la dépendance du package.json la fait
  // disparaître du bundle.
  modules: {
    commande: true,
  },

  theme: {
    couleurs: {
      primaire: '#7c2d12',
      primaireSurvol: '#5f2410',
      primaireContraste: '#fffbf5',
      secondaire: '#f5ede2',
      secondaireSurvol: '#ece0cd',
      secondaireContraste: '#42210b',
      accent: '#b45309',
      fond: '#fffdfa',
      surface: '#ffffff',
      surfaceAttenuee: '#faf5ee',
      texte: '#2b1a10',
      texteAttenue: '#6b5545',
      bordure: '#e8dccc',
    },
    polices: {
      titres: 'var(--police-titres), Georgia, serif',
      corps: 'var(--police-corps), system-ui, sans-serif',
      graisseTitres: '700',
    },
    rayons: {
      md: '0.375rem',
      lg: '0.75rem',
    },
    espacements: {
      conteneur: '76rem',
    },
  },

  options: {
    produitsParPage: 12,
    // A passer a false le jour de la mise en ligne, en plus de la case
    // « autoriser l'indexation » dans l'admin.
    bloquerIndexation: false,
  },
})
