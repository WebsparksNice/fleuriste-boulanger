import { Conteneur } from '../components/ui/Conteneur'
import { Etoiles } from '../components/ui/Etoiles'
import { Section } from '../components/ui/Section'
import { Titre } from '../components/ui/Titre'
import { obtenirDictionnaire } from '../i18n'
import { cn } from '../lib/cn'
import { listerTemoignages } from '../lib/donnees'
import { estPeuple, type BlocTemoignagesDoc } from '../types'
import type { ProprietesBloc } from './types'

export const Temoignages = async ({
  bloc,
  config,
  contexte,
}: ProprietesBloc<BlocTemoignagesDoc>) => {
  const t = obtenirDictionnaire(contexte.langue, config.dictionnaires)

  const identifiants =
    bloc.mode === 'selection'
      ? (bloc.selection ?? []).map((temoignage) => (estPeuple(temoignage) ? temoignage.id : temoignage))
      : undefined

  const temoignages = await listerTemoignages({
    payload: contexte.payload,
    langue: contexte.langue,
    ids: identifiants,
    limite: bloc.limite ?? 3,
  })

  if (temoignages.length === 0) return null

  return (
    <Section apparence={bloc.apparence ?? { fond: 'attenue' }}>
      <Conteneur>
        <Titre className="mb-8">{bloc.titre ?? t.temoignages.titre}</Titre>

        <ul
          className={cn(
            'grid grid-cols-1 gap-6',
            temoignages.length > 1 && 'sm:grid-cols-2',
            temoignages.length > 2 && 'lg:grid-cols-3',
          )}
        >
          {temoignages.map((temoignage) => (
            <li key={temoignage.id}>
              <figure className="flex h-full flex-col gap-4 rounded-lg border border-bordure bg-surface p-6">
                {bloc.afficherNotes !== false && temoignage.note ? (
                  <Etoiles
                    note={temoignage.note}
                    libelle={t.temoignages.noteSur(temoignage.note, 5)}
                  />
                ) : null}
                <blockquote className="grow text-pretty">« {temoignage.texte} »</blockquote>
                <figcaption className="text-sm font-medium text-texte-attenue">
                  {temoignage.auteur}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Conteneur>
    </Section>
  )
}
