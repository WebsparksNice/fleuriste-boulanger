import type { Field } from 'payload'

/**
 * Champs ajoutés à la fiche produit quand le module de commande est activé.
 *
 * Ils viennent compléter la fiche existante plutôt que de créer une seconde
 * liste de produits : le commerçant gère un seul catalogue, qu'il soit vendu en
 * ligne ou simplement présenté en vitrine.
 *
 * `disponible` répond à « peut-on le commander maintenant ? » ; c'est une autre
 * question que le champ `disponibilite` du socle, qui décrit la saisonnalité et
 * reste purement éditorial.
 */
export const champsProduitsCommande: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'prix',
        type: 'number',
        label: 'Prix (€)',
        min: 0,
        admin: {
          width: '25%',
          step: 0.01,
          placeholder: '3.50',
          description: 'Prix réellement facturé.',
        },
      },
      {
        name: 'disponible',
        type: 'checkbox',
        label: 'Commandable en ligne',
        defaultValue: false,
        admin: { width: '25%' },
      },
      {
        name: 'delaiPreparationHeures',
        type: 'number',
        label: 'Préparation (heures)',
        defaultValue: 0,
        min: 0,
        max: 336,
        admin: {
          width: '25%',
          description: 'S’ajoute au délai minimum général pour ce produit.',
        },
      },
      {
        name: 'quantiteMaxParCommande',
        type: 'number',
        label: 'Quantité max',
        defaultValue: 10,
        min: 1,
        max: 999,
        admin: { width: '25%' },
      },
    ],
  },
  {
    name: 'noteCommande',
    type: 'text',
    label: 'Précision affichée à la commande',
    localized: true,
    admin: { placeholder: 'Vendu à la pièce' },
  },
]
