import { Conteneur } from '../components/ui/Conteneur'
import { Section } from '../components/ui/Section'
import { TableauHoraires } from '../components/horaires/TableauHoraires'
import { Titre } from '../components/ui/Titre'
import { obtenirDictionnaire } from '../i18n'
import { fermeturesAVenir, formaterDate, jourActuel, normaliserHoraires } from '../lib/horaires'
import type { BlocHorairesDoc } from '../types'
import type { ProprietesBloc } from './types'

/**
 * Horaires d'ouverture.
 *
 * Le jour en cours est calcule au rendu, dans le fuseau du commerce. Comme les
 * pages sont mises en cache, l'app revalide toutes les heures : la mise en avant
 * peut donc etre en retard d'une heure au changement de jour, jamais davantage.
 * C'est le prix d'une page sans aucun JavaScript, et il est bien inferieur a
 * celui d'un badge « ouvert maintenant » qui serait faux la moitie du temps.
 */
export const Horaires = ({ bloc, config, contexte }: ProprietesBloc<BlocHorairesDoc>) => {
  const t = obtenirDictionnaire(contexte.langue, config.dictionnaires)

  const source =
    bloc.source === 'personnalise' ? bloc.horairesPersonnalises : contexte.etablissement?.horaires
  const horaires = normaliserHoraires(source)

  const fermetures =
    bloc.source !== 'personnalise' && bloc.afficherFermetures
      ? fermeturesAVenir(contexte.etablissement?.fermeturesExceptionnelles)
      : []

  return (
    <Section apparence={bloc.apparence}>
      <Conteneur etroit>
        <Titre className="mb-6">{bloc.titre ?? t.horaires.titre}</Titre>

        <TableauHoraires
          horaires={horaires}
          jourEnCours={jourActuel(config.fuseau)}
          t={t}
        />

        {bloc.note ? <p className="mt-4 text-sm text-texte-attenue">{bloc.note}</p> : null}

        {fermetures.length > 0 ? (
          <div className="mt-8">
            <h3 className="text-lg font-medium">{t.horaires.fermeturesExceptionnelles}</h3>
            <ul className="mt-3 space-y-2">
              {fermetures.map((fermeture, position) => {
                const memeJour = fermeture.du.getTime() === fermeture.au.getTime()
                const periode = memeJour
                  ? t.horaires.le(formaterDate(fermeture.du, contexte.langue, config.fuseau))
                  : t.horaires.duAu(
                      formaterDate(fermeture.du, contexte.langue, config.fuseau),
                      formaterDate(fermeture.au, contexte.langue, config.fuseau),
                    )

                return (
                  <li key={position} className="text-texte-attenue">
                    <span className="text-texte">{periode}</span>
                    {fermeture.motif ? ` — ${fermeture.motif}` : null}
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}
      </Conteneur>
    </Section>
  )
}
