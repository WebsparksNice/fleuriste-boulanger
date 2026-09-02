import { cn } from '../../lib/cn'
import type { ReseauSocialDoc } from '../../types'

const noms: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  google: 'Google',
  autre: 'Site',
}

type ProprietesReseaux = {
  reseaux?: ReseauSocialDoc[] | null
  titre: string
  className?: string
}

/**
 * Liens vers les reseaux sociaux.
 *
 * Chaque lien porte le nom de la plateforme en toutes lettres plutot qu'une
 * icone seule : une icone sans texte n'est annoncee par aucun lecteur d'ecran.
 */
export const ReseauxSociaux = ({ reseaux, titre, className }: ProprietesReseaux) => {
  const entrees = (reseaux ?? []).filter((reseau) => reseau.url)
  if (entrees.length === 0) return null

  return (
    <div className={className}>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-texte-attenue">{titre}</h3>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
        {entrees.map((reseau, position) => (
          <li key={reseau.id ?? position}>
            <a
              href={reseau.url as string}
              target="_blank"
              rel="noopener noreferrer me"
              className={cn('underline underline-offset-4 hover:no-underline')}
            >
              {noms[reseau.plateforme ?? 'autre'] ?? reseau.plateforme}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
