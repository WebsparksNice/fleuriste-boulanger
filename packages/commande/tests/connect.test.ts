process.env.PAYLOAD_SECRET = 'secret-de-test-pour-les-jetons'

import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { describe, it } from 'node:test'

import { modeConnect, signerJeton, verifierJeton } from '../src/serveur/connect'

describe('jetons signés de la liaison Stripe', () => {
  it('fait l aller-retour et conserve le contenu', () => {
    const jeton = signerJeton({ u: '42', a: 'connexion' })
    const contenu = verifierJeton(jeton)

    assert.ok(contenu)
    assert.equal(contenu.u, '42')
    assert.equal(contenu.a, 'connexion')
  })

  it('refuse un jeton dont la charge a été modifiée', () => {
    const jeton = signerJeton({ u: '42', a: 'connexion' })
    const [charge, signature] = jeton.split('.')

    // On remplace l'utilisateur par un autre, en gardant la signature d'origine.
    const falsifiee = Buffer.from(JSON.stringify({ u: '99', a: 'connexion', t: Date.now(), n: 'x' }))
      .toString('base64url')

    assert.equal(verifierJeton(`${falsifiee}.${signature}`), null)
    assert.ok(charge)
  })

  it('refuse un jeton dont la signature a été modifiée', () => {
    const jeton = signerJeton({ u: '42', a: 'connexion' })
    const [charge] = jeton.split('.')

    assert.equal(verifierJeton(`${charge}.signature-inventee`), null)
  })

  it('refuse un jeton signé avec un autre secret', () => {
    const jeton = signerJeton({ u: '42', a: 'connexion' })

    const secretOrigine = process.env.PAYLOAD_SECRET
    process.env.PAYLOAD_SECRET = 'un-autre-secret'
    const contenu = verifierJeton(jeton)
    process.env.PAYLOAD_SECRET = secretOrigine

    assert.equal(contenu, null)
  })

  it('refuse un jeton périmé', () => {
    // Jeton daté d'une heure, alors que la validité est de dix minutes.
    const ancien = Date.now() - 60 * 60 * 1000
    const charge = Buffer.from(JSON.stringify({ u: '42', a: 'connexion', t: ancien, n: 'x' })).toString(
      'base64url',
    )
    const signature = createHmac('sha256', process.env.PAYLOAD_SECRET as string)
      .update(charge)
      .digest('base64url')

    assert.equal(verifierJeton(`${charge}.${signature}`), null)
  })

  it('refuse une valeur vide ou mal formée', () => {
    assert.equal(verifierJeton(null), null)
    assert.equal(verifierJeton(''), null)
    assert.equal(verifierJeton('sans-point'), null)
    assert.equal(verifierJeton('a.b.c'), null)
  })

  it('produit un jeton différent à chaque appel', () => {
    // Le grain aléatoire évite qu'un jeton observé serve à en reconnaître un autre.
    const premier = signerJeton({ u: '42', a: 'connexion' })
    const second = signerJeton({ u: '42', a: 'connexion' })
    assert.notEqual(premier, second)
  })
})

describe('choix du mode de paiement', () => {
  it('bascule en mode Connect selon la seule présence du client_id', () => {
    const origine = process.env.STRIPE_CONNECT_CLIENT_ID

    delete process.env.STRIPE_CONNECT_CLIENT_ID
    assert.equal(modeConnect(), false)

    process.env.STRIPE_CONNECT_CLIENT_ID = 'ca_test'
    assert.equal(modeConnect(), true)

    if (origine === undefined) delete process.env.STRIPE_CONNECT_CLIENT_ID
    else process.env.STRIPE_CONNECT_CLIENT_ID = origine
  })
})
