import { creerRouteStatutCommande } from '@websparks/commande/routes'

import { commande } from '@/commande.config'

/** Changement de statut depuis la vue « commandes du jour » de l'administration. */
export const POST = creerRouteStatutCommande(commande)
