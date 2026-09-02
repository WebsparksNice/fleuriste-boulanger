import { formaterCreneau, formaterEuros } from '../domaine/formats'
import type { Courriel, DonneesEmail, GabaritsEmail } from './types'

/**
 * Gabarits d'e-mail par défaut.
 *
 * Volontairement en HTML simple, sans feuille de style externe ni image : les
 * clients de messagerie en découpent la moitié, et un e-mail de confirmation
 * doit rester lisible même réduit à son texte brut. Chaque site peut les
 * remplacer via `definirCommande({ emails })`.
 */

const echapper = (valeur: string): string =>
  valeur
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

const enveloppe = (titre: string, corps: string): string => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>${echapper(titre)}</title></head>
<body style="margin:0;padding:24px;background:#f6f5f3;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#1f2937;line-height:1.6">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px">
${corps}
</div>
</body></html>`

const tableauLignes = (donnees: DonneesEmail): string => {
  const lignes = donnees.lignes
    .map(
      (ligne) => `<tr>
<td style="padding:8px 0;border-bottom:1px solid #e5e7eb">${echapper(ligne.nom)}</td>
<td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:center">${ligne.quantite}</td>
<td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right">${formaterEuros(ligne.totalLigneCentimes, donnees.langue)}</td>
</tr>`,
    )
    .join('')

  return `<table style="width:100%;border-collapse:collapse;margin:16px 0">
<thead><tr>
<th style="text-align:left;padding-bottom:8px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:#6b7280">Produit</th>
<th style="text-align:center;padding-bottom:8px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:#6b7280">Qté</th>
<th style="text-align:right;padding-bottom:8px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:#6b7280">Total</th>
</tr></thead>
<tbody>${lignes}</tbody>
<tfoot><tr>
<td colspan="2" style="padding-top:12px;font-weight:600">Total</td>
<td style="padding-top:12px;text-align:right;font-weight:600">${formaterEuros(donnees.totalCentimes, donnees.langue)}</td>
</tr></tfoot>
</table>`
}

const lignesTexte = (donnees: DonneesEmail): string =>
  donnees.lignes
    .map(
      (ligne) =>
        `  ${ligne.quantite} x ${ligne.nom} — ${formaterEuros(ligne.totalLigneCentimes, donnees.langue)}`,
    )
    .join('\n')

const mentionPaiement = (donnees: DonneesEmail): string =>
  donnees.paye
    ? 'Votre commande est réglée.'
    : 'Le règlement se fera au moment du retrait.'

const confirmationClient = (donnees: DonneesEmail): Courriel => {
  const creneau = formaterCreneau(
    donnees.creneauDebut,
    donnees.creneauFin,
    donnees.langue,
    donnees.fuseau,
  )

  const texte = [
    `Bonjour ${donnees.client.nom},`,
    '',
    `Votre commande n° ${donnees.numero} est enregistrée.`,
    '',
    `Retrait : ${creneau}`,
    donnees.commerce.adresse ? `Adresse : ${donnees.commerce.adresse}` : null,
    '',
    'Détail :',
    lignesTexte(donnees),
    `  Total : ${formaterEuros(donnees.totalCentimes, donnees.langue)}`,
    '',
    mentionPaiement(donnees),
    donnees.messageConfirmation ?? null,
    donnees.lienSuivi ? `\nSuivre la commande : ${donnees.lienSuivi}` : null,
    '',
    donnees.commerce.nom,
    donnees.commerce.telephone ?? null,
  ]
    .filter((ligne) => ligne !== null)
    .join('\n')

  const html = enveloppe(
    `Commande ${donnees.numero}`,
    `<p style="margin:0 0 16px">Bonjour ${echapper(donnees.client.nom)},</p>
<p style="margin:0 0 24px">Votre commande <strong>n° ${echapper(donnees.numero)}</strong> est enregistrée.</p>
<p style="margin:0 0 4px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:#6b7280">Retrait</p>
<p style="margin:0 0 16px;font-size:18px"><strong>${echapper(creneau)}</strong></p>
${donnees.commerce.adresse ? `<p style="margin:0 0 24px;color:#4b5563">${echapper(donnees.commerce.adresse)}</p>` : ''}
${tableauLignes(donnees)}
<p style="margin:16px 0 0;color:#4b5563">${echapper(mentionPaiement(donnees))}</p>
${donnees.messageConfirmation ? `<p style="margin:16px 0 0">${echapper(donnees.messageConfirmation)}</p>` : ''}
${donnees.lienSuivi ? `<p style="margin:24px 0 0"><a href="${echapper(donnees.lienSuivi)}" style="color:#7c2d12">Suivre ma commande</a></p>` : ''}
<hr style="border:0;border-top:1px solid #e5e7eb;margin:32px 0 16px">
<p style="margin:0;color:#6b7280;font-size:14px">${echapper(donnees.commerce.nom)}${donnees.commerce.telephone ? ` — ${echapper(donnees.commerce.telephone)}` : ''}</p>`,
  )

  return { sujet: `Votre commande n° ${donnees.numero}`, html, texte }
}

const notificationCommercant = (donnees: DonneesEmail): Courriel => {
  const creneau = formaterCreneau(
    donnees.creneauDebut,
    donnees.creneauFin,
    donnees.langue,
    donnees.fuseau,
  )

  const texte = [
    `Nouvelle commande n° ${donnees.numero}`,
    '',
    `Retrait : ${creneau}`,
    `Client : ${donnees.client.nom} — ${donnees.client.telephone} — ${donnees.client.email}`,
    donnees.paye ? 'Payée en ligne.' : 'À encaisser au retrait.',
    '',
    lignesTexte(donnees),
    `  Total : ${formaterEuros(donnees.totalCentimes, donnees.langue)}`,
    donnees.notes ? `\nNote du client : ${donnees.notes}` : null,
  ]
    .filter((ligne) => ligne !== null)
    .join('\n')

  const html = enveloppe(
    `Commande ${donnees.numero}`,
    `<p style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:#6b7280">Nouvelle commande</p>
<p style="margin:0 0 24px;font-size:20px"><strong>n° ${echapper(donnees.numero)}</strong> — ${echapper(creneau)}</p>
<p style="margin:0 0 4px">${echapper(donnees.client.nom)}</p>
<p style="margin:0 0 16px;color:#4b5563">${echapper(donnees.client.telephone)} — ${echapper(donnees.client.email)}</p>
<p style="margin:0 0 16px;font-weight:600">${donnees.paye ? 'Payée en ligne' : 'À encaisser au retrait'}</p>
${tableauLignes(donnees)}
${donnees.notes ? `<p style="margin:16px 0 0"><strong>Note du client :</strong> ${echapper(donnees.notes)}</p>` : ''}`,
  )

  return { sujet: `Commande ${donnees.numero} — ${creneau}`, html, texte }
}

export const gabaritsParDefaut: GabaritsEmail = {
  confirmationClient,
  notificationCommercant,
}
