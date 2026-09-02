import { themeParDefaut, type Theme, type ThemePartiel } from './tokens'

/**
 * Fusionne une surcharge client avec le theme de repli, famille par famille.
 * Volontairement sur un seul niveau : les jetons sont plats, pas besoin de deep merge recursif.
 */
export const fusionnerTheme = (surcharge?: ThemePartiel): Theme => {
  if (!surcharge) return themeParDefaut

  return {
    couleurs: { ...themeParDefaut.couleurs, ...surcharge.couleurs },
    polices: { ...themeParDefaut.polices, ...surcharge.polices },
    rayons: { ...themeParDefaut.rayons, ...surcharge.rayons },
    espacements: { ...themeParDefaut.espacements, ...surcharge.espacements },
    ombres: { ...themeParDefaut.ombres, ...surcharge.ombres },
  }
}
