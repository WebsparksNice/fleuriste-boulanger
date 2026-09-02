/**
 * Valeur d'une relation Payload.
 *
 * Le type d'un identifiant dépend de l'adaptateur choisi par le client :
 * un entier avec Postgres, une chaîne avec MongoDB. Les types générés dans
 * chaque app figent l'un des deux, alors que ce module doit fonctionner avec
 * les deux. On convertit donc explicitement ici, une fois, plutôt que de
 * parsemer le code de conversions muettes.
 */
export const relation = (identifiant: string | number): never => identifiant as never
