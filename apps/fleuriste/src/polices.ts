import { Fraunces, Inter } from 'next/font/google'

/**
 * Polices du client.
 *
 * Elles sont declarees ici et non dans le socle : `next/font` exige des appels
 * statiques, analysables a la compilation. Le socle n'expose donc que des
 * variables CSS (`--police-titres`, `--police-corps`), que chaque app remplit
 * a sa facon.
 */

/*
 * Fraunces est une variable font : on ne fige aucune graisse, la plage complete
 * est chargee une seule fois. L'axe `opsz` est demande en plus de la graisse
 * pour que les titres soient composes dans le dessin « affiche » de la fonte
 * (empattements plus francs), regle dans globals.css.
 */
export const policeTitres = Fraunces({
  subsets: ['latin'],
  variable: '--police-titres',
  display: 'swap',
  axes: ['opsz'],
})

export const policeCorps = Inter({
  subsets: ['latin'],
  variable: '--police-corps',
  display: 'swap',
})

export const classesPolices = `${policeTitres.variable} ${policeCorps.variable}`
