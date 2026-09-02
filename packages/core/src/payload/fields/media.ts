import type { UploadField } from 'payload'

type OptionsImage = {
  name?: string
  label?: string
  required?: boolean
  description?: string
}

/** Champ image standard : toujours vers la collection `media`, dont l'alternative textuelle est obligatoire. */
export const champImage = ({
  name = 'image',
  label = 'Image',
  required = false,
  description,
}: OptionsImage = {}): UploadField => ({
  name,
  type: 'upload',
  relationTo: 'media',
  label,
  required,
  admin: { description },
})
