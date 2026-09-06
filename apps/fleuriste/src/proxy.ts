import { NextResponse, type NextRequest } from 'next/server'

import { site } from './site.config'

const langues = site.langues as readonly string[]
const langueParDefaut = site.langueParDefaut

/**
 * Prefixe de langue transparent.
 *
 * Convention `proxy.ts` de Next 16, qui remplace `middleware.ts`.
 *
 * La langue par defaut n'apparait pas dans l'URL : un client francophone garde
 * `/nos-pains`, et l'anglais eventuel vit sous `/en/our-breads`. On procede par
 * reecriture et non par redirection, pour que l'adresse affichee reste propre.
 *
 * Une URL explicitement prefixee de la langue par defaut (`/fr/contact`) est
 * redirigee vers sa forme canonique : deux adresses pour un meme contenu
 * diluent le referencement.
 */
export const proxy = (requete: NextRequest) => {
  const { pathname } = requete.nextUrl
  const [, premierSegment = ''] = pathname.split('/')

  if (premierSegment === langueParDefaut) {
    const url = requete.nextUrl.clone()
    url.pathname = pathname.slice(langueParDefaut.length + 1) || '/'
    return NextResponse.redirect(url, 308)
  }

  if (langues.includes(premierSegment)) return NextResponse.next()

  const url = requete.nextUrl.clone()
  url.pathname = `/${langueParDefaut}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  /*
   * Tout est traite sauf l'administration, l'API Payload, les fichiers servis
   * par Next et les fichiers a la racine (favicon, robots.txt, sitemap.xml...).
   */
  matcher: ['/((?!admin|api|_next/static|_next/image|media|.*\\..*).*)'],
}
