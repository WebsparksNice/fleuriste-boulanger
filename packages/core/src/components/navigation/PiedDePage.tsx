import Link from 'next/link'

import type { ConfigSiteResolue } from '../../config'
import type { Dictionnaire, Langue } from '../../i18n'
import { jourActuel, normaliserHoraires } from '../../lib/horaires'
import { resoudreLiens } from '../../lib/liens'
import type { EtablissementDoc, NavigationDoc } from '../../types'
import { Coordonnees } from '../contact/Coordonnees'
import { ReseauxSociaux } from '../contact/ReseauxSociaux'
import { TableauHoraires } from '../horaires/TableauHoraires'

type ProprietesPiedDePage = {
  navigation?: NavigationDoc | null
  etablissement?: EtablissementDoc | null
  config: ConfigSiteResolue
  langue: Langue
  t: Dictionnaire
}

export const PiedDePage = ({
  navigation,
  etablissement,
  config,
  langue,
  t,
}: ProprietesPiedDePage) => {
  const entrees = resoudreLiens(navigation?.menuPied, config, langue, etablissement)
  const horaires = normaliserHoraires(etablissement?.horaires)
  const annee = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-bordure bg-surface-attenuee py-section-compact">
      <div className="conteneur">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <p className="font-titres text-lg font-semibold">{etablissement?.nom}</p>
            {navigation?.mentionPied ? (
              <p className="text-sm text-texte-attenue">{navigation.mentionPied}</p>
            ) : null}
            <ReseauxSociaux reseaux={etablissement?.reseauxSociaux} titre={t.contact.suivezNous} />
          </div>

          <Coordonnees etablissement={etablissement} t={t} />

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-texte-attenue">
              {t.horaires.titre}
            </h3>
            <TableauHoraires
              horaires={horaires}
              jourEnCours={jourActuel(config.fuseau)}
              t={t}
              className="mt-2 text-sm"
            />
          </div>
        </div>

        {entrees.length > 0 ? (
          <nav aria-label={t.navigation.menuPied} className="mt-10 border-t border-bordure pt-6">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {entrees.map((entree, position) => (
                <li key={`${entree.href}-${position}`}>
                  <Link href={entree.href} className="underline underline-offset-4 hover:no-underline">
                    {entree.libelle}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <p className="mt-6 text-sm text-texte-attenue">
          © {annee} {etablissement?.nom}
        </p>
      </div>
    </footer>
  )
}
