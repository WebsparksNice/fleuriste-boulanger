import type { Block } from 'payload'

import { blocContact } from './contact'
import { blocCta } from './cta'
import { blocEtapes } from './etapes'
import { blocFaq } from './faq'
import { blocGalerie } from './galerie'
import { blocHero } from './hero'
import { blocHoraires } from './horaires'
import { blocProduits } from './produits'
import { blocTemoignages } from './temoignages'
import { blocTexteImage } from './texteImage'

/**
 * Blocs disponibles pour construire une page.
 * L'ordre est celui du menu d'ajout dans l'admin : du plus courant au plus rare.
 */
export const blocsDeContenu: Block[] = [
  blocHero,
  blocTexteImage,
  blocProduits,
  blocGalerie,
  blocHoraires,
  blocTemoignages,
  blocFaq,
  blocEtapes,
  blocContact,
  blocCta,
]

export {
  blocContact,
  blocCta,
  blocEtapes,
  blocFaq,
  blocGalerie,
  blocHero,
  blocHoraires,
  blocProduits,
  blocTemoignages,
  blocTexteImage,
}
