import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

import { Conteneur } from '../components/ui/Conteneur'
import { Section } from '../components/ui/Section'
import { TexteRiche } from '../components/richtext/TexteRiche'
import { Titre } from '../components/ui/Titre'
import { obtenirDictionnaire } from '../i18n'
import { listerFaq } from '../lib/donnees'
import { donneesFaq } from '../seo/localBusiness'
import { JsonLd } from '../seo/JsonLd'
import { estPeuple, type BlocFaqDoc } from '../types'
import type { ProprietesBloc } from './types'

/**
 * Questions frequentes.
 *
 * Construit avec `<details>` et `<summary>` : le pliage, le clavier et
 * l'annonce de l'etat ouvert/ferme sont assures par le navigateur, sans une
 * ligne de JavaScript ni d'attribut ARIA a maintenir.
 */
export const Faq = async ({ bloc, config, contexte }: ProprietesBloc<BlocFaqDoc>) => {
  const t = obtenirDictionnaire(contexte.langue, config.dictionnaires)

  const identifiants =
    bloc.mode === 'selection'
      ? (bloc.selection ?? []).map((question) => (estPeuple(question) ? question.id : question))
      : undefined

  const questions = await listerFaq({
    payload: contexte.payload,
    langue: contexte.langue,
    ids: identifiants,
  })

  if (questions.length === 0) return null

  // Les donnees structurees exigent du texte brut : Google ne lit pas l'arbre
  // Lexical, et une reponse en HTML y serait rejetee.
  const donnees =
    bloc.genererJsonLd !== false
      ? donneesFaq(
          questions.flatMap((question) =>
            question.question && question.reponse
              ? [
                  {
                    question: question.question,
                    reponse: convertLexicalToPlaintext({ data: question.reponse as never }),
                  },
                ]
              : [],
          ),
        )
      : null

  return (
    <Section apparence={bloc.apparence}>
      <Conteneur etroit>
        <JsonLd donnees={donnees} />
        <Titre className="mb-8">{bloc.titre ?? t.faq.titre}</Titre>

        <div className="divide-y divide-bordure border-y border-bordure">
          {questions.map((question) => (
            <details key={question.id} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {question.question}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-2xl leading-none transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <TexteRiche
                contenu={question.reponse}
                config={config}
                langue={contexte.langue}
                className="mt-3"
              />
            </details>
          ))}
        </div>
      </Conteneur>
    </Section>
  )
}
