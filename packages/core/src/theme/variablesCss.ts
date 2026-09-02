import { prefixes, type Theme } from './tokens'

const enKebab = (cle: string) => cle.replace(/[A-Z]/g, (lettre) => `-${lettre.toLowerCase()}`)

/**
 * Transforme un theme en declarations CSS personnalisees.
 * Ex. `couleurs.primaireContraste` -> `--c-primaire-contraste`.
 */
export const variablesCss = (theme: Theme): string => {
  const lignes: string[] = []

  for (const [famille, prefixe] of Object.entries(prefixes)) {
    const jetons = theme[famille as keyof Theme]
    for (const [cle, valeur] of Object.entries(jetons)) {
      lignes.push(`${prefixe}${enKebab(cle)}:${valeur}`)
    }
  }

  return lignes.join(';')
}
