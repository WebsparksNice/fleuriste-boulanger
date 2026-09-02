import type { CleJour, Dictionnaire } from '../../i18n'
import { cn } from '../../lib/cn'
import { formaterJour, type JourNormalise } from '../../lib/horaires'

type ProprietesTableauHoraires = {
  horaires: JourNormalise[]
  /** Jour a mettre en avant, calcule dans le fuseau du commerce. */
  jourEnCours?: CleJour
  t: Dictionnaire
  className?: string
}

/**
 * Semaine d'ouverture.
 *
 * Une liste de definitions plutot qu'un tableau : il n'y a qu'une donnee par
 * jour, donc pas de croisement de lignes et de colonnes a annoncer.
 *
 * Le jour en cours est repere par la graisse du texte et par un texte masque
 * lu a voix haute, jamais par la seule couleur.
 */
export const TableauHoraires = ({
  horaires,
  jourEnCours,
  t,
  className,
}: ProprietesTableauHoraires) => (
  <dl className={cn('divide-y divide-bordure', className)}>
    {horaires.map((jour) => {
      const actuel = jour.jour === jourEnCours

      return (
        <div
          key={jour.jour}
          className={cn(
            'flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-2.5',
            actuel && 'font-semibold',
          )}
        >
          <dt>
            {t.horaires.jours[jour.jour]}
            {actuel ? <span className="sr-only"> ({t.horaires.ouvertAujourdhui})</span> : null}
          </dt>
          <dd className={cn('tabular-nums', jour.ferme && !actuel && 'text-texte-attenue')}>
            {formaterJour(jour, t)}
          </dd>
        </div>
      )
    })}
  </dl>
)
