import { creerRouteLiaisonStripe } from '@websparks/commande/routes'

import { commande } from '@/commande.config'

/** Confirme et enregistre la liaison, depuis la page de confirmation. */
export const POST = creerRouteLiaisonStripe(commande)
