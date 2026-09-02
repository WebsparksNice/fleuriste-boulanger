import type { Access, FieldAccess } from 'payload'

/** Lecture ouverte a tous : contenu public du site vitrine. */
export const tousPeuventLire: Access = () => true

/** Reserve aux utilisateurs connectes a l'admin. */
export const authentifie: Access = ({ req }) => Boolean(req.user)

export const champAuthentifie: FieldAccess = ({ req }) => Boolean(req.user)

/** Reserve au role administrateur. */
export const estAdministrateur: Access = ({ req }) => req.user?.role === 'administrateur'

export const champEstAdministrateur: FieldAccess = ({ req }) => req.user?.role === 'administrateur'

/**
 * Lecture publique limitee aux documents publies.
 *
 * Un visiteur ne voit que `_status: published` ; un editeur connecte voit aussi
 * les brouillons, ce qui fait fonctionner la previsualisation sans route dediee
 * cote acces.
 */
export const publieOuAuthentifie: Access = ({ req }) => {
  if (req.user) return true

  return {
    _status: {
      equals: 'published',
    },
  }
}
