/**
 * Pièces d'administration rendues côté serveur.
 *
 * Le bouton Stripe vit dans `./client` et non ici : c'est un composant client,
 * il tire `@payloadcms/ui` et sa feuille de style. Les réunir dans un même
 * point d'entrée obligerait tout consommateur serveur à charger l'interface
 * d'administration entière — et empêcherait simplement d'importer cette vue
 * depuis Node.
 */
export { VueCommandesDuJour } from './VueCommandesDuJour'
