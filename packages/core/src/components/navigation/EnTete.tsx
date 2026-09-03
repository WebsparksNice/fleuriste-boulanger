import Link from 'next/link'
import type { ReactNode } from 'react'

import type { ConfigSiteResolue } from '../../config'
import { lienVers } from '../../config'
import type { Dictionnaire, Langue } from '../../i18n'
import { resoudreLien, resoudreLiens } from '../../lib/liens'
import type { EtablissementDoc, NavigationDoc } from '../../types'
import { Bouton } from '../ui/Bouton'
import { ImageMedia } from '../media/ImageMedia'
import { SelecteurLangue } from './SelecteurLangue'

type ProprietesEnTete = {
  navigation?: NavigationDoc | null
  etablissement?: EtablissementDoc | null
  config: ConfigSiteResolue
  langue: Langue
  alternatives?: Partial<Record<Langue, string>>
  t: Dictionnaire
  /**
   * Emplacement laisse aux modules optionnels (bouton « Commander », panier...).
   * Le socle ne sait pas ce qu'on y met et n'importe rien pour l'afficher.
   */
  actions?: ReactNode
}

/**
 * En-tete du site.
 *
 * Le menu mobile repose sur `<details>` / `<summary>` plutot que sur un
 * composant client : le navigateur fournit deja l'ouverture au clavier et
 * l'annonce de l'etat plie/deplie. L'en-tete etant present sur toutes les pages,
 * un menu en JavaScript aurait suffi a faire charger un bundle partout, y
 * compris sur des pages qui n'en ont aucun autre besoin.
 */
export const EnTete = ({
  navigation,
  etablissement,
  config,
  langue,
  alternatives,
  t,
  actions,
}: ProprietesEnTete) => {
  const entrees = resoudreLiens(navigation?.menuPrincipal, config, langue, etablissement)
  const cta = navigation?.ctaEnTete?.actif
    ? resoudreLien(navigation.ctaEnTete.lien, config, langue, etablissement)
    : null
  const accueil = lienVers(config, langue)

  const marque = (
    <Link href={accueil} className="flex items-center gap-3">
      {etablissement?.logo ? (
        <ImageMedia
          media={etablissement.logo}
          format="naturel"
          alt=""
          sizes="120px"
          className="h-10 w-auto"
          classNameImage="h-10 w-auto object-contain"
        />
      ) : null}
      <span className="font-titres text-lg font-semibold">{etablissement?.nom}</span>
    </Link>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-bordure bg-fond/95 backdrop-blur">
      <div className="conteneur flex min-h-16 items-center justify-between gap-4 py-2">
        {marque}

        {/* Navigation sur grand ecran */}
        <nav aria-label={t.navigation.menuPrincipal} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {entrees.map((entree, position) => (
              <li key={`${entree.href}-${position}`}>
                <Link
                  href={entree.href}
                  className="inline-flex min-h-11 items-center rounded-md px-3 hover:underline hover:underline-offset-4"
                >
                  {entree.libelle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <SelecteurLangue
            config={config}
            langueActive={langue}
            alternatives={alternatives}
            t={t}
            className="hidden sm:block"
          />
          {actions}
          {cta ? <Bouton lien={cta} className="hidden lg:inline-flex" /> : null}

          {/* Menu mobile : disclosure native, sans JavaScript */}
          {entrees.length > 0 ? (
            <details className="group relative lg:hidden">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md border border-bordure px-3">
                <span aria-hidden="true" className="text-xl leading-none">
                  <span className="group-open:hidden">☰</span>
                  <span className="hidden group-open:inline">✕</span>
                </span>
                <span className="sr-only group-open:hidden">{t.navigation.ouvrirMenu}</span>
                <span className="sr-only hidden group-open:inline">{t.navigation.fermerMenu}</span>
              </summary>

              <nav
                aria-label={t.navigation.menuPrincipal}
                className="absolute right-0 top-[calc(100%+0.5rem)] w-64 rounded-lg border border-bordure bg-surface p-2 shadow-lg"
              >
                <ul className="flex flex-col">
                  {entrees.map((entree, position) => (
                    <li key={`${entree.href}-${position}`}>
                      <Link
                        href={entree.href}
                        className="flex min-h-11 items-center rounded-md px-3 hover:bg-surface-attenuee"
                      >
                        {entree.libelle}
                      </Link>
                    </li>
                  ))}
                </ul>
                {cta ? <Bouton lien={cta} className="mt-2 w-full" /> : null}
                <SelecteurLangue
                  config={config}
                  langueActive={langue}
                  alternatives={alternatives}
                  t={t}
                  className="mt-2 border-t border-bordure pt-2 sm:hidden"
                />
              </nav>
            </details>
          ) : null}
        </div>
      </div>
    </header>
  )
}
