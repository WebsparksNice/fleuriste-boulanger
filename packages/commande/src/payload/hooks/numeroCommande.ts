import type { FieldHook } from 'payload'

// Alphabet sans caractères ambigus : ni O/0, ni I/1. Le numéro se lit au
// téléphone et se recopie sur un ticket, il ne doit pas prêter à confusion.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

const suffixe = (longueur = 4): string => {
  const octets = new Uint8Array(longueur)
  crypto.getRandomValues(octets)
  return Array.from(octets, (octet) => ALPHABET[octet % ALPHABET.length]).join('')
}

/**
 * Numéro lisible du type `20260902-4F7K`.
 *
 * La partie date rend la commande immédiatement situable par le commerçant, le
 * suffixe aléatoire évite toute contention : un compteur séquentiel imposerait
 * un verrou en base à chaque commande, pour un confort marginal.
 */
export const attribuerNumero: FieldHook = ({ operation, value }) => {
  if (operation !== 'create' || (typeof value === 'string' && value.length > 0)) return value

  const maintenant = new Date()
  const jour = [
    maintenant.getUTCFullYear(),
    String(maintenant.getUTCMonth() + 1).padStart(2, '0'),
    String(maintenant.getUTCDate()).padStart(2, '0'),
  ].join('')

  return `${jour}-${suffixe()}`
}

/** Jeton opaque qui autorise le client à consulter sa commande sans compte. */
export const attribuerJeton: FieldHook = ({ operation, value }) => {
  if (operation !== 'create' || (typeof value === 'string' && value.length > 0)) return value
  return crypto.randomUUID().replaceAll('-', '')
}
