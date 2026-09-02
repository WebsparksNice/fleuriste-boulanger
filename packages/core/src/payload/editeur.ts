import {
  BlockquoteFeature,
  BoldFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

/**
 * Editeur de texte long : titres de niveau 2 et 3 uniquement.
 *
 * Le h1 appartient au gabarit de la page, pas au contenu : le laisser a
 * l'editeur produirait plusieurs h1 par page et casserait la hierarchie que
 * lisent les lecteurs d'ecran comme les moteurs de recherche.
 */
export const editeurTexteRiche = lexicalEditor({
  features: [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    LinkFeature({ enabledCollections: ['pages'] }),
    UnorderedListFeature(),
    OrderedListFeature(),
    BlockquoteFeature(),
    HorizontalRuleFeature(),
    InlineToolbarFeature(),
  ],
})

/** Editeur reduit : une ou deux phrases mises en forme, sans titre ni liste. */
export const editeurTexteSimple = lexicalEditor({
  features: [
    ParagraphFeature(),
    BoldFeature(),
    ItalicFeature(),
    LinkFeature({ enabledCollections: ['pages'] }),
    InlineToolbarFeature(),
  ],
})
