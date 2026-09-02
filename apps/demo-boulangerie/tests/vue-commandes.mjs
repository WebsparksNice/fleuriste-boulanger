/**
 * Rend la vue « commandes du jour » hors de l'administration.
 *
 * L'interface de Payload s'assemble côté client : le HTML servi n'est qu'une
 * coquille, et aucune vérification par requête HTTP ne dirait si cette vue
 * fonctionne. On appelle donc le composant directement, avec une vraie instance
 * Payload, et on inspecte le HTML qu'il produit.
 *
 * Prérequis : DATABASE_URI renseigné et données présentes (pnpm seed).
 * Usage : pnpm --filter demo-boulangerie exec payload run tests/vue-commandes.mjs
 */
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// Hors de Next, tsx compile le JSX vers `React.createElement` : le tsconfig du
// dépôt laisse le JSX intact pour que Next choisisse lui-même son runtime.
globalThis.React = React

import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import { VueCommandesDuJour } from '@websparks/commande/admin'

const jour = process.argv[2] ?? new Date().toISOString().slice(0, 10)
const payload = await getPayload({ config })

// L'administration fournit une requête authentifiée ; on la simule ici.
const { docs: utilisateurs } = await payload.find({
  collection: 'utilisateurs',
  limit: 1,
  overrideAccess: true,
})
const utilisateur = utilisateurs[0]
if (!utilisateur) throw new Error('Aucun utilisateur : lancez pnpm seed d’abord.')

const element = await VueCommandesDuJour({
  initPageResult: { req: { payload, user: utilisateur } },
  searchParams: { jour },
  fuseau: 'Europe/Paris',
  langue: 'fr',
  cheminStatut: '/api/commande/statut',
  cheminVue: '/admin/commandes-du-jour',
})

const html = renderToStaticMarkup(element)

const creneaux = [...html.matchAll(/<h2[^>]*>(\d{2}:\d{2} – \d{2}:\d{2})/g)].map((m) => m[1])
const clients = [...html.matchAll(/<strong>([^<]+)<\/strong>/g)].map((m) => m[1])
const statuts = [...new Set([...html.matchAll(/name="statut" value="([^"]+)"/g)].map((m) => m[1]))]
const formulaires = [...html.matchAll(/<form[^>]*action="([^"]+)"/g)].map((m) => m[1])

console.log(`jour                 : ${jour}`)
console.log(`titre                : ${/<h1[^>]*>([^<]*)<\/h1>/.exec(html)?.[1]}`)
console.log(`résumé               : ${/<p[^>]*>([^<]*commande[^<]*)<\/p>/.exec(html)?.[1]?.trim()}`)
console.log(`créneaux affichés    : ${creneaux.length} → ${creneaux.join(', ')}`)
console.log(`noms et montants     : ${clients.slice(0, 8).join(' | ')}`)
console.log(`boutons de statut    : ${formulaires.length} vers ${[...new Set(formulaires)].join(', ')}`)
console.log(`transitions offertes : ${statuts.join(', ')}`)
console.log(`navigation entre jours : ${[...html.matchAll(/href="([^"]*jour=[^"]*)"/g)].map((m) => m[1]).join(' ')}`)
console.log(`taille du rendu      : ${html.length} caractères`)

process.exit(0)
