import config from '@payload-config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import sharp from 'sharp'

import type { Produit } from './payload-types'

/**
 * Jeu de donnees de demonstration.
 *
 * Sert a deux choses : monter un site client en quelques minutes, et verifier
 * que le schema du socle tourne reellement sur Postgres. Le script est
 * idempotent — il repart d'une base vide de ses propres collections — pour
 * pouvoir etre relance sans accumuler de doublons.
 *
 *   pnpm --filter demo-boulangerie seed
 */

const dossierCourant = path.dirname(fileURLToPath(import.meta.url))

/** Paragraphe Lexical minimal : evite de coller a la main un arbre complet. */
const paragraphe = (texte: string) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [
      {
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        textFormat: 0,
        children: [
          { type: 'text', text: texte, format: 0, style: '', mode: 'normal', detail: 0, version: 1 },
        ],
      },
    ],
  },
})

/** Aplat colore genere a la volee : evite d'embarquer des photos dans le depot. */
const imagePlaceholder = async (couleur: string, largeur = 1600, hauteur = 1200) =>
  sharp({
    create: {
      width: largeur,
      height: hauteur,
      channels: 3,
      background: couleur,
    },
  })
    .jpeg({ quality: 80 })
    .toBuffer()

const seed = async () => {
  const payload = await getPayload({ config })

  payload.logger.info('Nettoyage des collections...')
  for (const collection of [
    'reservations-creneaux',
    'commandes',
    'evenements-stripe',
    'pages',
    'produits',
    'categories-produits',
    'temoignages',
    'faq',
    'media',
    'utilisateurs',
  ] as const) {
    await payload.delete({ collection, where: { id: { exists: true } } })
  }

  payload.logger.info('Compte administrateur...')
  await payload.create({
    collection: 'utilisateurs',
    data: {
      nom: 'Administrateur',
      email: 'admin@example.com',
      password: 'motdepasse',
      role: 'administrateur',
    },
  })

  payload.logger.info('Medias...')
  const creerMedia = async (alt: string, couleur: string, nom: string) =>
    payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: await imagePlaceholder(couleur),
        mimetype: 'image/jpeg',
        name: `${nom}.jpg`,
        size: 0,
      },
    })

  const [vitrine, fournil, pain, croissant, tarte, baguette, plan, logo] = await Promise.all([
    creerMedia('Devanture de la boulangerie au petit matin', '#8b5e3c', 'vitrine'),
    creerMedia('Le fournil et son four a bois', '#a9714b', 'fournil'),
    creerMedia('Pain au levain fendu sur le dessus', '#c08552', 'pain-levain'),
    creerMedia('Croissants dores sortis du four', '#d9a05b', 'croissant'),
    creerMedia('Tarte aux fruits de saison', '#b5651d', 'tarte'),
    creerMedia('Baguettes de tradition dans leur panier', '#cd9b6a', 'baguette'),
    creerMedia("Plan d'acces a la boutique", '#e8dccc', 'plan'),
    creerMedia('Logo de la boulangerie Martin', '#7c2d12', 'logo'),
  ])

  payload.logger.info('Categories...')
  const [pains, viennoiseries, patisseries] = await Promise.all([
    payload.create({
      collection: 'categories-produits',
      data: { nom: 'Pains', slug: 'pains', ordre: 1 },
    }),
    payload.create({
      collection: 'categories-produits',
      data: { nom: 'Viennoiseries', slug: 'viennoiseries', ordre: 2 },
    }),
    payload.create({
      collection: 'categories-produits',
      data: { nom: 'Patisseries', slug: 'patisseries', ordre: 3 },
    }),
  ])

  payload.logger.info('Produits...')

  type ProduitDemo = {
    nom: string
    slug: string
    image: number
    categorie: number
    prix: string
    description: string
    allergenes: NonNullable<Produit['allergenes']>
    disponibilite?: NonNullable<Produit['disponibilite']>
    miseEnAvant?: boolean
    ordre: number
    /** Champs apportés par le module de commande. */
    prixEuros: number
    delaiPreparationHeures?: number
    quantiteMax?: number
  }

  const produits: ProduitDemo[] = [
    {
      nom: 'Pain au levain',
      slug: 'pain-au-levain',
      prixEuros: 4.2,
      quantiteMax: 4,
      image: pain.id,
      categorie: pains.id,
      prix: 'à partir de 4,20 €',
      description: 'Farine de blé T80 moulue à la meule, levain naturel entretenu depuis 1987, 24 heures de fermentation lente.',
      allergenes: ['gluten'],
      miseEnAvant: true,
      ordre: 1,
    },
    {
      nom: 'Baguette de tradition',
      slug: 'baguette-de-tradition',
      prixEuros: 1.3,
      quantiteMax: 12,
      image: baguette.id,
      categorie: pains.id,
      prix: '1,30 €',
      description: 'Pétrie et façonnée à la main chaque matin, cuite sur sole. Sans additif, comme le veut le décret pain.',
      allergenes: ['gluten'],
      miseEnAvant: true,
      ordre: 2,
    },
    {
      nom: 'Croissant au beurre',
      slug: 'croissant-au-beurre',
      prixEuros: 1.4,
      quantiteMax: 20,
      image: croissant.id,
      categorie: viennoiseries.id,
      prix: '1,40 €',
      description: 'Beurre de Charentes AOP, détrempe la veille, tourage à froid le matin même.',
      allergenes: ['gluten', 'lait', 'oeufs'],
      miseEnAvant: true,
      ordre: 3,
    },
    {
      nom: 'Pain de campagne',
      slug: 'pain-de-campagne',
      prixEuros: 3.8,
      quantiteMax: 4,
      image: pain.id,
      categorie: pains.id,
      prix: 'à partir de 3,80 €',
      description: 'Mélange de blé et de seigle, mie dense et longue conservation.',
      allergenes: ['gluten'],
      ordre: 4,
    },
    {
      nom: 'Tarte aux fruits de saison',
      slug: 'tarte-aux-fruits-de-saison',
      prixEuros: 3.5,
      quantiteMax: 6,
      image: tarte.id,
      categorie: patisseries.id,
      prix: 'à partir de 3,50 € la part',
      description: 'Pâte sablée, crème d amande et fruits du marché. La garniture change chaque semaine.',
      allergenes: ['gluten', 'lait', 'oeufs', 'fruits-a-coque'],
      disponibilite: 'saisonnier',
      ordre: 5,
    },
    {
      nom: 'Galette des rois',
      slug: 'galette-des-rois',
      prixEuros: 18,
      delaiPreparationHeures: 24,
      quantiteMax: 2,
      image: tarte.id,
      categorie: patisseries.id,
      prix: 'à partir de 18 €',
      description: 'Frangipane maison, disponible tout le mois de janvier. Réservation conseillée.',
      allergenes: ['gluten', 'lait', 'oeufs', 'fruits-a-coque'],
      disponibilite: 'surCommande',
      ordre: 6,
    },
  ]

  for (const produit of produits) {
    await payload.create({
      collection: 'produits',
      data: {
        nom: produit.nom,
        slug: produit.slug,
        imagePrincipale: produit.image,
        categorie: produit.categorie,
        prixIndicatif: produit.prix,
        description: paragraphe(produit.description) as never,
        allergenes: produit.allergenes,
        disponibilite: produit.disponibilite ?? 'permanent',
        miseEnAvant: produit.miseEnAvant ?? false,
        ordre: produit.ordre,
        // Module de commande
        prix: produit.prixEuros,
        disponible: true,
        delaiPreparationHeures: produit.delaiPreparationHeures ?? 0,
        quantiteMaxParCommande: produit.quantiteMax ?? 10,
        _status: 'published',
      },
    })
  }

  payload.logger.info('Temoignages...')
  const temoignages = [
    { auteur: 'Marie L.', texte: 'Le meilleur pain au levain du quartier, et un accueil toujours chaleureux.', note: 5 },
    { auteur: 'Julien P.', texte: 'Je viens de l autre bout de la ville pour leurs croissants. Ça vaut le détour.', note: 5 },
    { auteur: 'Amina B.', texte: 'La galette de janvier est une institution familiale chez nous depuis six ans.', note: 4 },
  ]

  for (const temoignage of temoignages) {
    await payload.create({
      collection: 'temoignages',
      data: { ...temoignage, source: 'boutique', visible: true, date: new Date().toISOString() },
    })
  }

  payload.logger.info('Questions frequentes...')
  const questions = [
    ['Peut-on commander à l avance ?', 'Oui, par téléphone jusqu à la veille 18h pour les pains spéciaux et les gâteaux.'],
    ['Proposez-vous des produits sans gluten ?', 'Non. Le fournil travaille la farine de blé en permanence, nous ne pouvons pas garantir l absence de contamination croisée.'],
    ['Acceptez-vous les titres restaurant ?', 'Oui, ainsi que la carte bancaire sans minimum d achat.'],
    ['À quelle heure sort la dernière fournée ?', 'Vers 17h30 en semaine, 16h le samedi.'],
  ]

  for (const [position, [question, reponse]] of questions.entries()) {
    await payload.create({
      collection: 'faq',
      data: {
        question: question as string,
        reponse: paragraphe(reponse as string) as never,
        ordre: position,
      },
    })
  }

  payload.logger.info('Fiche etablissement...')
  await payload.updateGlobal({
    slug: 'etablissement',
    data: {
      nom: 'Boulangerie Martin',
      typeCommerce: 'boulangerie',
      slogan: 'Artisan boulanger depuis 1987',
      description:
        'Boulangerie artisanale au levain naturel, à Lyon 3e. Pains de tradition, viennoiseries au beurre et pâtisseries de saison, pétris et cuits sur place chaque jour.',
      logo: logo.id,
      telephone: '04 78 12 34 56',
      email: 'bonjour@boulangerie-martin.fr',
      adresse: {
        rue: '12 rue de la Villette',
        codePostal: '69003',
        ville: 'Lyon',
        pays: 'France',
      },
      geo: { latitude: 45.7602, longitude: 4.8583 },
      lienItineraire: 'https://maps.google.com/?q=12+rue+de+la+Villette+69003+Lyon',
      accessibilitePmr: true,
      moyensPaiement: 'Espèces, carte bancaire, titres restaurant',
      horaires: [
        { jour: 'lundi', ferme: true, creneaux: [] },
        { jour: 'mardi', ferme: false, creneaux: [{ ouvre: '07:00', ferme: '13:00' }, { ouvre: '15:30', ferme: '19:30' }] },
        { jour: 'mercredi', ferme: false, creneaux: [{ ouvre: '07:00', ferme: '13:00' }, { ouvre: '15:30', ferme: '19:30' }] },
        { jour: 'jeudi', ferme: false, creneaux: [{ ouvre: '07:00', ferme: '13:00' }, { ouvre: '15:30', ferme: '19:30' }] },
        { jour: 'vendredi', ferme: false, creneaux: [{ ouvre: '07:00', ferme: '13:00' }, { ouvre: '15:30', ferme: '19:30' }] },
        { jour: 'samedi', ferme: false, creneaux: [{ ouvre: '07:00', ferme: '19:00' }] },
        { jour: 'dimanche', ferme: false, creneaux: [{ ouvre: '07:00', ferme: '13:00' }] },
      ],
      fermeturesExceptionnelles: [
        {
          du: new Date(new Date().getFullYear(), 7, 1).toISOString(),
          au: new Date(new Date().getFullYear(), 7, 21).toISOString(),
          motif: 'Congés annuels',
        },
      ],
      reseauxSociaux: [
        { plateforme: 'instagram', url: 'https://instagram.com/boulangerie-martin' },
        { plateforme: 'facebook', url: 'https://facebook.com/boulangerie-martin' },
      ],
    },
  })

  payload.logger.info('Pages...')
  const notreMaison = await payload.create({
    collection: 'pages',
    data: {
      titre: 'Notre maison',
      slug: 'notre-maison',
      _status: 'published',
      contenu: [
        {
          blockType: 'hero',
          variante: 'lateral',
          titre: 'Notre maison',
          sousTitre: 'Trois générations de boulangers rue de la Villette.',
          image: fournil.id,
          apparence: { fond: 'defaut', espacement: 'normal' },
        },
        {
          blockType: 'texteImage',
          positionImage: 'droite',
          formatImage: 'paysage',
          image: vitrine.id,
          titre: 'Le levain, depuis 1987',
          texte: paragraphe(
            'Le levain qui lève nos pains a été lancé par Robert Martin en 1987. Il est nourri tous les jours depuis, et c est lui qui donne à la mie son goût légèrement acidulé et sa conservation.',
          ) as never,
          apparence: { fond: 'defaut', espacement: 'normal' },
        },
        {
          blockType: 'galerie',
          titre: 'Le fournil en images',
          images: [
            { image: fournil.id, legende: 'Le four à bois, chauffé dès 4 heures' },
            { image: pain.id, legende: 'Grigne du pain au levain' },
            { image: baguette.id, legende: 'Baguettes de tradition' },
          ],
          colonnes: '3',
          format: 'carre',
          agrandissement: false,
          apparence: { fond: 'attenue', espacement: 'normal' },
        },
      ] as never,
      seo: {
        description:
          'Trois générations de boulangers à Lyon 3e. Levain naturel entretenu depuis 1987, pétrissage et cuisson sur place.',
      },
    },
  })

  const contact = await payload.create({
    collection: 'pages',
    data: {
      titre: 'Nous trouver',
      slug: 'nous-trouver',
      _status: 'published',
      contenu: [
        {
          blockType: 'hero',
          variante: 'texte',
          titre: 'Nous trouver',
          sousTitre: '12 rue de la Villette, Lyon 3e.',
          apparence: { fond: 'attenue', espacement: 'compact' },
        },
        {
          blockType: 'contact',
          titre: 'Venir à la boutique',
          afficherCoordonnees: true,
          afficherHoraires: true,
          afficherReseaux: true,
          afficherCarte: true,
          imageCarte: plan.id,
          apparence: { fond: 'defaut', espacement: 'normal', ancre: 'coordonnees' },
        },
        {
          blockType: 'faq',
          mode: 'toutes',
          genererJsonLd: true,
          apparence: { fond: 'attenue', espacement: 'normal' },
        },
      ] as never,
      seo: { description: 'Adresse, horaires et accès de la Boulangerie Martin, 12 rue de la Villette à Lyon 3e.' },
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      titre: 'Boulangerie Martin',
      slug: 'accueil',
      _status: 'published',
      contenu: [
        {
          blockType: 'hero',
          variante: 'couverture',
          titre: 'Le pain au levain, tous les matins',
          sousTitre: 'Boulangerie artisanale à Lyon 3e, ouverte du mardi au dimanche.',
          image: vitrine.id,
          alignement: 'gauche',
          opaciteVoile: 45,
          boutons: [
            { type: 'interne', style: 'primaire', libelle: 'Nos pains', reference: notreMaison.id },
            { type: 'ancre', style: 'secondaire', libelle: 'Nos horaires', ancre: 'horaires' },
          ],
          apparence: { fond: 'defaut', espacement: 'normal' },
        },
        {
          blockType: 'produits',
          titre: 'Nos incontournables',
          mode: 'misesEnAvant',
          limite: 3,
          colonnes: '3',
          afficherPrix: true,
          afficherLienVoirTout: true,
          apparence: { fond: 'defaut', espacement: 'normal' },
        },
        {
          blockType: 'texteImage',
          positionImage: 'gauche',
          formatImage: 'paysage',
          image: fournil.id,
          titre: 'Pétri, façonné et cuit sur place',
          texte: paragraphe(
            'Pas de pâte surgelée ni de mélange tout prêt : la farine arrive du moulin, le levain travaille toute la nuit, et la première fournée sort à 6h30.',
          ) as never,
          apparence: { fond: 'attenue', espacement: 'normal' },
        },
        {
          blockType: 'horaires',
          source: 'etablissement',
          afficherFermetures: true,
          note: 'Dernière fournée vers 17h30.',
          apparence: { fond: 'defaut', espacement: 'normal', ancre: 'horaires' },
        },
        {
          blockType: 'temoignages',
          mode: 'recents',
          limite: 3,
          afficherNotes: true,
          apparence: { fond: 'attenue', espacement: 'normal' },
        },
        {
          blockType: 'cta',
          titre: 'Une commande à passer ?',
          texte: 'Appelez-nous jusqu à la veille 18h pour les pains spéciaux et les gâteaux.',
          boutons: [{ type: 'telephone', style: 'primaire', libelle: 'Nous appeler' }],
          apparence: { fond: 'primaire', espacement: 'normal' },
        },
      ] as never,
      seo: {
        description:
          'Boulangerie artisanale au levain à Lyon 3e. Pains de tradition, viennoiseries au beurre et pâtisseries de saison, cuits sur place chaque jour.',
      },
    },
  })

  payload.logger.info('Reglages des commandes...')
  await payload.updateGlobal({
    slug: 'config-commande',
    data: {
      dureeCreneauMinutes: 15,
      capaciteParCreneau: 3,
      delaiMinimumHeures: 2,
      horizonJours: 7,
      minutesAvantExpiration: 30,
      horairesRetrait: [
        { jour: 'lundi', ferme: true, plages: [] },
        { jour: 'mardi', ferme: false, plages: [{ debut: '07:30', fin: '12:30' }, { debut: '16:00', fin: '19:00' }] },
        { jour: 'mercredi', ferme: false, plages: [{ debut: '07:30', fin: '12:30' }, { debut: '16:00', fin: '19:00' }] },
        { jour: 'jeudi', ferme: false, plages: [{ debut: '07:30', fin: '12:30' }, { debut: '16:00', fin: '19:00' }] },
        { jour: 'vendredi', ferme: false, plages: [{ debut: '07:30', fin: '12:30' }, { debut: '16:00', fin: '19:00' }] },
        { jour: 'samedi', ferme: false, plages: [{ debut: '07:30', fin: '18:30' }] },
        { jour: 'dimanche', ferme: false, plages: [{ debut: '07:30', fin: '12:30' }] },
      ],
      joursFermes: [],
      // Le paiement en ligne reste éteint tant que les clés Stripe du client
      // ne sont pas en place : l'activer sans clés afficherait un choix qui
      // échouerait au moment de payer.
      paiementEnLigne: Boolean(process.env.STRIPE_SECRET_KEY),
      paiementSurPlace: true,
      messageConfirmation: 'À tout bientôt rue de la Villette !',
    },
  })

  payload.logger.info('Menus et referencement...')
  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      menuPrincipal: [
        { type: 'interne', libelle: 'Notre maison', reference: notreMaison.id },
        { type: 'interne', libelle: 'Nous trouver', reference: contact.id },
      ],
      ctaEnTete: {
        actif: true,
        lien: { type: 'telephone', style: 'primaire', libelle: 'Nous appeler' },
      },
      menuPied: [
        { type: 'interne', libelle: 'Notre maison', reference: notreMaison.id },
        { type: 'interne', libelle: 'Nous trouver', reference: contact.id },
      ],
      mentionPied: 'Artisan boulanger depuis 1987',
    },
  })

  await payload.updateGlobal({
    slug: 'reglages-seo',
    data: {
      suffixeTitre: 'Boulangerie Martin, Lyon 3e',
      descriptionParDefaut:
        'Boulangerie artisanale au levain naturel à Lyon 3e. Pains de tradition, viennoiseries et pâtisseries de saison.',
      imagePartage: vitrine.id,
      autoriserIndexation: true,
    },
  })

  payload.logger.info('Terminé. Connexion admin : admin@example.com / motdepasse')
  process.exit(0)
}

await seed()
