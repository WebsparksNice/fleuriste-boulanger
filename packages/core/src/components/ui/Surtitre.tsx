import type { ReactNode } from 'react'

import { cn } from '../../lib/cn'

type ProprietesSurtitre = {
  children?: ReactNode
  className?: string
}

/**
 * Ligne d'annonce posee au-dessus d'un titre de section.
 *
 * Rendue en `<p>` et non en titre : elle n'ouvre pas de niveau dans le plan du
 * document, elle qualifie celui qui suit. Un lecteur d'ecran qui parcourt les
 * titres ne doit pas tomber sur « Le catalogue » avant « Nos bouquets ».
 *
 * Sa mise en forme vit dans la feuille du socle (`.surtitre`), pour que le
 * texte reprenne la couleur du bloc quand il est pose sur un aplat.
 */
export const Surtitre = ({ children, className }: ProprietesSurtitre) => {
  if (!children) return null
  return <p className={cn('surtitre', className)}>{children}</p>
}
