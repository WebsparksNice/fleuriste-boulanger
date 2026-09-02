import { Inter, Playfair_Display } from 'next/font/google'

/**
 * Polices du client.
 *
 * Elles sont declarees ici et non dans le socle : `next/font` exige des appels
 * statiques, analysables a la compilation. Le socle n'expose donc que des
 * variables CSS (`--police-titres`, `--police-corps`), que chaque app remplit
 * a sa facon.
 */
export const policeTitres = Playfair_Display({
  subsets: ['latin'],
  variable: '--police-titres',
  display: 'swap',
  weight: ['600', '700'],
})

export const policeCorps = Inter({
  subsets: ['latin'],
  variable: '--police-corps',
  display: 'swap',
})

export const classesPolices = `${policeTitres.variable} ${policeCorps.variable}`
