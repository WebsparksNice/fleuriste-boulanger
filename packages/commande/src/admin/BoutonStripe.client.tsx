'use client'

import { useFormFields } from '@payloadcms/ui'
import { useState } from 'react'

import {
  CHEMIN_CONNEXION_STRIPE,
  CHEMIN_DECONNEXION_STRIPE,
  CHEMIN_ETAT_STRIPE,
} from '../chemins'

const styles = {
  cadre: {
    border: '1px solid var(--theme-elevation-150)',
    borderRadius: '6px',
    padding: '1rem 1.25rem',
    marginBottom: '1.5rem',
  } as const,
  bouton: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '2.5rem',
    padding: '0 1rem',
    borderRadius: '4px',
    border: '1px solid var(--theme-elevation-250)',
    background: 'var(--theme-elevation-50)',
    color: 'inherit',
    cursor: 'pointer',
    textDecoration: 'none',
  } as const,
  principal: {
    background: '#635bff',
    borderColor: '#635bff',
    color: '#ffffff',
  } as const,
  alerte: { color: 'var(--theme-error-500)', marginTop: '0.5rem' } as const,
  discret: { color: 'var(--theme-elevation-600)', margin: '0.25rem 0 0.75rem' } as const,
}

/**
 * Bouton de liaison du compte Stripe.
 *
 * Le commerçant clique, s'authentifie chez Stripe, revient : aucune clé secrète
 * n'est saisie nulle part, ni dans l'administration ni dans un fichier. La
 * liaison est confirmée par une seconde page, côté site, avant d'être
 * enregistrée.
 */
export const BoutonStripe = () => {
  const compteId = useFormFields(([champs]) => champs?.stripeCompteId?.value as string | undefined)
  const compteNom = useFormFields(([champs]) => champs?.stripeCompteNom?.value as string | undefined)
  const chargesActives = useFormFields(
    ([champs]) => champs?.stripeChargesActives?.value as boolean | undefined,
  )

  const [enCours, setEnCours] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const verifier = async () => {
    setEnCours(true)
    setErreur(null)
    setMessage(null)
    try {
      const reponse = await fetch(CHEMIN_ETAT_STRIPE, { method: 'POST' })
      if (!reponse.ok) throw new Error(await reponse.text())

      const etat = (await reponse.json()) as { chargesActives: boolean }
      if (etat.chargesActives) {
        window.location.reload()
        return
      }

      setMessage('Toujours pas autorisé à encaisser. Terminez la configuration sur Stripe.')
      setEnCours(false)
    } catch (probleme) {
      setErreur(String(probleme))
      setEnCours(false)
    }
  }

  const deconnecter = async () => {
    setEnCours(true)
    setErreur(null)
    try {
      const reponse = await fetch(CHEMIN_DECONNEXION_STRIPE, { method: 'POST' })
      if (!reponse.ok) throw new Error(await reponse.text())
      window.location.reload()
    } catch (probleme) {
      setErreur(String(probleme))
      setEnCours(false)
    }
  }

  if (!compteId) {
    return (
      <div style={styles.cadre}>
        <h4 style={{ margin: '0 0 0.25rem' }}>Paiement en ligne</h4>
        <p style={styles.discret}>
          Reliez votre compte Stripe pour encaisser les commandes. Les paiements arrivent
          directement chez vous : rien ne transite par nous.
        </p>
        <a href={CHEMIN_CONNEXION_STRIPE} style={{ ...styles.bouton, ...styles.principal }}>
          Connecter mon compte Stripe
        </a>
      </div>
    )
  }

  return (
    <div style={styles.cadre}>
      <h4 style={{ margin: '0 0 0.25rem' }}>Paiement en ligne</h4>
      <p style={styles.discret}>
        Compte lié : <strong>{compteNom || compteId}</strong>
      </p>

      {chargesActives ? null : (
        <p style={styles.alerte}>
          Ce compte n’est pas encore autorisé à encaisser.{' '}
          <a
            href="https://dashboard.stripe.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit' }}
          >
            Terminez sa configuration sur Stripe
          </a>
          , puis vérifiez son état ci-dessous.
        </p>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {chargesActives ? null : (
          <button type="button" onClick={verifier} disabled={enCours} style={styles.bouton}>
            {enCours ? 'Vérification…' : 'Vérifier l’état'}
          </button>
        )}
        <button type="button" onClick={deconnecter} disabled={enCours} style={styles.bouton}>
          {enCours ? 'Patientez…' : 'Délier ce compte'}
        </button>
      </div>

      {message ? <p style={styles.alerte}>{message}</p> : null}
      {erreur ? <p style={styles.alerte}>{erreur}</p> : null}
    </div>
  )
}

export default BoutonStripe
