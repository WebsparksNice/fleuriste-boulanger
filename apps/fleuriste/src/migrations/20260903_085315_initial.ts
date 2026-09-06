import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fr');
  CREATE TYPE "public"."enum_pages_blocks_hero_boutons_type" AS ENUM('interne', 'externe', 'telephone', 'email', 'ancre');
  CREATE TYPE "public"."enum_pages_blocks_hero_boutons_style" AS ENUM('primaire', 'secondaire', 'discret');
  CREATE TYPE "public"."enum_pages_blocks_hero_variante" AS ENUM('couverture', 'lateral', 'texte');
  CREATE TYPE "public"."enum_pages_blocks_hero_alignement" AS ENUM('gauche', 'centre');
  CREATE TYPE "public"."enum_pages_blocks_hero_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum_pages_blocks_hero_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_texte_image_boutons_type" AS ENUM('interne', 'externe', 'telephone', 'email', 'ancre');
  CREATE TYPE "public"."enum_pages_blocks_texte_image_boutons_style" AS ENUM('primaire', 'secondaire', 'discret');
  CREATE TYPE "public"."enum_pages_blocks_texte_image_position_image" AS ENUM('gauche', 'droite');
  CREATE TYPE "public"."enum_pages_blocks_texte_image_format_image" AS ENUM('paysage', 'carre', 'portrait');
  CREATE TYPE "public"."enum_pages_blocks_texte_image_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum_pages_blocks_texte_image_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_produits_mode" AS ENUM('misesEnAvant', 'categorie', 'selection', 'tous');
  CREATE TYPE "public"."enum_pages_blocks_produits_colonnes" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_produits_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum_pages_blocks_produits_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_galerie_colonnes" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_galerie_format" AS ENUM('carre', 'portrait', 'paysage', 'naturel');
  CREATE TYPE "public"."enum_pages_blocks_galerie_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum_pages_blocks_galerie_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_horaires_horaires_personnalises_jour" AS ENUM('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche');
  CREATE TYPE "public"."enum_pages_blocks_horaires_source" AS ENUM('etablissement', 'personnalise');
  CREATE TYPE "public"."enum_pages_blocks_horaires_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum_pages_blocks_horaires_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_temoignages_mode" AS ENUM('recents', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_temoignages_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum_pages_blocks_temoignages_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_faq_mode" AS ENUM('toutes', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_faq_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum_pages_blocks_faq_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_contact_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum_pages_blocks_contact_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_cta_boutons_type" AS ENUM('interne', 'externe', 'telephone', 'email', 'ancre');
  CREATE TYPE "public"."enum_pages_blocks_cta_boutons_style" AS ENUM('primaire', 'secondaire', 'discret');
  CREATE TYPE "public"."enum_pages_blocks_cta_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum_pages_blocks_cta_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_blocks_commande_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum_pages_blocks_commande_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_boutons_type" AS ENUM('interne', 'externe', 'telephone', 'email', 'ancre');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_boutons_style" AS ENUM('primaire', 'secondaire', 'discret');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_variante" AS ENUM('couverture', 'lateral', 'texte');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_alignement" AS ENUM('gauche', 'centre');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_texte_image_boutons_type" AS ENUM('interne', 'externe', 'telephone', 'email', 'ancre');
  CREATE TYPE "public"."enum__pages_v_blocks_texte_image_boutons_style" AS ENUM('primaire', 'secondaire', 'discret');
  CREATE TYPE "public"."enum__pages_v_blocks_texte_image_position_image" AS ENUM('gauche', 'droite');
  CREATE TYPE "public"."enum__pages_v_blocks_texte_image_format_image" AS ENUM('paysage', 'carre', 'portrait');
  CREATE TYPE "public"."enum__pages_v_blocks_texte_image_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum__pages_v_blocks_texte_image_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_produits_mode" AS ENUM('misesEnAvant', 'categorie', 'selection', 'tous');
  CREATE TYPE "public"."enum__pages_v_blocks_produits_colonnes" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_produits_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum__pages_v_blocks_produits_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_galerie_colonnes" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_galerie_format" AS ENUM('carre', 'portrait', 'paysage', 'naturel');
  CREATE TYPE "public"."enum__pages_v_blocks_galerie_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum__pages_v_blocks_galerie_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_horaires_horaires_personnalises_jour" AS ENUM('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche');
  CREATE TYPE "public"."enum__pages_v_blocks_horaires_source" AS ENUM('etablissement', 'personnalise');
  CREATE TYPE "public"."enum__pages_v_blocks_horaires_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum__pages_v_blocks_horaires_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_temoignages_mode" AS ENUM('recents', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_temoignages_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum__pages_v_blocks_temoignages_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_mode" AS ENUM('toutes', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum__pages_v_blocks_faq_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_boutons_type" AS ENUM('interne', 'externe', 'telephone', 'email', 'ancre');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_boutons_style" AS ENUM('primaire', 'secondaire', 'discret');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_commande_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum__pages_v_blocks_commande_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('fr');
  CREATE TYPE "public"."enum_produits_disponibilite" AS ENUM('permanent', 'saisonnier', 'surCommande');
  CREATE TYPE "public"."enum_produits_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__produits_v_version_disponibilite" AS ENUM('permanent', 'saisonnier', 'surCommande');
  CREATE TYPE "public"."enum__produits_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__produits_v_published_locale" AS ENUM('fr');
  CREATE TYPE "public"."enum_temoignages_source" AS ENUM('boutique', 'google', 'reseaux');
  CREATE TYPE "public"."enum_utilisateurs_role" AS ENUM('administrateur', 'editeur');
  CREATE TYPE "public"."enum_commandes_statut_commande" AS ENUM('nouvelle', 'confirmee', 'prete', 'recuperee', 'annulee');
  CREATE TYPE "public"."enum_commandes_statut_paiement" AS ENUM('en_attente', 'payee', 'sur_place', 'remboursee');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_etablissement_horaires_jour" AS ENUM('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche');
  CREATE TYPE "public"."enum_etablissement_reseaux_sociaux_plateforme" AS ENUM('facebook', 'instagram', 'tiktok', 'linkedin', 'youtube', 'google', 'autre');
  CREATE TYPE "public"."enum_etablissement_type_commerce" AS ENUM('boulangerie', 'patisserie', 'fleuriste', 'boucherie', 'epicerie', 'cafe', 'restaurant', 'autre');
  CREATE TYPE "public"."enum_navigation_menu_principal_type" AS ENUM('interne', 'externe', 'telephone', 'email', 'ancre');
  CREATE TYPE "public"."enum_navigation_menu_pied_type" AS ENUM('interne', 'externe', 'telephone', 'email', 'ancre');
  CREATE TYPE "public"."enum_navigation_cta_en_tete_lien_type" AS ENUM('interne', 'externe', 'telephone', 'email', 'ancre');
  CREATE TYPE "public"."enum_navigation_cta_en_tete_lien_style" AS ENUM('primaire', 'secondaire', 'discret');
  CREATE TYPE "public"."enum_config_commande_horaires_retrait_jour" AS ENUM('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche');
  CREATE TABLE "pages_blocks_hero_boutons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_hero_boutons_type" DEFAULT 'interne',
  	"style" "enum_pages_blocks_hero_boutons_style" DEFAULT 'primaire',
  	"reference_id" integer,
  	"url" varchar,
  	"telephone" varchar,
  	"email" varchar,
  	"ancre" varchar,
  	"nouvel_onglet" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_hero_boutons_locales" (
  	"libelle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variante" "enum_pages_blocks_hero_variante" DEFAULT 'couverture',
  	"image_id" integer,
  	"alignement" "enum_pages_blocks_hero_alignement" DEFAULT 'gauche',
  	"opacite_voile" numeric DEFAULT 35,
  	"apparence_fond" "enum_pages_blocks_hero_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum_pages_blocks_hero_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_locales" (
  	"titre" varchar,
  	"sous_titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_texte_image_boutons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_texte_image_boutons_type" DEFAULT 'interne',
  	"style" "enum_pages_blocks_texte_image_boutons_style" DEFAULT 'primaire',
  	"reference_id" integer,
  	"url" varchar,
  	"telephone" varchar,
  	"email" varchar,
  	"ancre" varchar,
  	"nouvel_onglet" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_texte_image_boutons_locales" (
  	"libelle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_texte_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"position_image" "enum_pages_blocks_texte_image_position_image" DEFAULT 'droite',
  	"format_image" "enum_pages_blocks_texte_image_format_image" DEFAULT 'paysage',
  	"image_id" integer,
  	"apparence_fond" "enum_pages_blocks_texte_image_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum_pages_blocks_texte_image_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_texte_image_locales" (
  	"titre" varchar,
  	"texte" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_produits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mode" "enum_pages_blocks_produits_mode" DEFAULT 'misesEnAvant',
  	"categorie_id" integer,
  	"limite" numeric DEFAULT 6,
  	"colonnes" "enum_pages_blocks_produits_colonnes" DEFAULT '3',
  	"afficher_prix" boolean DEFAULT true,
  	"afficher_lien_voir_tout" boolean DEFAULT true,
  	"apparence_fond" "enum_pages_blocks_produits_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum_pages_blocks_produits_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_produits_locales" (
  	"titre" varchar,
  	"intro" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_galerie_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_galerie_images_locales" (
  	"legende" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_galerie" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"colonnes" "enum_pages_blocks_galerie_colonnes" DEFAULT '3',
  	"format" "enum_pages_blocks_galerie_format" DEFAULT 'carre',
  	"agrandissement" boolean DEFAULT false,
  	"apparence_fond" "enum_pages_blocks_galerie_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum_pages_blocks_galerie_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_galerie_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_horaires_horaires_personnalises_creneaux" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ouvre" varchar,
  	"ferme" varchar
  );
  
  CREATE TABLE "pages_blocks_horaires_horaires_personnalises" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"jour" "enum_pages_blocks_horaires_horaires_personnalises_jour",
  	"ferme" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_horaires" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_pages_blocks_horaires_source" DEFAULT 'etablissement',
  	"afficher_fermetures" boolean DEFAULT true,
  	"apparence_fond" "enum_pages_blocks_horaires_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum_pages_blocks_horaires_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_horaires_locales" (
  	"titre" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_temoignages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mode" "enum_pages_blocks_temoignages_mode" DEFAULT 'recents',
  	"limite" numeric DEFAULT 3,
  	"afficher_notes" boolean DEFAULT true,
  	"apparence_fond" "enum_pages_blocks_temoignages_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum_pages_blocks_temoignages_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_temoignages_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mode" "enum_pages_blocks_faq_mode" DEFAULT 'toutes',
  	"generer_json_ld" boolean DEFAULT true,
  	"apparence_fond" "enum_pages_blocks_faq_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum_pages_blocks_faq_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"afficher_coordonnees" boolean DEFAULT true,
  	"afficher_horaires" boolean DEFAULT true,
  	"afficher_reseaux" boolean DEFAULT true,
  	"afficher_carte" boolean DEFAULT true,
  	"image_carte_id" integer,
  	"apparence_fond" "enum_pages_blocks_contact_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum_pages_blocks_contact_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_locales" (
  	"titre" varchar,
  	"intro" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta_boutons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_cta_boutons_type" DEFAULT 'interne',
  	"style" "enum_pages_blocks_cta_boutons_style" DEFAULT 'primaire',
  	"reference_id" integer,
  	"url" varchar,
  	"telephone" varchar,
  	"email" varchar,
  	"ancre" varchar,
  	"nouvel_onglet" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_cta_boutons_locales" (
  	"libelle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"apparence_fond" "enum_pages_blocks_cta_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum_pages_blocks_cta_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_locales" (
  	"titre" varchar,
  	"texte" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_commande" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"apparence_fond" "enum_pages_blocks_commande_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum_pages_blocks_commande_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_commande_locales" (
  	"titre" varchar,
  	"intro" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"titre" varchar,
  	"slug" varchar,
  	"seo_titre" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"produits_id" integer,
  	"temoignages_id" integer,
  	"faq_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero_boutons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__pages_v_blocks_hero_boutons_type" DEFAULT 'interne',
  	"style" "enum__pages_v_blocks_hero_boutons_style" DEFAULT 'primaire',
  	"reference_id" integer,
  	"url" varchar,
  	"telephone" varchar,
  	"email" varchar,
  	"ancre" varchar,
  	"nouvel_onglet" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_boutons_locales" (
  	"libelle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variante" "enum__pages_v_blocks_hero_variante" DEFAULT 'couverture',
  	"image_id" integer,
  	"alignement" "enum__pages_v_blocks_hero_alignement" DEFAULT 'gauche',
  	"opacite_voile" numeric DEFAULT 35,
  	"apparence_fond" "enum__pages_v_blocks_hero_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum__pages_v_blocks_hero_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_locales" (
  	"titre" varchar,
  	"sous_titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_texte_image_boutons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__pages_v_blocks_texte_image_boutons_type" DEFAULT 'interne',
  	"style" "enum__pages_v_blocks_texte_image_boutons_style" DEFAULT 'primaire',
  	"reference_id" integer,
  	"url" varchar,
  	"telephone" varchar,
  	"email" varchar,
  	"ancre" varchar,
  	"nouvel_onglet" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_texte_image_boutons_locales" (
  	"libelle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_texte_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"position_image" "enum__pages_v_blocks_texte_image_position_image" DEFAULT 'droite',
  	"format_image" "enum__pages_v_blocks_texte_image_format_image" DEFAULT 'paysage',
  	"image_id" integer,
  	"apparence_fond" "enum__pages_v_blocks_texte_image_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum__pages_v_blocks_texte_image_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_texte_image_locales" (
  	"titre" varchar,
  	"texte" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_produits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"mode" "enum__pages_v_blocks_produits_mode" DEFAULT 'misesEnAvant',
  	"categorie_id" integer,
  	"limite" numeric DEFAULT 6,
  	"colonnes" "enum__pages_v_blocks_produits_colonnes" DEFAULT '3',
  	"afficher_prix" boolean DEFAULT true,
  	"afficher_lien_voir_tout" boolean DEFAULT true,
  	"apparence_fond" "enum__pages_v_blocks_produits_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum__pages_v_blocks_produits_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_produits_locales" (
  	"titre" varchar,
  	"intro" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_galerie_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_galerie_images_locales" (
  	"legende" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_galerie" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"colonnes" "enum__pages_v_blocks_galerie_colonnes" DEFAULT '3',
  	"format" "enum__pages_v_blocks_galerie_format" DEFAULT 'carre',
  	"agrandissement" boolean DEFAULT false,
  	"apparence_fond" "enum__pages_v_blocks_galerie_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum__pages_v_blocks_galerie_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_galerie_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_horaires_horaires_personnalises_creneaux" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"ouvre" varchar,
  	"ferme" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_horaires_horaires_personnalises" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"jour" "enum__pages_v_blocks_horaires_horaires_personnalises_jour",
  	"ferme" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_horaires" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum__pages_v_blocks_horaires_source" DEFAULT 'etablissement',
  	"afficher_fermetures" boolean DEFAULT true,
  	"apparence_fond" "enum__pages_v_blocks_horaires_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum__pages_v_blocks_horaires_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_horaires_locales" (
  	"titre" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_temoignages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"mode" "enum__pages_v_blocks_temoignages_mode" DEFAULT 'recents',
  	"limite" numeric DEFAULT 3,
  	"afficher_notes" boolean DEFAULT true,
  	"apparence_fond" "enum__pages_v_blocks_temoignages_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum__pages_v_blocks_temoignages_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_temoignages_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"mode" "enum__pages_v_blocks_faq_mode" DEFAULT 'toutes',
  	"generer_json_ld" boolean DEFAULT true,
  	"apparence_fond" "enum__pages_v_blocks_faq_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum__pages_v_blocks_faq_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_locales" (
  	"titre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"afficher_coordonnees" boolean DEFAULT true,
  	"afficher_horaires" boolean DEFAULT true,
  	"afficher_reseaux" boolean DEFAULT true,
  	"afficher_carte" boolean DEFAULT true,
  	"image_carte_id" integer,
  	"apparence_fond" "enum__pages_v_blocks_contact_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum__pages_v_blocks_contact_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_locales" (
  	"titre" varchar,
  	"intro" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta_boutons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__pages_v_blocks_cta_boutons_type" DEFAULT 'interne',
  	"style" "enum__pages_v_blocks_cta_boutons_style" DEFAULT 'primaire',
  	"reference_id" integer,
  	"url" varchar,
  	"telephone" varchar,
  	"email" varchar,
  	"ancre" varchar,
  	"nouvel_onglet" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_boutons_locales" (
  	"libelle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"apparence_fond" "enum__pages_v_blocks_cta_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum__pages_v_blocks_cta_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_locales" (
  	"titre" varchar,
  	"texte" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_commande" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"apparence_fond" "enum__pages_v_blocks_commande_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum__pages_v_blocks_commande_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_commande_locales" (
  	"titre" varchar,
  	"intro" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_seo_image_id" integer,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_titre" varchar,
  	"version_slug" varchar,
  	"version_seo_titre" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"produits_id" integer,
  	"temoignages_id" integer,
  	"faq_id" integer
  );
  
  CREATE TABLE "produits_galerie" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "produits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"mise_en_avant" boolean DEFAULT false,
  	"ordre" numeric DEFAULT 0,
  	"image_principale_id" integer,
  	"disponibilite" "enum_produits_disponibilite" DEFAULT 'permanent',
  	"categorie_id" integer,
  	"prix" numeric,
  	"disponible" boolean DEFAULT false,
  	"delai_preparation_heures" numeric DEFAULT 0,
  	"quantite_max_par_commande" numeric DEFAULT 10,
  	"seo_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_produits_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "produits_locales" (
  	"nom" varchar,
  	"slug" varchar,
  	"description" jsonb,
  	"prix_indicatif" varchar,
  	"note_commande" varchar,
  	"seo_titre" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_produits_v_version_galerie" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_produits_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_mise_en_avant" boolean DEFAULT false,
  	"version_ordre" numeric DEFAULT 0,
  	"version_image_principale_id" integer,
  	"version_disponibilite" "enum__produits_v_version_disponibilite" DEFAULT 'permanent',
  	"version_categorie_id" integer,
  	"version_prix" numeric,
  	"version_disponible" boolean DEFAULT false,
  	"version_delai_preparation_heures" numeric DEFAULT 0,
  	"version_quantite_max_par_commande" numeric DEFAULT 10,
  	"version_seo_image_id" integer,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__produits_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__produits_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_produits_v_locales" (
  	"version_nom" varchar,
  	"version_slug" varchar,
  	"version_description" jsonb,
  	"version_prix_indicatif" varchar,
  	"version_note_commande" varchar,
  	"version_seo_titre" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories_produits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ordre" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_produits_locales" (
  	"nom" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "temoignages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"auteur" varchar NOT NULL,
  	"note" numeric,
  	"date" timestamp(3) with time zone,
  	"source" "enum_temoignages_source" DEFAULT 'boutique',
  	"visible" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "temoignages_locales" (
  	"texte" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faq" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ordre" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faq_locales" (
  	"question" varchar NOT NULL,
  	"reponse" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_vignette_url" varchar,
  	"sizes_vignette_width" numeric,
  	"sizes_vignette_height" numeric,
  	"sizes_vignette_mime_type" varchar,
  	"sizes_vignette_filesize" numeric,
  	"sizes_vignette_filename" varchar,
  	"sizes_carte_url" varchar,
  	"sizes_carte_width" numeric,
  	"sizes_carte_height" numeric,
  	"sizes_carte_mime_type" varchar,
  	"sizes_carte_filesize" numeric,
  	"sizes_carte_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_banniere_url" varchar,
  	"sizes_banniere_width" numeric,
  	"sizes_banniere_height" numeric,
  	"sizes_banniere_mime_type" varchar,
  	"sizes_banniere_filesize" numeric,
  	"sizes_banniere_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"legende" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "utilisateurs_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "utilisateurs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nom" varchar NOT NULL,
  	"role" "enum_utilisateurs_role" DEFAULT 'editeur' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "commandes_lignes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nom_produit" varchar NOT NULL,
  	"quantite" numeric NOT NULL,
  	"prix_unitaire_centimes" numeric NOT NULL,
  	"total_ligne_centimes" numeric NOT NULL,
  	"produit_id" integer
  );
  
  CREATE TABLE "commandes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"numero" varchar,
  	"creneau_debut" timestamp(3) with time zone NOT NULL,
  	"creneau_fin" timestamp(3) with time zone NOT NULL,
  	"statut_commande" "enum_commandes_statut_commande" DEFAULT 'nouvelle' NOT NULL,
  	"statut_paiement" "enum_commandes_statut_paiement" DEFAULT 'en_attente' NOT NULL,
  	"client_nom" varchar NOT NULL,
  	"client_telephone" varchar NOT NULL,
  	"client_email" varchar NOT NULL,
  	"total_centimes" numeric NOT NULL,
  	"notes" varchar,
  	"jeton" varchar,
  	"stripe_session_id" varchar,
  	"expire_le" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reservations_creneaux" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"creneau" timestamp(3) with time zone NOT NULL,
  	"position" numeric NOT NULL,
  	"commande_id" integer NOT NULL,
  	"expire_le" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "evenements_stripe" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"evenement_id" varchar NOT NULL,
  	"type" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"produits_id" integer,
  	"categories_produits_id" integer,
  	"temoignages_id" integer,
  	"faq_id" integer,
  	"media_id" integer,
  	"utilisateurs_id" integer,
  	"commandes_id" integer,
  	"reservations_creneaux_id" integer,
  	"evenements_stripe_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"utilisateurs_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "etablissement_horaires_creneaux" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ouvre" varchar,
  	"ferme" varchar
  );
  
  CREATE TABLE "etablissement_horaires" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"jour" "enum_etablissement_horaires_jour" NOT NULL,
  	"ferme" boolean DEFAULT false
  );
  
  CREATE TABLE "etablissement_fermetures_exceptionnelles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"du" timestamp(3) with time zone NOT NULL,
  	"au" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "etablissement_fermetures_exceptionnelles_locales" (
  	"motif" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "etablissement_reseaux_sociaux" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"plateforme" "enum_etablissement_reseaux_sociaux_plateforme" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "etablissement" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nom" varchar NOT NULL,
  	"type_commerce" "enum_etablissement_type_commerce" DEFAULT 'autre' NOT NULL,
  	"logo_id" integer,
  	"telephone" varchar,
  	"email" varchar,
  	"adresse_rue" varchar,
  	"adresse_complement" varchar,
  	"adresse_code_postal" varchar,
  	"adresse_ville" varchar,
  	"adresse_pays" varchar DEFAULT 'France',
  	"geo_latitude" numeric,
  	"geo_longitude" numeric,
  	"lien_itineraire" varchar,
  	"accessibilite_pmr" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "etablissement_locales" (
  	"slogan" varchar,
  	"description" varchar,
  	"moyens_paiement" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "navigation_menu_principal" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_navigation_menu_principal_type" DEFAULT 'interne',
  	"reference_id" integer,
  	"url" varchar,
  	"telephone" varchar,
  	"email" varchar,
  	"ancre" varchar,
  	"nouvel_onglet" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation_menu_principal_locales" (
  	"libelle" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_menu_pied" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_navigation_menu_pied_type" DEFAULT 'interne',
  	"reference_id" integer,
  	"url" varchar,
  	"telephone" varchar,
  	"email" varchar,
  	"ancre" varchar,
  	"nouvel_onglet" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation_menu_pied_locales" (
  	"libelle" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_en_tete_actif" boolean DEFAULT false,
  	"cta_en_tete_lien_type" "enum_navigation_cta_en_tete_lien_type" DEFAULT 'interne',
  	"cta_en_tete_lien_style" "enum_navigation_cta_en_tete_lien_style" DEFAULT 'primaire',
  	"cta_en_tete_lien_reference_id" integer,
  	"cta_en_tete_lien_url" varchar,
  	"cta_en_tete_lien_telephone" varchar,
  	"cta_en_tete_lien_email" varchar,
  	"cta_en_tete_lien_ancre" varchar,
  	"cta_en_tete_lien_nouvel_onglet" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_locales" (
  	"cta_en_tete_lien_libelle" varchar,
  	"mention_pied" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "reglages_seo" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_partage_id" integer,
  	"autoriser_indexation" boolean DEFAULT false,
  	"verification_google" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "reglages_seo_locales" (
  	"suffixe_titre" varchar,
  	"description_par_defaut" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "config_commande_horaires_retrait_plages" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"debut" varchar,
  	"fin" varchar
  );
  
  CREATE TABLE "config_commande_horaires_retrait" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"jour" "enum_config_commande_horaires_retrait_jour" NOT NULL,
  	"ferme" boolean DEFAULT false
  );
  
  CREATE TABLE "config_commande_jours_fermes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"motif" varchar
  );
  
  CREATE TABLE "config_commande" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"duree_creneau_minutes" numeric DEFAULT 15 NOT NULL,
  	"capacite_par_creneau" numeric DEFAULT 4 NOT NULL,
  	"delai_minimum_heures" numeric DEFAULT 2 NOT NULL,
  	"horizon_jours" numeric DEFAULT 7 NOT NULL,
  	"minutes_avant_expiration" numeric DEFAULT 30 NOT NULL,
  	"stripe_compte_id" varchar,
  	"stripe_compte_nom" varchar,
  	"stripe_charges_actives" boolean,
  	"stripe_connecte_le" timestamp(3) with time zone,
  	"paiement_en_ligne" boolean DEFAULT false,
  	"paiement_sur_place" boolean DEFAULT true,
  	"email_commercant" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "config_commande_locales" (
  	"message_confirmation" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_hero_boutons" ADD CONSTRAINT "pages_blocks_hero_boutons_reference_id_pages_id_fk" FOREIGN KEY ("reference_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_boutons" ADD CONSTRAINT "pages_blocks_hero_boutons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_boutons_locales" ADD CONSTRAINT "pages_blocks_hero_boutons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_boutons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_locales" ADD CONSTRAINT "pages_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_texte_image_boutons" ADD CONSTRAINT "pages_blocks_texte_image_boutons_reference_id_pages_id_fk" FOREIGN KEY ("reference_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_texte_image_boutons" ADD CONSTRAINT "pages_blocks_texte_image_boutons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_texte_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_texte_image_boutons_locales" ADD CONSTRAINT "pages_blocks_texte_image_boutons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_texte_image_boutons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_texte_image" ADD CONSTRAINT "pages_blocks_texte_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_texte_image" ADD CONSTRAINT "pages_blocks_texte_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_texte_image_locales" ADD CONSTRAINT "pages_blocks_texte_image_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_texte_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_produits" ADD CONSTRAINT "pages_blocks_produits_categorie_id_categories_produits_id_fk" FOREIGN KEY ("categorie_id") REFERENCES "public"."categories_produits"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_produits" ADD CONSTRAINT "pages_blocks_produits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_produits_locales" ADD CONSTRAINT "pages_blocks_produits_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_produits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_galerie_images" ADD CONSTRAINT "pages_blocks_galerie_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_galerie_images" ADD CONSTRAINT "pages_blocks_galerie_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_galerie"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_galerie_images_locales" ADD CONSTRAINT "pages_blocks_galerie_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_galerie_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_galerie" ADD CONSTRAINT "pages_blocks_galerie_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_galerie_locales" ADD CONSTRAINT "pages_blocks_galerie_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_galerie"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_horaires_horaires_personnalises_creneaux" ADD CONSTRAINT "pages_blocks_horaires_horaires_personnalises_creneaux_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_horaires_horaires_personnalises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_horaires_horaires_personnalises" ADD CONSTRAINT "pages_blocks_horaires_horaires_personnalises_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_horaires"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_horaires" ADD CONSTRAINT "pages_blocks_horaires_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_horaires_locales" ADD CONSTRAINT "pages_blocks_horaires_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_horaires"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_temoignages" ADD CONSTRAINT "pages_blocks_temoignages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_temoignages_locales" ADD CONSTRAINT "pages_blocks_temoignages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_temoignages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_locales" ADD CONSTRAINT "pages_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact" ADD CONSTRAINT "pages_blocks_contact_image_carte_id_media_id_fk" FOREIGN KEY ("image_carte_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact" ADD CONSTRAINT "pages_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_locales" ADD CONSTRAINT "pages_blocks_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_boutons" ADD CONSTRAINT "pages_blocks_cta_boutons_reference_id_pages_id_fk" FOREIGN KEY ("reference_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_boutons" ADD CONSTRAINT "pages_blocks_cta_boutons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_boutons_locales" ADD CONSTRAINT "pages_blocks_cta_boutons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_boutons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_locales" ADD CONSTRAINT "pages_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_commande" ADD CONSTRAINT "pages_blocks_commande_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_commande_locales" ADD CONSTRAINT "pages_blocks_commande_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_commande"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_produits_fk" FOREIGN KEY ("produits_id") REFERENCES "public"."produits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_temoignages_fk" FOREIGN KEY ("temoignages_id") REFERENCES "public"."temoignages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_boutons" ADD CONSTRAINT "_pages_v_blocks_hero_boutons_reference_id_pages_id_fk" FOREIGN KEY ("reference_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_boutons" ADD CONSTRAINT "_pages_v_blocks_hero_boutons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_boutons_locales" ADD CONSTRAINT "_pages_v_blocks_hero_boutons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_boutons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_locales" ADD CONSTRAINT "_pages_v_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_texte_image_boutons" ADD CONSTRAINT "_pages_v_blocks_texte_image_boutons_reference_id_pages_id_fk" FOREIGN KEY ("reference_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_texte_image_boutons" ADD CONSTRAINT "_pages_v_blocks_texte_image_boutons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_texte_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_texte_image_boutons_locales" ADD CONSTRAINT "_pages_v_blocks_texte_image_boutons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_texte_image_boutons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_texte_image" ADD CONSTRAINT "_pages_v_blocks_texte_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_texte_image" ADD CONSTRAINT "_pages_v_blocks_texte_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_texte_image_locales" ADD CONSTRAINT "_pages_v_blocks_texte_image_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_texte_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_produits" ADD CONSTRAINT "_pages_v_blocks_produits_categorie_id_categories_produits_id_fk" FOREIGN KEY ("categorie_id") REFERENCES "public"."categories_produits"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_produits" ADD CONSTRAINT "_pages_v_blocks_produits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_produits_locales" ADD CONSTRAINT "_pages_v_blocks_produits_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_produits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_galerie_images" ADD CONSTRAINT "_pages_v_blocks_galerie_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_galerie_images" ADD CONSTRAINT "_pages_v_blocks_galerie_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_galerie"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_galerie_images_locales" ADD CONSTRAINT "_pages_v_blocks_galerie_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_galerie_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_galerie" ADD CONSTRAINT "_pages_v_blocks_galerie_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_galerie_locales" ADD CONSTRAINT "_pages_v_blocks_galerie_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_galerie"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_horaires_horaires_personnalises_creneaux" ADD CONSTRAINT "_pages_v_blocks_horaires_horaires_personnalises_creneaux_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_horaires_horaires_personnalises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_horaires_horaires_personnalises" ADD CONSTRAINT "_pages_v_blocks_horaires_horaires_personnalises_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_horaires"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_horaires" ADD CONSTRAINT "_pages_v_blocks_horaires_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_horaires_locales" ADD CONSTRAINT "_pages_v_blocks_horaires_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_horaires"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_temoignages" ADD CONSTRAINT "_pages_v_blocks_temoignages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_temoignages_locales" ADD CONSTRAINT "_pages_v_blocks_temoignages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_temoignages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_locales" ADD CONSTRAINT "_pages_v_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact" ADD CONSTRAINT "_pages_v_blocks_contact_image_carte_id_media_id_fk" FOREIGN KEY ("image_carte_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact" ADD CONSTRAINT "_pages_v_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_locales" ADD CONSTRAINT "_pages_v_blocks_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_boutons" ADD CONSTRAINT "_pages_v_blocks_cta_boutons_reference_id_pages_id_fk" FOREIGN KEY ("reference_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_boutons" ADD CONSTRAINT "_pages_v_blocks_cta_boutons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_boutons_locales" ADD CONSTRAINT "_pages_v_blocks_cta_boutons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_boutons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_locales" ADD CONSTRAINT "_pages_v_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_commande" ADD CONSTRAINT "_pages_v_blocks_commande_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_commande_locales" ADD CONSTRAINT "_pages_v_blocks_commande_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_commande"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_produits_fk" FOREIGN KEY ("produits_id") REFERENCES "public"."produits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_temoignages_fk" FOREIGN KEY ("temoignages_id") REFERENCES "public"."temoignages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produits_galerie" ADD CONSTRAINT "produits_galerie_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "produits_galerie" ADD CONSTRAINT "produits_galerie_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."produits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produits" ADD CONSTRAINT "produits_image_principale_id_media_id_fk" FOREIGN KEY ("image_principale_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "produits" ADD CONSTRAINT "produits_categorie_id_categories_produits_id_fk" FOREIGN KEY ("categorie_id") REFERENCES "public"."categories_produits"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "produits" ADD CONSTRAINT "produits_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "produits_locales" ADD CONSTRAINT "produits_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."produits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produits_v_version_galerie" ADD CONSTRAINT "_produits_v_version_galerie_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_produits_v_version_galerie" ADD CONSTRAINT "_produits_v_version_galerie_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_produits_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produits_v" ADD CONSTRAINT "_produits_v_parent_id_produits_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."produits"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_produits_v" ADD CONSTRAINT "_produits_v_version_image_principale_id_media_id_fk" FOREIGN KEY ("version_image_principale_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_produits_v" ADD CONSTRAINT "_produits_v_version_categorie_id_categories_produits_id_fk" FOREIGN KEY ("version_categorie_id") REFERENCES "public"."categories_produits"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_produits_v" ADD CONSTRAINT "_produits_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_produits_v_locales" ADD CONSTRAINT "_produits_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_produits_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_produits_locales" ADD CONSTRAINT "categories_produits_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_produits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "temoignages_locales" ADD CONSTRAINT "temoignages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."temoignages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_locales" ADD CONSTRAINT "faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "utilisateurs_sessions" ADD CONSTRAINT "utilisateurs_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."utilisateurs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "commandes_lignes" ADD CONSTRAINT "commandes_lignes_produit_id_produits_id_fk" FOREIGN KEY ("produit_id") REFERENCES "public"."produits"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "commandes_lignes" ADD CONSTRAINT "commandes_lignes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."commandes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reservations_creneaux" ADD CONSTRAINT "reservations_creneaux_commande_id_commandes_id_fk" FOREIGN KEY ("commande_id") REFERENCES "public"."commandes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_produits_fk" FOREIGN KEY ("produits_id") REFERENCES "public"."produits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_produits_fk" FOREIGN KEY ("categories_produits_id") REFERENCES "public"."categories_produits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_temoignages_fk" FOREIGN KEY ("temoignages_id") REFERENCES "public"."temoignages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_utilisateurs_fk" FOREIGN KEY ("utilisateurs_id") REFERENCES "public"."utilisateurs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_commandes_fk" FOREIGN KEY ("commandes_id") REFERENCES "public"."commandes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reservations_creneaux_fk" FOREIGN KEY ("reservations_creneaux_id") REFERENCES "public"."reservations_creneaux"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_evenements_stripe_fk" FOREIGN KEY ("evenements_stripe_id") REFERENCES "public"."evenements_stripe"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_utilisateurs_fk" FOREIGN KEY ("utilisateurs_id") REFERENCES "public"."utilisateurs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "etablissement_horaires_creneaux" ADD CONSTRAINT "etablissement_horaires_creneaux_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."etablissement_horaires"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "etablissement_horaires" ADD CONSTRAINT "etablissement_horaires_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."etablissement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "etablissement_fermetures_exceptionnelles" ADD CONSTRAINT "etablissement_fermetures_exceptionnelles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."etablissement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "etablissement_fermetures_exceptionnelles_locales" ADD CONSTRAINT "etablissement_fermetures_exceptionnelles_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."etablissement_fermetures_exceptionnelles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "etablissement_reseaux_sociaux" ADD CONSTRAINT "etablissement_reseaux_sociaux_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."etablissement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "etablissement" ADD CONSTRAINT "etablissement_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "etablissement_locales" ADD CONSTRAINT "etablissement_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."etablissement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_menu_principal" ADD CONSTRAINT "navigation_menu_principal_reference_id_pages_id_fk" FOREIGN KEY ("reference_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_menu_principal" ADD CONSTRAINT "navigation_menu_principal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_menu_principal_locales" ADD CONSTRAINT "navigation_menu_principal_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_menu_principal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_menu_pied" ADD CONSTRAINT "navigation_menu_pied_reference_id_pages_id_fk" FOREIGN KEY ("reference_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_menu_pied" ADD CONSTRAINT "navigation_menu_pied_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_menu_pied_locales" ADD CONSTRAINT "navigation_menu_pied_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_menu_pied"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation" ADD CONSTRAINT "navigation_cta_en_tete_lien_reference_id_pages_id_fk" FOREIGN KEY ("cta_en_tete_lien_reference_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_locales" ADD CONSTRAINT "navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reglages_seo" ADD CONSTRAINT "reglages_seo_image_partage_id_media_id_fk" FOREIGN KEY ("image_partage_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reglages_seo_locales" ADD CONSTRAINT "reglages_seo_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reglages_seo"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "config_commande_horaires_retrait_plages" ADD CONSTRAINT "config_commande_horaires_retrait_plages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."config_commande_horaires_retrait"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "config_commande_horaires_retrait" ADD CONSTRAINT "config_commande_horaires_retrait_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."config_commande"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "config_commande_jours_fermes" ADD CONSTRAINT "config_commande_jours_fermes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."config_commande"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "config_commande_locales" ADD CONSTRAINT "config_commande_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."config_commande"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_boutons_order_idx" ON "pages_blocks_hero_boutons" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_boutons_parent_id_idx" ON "pages_blocks_hero_boutons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_boutons_reference_idx" ON "pages_blocks_hero_boutons" USING btree ("reference_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_boutons_locales_locale_parent_id_unique" ON "pages_blocks_hero_boutons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_locales_locale_parent_id_unique" ON "pages_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_texte_image_boutons_order_idx" ON "pages_blocks_texte_image_boutons" USING btree ("_order");
  CREATE INDEX "pages_blocks_texte_image_boutons_parent_id_idx" ON "pages_blocks_texte_image_boutons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_texte_image_boutons_reference_idx" ON "pages_blocks_texte_image_boutons" USING btree ("reference_id");
  CREATE UNIQUE INDEX "pages_blocks_texte_image_boutons_locales_locale_parent_id_un" ON "pages_blocks_texte_image_boutons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_texte_image_order_idx" ON "pages_blocks_texte_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_texte_image_parent_id_idx" ON "pages_blocks_texte_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_texte_image_path_idx" ON "pages_blocks_texte_image" USING btree ("_path");
  CREATE INDEX "pages_blocks_texte_image_image_idx" ON "pages_blocks_texte_image" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_texte_image_locales_locale_parent_id_unique" ON "pages_blocks_texte_image_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_produits_order_idx" ON "pages_blocks_produits" USING btree ("_order");
  CREATE INDEX "pages_blocks_produits_parent_id_idx" ON "pages_blocks_produits" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_produits_path_idx" ON "pages_blocks_produits" USING btree ("_path");
  CREATE INDEX "pages_blocks_produits_categorie_idx" ON "pages_blocks_produits" USING btree ("categorie_id");
  CREATE UNIQUE INDEX "pages_blocks_produits_locales_locale_parent_id_unique" ON "pages_blocks_produits_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_galerie_images_order_idx" ON "pages_blocks_galerie_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_galerie_images_parent_id_idx" ON "pages_blocks_galerie_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_galerie_images_image_idx" ON "pages_blocks_galerie_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_galerie_images_locales_locale_parent_id_unique" ON "pages_blocks_galerie_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_galerie_order_idx" ON "pages_blocks_galerie" USING btree ("_order");
  CREATE INDEX "pages_blocks_galerie_parent_id_idx" ON "pages_blocks_galerie" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_galerie_path_idx" ON "pages_blocks_galerie" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_galerie_locales_locale_parent_id_unique" ON "pages_blocks_galerie_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_horaires_horaires_personnalises_creneaux_order_idx" ON "pages_blocks_horaires_horaires_personnalises_creneaux" USING btree ("_order");
  CREATE INDEX "pages_blocks_horaires_horaires_personnalises_creneaux_parent_id_idx" ON "pages_blocks_horaires_horaires_personnalises_creneaux" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_horaires_horaires_personnalises_order_idx" ON "pages_blocks_horaires_horaires_personnalises" USING btree ("_order");
  CREATE INDEX "pages_blocks_horaires_horaires_personnalises_parent_id_idx" ON "pages_blocks_horaires_horaires_personnalises" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_horaires_order_idx" ON "pages_blocks_horaires" USING btree ("_order");
  CREATE INDEX "pages_blocks_horaires_parent_id_idx" ON "pages_blocks_horaires" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_horaires_path_idx" ON "pages_blocks_horaires" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_horaires_locales_locale_parent_id_unique" ON "pages_blocks_horaires_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_temoignages_order_idx" ON "pages_blocks_temoignages" USING btree ("_order");
  CREATE INDEX "pages_blocks_temoignages_parent_id_idx" ON "pages_blocks_temoignages" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_temoignages_path_idx" ON "pages_blocks_temoignages" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_temoignages_locales_locale_parent_id_unique" ON "pages_blocks_temoignages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_faq_locales_locale_parent_id_unique" ON "pages_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_contact_order_idx" ON "pages_blocks_contact" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_parent_id_idx" ON "pages_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_path_idx" ON "pages_blocks_contact" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_image_carte_idx" ON "pages_blocks_contact" USING btree ("image_carte_id");
  CREATE UNIQUE INDEX "pages_blocks_contact_locales_locale_parent_id_unique" ON "pages_blocks_contact_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_boutons_order_idx" ON "pages_blocks_cta_boutons" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_boutons_parent_id_idx" ON "pages_blocks_cta_boutons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_boutons_reference_idx" ON "pages_blocks_cta_boutons" USING btree ("reference_id");
  CREATE UNIQUE INDEX "pages_blocks_cta_boutons_locales_locale_parent_id_unique" ON "pages_blocks_cta_boutons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cta_locales_locale_parent_id_unique" ON "pages_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_commande_order_idx" ON "pages_blocks_commande" USING btree ("_order");
  CREATE INDEX "pages_blocks_commande_parent_id_idx" ON "pages_blocks_commande" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_commande_path_idx" ON "pages_blocks_commande" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_commande_locales_locale_parent_id_unique" ON "pages_blocks_commande_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_seo_seo_image_idx" ON "pages" USING btree ("seo_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_produits_id_idx" ON "pages_rels" USING btree ("produits_id");
  CREATE INDEX "pages_rels_temoignages_id_idx" ON "pages_rels" USING btree ("temoignages_id");
  CREATE INDEX "pages_rels_faq_id_idx" ON "pages_rels" USING btree ("faq_id");
  CREATE INDEX "_pages_v_blocks_hero_boutons_order_idx" ON "_pages_v_blocks_hero_boutons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_boutons_parent_id_idx" ON "_pages_v_blocks_hero_boutons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_boutons_reference_idx" ON "_pages_v_blocks_hero_boutons" USING btree ("reference_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_hero_boutons_locales_locale_parent_id_unique" ON "_pages_v_blocks_hero_boutons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_image_idx" ON "_pages_v_blocks_hero" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_hero_locales_locale_parent_id_unique" ON "_pages_v_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_texte_image_boutons_order_idx" ON "_pages_v_blocks_texte_image_boutons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_texte_image_boutons_parent_id_idx" ON "_pages_v_blocks_texte_image_boutons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_texte_image_boutons_reference_idx" ON "_pages_v_blocks_texte_image_boutons" USING btree ("reference_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_texte_image_boutons_locales_locale_parent_id" ON "_pages_v_blocks_texte_image_boutons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_texte_image_order_idx" ON "_pages_v_blocks_texte_image" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_texte_image_parent_id_idx" ON "_pages_v_blocks_texte_image" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_texte_image_path_idx" ON "_pages_v_blocks_texte_image" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_texte_image_image_idx" ON "_pages_v_blocks_texte_image" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_texte_image_locales_locale_parent_id_unique" ON "_pages_v_blocks_texte_image_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_produits_order_idx" ON "_pages_v_blocks_produits" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_produits_parent_id_idx" ON "_pages_v_blocks_produits" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_produits_path_idx" ON "_pages_v_blocks_produits" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_produits_categorie_idx" ON "_pages_v_blocks_produits" USING btree ("categorie_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_produits_locales_locale_parent_id_unique" ON "_pages_v_blocks_produits_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_galerie_images_order_idx" ON "_pages_v_blocks_galerie_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_galerie_images_parent_id_idx" ON "_pages_v_blocks_galerie_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_galerie_images_image_idx" ON "_pages_v_blocks_galerie_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_galerie_images_locales_locale_parent_id_uniq" ON "_pages_v_blocks_galerie_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_galerie_order_idx" ON "_pages_v_blocks_galerie" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_galerie_parent_id_idx" ON "_pages_v_blocks_galerie" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_galerie_path_idx" ON "_pages_v_blocks_galerie" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_galerie_locales_locale_parent_id_unique" ON "_pages_v_blocks_galerie_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_horaires_horaires_personnalises_creneaux_order_idx" ON "_pages_v_blocks_horaires_horaires_personnalises_creneaux" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_horaires_horaires_personnalises_creneaux_parent_id_idx" ON "_pages_v_blocks_horaires_horaires_personnalises_creneaux" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_horaires_horaires_personnalises_order_idx" ON "_pages_v_blocks_horaires_horaires_personnalises" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_horaires_horaires_personnalises_parent_id_idx" ON "_pages_v_blocks_horaires_horaires_personnalises" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_horaires_order_idx" ON "_pages_v_blocks_horaires" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_horaires_parent_id_idx" ON "_pages_v_blocks_horaires" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_horaires_path_idx" ON "_pages_v_blocks_horaires" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_horaires_locales_locale_parent_id_unique" ON "_pages_v_blocks_horaires_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_temoignages_order_idx" ON "_pages_v_blocks_temoignages" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_temoignages_parent_id_idx" ON "_pages_v_blocks_temoignages" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_temoignages_path_idx" ON "_pages_v_blocks_temoignages" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_temoignages_locales_locale_parent_id_unique" ON "_pages_v_blocks_temoignages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_locales_locale_parent_id_unique" ON "_pages_v_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_order_idx" ON "_pages_v_blocks_contact" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_parent_id_idx" ON "_pages_v_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_path_idx" ON "_pages_v_blocks_contact" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_image_carte_idx" ON "_pages_v_blocks_contact" USING btree ("image_carte_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_contact_locales_locale_parent_id_unique" ON "_pages_v_blocks_contact_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_boutons_order_idx" ON "_pages_v_blocks_cta_boutons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_boutons_parent_id_idx" ON "_pages_v_blocks_cta_boutons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_boutons_reference_idx" ON "_pages_v_blocks_cta_boutons" USING btree ("reference_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_boutons_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_boutons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_commande_order_idx" ON "_pages_v_blocks_commande" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_commande_parent_id_idx" ON "_pages_v_blocks_commande" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_commande_path_idx" ON "_pages_v_blocks_commande" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_commande_locales_locale_parent_id_unique" ON "_pages_v_blocks_commande_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_seo_version_seo_image_idx" ON "_pages_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_produits_id_idx" ON "_pages_v_rels" USING btree ("produits_id");
  CREATE INDEX "_pages_v_rels_temoignages_id_idx" ON "_pages_v_rels" USING btree ("temoignages_id");
  CREATE INDEX "_pages_v_rels_faq_id_idx" ON "_pages_v_rels" USING btree ("faq_id");
  CREATE INDEX "produits_galerie_order_idx" ON "produits_galerie" USING btree ("_order");
  CREATE INDEX "produits_galerie_parent_id_idx" ON "produits_galerie" USING btree ("_parent_id");
  CREATE INDEX "produits_galerie_image_idx" ON "produits_galerie" USING btree ("image_id");
  CREATE INDEX "produits_image_principale_idx" ON "produits" USING btree ("image_principale_id");
  CREATE INDEX "produits_categorie_idx" ON "produits" USING btree ("categorie_id");
  CREATE INDEX "produits_seo_seo_image_idx" ON "produits" USING btree ("seo_image_id");
  CREATE INDEX "produits_updated_at_idx" ON "produits" USING btree ("updated_at");
  CREATE INDEX "produits_created_at_idx" ON "produits" USING btree ("created_at");
  CREATE INDEX "produits__status_idx" ON "produits" USING btree ("_status");
  CREATE UNIQUE INDEX "produits_slug_idx" ON "produits_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "produits_locales_locale_parent_id_unique" ON "produits_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_produits_v_version_galerie_order_idx" ON "_produits_v_version_galerie" USING btree ("_order");
  CREATE INDEX "_produits_v_version_galerie_parent_id_idx" ON "_produits_v_version_galerie" USING btree ("_parent_id");
  CREATE INDEX "_produits_v_version_galerie_image_idx" ON "_produits_v_version_galerie" USING btree ("image_id");
  CREATE INDEX "_produits_v_parent_idx" ON "_produits_v" USING btree ("parent_id");
  CREATE INDEX "_produits_v_version_version_image_principale_idx" ON "_produits_v" USING btree ("version_image_principale_id");
  CREATE INDEX "_produits_v_version_version_categorie_idx" ON "_produits_v" USING btree ("version_categorie_id");
  CREATE INDEX "_produits_v_version_seo_version_seo_image_idx" ON "_produits_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_produits_v_version_version_updated_at_idx" ON "_produits_v" USING btree ("version_updated_at");
  CREATE INDEX "_produits_v_version_version_created_at_idx" ON "_produits_v" USING btree ("version_created_at");
  CREATE INDEX "_produits_v_version_version__status_idx" ON "_produits_v" USING btree ("version__status");
  CREATE INDEX "_produits_v_created_at_idx" ON "_produits_v" USING btree ("created_at");
  CREATE INDEX "_produits_v_updated_at_idx" ON "_produits_v" USING btree ("updated_at");
  CREATE INDEX "_produits_v_snapshot_idx" ON "_produits_v" USING btree ("snapshot");
  CREATE INDEX "_produits_v_published_locale_idx" ON "_produits_v" USING btree ("published_locale");
  CREATE INDEX "_produits_v_latest_idx" ON "_produits_v" USING btree ("latest");
  CREATE INDEX "_produits_v_autosave_idx" ON "_produits_v" USING btree ("autosave");
  CREATE INDEX "_produits_v_version_version_slug_idx" ON "_produits_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_produits_v_locales_locale_parent_id_unique" ON "_produits_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_produits_updated_at_idx" ON "categories_produits" USING btree ("updated_at");
  CREATE INDEX "categories_produits_created_at_idx" ON "categories_produits" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_produits_slug_idx" ON "categories_produits_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "categories_produits_locales_locale_parent_id_unique" ON "categories_produits_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "temoignages_updated_at_idx" ON "temoignages" USING btree ("updated_at");
  CREATE INDEX "temoignages_created_at_idx" ON "temoignages" USING btree ("created_at");
  CREATE UNIQUE INDEX "temoignages_locales_locale_parent_id_unique" ON "temoignages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faq_updated_at_idx" ON "faq" USING btree ("updated_at");
  CREATE INDEX "faq_created_at_idx" ON "faq" USING btree ("created_at");
  CREATE UNIQUE INDEX "faq_locales_locale_parent_id_unique" ON "faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_vignette_sizes_vignette_filename_idx" ON "media" USING btree ("sizes_vignette_filename");
  CREATE INDEX "media_sizes_carte_sizes_carte_filename_idx" ON "media" USING btree ("sizes_carte_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_banniere_sizes_banniere_filename_idx" ON "media" USING btree ("sizes_banniere_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "utilisateurs_sessions_order_idx" ON "utilisateurs_sessions" USING btree ("_order");
  CREATE INDEX "utilisateurs_sessions_parent_id_idx" ON "utilisateurs_sessions" USING btree ("_parent_id");
  CREATE INDEX "utilisateurs_updated_at_idx" ON "utilisateurs" USING btree ("updated_at");
  CREATE INDEX "utilisateurs_created_at_idx" ON "utilisateurs" USING btree ("created_at");
  CREATE UNIQUE INDEX "utilisateurs_email_idx" ON "utilisateurs" USING btree ("email");
  CREATE INDEX "commandes_lignes_order_idx" ON "commandes_lignes" USING btree ("_order");
  CREATE INDEX "commandes_lignes_parent_id_idx" ON "commandes_lignes" USING btree ("_parent_id");
  CREATE INDEX "commandes_lignes_produit_idx" ON "commandes_lignes" USING btree ("produit_id");
  CREATE UNIQUE INDEX "commandes_numero_idx" ON "commandes" USING btree ("numero");
  CREATE INDEX "commandes_creneau_debut_idx" ON "commandes" USING btree ("creneau_debut");
  CREATE INDEX "commandes_statut_commande_idx" ON "commandes" USING btree ("statut_commande");
  CREATE INDEX "commandes_statut_paiement_idx" ON "commandes" USING btree ("statut_paiement");
  CREATE INDEX "commandes_jeton_idx" ON "commandes" USING btree ("jeton");
  CREATE INDEX "commandes_stripe_session_id_idx" ON "commandes" USING btree ("stripe_session_id");
  CREATE INDEX "commandes_expire_le_idx" ON "commandes" USING btree ("expire_le");
  CREATE INDEX "commandes_updated_at_idx" ON "commandes" USING btree ("updated_at");
  CREATE INDEX "commandes_created_at_idx" ON "commandes" USING btree ("created_at");
  CREATE INDEX "reservations_creneaux_creneau_idx" ON "reservations_creneaux" USING btree ("creneau");
  CREATE INDEX "reservations_creneaux_commande_idx" ON "reservations_creneaux" USING btree ("commande_id");
  CREATE INDEX "reservations_creneaux_expire_le_idx" ON "reservations_creneaux" USING btree ("expire_le");
  CREATE INDEX "reservations_creneaux_updated_at_idx" ON "reservations_creneaux" USING btree ("updated_at");
  CREATE INDEX "reservations_creneaux_created_at_idx" ON "reservations_creneaux" USING btree ("created_at");
  CREATE UNIQUE INDEX "creneau_position_idx" ON "reservations_creneaux" USING btree ("creneau","position");
  CREATE UNIQUE INDEX "evenements_stripe_evenement_id_idx" ON "evenements_stripe" USING btree ("evenement_id");
  CREATE INDEX "evenements_stripe_updated_at_idx" ON "evenements_stripe" USING btree ("updated_at");
  CREATE INDEX "evenements_stripe_created_at_idx" ON "evenements_stripe" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_produits_id_idx" ON "payload_locked_documents_rels" USING btree ("produits_id");
  CREATE INDEX "payload_locked_documents_rels_categories_produits_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_produits_id");
  CREATE INDEX "payload_locked_documents_rels_temoignages_id_idx" ON "payload_locked_documents_rels" USING btree ("temoignages_id");
  CREATE INDEX "payload_locked_documents_rels_faq_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_utilisateurs_id_idx" ON "payload_locked_documents_rels" USING btree ("utilisateurs_id");
  CREATE INDEX "payload_locked_documents_rels_commandes_id_idx" ON "payload_locked_documents_rels" USING btree ("commandes_id");
  CREATE INDEX "payload_locked_documents_rels_reservations_creneaux_id_idx" ON "payload_locked_documents_rels" USING btree ("reservations_creneaux_id");
  CREATE INDEX "payload_locked_documents_rels_evenements_stripe_id_idx" ON "payload_locked_documents_rels" USING btree ("evenements_stripe_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_utilisateurs_id_idx" ON "payload_preferences_rels" USING btree ("utilisateurs_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "etablissement_horaires_creneaux_order_idx" ON "etablissement_horaires_creneaux" USING btree ("_order");
  CREATE INDEX "etablissement_horaires_creneaux_parent_id_idx" ON "etablissement_horaires_creneaux" USING btree ("_parent_id");
  CREATE INDEX "etablissement_horaires_order_idx" ON "etablissement_horaires" USING btree ("_order");
  CREATE INDEX "etablissement_horaires_parent_id_idx" ON "etablissement_horaires" USING btree ("_parent_id");
  CREATE INDEX "etablissement_fermetures_exceptionnelles_order_idx" ON "etablissement_fermetures_exceptionnelles" USING btree ("_order");
  CREATE INDEX "etablissement_fermetures_exceptionnelles_parent_id_idx" ON "etablissement_fermetures_exceptionnelles" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "etablissement_fermetures_exceptionnelles_locales_locale_pare" ON "etablissement_fermetures_exceptionnelles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "etablissement_reseaux_sociaux_order_idx" ON "etablissement_reseaux_sociaux" USING btree ("_order");
  CREATE INDEX "etablissement_reseaux_sociaux_parent_id_idx" ON "etablissement_reseaux_sociaux" USING btree ("_parent_id");
  CREATE INDEX "etablissement_logo_idx" ON "etablissement" USING btree ("logo_id");
  CREATE UNIQUE INDEX "etablissement_locales_locale_parent_id_unique" ON "etablissement_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_menu_principal_order_idx" ON "navigation_menu_principal" USING btree ("_order");
  CREATE INDEX "navigation_menu_principal_parent_id_idx" ON "navigation_menu_principal" USING btree ("_parent_id");
  CREATE INDEX "navigation_menu_principal_reference_idx" ON "navigation_menu_principal" USING btree ("reference_id");
  CREATE UNIQUE INDEX "navigation_menu_principal_locales_locale_parent_id_unique" ON "navigation_menu_principal_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_menu_pied_order_idx" ON "navigation_menu_pied" USING btree ("_order");
  CREATE INDEX "navigation_menu_pied_parent_id_idx" ON "navigation_menu_pied" USING btree ("_parent_id");
  CREATE INDEX "navigation_menu_pied_reference_idx" ON "navigation_menu_pied" USING btree ("reference_id");
  CREATE UNIQUE INDEX "navigation_menu_pied_locales_locale_parent_id_unique" ON "navigation_menu_pied_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_cta_en_tete_lien_cta_en_tete_lien_reference_idx" ON "navigation" USING btree ("cta_en_tete_lien_reference_id");
  CREATE UNIQUE INDEX "navigation_locales_locale_parent_id_unique" ON "navigation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "reglages_seo_image_partage_idx" ON "reglages_seo" USING btree ("image_partage_id");
  CREATE UNIQUE INDEX "reglages_seo_locales_locale_parent_id_unique" ON "reglages_seo_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "config_commande_horaires_retrait_plages_order_idx" ON "config_commande_horaires_retrait_plages" USING btree ("_order");
  CREATE INDEX "config_commande_horaires_retrait_plages_parent_id_idx" ON "config_commande_horaires_retrait_plages" USING btree ("_parent_id");
  CREATE INDEX "config_commande_horaires_retrait_order_idx" ON "config_commande_horaires_retrait" USING btree ("_order");
  CREATE INDEX "config_commande_horaires_retrait_parent_id_idx" ON "config_commande_horaires_retrait" USING btree ("_parent_id");
  CREATE INDEX "config_commande_jours_fermes_order_idx" ON "config_commande_jours_fermes" USING btree ("_order");
  CREATE INDEX "config_commande_jours_fermes_parent_id_idx" ON "config_commande_jours_fermes" USING btree ("_parent_id");
  CREATE INDEX "config_commande_stripe_compte_id_idx" ON "config_commande" USING btree ("stripe_compte_id");
  CREATE UNIQUE INDEX "config_commande_locales_locale_parent_id_unique" ON "config_commande_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_boutons" CASCADE;
  DROP TABLE "pages_blocks_hero_boutons_locales" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_hero_locales" CASCADE;
  DROP TABLE "pages_blocks_texte_image_boutons" CASCADE;
  DROP TABLE "pages_blocks_texte_image_boutons_locales" CASCADE;
  DROP TABLE "pages_blocks_texte_image" CASCADE;
  DROP TABLE "pages_blocks_texte_image_locales" CASCADE;
  DROP TABLE "pages_blocks_produits" CASCADE;
  DROP TABLE "pages_blocks_produits_locales" CASCADE;
  DROP TABLE "pages_blocks_galerie_images" CASCADE;
  DROP TABLE "pages_blocks_galerie_images_locales" CASCADE;
  DROP TABLE "pages_blocks_galerie" CASCADE;
  DROP TABLE "pages_blocks_galerie_locales" CASCADE;
  DROP TABLE "pages_blocks_horaires_horaires_personnalises_creneaux" CASCADE;
  DROP TABLE "pages_blocks_horaires_horaires_personnalises" CASCADE;
  DROP TABLE "pages_blocks_horaires" CASCADE;
  DROP TABLE "pages_blocks_horaires_locales" CASCADE;
  DROP TABLE "pages_blocks_temoignages" CASCADE;
  DROP TABLE "pages_blocks_temoignages_locales" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_faq_locales" CASCADE;
  DROP TABLE "pages_blocks_contact" CASCADE;
  DROP TABLE "pages_blocks_contact_locales" CASCADE;
  DROP TABLE "pages_blocks_cta_boutons" CASCADE;
  DROP TABLE "pages_blocks_cta_boutons_locales" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_cta_locales" CASCADE;
  DROP TABLE "pages_blocks_commande" CASCADE;
  DROP TABLE "pages_blocks_commande_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_boutons" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_boutons_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_texte_image_boutons" CASCADE;
  DROP TABLE "_pages_v_blocks_texte_image_boutons_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_texte_image" CASCADE;
  DROP TABLE "_pages_v_blocks_texte_image_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_produits" CASCADE;
  DROP TABLE "_pages_v_blocks_produits_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_galerie_images" CASCADE;
  DROP TABLE "_pages_v_blocks_galerie_images_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_galerie" CASCADE;
  DROP TABLE "_pages_v_blocks_galerie_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_horaires_horaires_personnalises_creneaux" CASCADE;
  DROP TABLE "_pages_v_blocks_horaires_horaires_personnalises" CASCADE;
  DROP TABLE "_pages_v_blocks_horaires" CASCADE;
  DROP TABLE "_pages_v_blocks_horaires_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_temoignages" CASCADE;
  DROP TABLE "_pages_v_blocks_temoignages_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_contact" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_boutons" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_boutons_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_commande" CASCADE;
  DROP TABLE "_pages_v_blocks_commande_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "produits_galerie" CASCADE;
  DROP TABLE "produits" CASCADE;
  DROP TABLE "produits_locales" CASCADE;
  DROP TABLE "_produits_v_version_galerie" CASCADE;
  DROP TABLE "_produits_v" CASCADE;
  DROP TABLE "_produits_v_locales" CASCADE;
  DROP TABLE "categories_produits" CASCADE;
  DROP TABLE "categories_produits_locales" CASCADE;
  DROP TABLE "temoignages" CASCADE;
  DROP TABLE "temoignages_locales" CASCADE;
  DROP TABLE "faq" CASCADE;
  DROP TABLE "faq_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "utilisateurs_sessions" CASCADE;
  DROP TABLE "utilisateurs" CASCADE;
  DROP TABLE "commandes_lignes" CASCADE;
  DROP TABLE "commandes" CASCADE;
  DROP TABLE "reservations_creneaux" CASCADE;
  DROP TABLE "evenements_stripe" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "etablissement_horaires_creneaux" CASCADE;
  DROP TABLE "etablissement_horaires" CASCADE;
  DROP TABLE "etablissement_fermetures_exceptionnelles" CASCADE;
  DROP TABLE "etablissement_fermetures_exceptionnelles_locales" CASCADE;
  DROP TABLE "etablissement_reseaux_sociaux" CASCADE;
  DROP TABLE "etablissement" CASCADE;
  DROP TABLE "etablissement_locales" CASCADE;
  DROP TABLE "navigation_menu_principal" CASCADE;
  DROP TABLE "navigation_menu_principal_locales" CASCADE;
  DROP TABLE "navigation_menu_pied" CASCADE;
  DROP TABLE "navigation_menu_pied_locales" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "navigation_locales" CASCADE;
  DROP TABLE "reglages_seo" CASCADE;
  DROP TABLE "reglages_seo_locales" CASCADE;
  DROP TABLE "config_commande_horaires_retrait_plages" CASCADE;
  DROP TABLE "config_commande_horaires_retrait" CASCADE;
  DROP TABLE "config_commande_jours_fermes" CASCADE;
  DROP TABLE "config_commande" CASCADE;
  DROP TABLE "config_commande_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_pages_blocks_hero_boutons_type";
  DROP TYPE "public"."enum_pages_blocks_hero_boutons_style";
  DROP TYPE "public"."enum_pages_blocks_hero_variante";
  DROP TYPE "public"."enum_pages_blocks_hero_alignement";
  DROP TYPE "public"."enum_pages_blocks_hero_apparence_fond";
  DROP TYPE "public"."enum_pages_blocks_hero_apparence_espacement";
  DROP TYPE "public"."enum_pages_blocks_texte_image_boutons_type";
  DROP TYPE "public"."enum_pages_blocks_texte_image_boutons_style";
  DROP TYPE "public"."enum_pages_blocks_texte_image_position_image";
  DROP TYPE "public"."enum_pages_blocks_texte_image_format_image";
  DROP TYPE "public"."enum_pages_blocks_texte_image_apparence_fond";
  DROP TYPE "public"."enum_pages_blocks_texte_image_apparence_espacement";
  DROP TYPE "public"."enum_pages_blocks_produits_mode";
  DROP TYPE "public"."enum_pages_blocks_produits_colonnes";
  DROP TYPE "public"."enum_pages_blocks_produits_apparence_fond";
  DROP TYPE "public"."enum_pages_blocks_produits_apparence_espacement";
  DROP TYPE "public"."enum_pages_blocks_galerie_colonnes";
  DROP TYPE "public"."enum_pages_blocks_galerie_format";
  DROP TYPE "public"."enum_pages_blocks_galerie_apparence_fond";
  DROP TYPE "public"."enum_pages_blocks_galerie_apparence_espacement";
  DROP TYPE "public"."enum_pages_blocks_horaires_horaires_personnalises_jour";
  DROP TYPE "public"."enum_pages_blocks_horaires_source";
  DROP TYPE "public"."enum_pages_blocks_horaires_apparence_fond";
  DROP TYPE "public"."enum_pages_blocks_horaires_apparence_espacement";
  DROP TYPE "public"."enum_pages_blocks_temoignages_mode";
  DROP TYPE "public"."enum_pages_blocks_temoignages_apparence_fond";
  DROP TYPE "public"."enum_pages_blocks_temoignages_apparence_espacement";
  DROP TYPE "public"."enum_pages_blocks_faq_mode";
  DROP TYPE "public"."enum_pages_blocks_faq_apparence_fond";
  DROP TYPE "public"."enum_pages_blocks_faq_apparence_espacement";
  DROP TYPE "public"."enum_pages_blocks_contact_apparence_fond";
  DROP TYPE "public"."enum_pages_blocks_contact_apparence_espacement";
  DROP TYPE "public"."enum_pages_blocks_cta_boutons_type";
  DROP TYPE "public"."enum_pages_blocks_cta_boutons_style";
  DROP TYPE "public"."enum_pages_blocks_cta_apparence_fond";
  DROP TYPE "public"."enum_pages_blocks_cta_apparence_espacement";
  DROP TYPE "public"."enum_pages_blocks_commande_apparence_fond";
  DROP TYPE "public"."enum_pages_blocks_commande_apparence_espacement";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_hero_boutons_type";
  DROP TYPE "public"."enum__pages_v_blocks_hero_boutons_style";
  DROP TYPE "public"."enum__pages_v_blocks_hero_variante";
  DROP TYPE "public"."enum__pages_v_blocks_hero_alignement";
  DROP TYPE "public"."enum__pages_v_blocks_hero_apparence_fond";
  DROP TYPE "public"."enum__pages_v_blocks_hero_apparence_espacement";
  DROP TYPE "public"."enum__pages_v_blocks_texte_image_boutons_type";
  DROP TYPE "public"."enum__pages_v_blocks_texte_image_boutons_style";
  DROP TYPE "public"."enum__pages_v_blocks_texte_image_position_image";
  DROP TYPE "public"."enum__pages_v_blocks_texte_image_format_image";
  DROP TYPE "public"."enum__pages_v_blocks_texte_image_apparence_fond";
  DROP TYPE "public"."enum__pages_v_blocks_texte_image_apparence_espacement";
  DROP TYPE "public"."enum__pages_v_blocks_produits_mode";
  DROP TYPE "public"."enum__pages_v_blocks_produits_colonnes";
  DROP TYPE "public"."enum__pages_v_blocks_produits_apparence_fond";
  DROP TYPE "public"."enum__pages_v_blocks_produits_apparence_espacement";
  DROP TYPE "public"."enum__pages_v_blocks_galerie_colonnes";
  DROP TYPE "public"."enum__pages_v_blocks_galerie_format";
  DROP TYPE "public"."enum__pages_v_blocks_galerie_apparence_fond";
  DROP TYPE "public"."enum__pages_v_blocks_galerie_apparence_espacement";
  DROP TYPE "public"."enum__pages_v_blocks_horaires_horaires_personnalises_jour";
  DROP TYPE "public"."enum__pages_v_blocks_horaires_source";
  DROP TYPE "public"."enum__pages_v_blocks_horaires_apparence_fond";
  DROP TYPE "public"."enum__pages_v_blocks_horaires_apparence_espacement";
  DROP TYPE "public"."enum__pages_v_blocks_temoignages_mode";
  DROP TYPE "public"."enum__pages_v_blocks_temoignages_apparence_fond";
  DROP TYPE "public"."enum__pages_v_blocks_temoignages_apparence_espacement";
  DROP TYPE "public"."enum__pages_v_blocks_faq_mode";
  DROP TYPE "public"."enum__pages_v_blocks_faq_apparence_fond";
  DROP TYPE "public"."enum__pages_v_blocks_faq_apparence_espacement";
  DROP TYPE "public"."enum__pages_v_blocks_contact_apparence_fond";
  DROP TYPE "public"."enum__pages_v_blocks_contact_apparence_espacement";
  DROP TYPE "public"."enum__pages_v_blocks_cta_boutons_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_boutons_style";
  DROP TYPE "public"."enum__pages_v_blocks_cta_apparence_fond";
  DROP TYPE "public"."enum__pages_v_blocks_cta_apparence_espacement";
  DROP TYPE "public"."enum__pages_v_blocks_commande_apparence_fond";
  DROP TYPE "public"."enum__pages_v_blocks_commande_apparence_espacement";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_produits_disponibilite";
  DROP TYPE "public"."enum_produits_status";
  DROP TYPE "public"."enum__produits_v_version_disponibilite";
  DROP TYPE "public"."enum__produits_v_version_status";
  DROP TYPE "public"."enum__produits_v_published_locale";
  DROP TYPE "public"."enum_temoignages_source";
  DROP TYPE "public"."enum_utilisateurs_role";
  DROP TYPE "public"."enum_commandes_statut_commande";
  DROP TYPE "public"."enum_commandes_statut_paiement";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_etablissement_horaires_jour";
  DROP TYPE "public"."enum_etablissement_reseaux_sociaux_plateforme";
  DROP TYPE "public"."enum_etablissement_type_commerce";
  DROP TYPE "public"."enum_navigation_menu_principal_type";
  DROP TYPE "public"."enum_navigation_menu_pied_type";
  DROP TYPE "public"."enum_navigation_cta_en_tete_lien_type";
  DROP TYPE "public"."enum_navigation_cta_en_tete_lien_style";
  DROP TYPE "public"."enum_config_commande_horaires_retrait_jour";`)
}
