type ProprietesLienEvitement = {
  libelle: string
  cible?: string
}

/**
 * Lien d'evitement, premier element focalisable de la page.
 *
 * Invisible tant qu'il n'a pas le focus, il permet a qui navigue au clavier de
 * sauter le menu pour aller droit au contenu, au lieu de retraverser toute la
 * navigation a chaque page.
 */
export const LienEvitement = ({ libelle, cible = '#contenu' }: ProprietesLienEvitement) => (
  <a
    href={cible}
    className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primaire focus:px-4 focus:py-2 focus:text-primaire-contraste"
  >
    {libelle}
  </a>
)
