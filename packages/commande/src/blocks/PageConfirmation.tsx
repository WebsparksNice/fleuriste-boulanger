import { Conteneur, Section, Titre } from '@websparks/core/ui'
import type { ConfigSiteResolue, ContexteRendu } from '@websparks/core'

import { formaterCreneau, formaterEuros } from '../domaine/formats'
import { dictionnaireCommande } from '../i18n'
import { lireReglages } from '../serveur/reglages'

type CommandeAffichee = {
  numero: string
  creneauDebut: string
  creneauFin: string
  totalCentimes: number
  statutPaiement: string
  lignes: { nomProduit: string; quantite: number; totalLigneCentimes: number }[]
}

type ProprietesConfirmation = {
  config: ConfigSiteResolue
  contexte: ContexteRendu
  numero?: string
  jeton?: string
}

/**
 * Page de confirmation.
 *
 * La commande est retrouvée par son numéro **et** son jeton. Le numéro seul
 * serait devinable — il porte la date du jour et quatre caractères — et
 * laisserait n'importe qui parcourir les commandes des autres.
 */
export const PageConfirmationCommande = async ({
  config,
  contexte,
  numero,
  jeton,
}: ProprietesConfirmation) => {
  const t = dictionnaireCommande(contexte.langue)

  const introuvable = (
    <Section>
      <Conteneur etroit>
        <Titre niveau={1}>{t.commandeIntrouvable}</Titre>
      </Conteneur>
    </Section>
  )

  if (!numero || !jeton) return introuvable

  const { docs } = await contexte.payload.find({
    collection: 'commandes',
    depth: 0,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    where: { and: [{ numero: { equals: numero } }, { jeton: { equals: jeton } }] },
  })

  const commande = docs[0] as CommandeAffichee | undefined
  if (!commande) return introuvable

  const reglages = await lireReglages(contexte.payload, config.fuseau)

  const libelleStatut =
    commande.statutPaiement === 'payee'
      ? t.paiementRegle
      : commande.statutPaiement === 'sur_place'
        ? t.paiementSurPlace
        : t.paiementEnAttente

  return (
    <Section>
      <Conteneur etroit>
        <Titre niveau={1} className="mb-3">
          {t.confirmationTitre}
        </Titre>
        <p className="mb-8 text-lg">{t.confirmationIntro(commande.numero)}</p>

        <dl className="divide-y divide-bordure border-y border-bordure">
          <div className="flex flex-wrap justify-between gap-4 py-3">
            <dt className="text-texte-attenue">{t.retraitPrevu}</dt>
            <dd className="font-medium">
              {formaterCreneau(
                new Date(commande.creneauDebut),
                new Date(commande.creneauFin),
                contexte.langue,
                config.fuseau,
              )}
            </dd>
          </div>
          <div className="flex flex-wrap justify-between gap-4 py-3">
            <dt className="text-texte-attenue">{t.statutPaiement}</dt>
            <dd className="font-medium">{libelleStatut}</dd>
          </div>
        </dl>

        <ul className="mt-8 divide-y divide-bordure border-y border-bordure">
          {commande.lignes.map((ligne, position) => (
            <li key={position} className="flex justify-between gap-4 py-3">
              <span>
                {ligne.quantite} × {ligne.nomProduit}
              </span>
              <span className="tabular-nums">
                {formaterEuros(ligne.totalLigneCentimes, contexte.langue)}
              </span>
            </li>
          ))}
          <li className="flex justify-between gap-4 py-3 font-semibold">
            <span>{t.total}</span>
            <span className="tabular-nums">
              {formaterEuros(commande.totalCentimes, contexte.langue)}
            </span>
          </li>
        </ul>

        {reglages.messageConfirmation ? (
          <p className="mt-8 text-texte-attenue">{reglages.messageConfirmation}</p>
        ) : null}
      </Conteneur>
    </Section>
  )
}
