import type { CollectionConfig } from 'payload'

import { authentifie, champEstAdministrateur, estAdministrateur } from '../access'

export const Utilisateurs: CollectionConfig = {
  slug: 'utilisateurs',
  labels: { singular: 'Utilisateur', plural: 'Utilisateurs' },
  auth: true,
  access: {
    read: authentifie,
    create: estAdministrateur,
    update: authentifie,
    delete: estAdministrateur,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['nom', 'email', 'role'],
    group: 'Administration',
  },
  fields: [
    {
      name: 'nom',
      type: 'text',
      label: 'Nom',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      defaultValue: 'editeur',
      required: true,
      options: [
        { label: 'Administrateur', value: 'administrateur' },
        { label: 'Editeur', value: 'editeur' },
      ],
      access: {
        // Un editeur ne doit pas pouvoir se promouvoir administrateur.
        create: champEstAdministrateur,
        update: champEstAdministrateur,
      },
      admin: {
        description: "L'editeur gere le contenu ; l'administrateur gere aussi les comptes.",
      },
    },
  ],
}
