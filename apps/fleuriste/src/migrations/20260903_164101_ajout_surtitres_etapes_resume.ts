import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_produits_variante" AS ENUM('sobre', 'carte');
  CREATE TYPE "public"."enum_pages_blocks_produits_disposition_entete" AS ENUM('empilee', 'repartie');
  CREATE TYPE "public"."enum_pages_blocks_etapes_numerotation" AS ENUM('chiffres', 'aucune');
  CREATE TYPE "public"."enum_pages_blocks_etapes_colonnes" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_etapes_disposition_entete" AS ENUM('empilee', 'repartie');
  CREATE TYPE "public"."enum_pages_blocks_etapes_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum_pages_blocks_etapes_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_produits_variante" AS ENUM('sobre', 'carte');
  CREATE TYPE "public"."enum__pages_v_blocks_produits_disposition_entete" AS ENUM('empilee', 'repartie');
  CREATE TYPE "public"."enum__pages_v_blocks_etapes_numerotation" AS ENUM('chiffres', 'aucune');
  CREATE TYPE "public"."enum__pages_v_blocks_etapes_colonnes" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_etapes_disposition_entete" AS ENUM('empilee', 'repartie');
  CREATE TYPE "public"."enum__pages_v_blocks_etapes_apparence_fond" AS ENUM('defaut', 'attenue', 'primaire');
  CREATE TYPE "public"."enum__pages_v_blocks_etapes_apparence_espacement" AS ENUM('compact', 'normal', 'large');
  CREATE TABLE "pages_blocks_etapes_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_etapes_elements_locales" (
  	"titre" varchar,
  	"texte" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_etapes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"numerotation" "enum_pages_blocks_etapes_numerotation" DEFAULT 'chiffres',
  	"colonnes" "enum_pages_blocks_etapes_colonnes" DEFAULT '3',
  	"disposition_entete" "enum_pages_blocks_etapes_disposition_entete" DEFAULT 'empilee',
  	"apparence_fond" "enum_pages_blocks_etapes_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum_pages_blocks_etapes_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_etapes_locales" (
  	"surtitre" varchar,
  	"titre" varchar,
  	"intro" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_etapes_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_etapes_elements_locales" (
  	"titre" varchar,
  	"texte" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_etapes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"numerotation" "enum__pages_v_blocks_etapes_numerotation" DEFAULT 'chiffres',
  	"colonnes" "enum__pages_v_blocks_etapes_colonnes" DEFAULT '3',
  	"disposition_entete" "enum__pages_v_blocks_etapes_disposition_entete" DEFAULT 'empilee',
  	"apparence_fond" "enum__pages_v_blocks_etapes_apparence_fond" DEFAULT 'defaut',
  	"apparence_espacement" "enum__pages_v_blocks_etapes_apparence_espacement" DEFAULT 'normal',
  	"apparence_ancre" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_etapes_locales" (
  	"surtitre" varchar,
  	"titre" varchar,
  	"intro" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_hero_locales" ADD COLUMN "surtitre" varchar;
  ALTER TABLE "pages_blocks_texte_image_locales" ADD COLUMN "surtitre" varchar;
  ALTER TABLE "pages_blocks_produits" ADD COLUMN "variante" "enum_pages_blocks_produits_variante" DEFAULT 'sobre';
  ALTER TABLE "pages_blocks_produits" ADD COLUMN "disposition_entete" "enum_pages_blocks_produits_disposition_entete" DEFAULT 'empilee';
  ALTER TABLE "pages_blocks_produits_locales" ADD COLUMN "surtitre" varchar;
  ALTER TABLE "pages_blocks_temoignages_locales" ADD COLUMN "surtitre" varchar;
  ALTER TABLE "pages_blocks_cta_locales" ADD COLUMN "surtitre" varchar;
  ALTER TABLE "_pages_v_blocks_hero_locales" ADD COLUMN "surtitre" varchar;
  ALTER TABLE "_pages_v_blocks_texte_image_locales" ADD COLUMN "surtitre" varchar;
  ALTER TABLE "_pages_v_blocks_produits" ADD COLUMN "variante" "enum__pages_v_blocks_produits_variante" DEFAULT 'sobre';
  ALTER TABLE "_pages_v_blocks_produits" ADD COLUMN "disposition_entete" "enum__pages_v_blocks_produits_disposition_entete" DEFAULT 'empilee';
  ALTER TABLE "_pages_v_blocks_produits_locales" ADD COLUMN "surtitre" varchar;
  ALTER TABLE "_pages_v_blocks_temoignages_locales" ADD COLUMN "surtitre" varchar;
  ALTER TABLE "_pages_v_blocks_cta_locales" ADD COLUMN "surtitre" varchar;
  ALTER TABLE "produits_locales" ADD COLUMN "resume" varchar;
  ALTER TABLE "_produits_v_locales" ADD COLUMN "version_resume" varchar;
  ALTER TABLE "pages_blocks_etapes_elements" ADD CONSTRAINT "pages_blocks_etapes_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_etapes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_etapes_elements_locales" ADD CONSTRAINT "pages_blocks_etapes_elements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_etapes_elements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_etapes" ADD CONSTRAINT "pages_blocks_etapes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_etapes_locales" ADD CONSTRAINT "pages_blocks_etapes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_etapes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_etapes_elements" ADD CONSTRAINT "_pages_v_blocks_etapes_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_etapes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_etapes_elements_locales" ADD CONSTRAINT "_pages_v_blocks_etapes_elements_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_etapes_elements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_etapes" ADD CONSTRAINT "_pages_v_blocks_etapes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_etapes_locales" ADD CONSTRAINT "_pages_v_blocks_etapes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_etapes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_etapes_elements_order_idx" ON "pages_blocks_etapes_elements" USING btree ("_order");
  CREATE INDEX "pages_blocks_etapes_elements_parent_id_idx" ON "pages_blocks_etapes_elements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_etapes_elements_locales_locale_parent_id_unique" ON "pages_blocks_etapes_elements_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_etapes_order_idx" ON "pages_blocks_etapes" USING btree ("_order");
  CREATE INDEX "pages_blocks_etapes_parent_id_idx" ON "pages_blocks_etapes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_etapes_path_idx" ON "pages_blocks_etapes" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_etapes_locales_locale_parent_id_unique" ON "pages_blocks_etapes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_etapes_elements_order_idx" ON "_pages_v_blocks_etapes_elements" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_etapes_elements_parent_id_idx" ON "_pages_v_blocks_etapes_elements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_etapes_elements_locales_locale_parent_id_uni" ON "_pages_v_blocks_etapes_elements_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_etapes_order_idx" ON "_pages_v_blocks_etapes" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_etapes_parent_id_idx" ON "_pages_v_blocks_etapes" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_etapes_path_idx" ON "_pages_v_blocks_etapes" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_etapes_locales_locale_parent_id_unique" ON "_pages_v_blocks_etapes_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_etapes_elements" CASCADE;
  DROP TABLE "pages_blocks_etapes_elements_locales" CASCADE;
  DROP TABLE "pages_blocks_etapes" CASCADE;
  DROP TABLE "pages_blocks_etapes_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_etapes_elements" CASCADE;
  DROP TABLE "_pages_v_blocks_etapes_elements_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_etapes" CASCADE;
  DROP TABLE "_pages_v_blocks_etapes_locales" CASCADE;
  ALTER TABLE "pages_blocks_hero_locales" DROP COLUMN "surtitre";
  ALTER TABLE "pages_blocks_texte_image_locales" DROP COLUMN "surtitre";
  ALTER TABLE "pages_blocks_produits" DROP COLUMN "variante";
  ALTER TABLE "pages_blocks_produits" DROP COLUMN "disposition_entete";
  ALTER TABLE "pages_blocks_produits_locales" DROP COLUMN "surtitre";
  ALTER TABLE "pages_blocks_temoignages_locales" DROP COLUMN "surtitre";
  ALTER TABLE "pages_blocks_cta_locales" DROP COLUMN "surtitre";
  ALTER TABLE "_pages_v_blocks_hero_locales" DROP COLUMN "surtitre";
  ALTER TABLE "_pages_v_blocks_texte_image_locales" DROP COLUMN "surtitre";
  ALTER TABLE "_pages_v_blocks_produits" DROP COLUMN "variante";
  ALTER TABLE "_pages_v_blocks_produits" DROP COLUMN "disposition_entete";
  ALTER TABLE "_pages_v_blocks_produits_locales" DROP COLUMN "surtitre";
  ALTER TABLE "_pages_v_blocks_temoignages_locales" DROP COLUMN "surtitre";
  ALTER TABLE "_pages_v_blocks_cta_locales" DROP COLUMN "surtitre";
  ALTER TABLE "produits_locales" DROP COLUMN "resume";
  ALTER TABLE "_produits_v_locales" DROP COLUMN "version_resume";
  DROP TYPE "public"."enum_pages_blocks_produits_variante";
  DROP TYPE "public"."enum_pages_blocks_produits_disposition_entete";
  DROP TYPE "public"."enum_pages_blocks_etapes_numerotation";
  DROP TYPE "public"."enum_pages_blocks_etapes_colonnes";
  DROP TYPE "public"."enum_pages_blocks_etapes_disposition_entete";
  DROP TYPE "public"."enum_pages_blocks_etapes_apparence_fond";
  DROP TYPE "public"."enum_pages_blocks_etapes_apparence_espacement";
  DROP TYPE "public"."enum__pages_v_blocks_produits_variante";
  DROP TYPE "public"."enum__pages_v_blocks_produits_disposition_entete";
  DROP TYPE "public"."enum__pages_v_blocks_etapes_numerotation";
  DROP TYPE "public"."enum__pages_v_blocks_etapes_colonnes";
  DROP TYPE "public"."enum__pages_v_blocks_etapes_disposition_entete";
  DROP TYPE "public"."enum__pages_v_blocks_etapes_apparence_fond";
  DROP TYPE "public"."enum__pages_v_blocks_etapes_apparence_espacement";`)
}
