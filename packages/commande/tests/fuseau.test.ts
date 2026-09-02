import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  ajouterJours,
  dateLocaleIso,
  decalageMinutes,
  heureLocale,
  instantDepuisHeureLocale,
  jourSemaineLocal,
} from '../src/domaine/fuseau'

const PARIS = 'Europe/Paris'

const instant = (annee: number, mois: number, jour: number, heures: number, minutes: number) =>
  instantDepuisHeureLocale(annee, mois, jour, heures, minutes, PARIS)?.toISOString() ?? null

describe('decalageMinutes', () => {
  it('vaut UTC+1 en hiver', () => {
    assert.equal(decalageMinutes(new Date('2026-01-15T12:00:00Z'), PARIS), 60)
  })

  it('vaut UTC+2 en ete', () => {
    assert.equal(decalageMinutes(new Date('2026-07-15T12:00:00Z'), PARIS), 120)
  })
})

describe('instantDepuisHeureLocale', () => {
  it('convertit une heure murale hors periode de transition', () => {
    assert.equal(instant(2026, 1, 15, 7, 30), '2026-01-15T06:30:00.000Z')
    assert.equal(instant(2026, 7, 15, 7, 30), '2026-07-15T05:30:00.000Z')
  })

  it('refuse une heure qui n existe pas au passage a l heure d ete', () => {
    // Le 29 mars 2026, l'horloge saute de 02:00 a 03:00 : 02:30 n'a pas lieu.
    assert.equal(instant(2026, 3, 29, 1, 30), '2026-03-29T00:30:00.000Z')
    assert.equal(instant(2026, 3, 29, 2, 30), null)
    assert.equal(instant(2026, 3, 29, 3, 30), '2026-03-29T01:30:00.000Z')
  })

  it('retient la premiere occurrence au retour a l heure d hiver', () => {
    // Le 25 octobre 2026, 02:30 se produit deux fois : en UTC+2 puis en UTC+1.
    assert.equal(instant(2026, 10, 25, 2, 30), '2026-10-25T00:30:00.000Z')
  })

  it('reste juste sur les journees de transition, aux heures d ouverture', () => {
    assert.equal(instant(2026, 3, 29, 7, 0), '2026-03-29T05:00:00.000Z')
    assert.equal(instant(2026, 10, 25, 7, 0), '2026-10-25T06:00:00.000Z')
  })

  it('gere minuit et le passage d annee', () => {
    assert.equal(instant(2026, 1, 1, 0, 0), '2025-12-31T23:00:00.000Z')
  })
})

describe('lecture locale', () => {
  it('fait l aller-retour sans deriver', () => {
    const retrait = instantDepuisHeureLocale(2026, 10, 25, 7, 0, PARIS)
    assert.ok(retrait)
    assert.equal(dateLocaleIso(retrait, PARIS), '2026-10-25')
    assert.equal(heureLocale(retrait, PARIS), '07:00')
    assert.equal(jourSemaineLocal(retrait, PARIS), 'dimanche')
  })

  it('rattache un instant de fin de soiree au bon jour local', () => {
    // 23:30 UTC le 30 juin, c'est deja le 1er juillet a Paris.
    assert.equal(dateLocaleIso(new Date('2026-06-30T23:30:00Z'), PARIS), '2026-07-01')
  })
})

describe('ajouterJours', () => {
  it('avance dans le mois et dans l annee', () => {
    assert.equal(ajouterJours('2026-09-02', 1), '2026-09-03')
    assert.equal(ajouterJours('2026-09-30', 1), '2026-10-01')
    assert.equal(ajouterJours('2026-12-31', 1), '2027-01-01')
  })

  it('ne derive pas en traversant un changement d heure', () => {
    assert.equal(ajouterJours('2026-03-28', 1), '2026-03-29')
    assert.equal(ajouterJours('2026-10-24', 1), '2026-10-25')
  })
})
