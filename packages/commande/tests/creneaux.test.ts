import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { creneauProposable, genererCreneaux, grouperParJour } from '../src/domaine/creneaux'
import type { ReglesCreneaux } from '../src/domaine/creneaux'
import { heureLocale } from '../src/domaine/fuseau'

const PARIS = 'Europe/Paris'

const ouvert = (jour: string, debut: string, fin: string) => ({
  jour: jour as never,
  ferme: false,
  plages: [{ debut, fin }],
})

const regles = (surcharges: Partial<ReglesCreneaux> = {}): ReglesCreneaux => ({
  dureeMinutes: 30,
  capaciteParCreneau: 4,
  delaiMinimumHeures: 2,
  horizonJours: 7,
  joursFermes: [],
  fuseau: PARIS,
  horaires: [
    { jour: 'lundi' as never, ferme: true, plages: [] },
    ouvert('mardi', '07:00', '12:00'),
    ouvert('mercredi', '07:00', '12:00'),
    ouvert('jeudi', '07:00', '12:00'),
    ouvert('vendredi', '07:00', '12:00'),
    ouvert('samedi', '07:00', '12:00'),
    ouvert('dimanche', '07:00', '12:00'),
  ],
  ...surcharges,
})

const heures = (creneaux: { debut: Date }[]) =>
  creneaux.map((creneau) => heureLocale(creneau.debut, PARIS))

describe('genererCreneaux', () => {
  it('decoupe la plage d ouverture en creneaux de la duree demandee', () => {
    // Mardi 1er septembre 2026, 05:00 locale : rien n'est encore ouvert.
    const creneaux = genererCreneaux(
      regles({ horizonJours: 1, delaiMinimumHeures: 0 }),
      new Date('2026-09-01T03:00:00Z'),
    )

    assert.equal(creneaux.length, 10)
    assert.deepEqual(heures(creneaux).slice(0, 3), ['07:00', '07:30', '08:00'])
    assert.equal(heures(creneaux).at(-1), '11:30')
  })

  it('n emet pas de creneau qui deborderait de la plage', () => {
    const creneaux = genererCreneaux(
      regles({ horizonJours: 1, delaiMinimumHeures: 0, dureeMinutes: 45 }),
      new Date('2026-09-01T03:00:00Z'),
    )

    // 07:00 -> 12:00 = 300 minutes, soit 6 creneaux de 45 minutes (270) ; le
    // reliquat de 30 minutes ne suffit pas. Le dernier part a 10:45 et finit a 11:30.
    assert.equal(creneaux.length, 6)
    assert.equal(heures(creneaux).at(-1), '10:45')
  })

  it('applique le delai minimum avant retrait', () => {
    // Mardi 1er septembre 2026, 08:10 locale (06:10 UTC), delai de 2 heures.
    const creneaux = genererCreneaux(
      regles({ horizonJours: 1 }),
      new Date('2026-09-01T06:10:00Z'),
    )

    assert.equal(heures(creneaux)[0], '10:30')
  })

  it('saute les jours de fermeture hebdomadaire', () => {
    // Du dimanche 6 au lundi 7 septembre 2026 ; le lundi est ferme.
    const creneaux = genererCreneaux(
      regles({ horizonJours: 2, delaiMinimumHeures: 0 }),
      new Date('2026-09-06T03:00:00Z'),
    )

    const jours = new Set(grouperParJour(creneaux).map((groupe) => groupe.jour))
    assert.deepEqual([...jours], ['2026-09-06'])
  })

  it('saute les fermetures exceptionnelles', () => {
    const creneaux = genererCreneaux(
      regles({ horizonJours: 2, delaiMinimumHeures: 0, joursFermes: ['2026-09-02'] }),
      new Date('2026-09-01T03:00:00Z'),
    )

    const jours = grouperParJour(creneaux).map((groupe) => groupe.jour)
    assert.deepEqual(jours, ['2026-09-01'])
  })

  it('gere plusieurs plages dans la journee, coupure de midi comprise', () => {
    const creneaux = genererCreneaux(
      regles({
        horizonJours: 1,
        delaiMinimumHeures: 0,
        horaires: [
          {
            jour: 'mardi' as never,
            ferme: false,
            plages: [
              { debut: '07:00', fin: '08:00' },
              { debut: '16:00', fin: '17:00' },
            ],
          },
        ],
      }),
      new Date('2026-09-01T03:00:00Z'),
    )

    assert.deepEqual(heures(creneaux), ['07:00', '07:30', '16:00', '16:30'])
  })

  it('ignore une plage mal saisie plutot que de boucler', () => {
    const creneaux = genererCreneaux(
      regles({
        horizonJours: 1,
        delaiMinimumHeures: 0,
        horaires: [
          {
            jour: 'mardi' as never,
            ferme: false,
            plages: [
              { debut: '12:00', fin: '07:00' },
              { debut: 'nawak', fin: '17:00' },
              { debut: '16:00', fin: '17:00' },
            ],
          },
        ],
      }),
      new Date('2026-09-01T03:00:00Z'),
    )

    assert.deepEqual(heures(creneaux), ['16:00', '16:30'])
  })
})

describe('changement d heure', () => {
  it('ne propose pas de creneau dans l heure qui n existe pas', () => {
    // Dimanche 29 mars 2026 : l'horloge saute de 02:00 a 03:00.
    const creneaux = genererCreneaux(
      regles({
        horizonJours: 1,
        delaiMinimumHeures: 0,
        horaires: [{ jour: 'dimanche' as never, ferme: false, plages: [{ debut: '01:00', fin: '04:00' }] }],
      }),
      new Date('2026-03-28T23:30:00Z'),
    )

    assert.deepEqual(heures(creneaux), ['01:00', '01:30', '03:00', '03:30'])
  })

  it('ne duplique pas l heure vecue deux fois', () => {
    // Dimanche 25 octobre 2026 : 02:00 -> 03:00 devient 02:00 -> 03:00 bis.
    const creneaux = genererCreneaux(
      regles({
        horizonJours: 1,
        delaiMinimumHeures: 0,
        horaires: [{ jour: 'dimanche' as never, ferme: false, plages: [{ debut: '01:00', fin: '04:00' }] }],
      }),
      new Date('2026-10-24T22:30:00Z'),
    )

    assert.deepEqual(heures(creneaux), ['01:00', '01:30', '02:00', '02:30', '03:00', '03:30'])
    // Chaque creneau reste un instant distinct, malgre les heures identiques.
    assert.equal(new Set(creneaux.map((creneau) => creneau.cle)).size, creneaux.length)
  })

  it('conserve une journee complete de creneaux le jour du changement', () => {
    const printemps = genererCreneaux(
      regles({ horizonJours: 1, delaiMinimumHeures: 0 }),
      new Date('2026-03-28T23:30:00Z'),
    )
    const automne = genererCreneaux(
      regles({ horizonJours: 1, delaiMinimumHeures: 0 }),
      new Date('2026-10-24T22:30:00Z'),
    )

    // 07:00 -> 12:00 des deux cotes : les heures d'ouverture sont murales,
    // elles ne bougent pas avec le fuseau.
    assert.equal(printemps.length, 10)
    assert.equal(automne.length, 10)
  })
})

describe('creneauProposable', () => {
  const maintenant = new Date('2026-09-01T03:00:00Z')

  it('accepte un creneau issu du calcul serveur', () => {
    const [premier] = genererCreneaux(regles({ horizonJours: 1, delaiMinimumHeures: 0 }), maintenant)
    assert.ok(premier)
    assert.ok(creneauProposable(premier.cle, regles({ horizonJours: 1, delaiMinimumHeures: 0 }), maintenant))
  })

  it('refuse un creneau fabrique a la main', () => {
    // Une heure plausible, mais hors des creneaux calcules.
    assert.equal(
      creneauProposable('2026-09-01T05:07:00.000Z', regles(), maintenant),
      null,
    )
  })

  it('refuse un creneau tombant sous le delai minimum', () => {
    const sansDelai = regles({ horizonJours: 1, delaiMinimumHeures: 0 })
    const [premier] = genererCreneaux(sansDelai, maintenant)
    assert.ok(premier)

    // Le meme creneau, mais avec le delai de deux heures reactive.
    assert.equal(creneauProposable(premier.cle, regles({ horizonJours: 1 }), new Date('2026-09-01T06:10:00Z')), null)
  })

  it('refuse un creneau au-dela de l horizon de reservation', () => {
    const dansTroisSemaines = new Date('2026-09-22T08:00:00Z').toISOString()
    assert.equal(creneauProposable(dansTroisSemaines, regles(), maintenant), null)
  })
})
