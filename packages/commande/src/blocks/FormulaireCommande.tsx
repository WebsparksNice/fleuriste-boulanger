import { Conteneur, Section, TexteRiche as TexteRicheRendu, Titre } from '@websparks/core/ui'
import type { ConfigSiteResolue } from '@websparks/core'
import { cn } from '@websparks/core/lib'
import type { ApparenceDoc, ContexteRendu, TexteRiche } from '@websparks/core'

import { CHEMIN_ENVOI_COMMANDE } from '../chemins'
import { genererCreneaux, grouperParJour } from '../domaine/creneaux'
import { formaterJourLong, formaterPlage } from '../domaine/formats'
import { dictionnaireCommande } from '../i18n'
import { compterParCreneau } from '../serveur/reservation'
import { resoudrePanier } from '../serveur/panier'
import { lireReglages } from '../serveur/reglages'
import { lirePanier } from '../serveur/session'
import { ResumePanier } from './ResumePanier'

/**
 * Panneau : le panier et le formulaire se posent chacun sur une surface, cote a
 * cote. `bg-surface` prend la couleur de carte du client, quelle qu'elle soit.
 */
const PANNEAU = 'rounded-lg bg-surface p-6 sm:p-8'

const CHAMP = 'h-11 w-full rounded-md border border-bordure px-3'
const ETIQUETTE = 'mb-1.5 block text-sm font-medium'

/**
 * Mode de paiement presente en carte a cocher.
 *
 * Le bouton radio reste visible. Le masquer obligeait la carte a porter seule
 * l'etat choisi, par un aplat — or rien ne garantit qu'un client ait un aplat
 * disponible qui contraste avec la surface du panneau : quand les deux se
 * confondent, la selection ne se voit plus du tout.
 *
 * L'etat tient donc a trois marques cumulees : le point du bouton radio, le
 * filet en accent, et l'anneau qui l'epaissit. Aucune ne depend d'une couleur
 * de fond, et la couleur n'est jamais le seul indice.
 */
const CARTE_PAIEMENT =
  'flex cursor-pointer flex-col gap-2 rounded-md border border-bordure p-4 transition-colors hover:border-accent has-[:checked]:border-accent has-[:checked]:ring-1 has-[:checked]:ring-accent'

type ProprietesFormulaire = {
  config: ConfigSiteResolue
  contexte: ContexteRendu
  /** Code d'erreur renvoyé par la route de validation. */
  erreur?: string
  /** Détail de l'erreur, par exemple le nom du produit en cause. */
  detail?: string
  titre?: string | null
  /** Texte d'introduction saisi dans l'admin. A defaut, celui du module. */
  intro?: TexteRiche | null
  /**
   * Apparence du bloc quand le formulaire est pose dans une page. La route
   * dediee n'en passe pas : elle garde le rendu neutre d'une page a part.
   */
  apparence?: ApparenceDoc | null
  /**
   * Niveau du titre. `1` sur la page de commande dediee, dont le formulaire est
   * le sujet ; `2` quand le bloc est pose dans une page qui porte deja son h1 —
   * une page ne peut pas en avoir deux.
   */
  niveau?: 1 | 2
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
  titre,
  intro,
  apparence,
  niveau = 1,
}: ProprietesFormulaire) => {
  const t = dictionnaireCommande(contexte.langue)
  const { payload, langue } = contexte

  const reglages = await lireReglages(payload, config.fuseau)
  const panier = await resoudrePanier(payload, langue, await lirePanier())

  const creneaux = genererCreneaux(reglages.regles, new Date())
  const occupation = await compterParCreneau(
    payload,
    creneaux.map((creneau) => creneau.cle),
  )

  const messageErreur = erreur ? (t.erreurs[erreur] ?? t.erreurs.erreur_interne) : null

  const niveauPanneau = niveau === 1 ? 2 : 3
  const vide = panier.lignes.length === 0

  return (
    <Section apparence={apparence}>
      {/*
        Le conteneur reste etroit tant qu'il n'y a qu'une colonne a montrer :
        un panier vide n'a pas besoin de toute la largeur du site.
      */}
      <Conteneur etroit={vide}>
        <Titre niveau={niveau} className="mb-2">
          {titre ?? t.titre}
        </Titre>
        {intro ? (
          <div className="mb-8">
            <TexteRicheRendu contenu={intro} config={config} langue={langue} />
          </div>
        ) : (
          <p className="mb-8 text-texte-attenue">{t.intro}</p>
        )}

        {messageErreur ? (
          <p
            role="alert"
            className="mb-8 rounded-md border border-erreur bg-surface-attenuee p-4 text-erreur"
          >
            {messageErreur}
            {detail ? <span className="mt-1 block text-sm">{detail}</span> : null}
          </p>
        ) : null}

        {/*
          Deux panneaux cote a cote, alignes en haut : le panier grandit avec le
          nombre de lignes, le formulaire avec ses champs, et rien n'oblige les
          deux a faire la meme hauteur.

          Le partage n'est pas moitie-moitie : le formulaire porte une grille de
          champs sur deux colonnes, le panier une simple liste. A largeur egale,
          l'un etouffe pendant que l'autre se vide.

          Ce sont deux freres dans une grille, et non un formulaire englobant :
          les lignes du panier portent leurs propres formulaires, que le HTML
          interdit d'imbriquer dans celui de la commande.
        */}
        <div className="grid items-start gap-6 lg:grid-cols-[2fr_3fr] lg:gap-8">
          <section className={PANNEAU} aria-labelledby="titre-panier">
            <Titre niveau={niveauPanneau} id="titre-panier" className="mb-5">
              {t.panier}
            </Titre>
            <ResumePanier panier={panier} config={config} langue={langue} />
          </section>

          {vide ? null : (
            <form
              method="post"
              action={CHEMIN_ENVOI_COMMANDE}
              className={`${PANNEAU} space-y-7`}
              aria-labelledby="titre-retrait"
            >
              <Titre niveau={niveauPanneau} id="titre-retrait">
                {t.informationsRetrait}
              </Titre>

              <input type="hidden" name="langue" value={langue} />

              <div>
                <label htmlFor="creneau" className={ETIQUETTE}>
                  {t.creneau} <span className="text-texte-attenue">({t.champObligatoire})</span>
                </label>

                {creneaux.length === 0 ? (
                  <p className="text-texte-attenue">{t.aucunCreneau}</p>
                ) : (
                  <>
                    <select
                      id="creneau"
                      name="creneau"
                      required
                      defaultValue=""
                      aria-describedby="aide-creneau"
                      className={CHAMP}
                    >
                      <option value="" disabled>
                        {t.choisirCreneau}
                      </option>
                      {grouperParJour(creneaux).map((groupe) => (
                        <optgroup
                          key={groupe.jour}
                          label={formaterJourLong(groupe.creneaux[0]!.debut, langue, config.fuseau)}
                        >
                          {groupe.creneaux.map((creneau) => {
                            const restantes =
                              reglages.regles.capaciteParCreneau -
                              (occupation.get(creneau.cle) ?? 0)
                            const complet = restantes <= 0

                            return (
                              <option key={creneau.cle} value={creneau.cle} disabled={complet}>
                                {formaterPlage(creneau.debut, creneau.fin, config.fuseau)}
                                {complet ? ` — ${t.creneauComplet}` : ''}
                                {!complet && restantes <= 2
                                  ? ` — ${t.placesRestantes(restantes)}`
                                  : ''}
                              </option>
                            )
                          })}
                        </optgroup>
                      ))}
                    </select>
                    <span id="aide-creneau" className="mt-1.5 block text-sm text-texte-attenue">
                      {t.delaiMinimum(reglages.regles.delaiMinimumHeures)}
                    </span>
                  </>
                )}
              </div>

              <fieldset>
                <legend className="mb-4 font-medium">{t.vosCoordonnees}</legend>

                {/* Nom et telephone tiennent sur une ligne : deux champs courts. */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <p>
                    <label htmlFor="nom" className={ETIQUETTE}>
                      {t.nom} <span className="text-texte-attenue">({t.champObligatoire})</span>
                    </label>
                    <input
                      id="nom"
                      name="nom"
                      type="text"
                      required
                      autoComplete="name"
                      className={CHAMP}
                    />
                  </p>

                  <p>
                    <label htmlFor="telephone" className={ETIQUETTE}>
                      {t.telephone}{' '}
                      <span className="text-texte-attenue">({t.champObligatoire})</span>
                    </label>
                    <input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      required
                      autoComplete="tel"
                      className={CHAMP}
                    />
                  </p>
                </div>

                <p className="mt-4">
                  <label htmlFor="email" className={ETIQUETTE}>
                    {t.email} <span className="text-texte-attenue">({t.champObligatoire})</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={CHAMP}
                  />
                </p>

                <p className="mt-4">
                  <label htmlFor="notes" className={ETIQUETTE}>
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
                  <span id="aide-notes" className="mt-1.5 block text-sm text-texte-attenue">
                    {t.notesAide}
                  </span>
                </p>
              </fieldset>

              <fieldset>
                <legend className="mb-4 font-medium">{t.paiement}</legend>
                {/* Seul un commerce qui propose les deux modes a deux colonnes. */}
                <div
                  className={cn(
                    'grid gap-3',
                    reglages.paiementEnLigne && reglages.paiementSurPlace && 'sm:grid-cols-2',
                  )}
                >
                  {reglages.paiementEnLigne ? (
                    <label className={CARTE_PAIEMENT}>
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="modePaiement"
                          value="en_ligne"
                          defaultChecked
                          required
                          className="size-4 shrink-0 accent-accent"
                        />
                        <span className="font-titres text-lg">{t.payerEnLigne}</span>
                      </span>
                      <span className="text-sm text-texte-attenue">{t.payerEnLigneAide}</span>
                    </label>
                  ) : null}
                  {reglages.paiementSurPlace ? (
                    <label className={CARTE_PAIEMENT}>
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="modePaiement"
                          value="sur_place"
                          defaultChecked={!reglages.paiementEnLigne}
                          required
                          className="size-4 shrink-0 accent-accent"
                        />
                        <span className="font-titres text-lg">{t.payerSurPlace}</span>
                      </span>
                      <span className="text-sm text-texte-attenue">{t.payerSurPlaceAide}</span>
                    </label>
                  ) : null}
                </div>
              </fieldset>

              <button
                type="submit"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-primaire px-6 py-3 font-medium text-primaire-contraste transition-colors hover:bg-primaire-survol"
              >
                {t.valider}
              </button>
            </form>
          )}
        </div>
      </Conteneur>
    </Section>
  )
}
