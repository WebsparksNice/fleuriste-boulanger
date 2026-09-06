import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Jeu de départ pour Parmi les fleurs.
 *
 * Pose la structure de la page d'accueil telle qu'elle a été dessinée, la fiche
 * établissement et les menus. Les produits, les photos et les avis restent la
 * matière du commerçant : le script ne les crée que s'il n'en trouve aucun, et
 * n'en supprime jamais.
 *
 * Relançable : chaque élément est cherché avant d'être créé.
 *
 *   pnpm --filter fleuriste seed
 */

/** Paragraphes Lexical, seule forme que l'éditeur sait relire. */
const paragraphes = (...textes: string[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: textes.map((texte) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      textFormat: 0,
      children: [
        {
          type: 'text',
          text: texte,
          format: 0,
          style: '',
          mode: 'normal',
          detail: 0,
          version: 1,
        },
      ],
    })),
  },
})

const ancre = (cible: string, libelle: string, style: 'primaire' | 'secondaire' | 'discret') => ({
  type: 'ancre' as const,
  style,
  libelle,
  ancre: cible,
})

const seed = async () => {
  const payload = await getPayload({ config })

  payload.logger.info('Compte administrateur...')
  const administrateurs = await payload.count({
    collection: 'utilisateurs',
    where: { email: { equals: 'admin@fleuriste.fr' } },
  })
  if (administrateurs.totalDocs === 0) {
    await payload.create({
      collection: 'utilisateurs',
      data: {
        nom: 'Administrateur',
        email: 'admin@fleuriste.fr',
        password: 'motdepasse-a-changer',
        role: 'administrateur',
      },
    })
  }

  payload.logger.info('Fiche établissement...')
  await payload.updateGlobal({
    slug: 'etablissement',
    data: {
      nom: 'Parmi les fleurs',
      typeCommerce: 'fleuriste',
      slogan: 'Maison florale artisanale',
      telephone: '05 00 00 00 00',
      email: 'contact@parmilesfleurs.fr',
      adresse: { rue: '14 rue des Capucines', complement: 'Atelier-boutique', pays: 'France' },
      horaires: [
        { jour: 'lundi', ferme: true, creneaux: [] },
        { jour: 'mardi', ferme: false, creneaux: [{ ouvre: '09:00', ferme: '19:00' }] },
        { jour: 'mercredi', ferme: false, creneaux: [{ ouvre: '09:00', ferme: '19:00' }] },
        { jour: 'jeudi', ferme: false, creneaux: [{ ouvre: '09:00', ferme: '19:00' }] },
        { jour: 'vendredi', ferme: false, creneaux: [{ ouvre: '09:00', ferme: '19:00' }] },
        { jour: 'samedi', ferme: false, creneaux: [{ ouvre: '09:00', ferme: '18:00' }] },
        { jour: 'dimanche', ferme: false, creneaux: [{ ouvre: '10:00', ferme: '13:00' }] },
      ],
    },
  })

  /*
   * Photos d'illustration des blocs.
   *
   * Reprises parmi les médias déjà déposés par le commerçant plutôt que
   * réimportées : le script ne doit rien ajouter à sa bibliothèque.
   */
  const { docs: medias } = await payload.find({
    collection: 'media',
    limit: 12,
    sort: '-createdAt',
  })
  const illustration = (position: number) => medias[position % Math.max(medias.length, 1)]?.id

  payload.logger.info('Avis...')
  const avis = await payload.count({ collection: 'temoignages' })
  if (avis.totalDocs === 0) {
    for (const temoignage of [
      {
        auteur: 'Élise M.',
        texte:
          "Le bouquet est arrivé à l'heure dite, encore frais du matin. Ma mère l'a gardé douze jours.",
        note: 5,
      },
      {
        auteur: 'Tomas R.',
        texte:
          "J'ai demandé quelque chose de sobre, en vert et blanc. Ils ont compris sans que j'insiste.",
        note: 5,
      },
      {
        auteur: 'Farida B.',
        texte: 'Payé sur place, sans histoire. La carte manuscrite a fait pleurer tout le monde.',
        note: 5,
      },
    ]) {
      await payload.create({ collection: 'temoignages', data: { ...temoignage, visible: true } })
    }
  }

  payload.logger.info('Page d’accueil...')
  const contenu = [
    {
      blockType: 'hero',
      variante: 'lateral',
      surtitre: 'Maison florale · depuis 2011',
      titre: 'Des bouquets composés à la main, un matin à la fois.',
      sousTitre:
        "Feuillages frais, tiges de saison, parfum de sauge et d'eau claire. Chaque bouquet est noué à l'atelier, puis livré le jour même dans un papier écru.",
      image: illustration(0),
      boutons: [
        ancre('bouquets', 'Découvrir les bouquets', 'primaire'),
        ancre('commande', 'Comment commander', 'discret'),
      ],
      apparence: { fond: 'defaut', espacement: 'large', ancre: 'accueil' },
    },
    {
      blockType: 'produits',
      surtitre: 'Le catalogue',
      titre: 'Nos bouquets',
      intro: paragraphes(
        'Des compositions renouvelées au fil des marchés. Les tiges varient légèrement selon la saison.',
      ),
      dispositionEntete: 'repartie',
      mode: 'tous',
      colonnes: '3',
      variante: 'carte',
      limite: 6,
      afficherPrix: true,
      afficherLienVoirTout: false,
      apparence: { fond: 'defaut', espacement: 'normal', ancre: 'bouquets' },
    },
    {
      blockType: 'texteImage',
      positionImage: 'gauche',
      formatImage: 'carre',
      image: illustration(1),
      surtitre: 'Bouquet du moment',
      titre: 'Brume de Sauge',
      texte: paragraphes(
        "Un bouquet bas et large : eucalyptus, achillée crème, quelques renoncules pâles. Il tient longtemps et sent la fin d'été. Composé chaque mercredi, en série limitée.",
      ),
      boutons: [ancre('commander', 'Le commander', 'primaire')],
      apparence: { fond: 'primaire', espacement: 'normal' },
    },
    {
      blockType: 'etapes',
      surtitre: 'En trois gestes',
      titre: 'Comment commander',
      numerotation: 'chiffres',
      colonnes: '3',
      elements: [
        {
          titre: 'Choisir',
          texte:
            'Parcourez le catalogue et retenez le bouquet qui vous parle. Trois tailles possibles sur demande.',
        },
        {
          titre: 'Personnaliser',
          texte: 'Un mot doux calligraphié sur carte écru, la date et le créneau de votre choix.',
        },
        {
          titre: 'Livraison',
          texte:
            'À vélo dans le centre, ou à retirer à la boutique. Paiement en ligne ou sur place.',
        },
      ],
      apparence: { fond: 'defaut', espacement: 'normal', ancre: 'commande' },
    },
    {
      blockType: 'commande',
      titre: 'Panier & règlement',
      apparence: { fond: 'attenue', espacement: 'normal', ancre: 'commander' },
    },
    {
      blockType: 'texteImage',
      positionImage: 'droite',
      formatImage: 'carre',
      image: illustration(2),
      surtitre: 'Notre approche',
      titre: 'Peu de fleurs, mais les bonnes.',
      texte: paragraphes(
        "L'atelier ouvre à six heures. On trie, on nettoie les tiges, on garde ce qui tient. Nos fleurs viennent de trois producteurs à moins de cent kilomètres, et de la serre familiale pour les feuillages.",
        'Nous ne composons pas deux bouquets identiques : la saison décide, nous accompagnons. Pas de mousse florale, pas de plastique, du papier écru et de la ficelle de lin.',
        '— Camille & Naïm, fleuristes',
      ),
      apparence: { fond: 'defaut', espacement: 'normal', ancre: 'apropos' },
    },
    {
      blockType: 'etapes',
      surtitre: 'Livraison & zone',
      titre: 'Livré à vélo, le jour même.',
      numerotation: 'aucune',
      colonnes: '3',
      elements: [
        {
          titre: 'Zone couverte',
          texte:
            'Centre-ville et premiers faubourgs (5 km). Communes limitrophes sur demande, supplément de 6 €.',
        },
        {
          titre: 'Délais',
          texte:
            "Commande avant 11 h : livraison l'après-midi. Après 11 h : le lendemain, créneau au choix.",
        },
        {
          titre: 'Retrait boutique',
          texte: 'Prêt en deux heures, du mardi au samedi. Sans frais, réglable sur place.',
        },
      ],
      apparence: { fond: 'defaut', espacement: 'compact', ancre: 'livraison' },
    },
    {
      blockType: 'temoignages',
      titre: 'Ce qu’on nous écrit',
      mode: 'recents',
      limite: 3,
      afficherNotes: false,
      apparence: { fond: 'attenue', espacement: 'normal' },
    },
  ] as never

  const { docs: pagesAccueil } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'accueil' } },
    limit: 1,
  })

  if (pagesAccueil[0]) {
    await payload.update({
      collection: 'pages',
      id: pagesAccueil[0].id,
      data: { titre: 'Parmi les fleurs', _status: 'published', contenu },
    })
  } else {
    await payload.create({
      collection: 'pages',
      data: { titre: 'Parmi les fleurs', slug: 'accueil', _status: 'published', contenu },
    })
  }

  payload.logger.info('Menus...')
  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      menuPrincipal: [
        { type: 'ancre', libelle: 'Accueil', ancre: 'accueil' },
        { type: 'ancre', libelle: 'Nos bouquets', ancre: 'bouquets' },
        { type: 'ancre', libelle: 'À propos', ancre: 'apropos' },
        { type: 'ancre', libelle: 'Livraison', ancre: 'livraison' },
      ] as never,
      mentionPied: 'Maison florale artisanale',
    },
  })

  await payload.updateGlobal({
    slug: 'reglages-seo',
    data: {
      suffixeTitre: 'Parmi les fleurs',
      // Reste décoché jusqu'à la mise en ligne : le site est alors invisible
      // des moteurs de recherche.
      autoriserIndexation: false,
    },
  })

  payload.logger.info('Réglages des commandes...')
  await payload.updateGlobal({
    slug: 'config-commande',
    data: {
      dureeCreneauMinutes: 15,
      capaciteParCreneau: 4,
      delaiMinimumHeures: 2,
      horizonJours: 7,
      minutesAvantExpiration: 30,
      horairesRetrait: [
        { jour: 'mardi', ferme: false, plages: [{ debut: '09:00', fin: '18:00' }] },
        { jour: 'mercredi', ferme: false, plages: [{ debut: '09:00', fin: '18:00' }] },
        { jour: 'jeudi', ferme: false, plages: [{ debut: '09:00', fin: '18:00' }] },
        { jour: 'vendredi', ferme: false, plages: [{ debut: '09:00', fin: '18:00' }] },
        { jour: 'samedi', ferme: false, plages: [{ debut: '09:00', fin: '18:00' }] },
      ],
      paiementEnLigne: false,
      paiementSurPlace: true,
    },
  })

  payload.logger.info('Terminé. Connexion : admin@fleuriste.fr / motdepasse-a-changer')
  process.exit(0)
}

await seed()
