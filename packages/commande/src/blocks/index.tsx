import type { ProprietesBloc, RegistreBlocs } from '@websparks/core/blocks'
import type { BlocExterne } from '@websparks/core'

import { FormulaireCommande } from './FormulaireCommande'

/**
 * Rendu du bloc « commande en ligne » posé dans une page.
 *
 * Le bloc n'affiche pas les erreurs de validation : en cas de refus, la route
 * de traitement renvoie vers la page de commande dédiée, seule à recevoir les
 * paramètres d'URL. Un bloc ne connaît pas la requête qui l'a amené là.
 */
export const BlocCommande = ({ bloc, config, contexte }: ProprietesBloc<BlocExterne>) => (
  <FormulaireCommande
    config={config}
    contexte={contexte}
    titre={typeof bloc.titre === 'string' ? bloc.titre : null}
  />
)

/** Registre à passer à `RenderBlocks` quand le module est activé. */
export const rendusCommande: RegistreBlocs = {
  commande: BlocCommande,
}

export { FormulaireCommande, CHEMIN_ENVOI_COMMANDE } from './FormulaireCommande'
export { PageConfirmationCommande } from './PageConfirmation'
export { decoderPanier, encoderPanier } from './panierUrl'
