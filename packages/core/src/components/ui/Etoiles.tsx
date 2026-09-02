import { cn } from '../../lib/cn'

type ProprietesEtoiles = {
  note: number
  max?: number
  /** Texte lu par les lecteurs d'ecran, deja traduit. */
  libelle: string
  className?: string
}

/**
 * Note en etoiles.
 *
 * Les etoiles sont decoratives (`aria-hidden`) et la valeur est donnee en texte
 * a cote : un lecteur d'ecran annonce « Note de 5 sur 5 » au lieu d'enumerer
 * cinq images sans signification.
 */
export const Etoiles = ({ note, max = 5, libelle, className }: ProprietesEtoiles) => (
  <p className={cn('flex items-center gap-0.5', className)}>
    <span className="sr-only">{libelle}</span>
    {Array.from({ length: max }, (_, index) => (
      <svg
        key={index}
        aria-hidden="true"
        viewBox="0 0 20 20"
        className={cn('size-5', index < note ? 'fill-accent' : 'fill-bordure')}
      >
        <path d="M10 1.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 14.9l-5.25 2.75 1-5.85L1.5 7.65l5.9-.85L10 1.5z" />
      </svg>
    ))}
  </p>
)
