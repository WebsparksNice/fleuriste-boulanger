type ProprietesJsonLd = {
  donnees: Record<string, unknown> | null
}

/**
 * Insere un bloc de donnees structurees.
 *
 * `<` est echappe : une chaine venant du CMS qui contiendrait `</script>`
 * fermerait la balise et injecterait du HTML arbitraire dans la page.
 */
export const JsonLd = ({ donnees }: ProprietesJsonLd) => {
  if (!donnees) return null

  const contenu = JSON.stringify(donnees).replace(/</g, '\\u003c')

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- charge utile serialisee et echappee ci-dessus
      dangerouslySetInnerHTML={{ __html: contenu }}
    />
  )
}
