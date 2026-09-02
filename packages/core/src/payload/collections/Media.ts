import type { CollectionConfig } from 'payload'

import { authentifie, tousPeuventLire } from '../access'

type OptionsMedia = {
  /**
   * Dossier de stockage des fichiers, fourni par l'app.
   * Sur un VPS, ce chemin doit pointer vers un volume persistant, sinon les
   * images disparaissent au redeploiement.
   */
  dossier: string
}

export const Media = ({ dossier }: OptionsMedia): CollectionConfig => ({
  slug: 'media',
  labels: { singular: 'Media', plural: 'Medias' },
  access: {
    read: tousPeuventLire,
    create: authentifie,
    update: authentifie,
    delete: authentifie,
  },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    group: 'Contenu',
  },
  upload: {
    staticDir: dossier,
    mimeTypes: ['image/*'],
    focalPoint: true,
    adminThumbnail: 'vignette',
    // Chaque taille est declinee en WebP : c'est le format que next/image
    // servira, et cela evite de retraiter les originaux a chaque requete.
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      {
        name: 'vignette',
        width: 400,
        height: 400,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 78 } },
      },
      {
        name: 'carte',
        width: 768,
        withoutEnlargement: true,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'large',
        width: 1280,
        withoutEnlargement: true,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'banniere',
        width: 1920,
        withoutEnlargement: true,
        formatOptions: { format: 'webp', options: { quality: 78 } },
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Description de l image',
      required: true,
      localized: true,
      admin: {
        description:
          "Lue par les lecteurs d'ecran et affichee si l'image ne charge pas. Decrivez ce que l'on voit, sans commencer par « photo de ».",
      },
    },
    {
      name: 'legende',
      type: 'text',
      label: 'Legende',
      localized: true,
      admin: { description: 'Facultative, affichee sous l image dans les galeries.' },
    },
  ],
})
