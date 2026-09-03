import { VueCommandesDuJour } from '@websparks/commande/admin'

import { site } from '@/site.config'

/**
 * Vue « commandes du jour » de l'administration.
 *
 * Ce fichier n'existe que pour lier la vue du module à la configuration du
 * client : Payload référence les composants par un chemin, sans pouvoir leur
 * transmettre le fuseau ni la langue du site.
 */
type ProprietesPayload = Parameters<typeof VueCommandesDuJour>[0]

const CommandesDuJour = (proprietes: Omit<ProprietesPayload, 'fuseau' | 'langue' | 'cheminStatut' | 'cheminVue'>) =>
  VueCommandesDuJour({
    ...proprietes,
    fuseau: site.fuseau,
    langue: site.langueParDefaut,
    cheminStatut: '/api/commande/statut',
    cheminVue: '/admin/commandes-du-jour',
  })

export default CommandesDuJour
