import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Le socle est consomme en TypeScript source, sans etape de build :
  // une modification dans packages/core est visible immediatement en dev.
  transpilePackages: ['@websparks/core'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
