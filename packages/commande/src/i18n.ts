export type DictionnaireCommande = {
  titre: string
  intro: string
  vosProduits: string
  aucunProduit: string
  quantite: string
  quantitePour: (produit: string) => string
  creneau: string
  choisirCreneau: string
  creneauComplet: string
  placesRestantes: (places: number) => string
  aucunCreneau: string
  vosCoordonnees: string
  nom: string
  telephone: string
  email: string
  notes: string
  notesAide: string
  paiement: string
  payerEnLigne: string
  payerSurPlace: string
  valider: string
  total: string
  totalIndicatif: string
  champObligatoire: string
  delaiMinimum: (heures: number) => string
  confirmationTitre: string
  confirmationIntro: (numero: string) => string
  retraitPrevu: string
  statutPaiement: string
  paiementRegle: string
  paiementSurPlace: string
  paiementEnAttente: string
  commandeIntrouvable: string
  erreurs: Record<string, string>
}

export const fr: DictionnaireCommande = {
  titre: 'Commander',
  intro: 'Choisissez vos produits et votre créneau de retrait.',
  vosProduits: 'Vos produits',
  aucunProduit: 'Aucun produit n’est disponible à la commande pour le moment.',
  quantite: 'Quantité',
  quantitePour: (produit) => `Quantité pour ${produit}`,
  creneau: 'Créneau de retrait',
  choisirCreneau: 'Choisissez un créneau',
  creneauComplet: 'complet',
  placesRestantes: (places) => (places === 1 ? '1 place' : `${places} places`),
  aucunCreneau: 'Aucun créneau n’est disponible pour l’instant. Réessayez plus tard.',
  vosCoordonnees: 'Vos coordonnées',
  nom: 'Nom',
  telephone: 'Téléphone',
  email: 'E-mail',
  notes: 'Précision',
  notesAide: 'Une allergie, une occasion particulière, un mot à écrire sur le gâteau.',
  paiement: 'Paiement',
  payerEnLigne: 'Payer maintenant en ligne',
  payerSurPlace: 'Payer au retrait',
  valider: 'Valider ma commande',
  total: 'Total',
  totalIndicatif: 'Le total est calculé et confirmé après validation.',
  champObligatoire: 'obligatoire',
  delaiMinimum: (heures) =>
    heures === 1
      ? 'Comptez au moins 1 heure entre la commande et le retrait.'
      : `Comptez au moins ${heures} heures entre la commande et le retrait.`,
  confirmationTitre: 'Commande enregistrée',
  confirmationIntro: (numero) => `Votre commande porte le numéro ${numero}.`,
  retraitPrevu: 'Retrait prévu',
  statutPaiement: 'Paiement',
  paiementRegle: 'Réglée en ligne',
  paiementSurPlace: 'À régler au retrait',
  paiementEnAttente: 'En attente de paiement',
  commandeIntrouvable: 'Cette commande est introuvable.',
  erreurs: {
    panier_vide: 'Choisissez au moins un produit.',
    produit_indisponible: 'Un produit de votre panier n’est plus disponible.',
    quantite_invalide: 'La quantité demandée n’est pas possible.',
    creneau_invalide: 'Ce créneau n’est plus proposé, choisissez-en un autre.',
    creneau_complet: 'Ce créneau vient d’être complété. Choisissez-en un autre.',
    creneau_trop_tot: 'Ce créneau est trop proche pour préparer votre commande.',
    coordonnees_invalides: 'Vérifiez votre nom, votre téléphone et votre e-mail.',
    paiement_indisponible: 'Ce mode de paiement n’est pas proposé.',
    paiement_annule: 'Le paiement a été interrompu. Votre commande n’est pas validée.',
    erreur_interne: 'Une erreur est survenue. Réessayez dans un instant.',
  },
}

export const en: DictionnaireCommande = {
  titre: 'Order',
  intro: 'Pick your items and a collection slot.',
  vosProduits: 'Your items',
  aucunProduit: 'No items are available to order right now.',
  quantite: 'Quantity',
  quantitePour: (produit) => `Quantity for ${produit}`,
  creneau: 'Collection slot',
  choisirCreneau: 'Choose a slot',
  creneauComplet: 'full',
  placesRestantes: (places) => (places === 1 ? '1 place left' : `${places} places left`),
  aucunCreneau: 'No slot is available right now. Please try again later.',
  vosCoordonnees: 'Your details',
  nom: 'Name',
  telephone: 'Phone',
  email: 'Email',
  notes: 'Note',
  notesAide: 'An allergy, a special occasion, a message to write on the cake.',
  paiement: 'Payment',
  payerEnLigne: 'Pay online now',
  payerSurPlace: 'Pay on collection',
  valider: 'Place my order',
  total: 'Total',
  totalIndicatif: 'The total is calculated and confirmed after you place the order.',
  champObligatoire: 'required',
  delaiMinimum: (heures) =>
    heures === 1
      ? 'Allow at least 1 hour between ordering and collection.'
      : `Allow at least ${heures} hours between ordering and collection.`,
  confirmationTitre: 'Order received',
  confirmationIntro: (numero) => `Your order number is ${numero}.`,
  retraitPrevu: 'Collection',
  statutPaiement: 'Payment',
  paiementRegle: 'Paid online',
  paiementSurPlace: 'To pay on collection',
  paiementEnAttente: 'Awaiting payment',
  commandeIntrouvable: 'This order cannot be found.',
  erreurs: {
    panier_vide: 'Choose at least one item.',
    produit_indisponible: 'An item in your basket is no longer available.',
    quantite_invalide: 'That quantity is not possible.',
    creneau_invalide: 'That slot is no longer offered, please pick another.',
    creneau_complet: 'That slot has just filled up. Please pick another.',
    creneau_trop_tot: 'That slot is too soon to prepare your order.',
    coordonnees_invalides: 'Please check your name, phone and email.',
    paiement_indisponible: 'That payment method is not offered.',
    paiement_annule: 'Payment was interrupted. Your order is not confirmed.',
    erreur_interne: 'Something went wrong. Please try again shortly.',
  },
}

const dictionnaires: Record<string, DictionnaireCommande> = { fr, en }

export const dictionnaireCommande = (langue: string): DictionnaireCommande =>
  dictionnaires[langue] ?? fr
