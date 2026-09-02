import type { Dictionnaire } from '../../i18n'
import { cn } from '../../lib/cn'
import { numeroPourAppel } from '../../lib/liens'
import type { EtablissementDoc } from '../../types'

/** Adresse postale sur plusieurs lignes, sans virgule superflue si un champ manque. */
export const lignesAdresse = (etablissement?: EtablissementDoc | null): string[] => {
  const adresse = etablissement?.adresse
  if (!adresse) return []

  const villeEtCode = [adresse.codePostal, adresse.ville].filter(Boolean).join(' ')

  return [adresse.rue, adresse.complement, villeEtCode, adresse.pays].filter(
    (ligne): ligne is string => Boolean(ligne && ligne.trim()),
  )
}

type ProprietesCoordonnees = {
  etablissement?: EtablissementDoc | null
  t: Dictionnaire
  className?: string
}

/**
 * Adresse, telephone et e-mail du commerce.
 *
 * Balise en `<address>` avec un microformat h-card : c'est ce que lisent les
 * moteurs pour rattacher le numero de telephone au commerce, en complement du
 * JSON-LD.
 */
export const Coordonnees = ({ etablissement, t, className }: ProprietesCoordonnees) => {
  const lignes = lignesAdresse(etablissement)
  const telephone = etablissement?.telephone
  const email = etablissement?.email

  if (lignes.length === 0 && !telephone && !email) return null

  return (
    <address className={cn('not-italic space-y-4', className)}>
      {lignes.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-texte-attenue">
            {t.contact.adresse}
          </h3>
          <p className="mt-1">
            {lignes.map((ligne, position) => (
              <span key={position} className="block">
                {ligne}
              </span>
            ))}
          </p>
        </div>
      ) : null}

      {telephone ? (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-texte-attenue">
            {t.contact.telephone}
          </h3>
          <p className="mt-1">
            <a href={`tel:${numeroPourAppel(telephone)}`} className="underline underline-offset-4 hover:no-underline">
              {telephone}
            </a>
          </p>
        </div>
      ) : null}

      {email ? (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-texte-attenue">
            {t.contact.email}
          </h3>
          <p className="mt-1">
            <a href={`mailto:${email}`} className="underline underline-offset-4 hover:no-underline">
              {email}
            </a>
          </p>
        </div>
      ) : null}
    </address>
  )
}
