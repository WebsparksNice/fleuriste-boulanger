import { Conteneur, Section, Titre } from '@websparks/core/ui'
import type { ConfigSiteResolue } from '@websparks/core'
import type { ContexteRendu } from '@websparks/core'

import { genererCreneaux, grouperParJour } from '../domaine/creneaux'
import { formaterEuros, formaterJourLong, formaterPlage } from '../domaine/formats'
import { dictionnaireCommande } from '../i18n'
import { compterParCreneau } from '../serveur/reservation'
import { listerProduitsCommandables } from '../serveur/panier'
import { lireReglages } from '../serveur/reglages'
import { decoderPanier } from './panierUrl'

export const CHEMIN_ENVOI_COMMANDE = '/api/commande'

type ProprietesFormulaire = {
  config: ConfigSiteResolue
  contexte: ContexteRendu
  /** Code d'erreur renvoyé par la route de validation. */
  erreur?: string
  /** Détail de l'erreur, par exemple le nom du produit en cause. */
  detail?: string
  /** Quantités à réafficher après un retour en erreur. */
  panier?: string
  titre?: string | null
}

/**
 * Formulaire de click & collect.
 *
 * Aucun JavaScript : un formulaire HTML qui poste vers une route serveur. Les
 * créneaux sont calculés côté serveur au moment du rendu, et revérifiés à la
 * validation — la liste affichée n'est qu'une commodité, jamais une autorisation.
 */
export const FormulaireCommande = async ({
  config,
  contexte,
  erreur,
  detail,
  panier,
  titre,
}: ProprietesFormulaire) => {
  const t = dictionnaireCommande(contexte.langue)
  const { payload, langue } = contexte

  const reglages = await lireReglages(payload, config.fuseau)
  const produits = await listerProduitsCommandables(payload, langue)

  const creneaux = genererCreneaux(reglages.regles, new Date())
  const occupation = await compterParCreneau(
    payload,
    creneaux.map((creneau) => creneau.cle),
  )

  const quantitesPrecedentes = decoderPanier(panier)
  const messageErreur = erreur ? (t.erreurs[erreur] ?? t.erreurs.erreur_interne) : null

  return (
    <Section>
      <Conteneur etroit>
        <Titre niveau={1} className="mb-2">
          {titre ?? t.titre}
        </Titre>
        <p className="mb-8 text-texte-attenue">{t.intro}</p>

        {messageErreur ? (
          <p
            role="alert"
            className="mb-8 rounded-md border border-erreur bg-surface-attenuee p-4 text-erreur"
          >
            {messageErreur}
            {detail ? <span className="mt-1 block text-sm">{detail}</span> : null}
          </p>
        ) : null}

        {produits.length === 0 ? (
          <p className="text-texte-attenue">{t.aucunProduit}</p>
        ) : (
          <form method="post" action={CHEMIN_ENVOI_COMMANDE} className="space-y-10">
            <input type="hidden" name="langue" value={langue} />

            <fieldset>
              <legend className="mb-4 text-lg font-medium">{t.vosProduits}</legend>
              <ul className="divide-y divide-bordure border-y border-bordure">
                {produits.map((produit) => {
                  const champ = `q_${produit.id}`
                  return (
                    <li
                      key={produit.id}
                      className="flex flex-wrap items-center justify-between gap-4 py-4"
                    >
                      <span className="min-w-0 flex-1">
                        <label htmlFor={champ} className="font-medium">
                          {produit.nom}
                        </label>
                        <span className="block text-sm text-texte-attenue">
                          {formaterEuros(produit.prixCentimes, langue)}
                          {produit.noteCommande ? ` — ${produit.noteCommande}` : ''}
                          {produit.delaiPreparationHeures > 0
                            ? ` — ${t.delaiMinimum(produit.delaiPreparationHeures)}`
                            : ''}
                        </span>
                      </span>
                      <input
                        id={champ}
                        name={champ}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={produit.quantiteMaxParCommande}
                        step={1}
                        defaultValue={quantitesPrecedentes[String(produit.id)] ?? 0}
                        aria-label={t.quantitePour(produit.nom)}
                        className="h-11 w-20 rounded-md border border-bordure px-3 text-center"
                      />
                    </li>
                  )
                })}
              </ul>
              <p className="mt-3 text-sm text-texte-attenue">{t.totalIndicatif}</p>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-lg font-medium">{t.creneau}</legend>
              <p className="mb-3 text-sm text-texte-attenue">
                {t.delaiMinimum(reglages.regles.delaiMinimumHeures)}
              </p>

              {creneaux.length === 0 ? (
                <p className="text-texte-attenue">{t.aucunCreneau}</p>
              ) : (
                <select
                  id="creneau"
                  name="creneau"
                  required
                  defaultValue=""
                  className="h-11 w-full rounded-md border border-bordure px-3"
                >
                  <option value="" disabled>
                    {t.choisirCreneau}
                  </option>
                  {grouperParJour(creneaux).map((groupe) => (
                    <optgroup
                      key={groupe.jour}
                      label={formaterJourLong(
                        groupe.creneaux[0]!.debut,
                        langue,
                        config.fuseau,
                      )}
                    >
                      {groupe.creneaux.map((creneau) => {
                        const restantes =
                          reglages.regles.capaciteParCreneau - (occupation.get(creneau.cle) ?? 0)
                        const complet = restantes <= 0

                        return (
                          <option key={creneau.cle} value={creneau.cle} disabled={complet}>
                            {formaterPlage(creneau.debut, creneau.fin, config.fuseau)}
                            {complet ? ` — ${t.creneauComplet}` : ''}
                            {!complet && restantes <= 2 ? ` — ${t.placesRestantes(restantes)}` : ''}
                          </option>
                        )
                      })}
                    </optgroup>
                  ))}
                </select>
              )}
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="mb-2 text-lg font-medium">{t.vosCoordonnees}</legend>

              <p>
                <label htmlFor="nom" className="mb-1 block text-sm font-medium">
                  {t.nom} <span className="text-texte-attenue">({t.champObligatoire})</span>
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  required
                  autoComplete="name"
                  className="h-11 w-full rounded-md border border-bordure px-3"
                />
              </p>

              <p>
                <label htmlFor="telephone" className="mb-1 block text-sm font-medium">
                  {t.telephone} <span className="text-texte-attenue">({t.champObligatoire})</span>
                </label>
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  required
                  autoComplete="tel"
                  className="h-11 w-full rounded-md border border-bordure px-3"
                />
              </p>

              <p>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">
                  {t.email} <span className="text-texte-attenue">({t.champObligatoire})</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="h-11 w-full rounded-md border border-bordure px-3"
                />
              </p>

              <p>
                <label htmlFor="notes" className="mb-1 block text-sm font-medium">
                  {t.notes}
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  maxLength={500}
                  aria-describedby="aide-notes"
                  className="w-full rounded-md border border-bordure p-3"
                />
                <span id="aide-notes" className="mt-1 block text-sm text-texte-attenue">
                  {t.notesAide}
                </span>
              </p>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-lg font-medium">{t.paiement}</legend>
              <div className="space-y-2">
                {reglages.paiementEnLigne ? (
                  <label className="flex min-h-11 items-center gap-3">
                    <input
                      type="radio"
                      name="modePaiement"
                      value="en_ligne"
                      defaultChecked
                      required
                      className="size-4"
                    />
                    {t.payerEnLigne}
                  </label>
                ) : null}
                {reglages.paiementSurPlace ? (
                  <label className="flex min-h-11 items-center gap-3">
                    <input
                      type="radio"
                      name="modePaiement"
                      value="sur_place"
                      defaultChecked={!reglages.paiementEnLigne}
                      required
                      className="size-4"
                    />
                    {t.payerSurPlace}
                  </label>
                ) : null}
              </div>
            </fieldset>

            <button
              type="submit"
              className="inline-flex min-h-12 items-center rounded-md bg-primaire px-6 py-3 font-medium text-primaire-contraste"
            >
              {t.valider}
            </button>
          </form>
        )}
      </Conteneur>
    </Section>
  )
}
