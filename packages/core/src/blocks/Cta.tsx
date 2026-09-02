import { Conteneur } from '../components/ui/Conteneur'
import { GroupeBoutons } from '../components/ui/Bouton'
import { Section } from '../components/ui/Section'
import { Titre } from '../components/ui/Titre'
import { resoudreLiens } from '../lib/liens'
import type { BlocCtaDoc } from '../types'
import type { ProprietesBloc } from './types'

export const Cta = ({ bloc, config, contexte }: ProprietesBloc<BlocCtaDoc>) => {
  const boutons = resoudreLiens(bloc.boutons, config, contexte.langue, contexte.etablissement)

  return (
    <Section apparence={bloc.apparence ?? { fond: 'primaire' }}>
      <Conteneur>
        <div className="mx-auto max-w-2xl space-y-5 text-center">
          <Titre>{bloc.titre}</Titre>
          {bloc.texte ? <p className="text-lg opacity-90">{bloc.texte}</p> : null}
          <GroupeBoutons liens={boutons} className="justify-center" />
        </div>
      </Conteneur>
    </Section>
  )
}
