import Link from 'next/link'

import { CarteProduit } from '../components/produits/CarteProduit'
import { Conteneur } from '../components/ui/Conteneur'
import { EnTeteSection } from '../components/ui/EnTeteSection'
import { Section } from '../components/ui/Section'
import { TexteRiche } from '../components/richtext/TexteRiche'
import { lienListeProduits } from '../config'
import { obtenirDictionnaire } from '../i18n'
import { cn } from '../lib/cn'
import { listerProduits } from '../lib/donnees'
import { estPeuple, type BlocProduitsDoc } from '../types'
import { classesGrille, taillesGrille, type ProprietesBloc } from './types'

/**
 * Vitrine de produits.
 *
 * Le bloc va chercher ses donnees lui-meme : la page n'a pas a savoir quels
 * blocs elle contient ni ce dont ils ont besoin. Les appels sont dedoublonnes
 * par `cache()` au niveau de l'acces aux donnees.
 */
export const Produits = async ({ bloc, config, contexte }: ProprietesBloc<BlocProduitsDoc>) => {
  const t = obtenirDictionnaire(contexte.langue, config.dictionnaires)
  const colonnes = bloc.colonnes ?? '3'
  const mode = bloc.mode ?? 'misesEnAvant'

  const identifiantsSelection =
    mode === 'selection'
      ? (bloc.selection ?? []).map((produit) => (estPeuple(produit) ? produit.id : produit))
      : undefined

  const categorie =
    mode === 'categorie' && bloc.categorie
      ? estPeuple(bloc.categorie)
        ? bloc.categorie.id
        : bloc.categorie
      : undefined

  const { produits } = await listerProduits({
    payload: contexte.payload,
    langue: contexte.langue,
    brouillon: contexte.brouillon,
    categorie,
    misEnAvant: mode === 'misesEnAvant',
    ids: identifiantsSelection,
    limite: identifiantsSelection?.length ?? bloc.limite ?? 6,
  })

  const lienTout = lienListeProduits(config, contexte.langue)

  return (
    <Section apparence={bloc.apparence}>
      <Conteneur>
        <EnTeteSection
          surtitre={bloc.surtitre}
          titre={bloc.titre ?? t.produits.titre}
          intro={
            bloc.intro ? (
              <TexteRiche contenu={bloc.intro} config={config} langue={contexte.langue} />
            ) : null
          }
          disposition={bloc.dispositionEntete ?? 'empilee'}
          className="mb-8"
        />

        {produits.length === 0 ? (
          <p className="text-texte-attenue">{t.produits.aucunProduit}</p>
        ) : (
          <ul
            className={cn(
              'grid grid-cols-1',
              bloc.variante === 'carte' ? 'gap-6' : 'gap-x-6 gap-y-10',
              classesGrille(colonnes),
            )}
          >
            {produits.map((produit) => (
              <li key={produit.id}>
                <CarteProduit
                  produit={produit}
                  config={config}
                  langue={contexte.langue}
                  afficherPrix={bloc.afficherPrix !== false}
                  variante={bloc.variante ?? 'sobre'}
                  sizes={taillesGrille(colonnes)}
                  action={contexte.actionProduit?.(produit)}
                />
              </li>
            ))}
          </ul>
        )}

        {bloc.afficherLienVoirTout !== false ? (
          <p className="mt-10">
            <Link href={lienTout} className="font-medium underline underline-offset-4 hover:no-underline">
              {t.produits.voirTous}
            </Link>
          </p>
        ) : null}
      </Conteneur>
    </Section>
  )
}
