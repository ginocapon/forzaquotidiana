import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_clients_training_focus" AS ENUM('hypertrophy', 'strength', 'definition', 'recomposition', 'fat_loss', 'maintenance', 'muscular_endurance', 'mobility', 'recovery', 'over_50');
  CREATE TYPE "public"."enum_clients_experience_level" AS ENUM('beginner', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum__clients_v_version_training_focus" AS ENUM('hypertrophy', 'strength', 'definition', 'recomposition', 'fat_loss', 'maintenance', 'muscular_endurance', 'mobility', 'recovery', 'over_50');
  CREATE TYPE "public"."enum__clients_v_version_experience_level" AS ENUM('beginner', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum_plans_training_type" AS ENUM('hypertrophy', 'strength', 'definition', 'recomposition', 'fat_loss', 'maintenance', 'muscular_endurance', 'mobility', 'recovery', 'over_50');
  CREATE TYPE "public"."enum__plans_v_version_training_type" AS ENUM('hypertrophy', 'strength', 'definition', 'recomposition', 'fat_loss', 'maintenance', 'muscular_endurance', 'mobility', 'recovery', 'over_50');
  CREATE TABLE "clients_training_focus" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_clients_training_focus",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_clients_v_version_training_focus" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__clients_v_version_training_focus",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "clients" ADD COLUMN "birth_date" timestamp(3) with time zone;
  ALTER TABLE "clients" ADD COLUMN "weight_kg" numeric;
  ALTER TABLE "clients" ADD COLUMN "height_cm" numeric;
  ALTER TABLE "clients" ADD COLUMN "experience_level" "enum_clients_experience_level";
  ALTER TABLE "clients" ADD COLUMN "goals" varchar;
  ALTER TABLE "_clients_v" ADD COLUMN "version_birth_date" timestamp(3) with time zone;
  ALTER TABLE "_clients_v" ADD COLUMN "version_weight_kg" numeric;
  ALTER TABLE "_clients_v" ADD COLUMN "version_height_cm" numeric;
  ALTER TABLE "_clients_v" ADD COLUMN "version_experience_level" "enum__clients_v_version_experience_level";
  ALTER TABLE "_clients_v" ADD COLUMN "version_goals" varchar;
  ALTER TABLE "plans" ADD COLUMN "training_type" "enum_plans_training_type";
  ALTER TABLE "_plans_v" ADD COLUMN "version_training_type" "enum__plans_v_version_training_type";
  ALTER TABLE "clients_training_focus" ADD CONSTRAINT "clients_training_focus_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_clients_v_version_training_focus" ADD CONSTRAINT "_clients_v_version_training_focus_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_clients_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "clients_training_focus_order_idx" ON "clients_training_focus" USING btree ("order");
  CREATE INDEX "clients_training_focus_parent_idx" ON "clients_training_focus" USING btree ("parent_id");
  CREATE INDEX "_clients_v_version_training_focus_order_idx" ON "_clients_v_version_training_focus" USING btree ("order");
  CREATE INDEX "_clients_v_version_training_focus_parent_idx" ON "_clients_v_version_training_focus" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "clients_training_focus" CASCADE;
  DROP TABLE "_clients_v_version_training_focus" CASCADE;
  ALTER TABLE "clients" DROP COLUMN "birth_date";
  ALTER TABLE "clients" DROP COLUMN "weight_kg";
  ALTER TABLE "clients" DROP COLUMN "height_cm";
  ALTER TABLE "clients" DROP COLUMN "experience_level";
  ALTER TABLE "clients" DROP COLUMN "goals";
  ALTER TABLE "_clients_v" DROP COLUMN "version_birth_date";
  ALTER TABLE "_clients_v" DROP COLUMN "version_weight_kg";
  ALTER TABLE "_clients_v" DROP COLUMN "version_height_cm";
  ALTER TABLE "_clients_v" DROP COLUMN "version_experience_level";
  ALTER TABLE "_clients_v" DROP COLUMN "version_goals";
  ALTER TABLE "plans" DROP COLUMN "training_type";
  ALTER TABLE "_plans_v" DROP COLUMN "version_training_type";
  DROP TYPE "public"."enum_clients_training_focus";
  DROP TYPE "public"."enum_clients_experience_level";
  DROP TYPE "public"."enum__clients_v_version_training_focus";
  DROP TYPE "public"."enum__clients_v_version_experience_level";
  DROP TYPE "public"."enum_plans_training_type";
  DROP TYPE "public"."enum__plans_v_version_training_type";`)
}
