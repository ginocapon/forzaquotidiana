import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_program_products_currency" AS ENUM('eur', 'pln', 'usd');
  CREATE TYPE "public"."enum_program_orders_status" AS ENUM('pending', 'paid', 'failed', 'refunded');
  CREATE TABLE "program_products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"published" boolean DEFAULT false,
  	"featured" boolean DEFAULT false,
  	"price_cents" numeric NOT NULL,
  	"currency" "enum_program_products_currency" DEFAULT 'eur',
  	"stripe_price_id" varchar,
  	"template_plan_id" integer NOT NULL,
  	"short_description" varchar,
  	"description" varchar,
  	"duration_weeks" numeric,
  	"cover_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "program_orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"client_id" integer,
  	"assigned_plan_id" integer,
  	"email" varchar NOT NULL,
  	"status" "enum_program_orders_status" DEFAULT 'pending' NOT NULL,
  	"amount_cents" numeric,
  	"currency" varchar,
  	"stripe_session_id" varchar,
  	"stripe_payment_intent_id" varchar,
  	"fulfillment_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "plans" ADD COLUMN "is_template" boolean DEFAULT false;
  ALTER TABLE "_plans_v" ADD COLUMN "version_is_template" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "program_products_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "program_orders_id" integer;
  ALTER TABLE "program_products" ADD CONSTRAINT "program_products_template_plan_id_plans_id_fk" FOREIGN KEY ("template_plan_id") REFERENCES "public"."plans"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "program_products" ADD CONSTRAINT "program_products_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "program_orders" ADD CONSTRAINT "program_orders_product_id_program_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."program_products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "program_orders" ADD CONSTRAINT "program_orders_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "program_orders" ADD CONSTRAINT "program_orders_assigned_plan_id_plans_id_fk" FOREIGN KEY ("assigned_plan_id") REFERENCES "public"."plans"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "program_products_slug_idx" ON "program_products" USING btree ("slug");
  CREATE INDEX "program_products_template_plan_idx" ON "program_products" USING btree ("template_plan_id");
  CREATE INDEX "program_products_cover_image_idx" ON "program_products" USING btree ("cover_image_id");
  CREATE INDEX "program_products_updated_at_idx" ON "program_products" USING btree ("updated_at");
  CREATE INDEX "program_products_created_at_idx" ON "program_products" USING btree ("created_at");
  CREATE INDEX "program_orders_product_idx" ON "program_orders" USING btree ("product_id");
  CREATE INDEX "program_orders_client_idx" ON "program_orders" USING btree ("client_id");
  CREATE INDEX "program_orders_assigned_plan_idx" ON "program_orders" USING btree ("assigned_plan_id");
  CREATE UNIQUE INDEX "program_orders_stripe_session_id_idx" ON "program_orders" USING btree ("stripe_session_id");
  CREATE INDEX "program_orders_updated_at_idx" ON "program_orders" USING btree ("updated_at");
  CREATE INDEX "program_orders_created_at_idx" ON "program_orders" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_program_products_fk" FOREIGN KEY ("program_products_id") REFERENCES "public"."program_products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_program_orders_fk" FOREIGN KEY ("program_orders_id") REFERENCES "public"."program_orders"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_program_products_id_idx" ON "payload_locked_documents_rels" USING btree ("program_products_id");
  CREATE INDEX "payload_locked_documents_rels_program_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("program_orders_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "program_products" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "program_orders" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "program_products" CASCADE;
  DROP TABLE "program_orders" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_program_products_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_program_orders_fk";
  
  DROP INDEX "payload_locked_documents_rels_program_products_id_idx";
  DROP INDEX "payload_locked_documents_rels_program_orders_id_idx";
  ALTER TABLE "plans" DROP COLUMN "is_template";
  ALTER TABLE "_plans_v" DROP COLUMN "version_is_template";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "program_products_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "program_orders_id";
  DROP TYPE "public"."enum_program_products_currency";
  DROP TYPE "public"."enum_program_orders_status";`)
}
