import config from '@payload-config'
import { NotFoundPage, generatePageMetadata } from '@payloadcms/next/views'
import type { Metadata } from 'next'

import { importMap } from '../importMap.js'

type Parametres = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [cle: string]: string | string[] }>
}

export const generateMetadata = ({ params, searchParams }: Parametres): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const AdminIntrouvable = ({ params, searchParams }: Parametres) =>
  NotFoundPage({ config, importMap, params, searchParams })

export default AdminIntrouvable
