import { bornesJourLocal, dateLocaleIso } from '../domaine/fuseau'
import { formaterEuros, formaterJourLong, formaterPlage } from '../domaine/formats'
import { ajouterJours } from '../domaine/fuseau'
import { STATUTS_COMMANDE, STATUTS_PAIEMENT } from '../payload/statuts'

type CommandeAdmin = {
  id: string | number
  numero: string
  creneauDebut: string
  creneauFin: string
  totalCentimes: number
  statutCommande: string
  statutPaiement: string
  notes?: string | null
  client: { nom: string; telephone: string; email: string }
  lignes: { nomProduit: string; quantite: number }[]
}

type ProprietesVue = {
  /** Injecté par Payload : contient la requête, donc l'instance et l'utilisateur. */
  initPageResult: { req: { payload: unknown; user?: unknown } & Record<string, unknown> }
  searchParams?: Record<string, string | string[] | undefined>
  fuseau: string
  langue: string
  /** Route qui applique un changement de statut. */
  cheminStatut: string
  /** Chemin de cette vue, pour y revenir après le changement. */
  cheminVue: string
}

const LIBELLES_COMMANDE = Object.fromEntries(
  STATUTS_COMMANDE.map((statut) => [statut.value, statut.label]),
)
const LIBELLES_PAIEMENT = Object.fromEntries(
  STATUTS_PAIEMENT.map((statut) => [statut.value, statut.label]),
)

/** Statuts proposés en un clic, dans l'ordre où ils surviennent au comptoir. */
const TRANSITIONS: Record<string, string[]> = {
  nouvelle: ['confirmee', 'annulee'],
  confirmee: ['prete', 'annulee'],
  prete: ['recuperee', 'annulee'],
  recuperee: [],
  annulee: ['nouvelle'],
}

const styles = {
  page: { padding: '2rem', maxWidth: '68rem', margin: '0 auto' } as const,
  carte: {
    border: '1px solid var(--theme-elevation-150)',
    borderRadius: '6px',
    padding: '1rem',
    marginBottom: '0.75rem',
  } as const,
  entete: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'space-between',
    gap: '1rem',
    alignItems: 'baseline',
  } as const,
  bouton: {
    minHeight: '2.5rem',
    padding: '0 0.9rem',
    borderRadius: '4px',
    border: '1px solid var(--theme-elevation-250)',
    background: 'var(--theme-elevation-50)',
    cursor: 'pointer',
  } as const,
  creneau: {
    margin: '2rem 0 0.75rem',
    paddingBottom: '0.35rem',
    borderBottom: '1px solid var(--theme-elevation-150)',
    fontSize: '1.05rem',
  } as const,
}

/**
 * Commandes du jour, groupées par créneau de retrait.
 *
 * C'est la vue de travail du commerçant : elle répond à « qu'est-ce que je
 * prépare pour 10 h ? », question à laquelle la liste standard, triée par date
 * de création, ne répond pas.
 *
 * Le changement de statut passe par un formulaire HTML classique. Dans un
 * fournil, avec les mains occupées et une connexion incertaine, un bouton qui
 * recharge la page est plus fiable qu'un appel asynchrone dont l'échec ne se
 * voit pas.
 */
export const VueCommandesDuJour = async ({
  initPageResult,
  searchParams,
  fuseau,
  langue,
  cheminStatut,
  cheminVue,
}: ProprietesVue) => {
  const payload = initPageResult.req.payload as {
    find: (args: Record<string, unknown>) => Promise<{ docs: unknown[] }>
  }

  // La requête doit accompagner la lecture : sans elle, l'API locale n'a aucun
  // utilisateur à présenter au contrôle d'accès, et la vue se retrouve vide
  // alors même que le commerçant est connecté.
  const requete = initPageResult.req

  const jourDemande = searchParams?.jour
  const jour =
    typeof jourDemande === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(jourDemande)
      ? jourDemande
      : dateLocaleIso(new Date(), fuseau)

  const bornes = bornesJourLocal(jour, fuseau)

  const { docs } = bornes
    ? await payload.find({
        collection: 'commandes',
        depth: 0,
        limit: 500,
        pagination: false,
        overrideAccess: false,
        req: requete,
        sort: 'creneauDebut',
        where: {
          and: [
            { creneauDebut: { greater_than_equal: bornes.debut.toISOString() } },
            { creneauDebut: { less_than: bornes.fin.toISOString() } },
          ],
        },
      })
    : { docs: [] }

  const commandes = docs as CommandeAdmin[]

  const parCreneau = new Map<string, CommandeAdmin[]>()
  for (const commande of commandes) {
    const cle = new Date(commande.creneauDebut).toISOString()
    const existantes = parCreneau.get(cle)
    if (existantes) existantes.push(commande)
    else parCreneau.set(cle, [commande])
  }

  const lienJour = (cible: string) => `${cheminVue}?jour=${cible}`
  const retour = `${cheminVue}?jour=${jour}`

  return (
    <div style={styles.page}>
      <h1 style={{ marginBottom: '0.25rem' }}>Commandes du jour</h1>
      <p style={{ margin: '0 0 1.5rem', color: 'var(--theme-elevation-600)' }}>
        {formaterJourLong(bornes?.debut ?? new Date(), langue, fuseau)} — {commandes.length}{' '}
        commande{commandes.length > 1 ? 's' : ''}
      </p>

      <nav style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <a href={lienJour(ajouterJours(jour, -1))} style={styles.bouton}>
          ← Veille
        </a>
        <a href={lienJour(dateLocaleIso(new Date(), fuseau))} style={styles.bouton}>
          Aujourd’hui
        </a>
        <a href={lienJour(ajouterJours(jour, 1))} style={styles.bouton}>
          Lendemain →
        </a>
      </nav>

      {commandes.length === 0 ? (
        <p style={{ color: 'var(--theme-elevation-600)' }}>Aucune commande pour cette journée.</p>
      ) : (
        [...parCreneau.entries()].map(([cle, groupe]) => (
          <section key={cle}>
            <h2 style={styles.creneau}>
              {formaterPlage(new Date(cle), new Date(groupe[0]!.creneauFin), fuseau)}
              <span style={{ color: 'var(--theme-elevation-600)', fontWeight: 400 }}>
                {' '}
                — {groupe.length} commande{groupe.length > 1 ? 's' : ''}
              </span>
            </h2>

            {groupe.map((commande) => (
              <article key={commande.id} style={styles.carte}>
                <div style={styles.entete}>
                  <div>
                    <strong>{commande.client.nom}</strong>{' '}
                    <span style={{ color: 'var(--theme-elevation-600)' }}>
                      · {commande.client.telephone} · n° {commande.numero}
                    </span>
                  </div>
                  <div>
                    <strong>{formaterEuros(commande.totalCentimes, langue)}</strong>{' '}
                    <span style={{ color: 'var(--theme-elevation-600)' }}>
                      · {LIBELLES_PAIEMENT[commande.statutPaiement] ?? commande.statutPaiement}
                    </span>
                  </div>
                </div>

                <ul style={{ margin: '0.75rem 0', paddingLeft: '1.1rem' }}>
                  {commande.lignes.map((ligne, position) => (
                    <li key={position}>
                      {ligne.quantite} × {ligne.nomProduit}
                    </li>
                  ))}
                </ul>

                {commande.notes ? (
                  <p style={{ margin: '0 0 0.75rem', fontStyle: 'italic' }}>« {commande.notes} »</p>
                ) : null}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--theme-elevation-600)' }}>
                    {LIBELLES_COMMANDE[commande.statutCommande] ?? commande.statutCommande}
                  </span>
                  {(TRANSITIONS[commande.statutCommande] ?? []).map((cible) => (
                    <form key={cible} method="post" action={cheminStatut} style={{ display: 'inline' }}>
                      <input type="hidden" name="commande" value={String(commande.id)} />
                      <input type="hidden" name="statut" value={cible} />
                      <input type="hidden" name="retour" value={retour} />
                      <button type="submit" style={styles.bouton}>
                        {LIBELLES_COMMANDE[cible] ?? cible}
                      </button>
                    </form>
                  ))}
                </div>
              </article>
            ))}
          </section>
        ))
      )}
    </div>
  )
}
