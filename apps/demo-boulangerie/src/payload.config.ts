import { postgresAdapter } from '@payloadcms/db-postgres'
import { creerConfigCore } from '@websparks/core/payload'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { site } from './site.config'

const dossierCourant = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig(
  creerConfigCore({
    site,
    db: postgresAdapter({
      pool: { connectionString: process.env.DATABASE_URI ?? '' },
    }),
    sharp,
    secret: process.env.PAYLOAD_SECRET ?? '',

    // En production, ce chemin doit pointer vers un volume persistant du
    // droplet : sans cela, chaque redeploiement effacerait les images.
    dossierMedia: path.resolve(dossierCourant, '../public/media'),

    baseDirImportMap: dossierCourant,
    cheminTypes: path.resolve(dossierCourant, 'payload-types.ts'),

    // Metier de bouche : la liste des allergenes a du sens ici.
    // A retirer pour un fleuriste.
    optionsProduits: { allergenes: true },
  }),
)
