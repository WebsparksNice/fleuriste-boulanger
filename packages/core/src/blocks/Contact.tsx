import { Conteneur } from '../components/ui/Conteneur'
import { Coordonnees } from '../components/contact/Coordonnees'
import { ImageMedia } from '../components/media/ImageMedia'
import { ReseauxSociaux } from '../components/contact/ReseauxSociaux'
import { Section } from '../components/ui/Section'
import { TableauHoraires } from '../components/horaires/TableauHoraires'
import { TexteRiche } from '../components/richtext/TexteRiche'
import { Titre } from '../components/ui/Titre'
import { obtenirDictionnaire } from '../i18n'
import { jourActuel, normaliserHoraires } from '../lib/horaires'
import { numeroPourAppel } from '../lib/liens'
import { estPeuple, type BlocContactDoc } from '../types'
import type { ProprietesBloc } from './types'

/**
 * Bloc « nous trouver ».
 *
 * Le plan d'acces est une image cliquable vers l'itineraire, jamais une carte
 * interactive : une iframe Google Maps pese plus lourd que le reste de la page
 * et depose des traceurs avant tout consentement.
 */
export const Contact = ({ bloc, config, contexte }: ProprietesBloc<BlocContactDoc>) => {
  const t = obtenirDictionnaire(contexte.langue, config.dictionnaires)
  const etablissement = contexte.etablissement
  const horaires = normaliserHoraires(etablissement?.horaires)
  const itineraire = etablissement?.lienItineraire
  const telephone = etablissement?.telephone

  return (
    <Section apparence={bloc.apparence}>
      <Conteneur>
        <div className="mb-8 space-y-3">
          <Titre>{bloc.titre ?? t.contact.titre}</Titre>
          <TexteRiche contenu={bloc.intro} config={config} langue={contexte.langue} />
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-8">
            {bloc.afficherCoordonnees !== false ? (
              <Coordonnees etablissement={etablissement} t={t} />
            ) : null}

            {bloc.afficherHoraires !== false ? (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-texte-attenue">
                  {t.horaires.titre}
                </h3>
                <TableauHoraires
                  horaires={horaires}
                  jourEnCours={jourActuel(config.fuseau)}
                  t={t}
                  className="mt-2"
                />
              </div>
            ) : null}

            {bloc.afficherReseaux !== false ? (
              <ReseauxSociaux reseaux={etablissement?.reseauxSociaux} titre={t.contact.suivezNous} />
            ) : null}

            <div className="flex flex-wrap gap-3">
              {telephone ? (
                <a
                  href={`tel:${numeroPourAppel(telephone)}`}
                  className="inline-flex min-h-11 items-center rounded-md bg-primaire px-5 py-3 font-medium text-primaire-contraste"
                >
                  {t.contact.nousAppeler}
                </a>
              ) : null}
              {itineraire ? (
                <a
                  href={itineraire}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-md border border-bordure px-5 py-3 font-medium"
                >
                  {t.contact.itineraire}
                </a>
              ) : null}
            </div>
          </div>

          {bloc.afficherCarte !== false && estPeuple(bloc.imageCarte) ? (
            <div>
              {itineraire ? (
                <a href={itineraire} target="_blank" rel="noopener noreferrer" className="block">
                  <ImageMedia
                    media={bloc.imageCarte}
                    format="paysage"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="rounded-lg bg-surface-attenuee"
                  />
                  <span className="mt-2 inline-block text-sm underline underline-offset-4">
                    {t.contact.voirSurLaCarte}
                  </span>
                </a>
              ) : (
                <ImageMedia
                  media={bloc.imageCarte}
                  format="paysage"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="rounded-lg bg-surface-attenuee"
                />
              )}
            </div>
          ) : null}
        </div>
      </Conteneur>
    </Section>
  )
}
