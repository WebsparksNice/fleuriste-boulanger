import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import type { Metadata } from 'next'

import { importMap } from '../importMap.js'

type Parametres = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [cle: string]: string | string[] }>
}

export const generateMetadata = ({ params, searchParams }: Parametres): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const PageAdmin = ({ params, searchParams }: Parametres) =>
  RootPage({ config, importMap, params, searchParams })

export default PageAdmin
