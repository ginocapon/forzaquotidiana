import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "body_weight_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_id" integer,
  	"recorded_at" timestamp(3) with time zone NOT NULL,
  	"weight_kg" numeric NOT NULL,
  	"note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "body_weight_logs_id" integer;
  ALTER TABLE "body_weight_logs" ADD CONSTRAINT "body_weight_logs_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "body_weight_logs_client_idx" ON "body_weight_logs" USING btree ("client_id");
  CREATE INDEX "body_weight_logs_updated_at_idx" ON "body_weight_logs" USING btree ("updated_at");
  CREATE INDEX "body_weight_logs_created_at_idx" ON "body_weight_logs" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_body_weight_logs_fk" FOREIGN KEY ("body_weight_logs_id") REFERENCES "public"."body_weight_logs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_body_weight_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("body_weight_logs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "body_weight_logs" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "body_weight_logs" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_body_weight_logs_fk";
  
  DROP INDEX "payload_locked_documents_rels_body_weight_logs_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "body_weight_logs_id";`)
}
