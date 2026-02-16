CREATE TYPE "public"."action_type" AS ENUM('add_to_campaign', 'send_email', 'update_crm_field', 'create_crm_record', 'wait', 'http_request');--> statement-breakpoint
CREATE TYPE "public"."execution_status" AS ENUM('pending', 'running', 'completed', 'failed', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."log_status" AS ENUM('success', 'failed', 'in_progress');--> statement-breakpoint
CREATE TYPE "public"."operation" AS ENUM('received', 'field_sync', 'crm_push', 'retry_attempt');--> statement-breakpoint
CREATE TYPE "public"."processing_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."sync_status" AS ENUM('pending', 'synced', 'failed');--> statement-breakpoint
CREATE TYPE "public"."trigger_type" AS ENUM('crm_record_created', 'crm_record_updated', 'crm_field_changed', 'manual', 'scheduled');--> statement-breakpoint
CREATE TYPE "public"."workflow_status" AS ENUM('active', 'paused', 'archived');--> statement-breakpoint
CREATE TABLE "action_executions" (
	"id" serial PRIMARY KEY NOT NULL,
	"execution_id" integer NOT NULL,
	"action_type" "action_type" NOT NULL,
	"action_config" jsonb NOT NULL,
	"status" "execution_status" DEFAULT 'pending' NOT NULL,
	"result" jsonb,
	"error_message" text,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"duration" integer
);
--> statement-breakpoint
CREATE TABLE "automation_workflows" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"trigger_type" "trigger_type" NOT NULL,
	"trigger_config" jsonb NOT NULL,
	"conditions" jsonb,
	"actions" jsonb NOT NULL,
	"status" "workflow_status" DEFAULT 'active' NOT NULL,
	"execution_count" integer DEFAULT 0 NOT NULL,
	"last_executed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "campaign_syncs" (
	"id" serial PRIMARY KEY NOT NULL,
	"zoho_campaign_id" varchar(100) NOT NULL,
	"campaign_name" varchar(255) NOT NULL,
	"list_id" varchar(100),
	"metadata" jsonb,
	"last_synced_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "event_admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "event_admins_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "field_mappings" (
	"id" serial PRIMARY KEY NOT NULL,
	"zoho_module" varchar(100) NOT NULL,
	"field_name" varchar(255) NOT NULL,
	"field_type" varchar(50) NOT NULL,
	"is_custom_field" boolean DEFAULT false NOT NULL,
	"picklist_values" jsonb,
	"is_required" boolean DEFAULT false NOT NULL,
	"max_length" integer,
	"last_synced_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_zoho_module_field" UNIQUE("zoho_module","field_name")
);
--> statement-breakpoint
CREATE TABLE "field_metadata_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"zoho_module" varchar(100) NOT NULL,
	"field_api_name" varchar(255) NOT NULL,
	"field_label" varchar(255) NOT NULL,
	"data_type" varchar(50) NOT NULL,
	"is_custom_field" boolean DEFAULT false NOT NULL,
	"is_required" boolean DEFAULT false NOT NULL,
	"max_length" integer,
	"picklist_values" jsonb,
	"field_metadata" jsonb,
	"last_synced" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_module_field_api" UNIQUE("zoho_module","field_api_name")
);
--> statement-breakpoint
CREATE TABLE "form_configurations" (
	"id" serial PRIMARY KEY NOT NULL,
	"form_name" varchar(255) NOT NULL,
	"zoho_module" varchar(100) DEFAULT 'Leads' NOT NULL,
	"zoho_layout_id" varchar(100),
	"zoho_layout_name" varchar(255),
	"lead_source_tag" text,
	"display_fields" jsonb,
	"submit_fields" jsonb,
	"field_mappings" jsonb,
	"strict_mapping" boolean DEFAULT true NOT NULL,
	"auto_create_fields" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "form_configurations_form_name_unique" UNIQUE("form_name")
);
--> statement-breakpoint
CREATE TABLE "form_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"form_name" varchar(255) NOT NULL,
	"submission_data" jsonb NOT NULL,
	"source_form" varchar(255) NOT NULL,
	"zoho_module" varchar(100) DEFAULT 'Leads' NOT NULL,
	"zoho_crm_id" varchar(100),
	"processing_status" "processing_status" DEFAULT 'pending' NOT NULL,
	"sync_status" "sync_status" DEFAULT 'pending' NOT NULL,
	"error_message" text,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"last_retry_at" timestamp,
	"next_retry_at" timestamp,
	"last_sync_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "oauth_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider" varchar(50) NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"expires_at" timestamp,
	"scope" text,
	"token_type" varchar(50) DEFAULT 'Bearer',
	"is_active" boolean DEFAULT true NOT NULL,
	"last_refreshed" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"file_url" varchar(500) NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"file_size" varchar(50),
	"amyloidosis_type" varchar(50) NOT NULL,
	"resource_type" varchar(100) NOT NULL,
	"category" varchar(100) NOT NULL,
	"audience" varchar(100) NOT NULL,
	"language" varchar(10) DEFAULT 'en' NOT NULL,
	"region" varchar(50) DEFAULT 'national' NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"requires_login" boolean DEFAULT false NOT NULL,
	"submitted_by" varchar(255),
	"submitter_role" varchar(255),
	"submitter_organization" varchar(255),
	"consent_agreed" boolean DEFAULT false,
	"phi_confirmation" boolean DEFAULT false,
	"editorial_charter" boolean DEFAULT false,
	"moderated_by" varchar(255),
	"is_approved" boolean DEFAULT false NOT NULL,
	"tags" text[],
	"download_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "submission_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"submission_id" integer NOT NULL,
	"operation" "operation" NOT NULL,
	"status" "log_status" NOT NULL,
	"details" jsonb,
	"error_message" text,
	"duration" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "townhall_registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"institution" varchar(255) NOT NULL,
	"is_cann_member" boolean NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "workflow_executions" (
	"id" serial PRIMARY KEY NOT NULL,
	"workflow_id" integer NOT NULL,
	"status" "execution_status" DEFAULT 'pending' NOT NULL,
	"trigger_data" jsonb,
	"execution_context" jsonb,
	"error_message" text,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"duration" integer
);
--> statement-breakpoint
ALTER TABLE "action_executions" ADD CONSTRAINT "action_executions_execution_id_workflow_executions_id_fk" FOREIGN KEY ("execution_id") REFERENCES "public"."workflow_executions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_logs" ADD CONSTRAINT "submission_logs_submission_id_form_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_executions" ADD CONSTRAINT "workflow_executions_workflow_id_automation_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."automation_workflows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_action_executions_execution_id" ON "action_executions" USING btree ("execution_id");--> statement-breakpoint
CREATE INDEX "idx_action_executions_status" ON "action_executions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_automation_workflows_status" ON "automation_workflows" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_automation_workflows_trigger_type" ON "automation_workflows" USING btree ("trigger_type");--> statement-breakpoint
CREATE INDEX "idx_campaign_syncs_zoho_id" ON "campaign_syncs" USING btree ("zoho_campaign_id");--> statement-breakpoint
CREATE INDEX "idx_field_mappings_zoho_module" ON "field_mappings" USING btree ("zoho_module");--> statement-breakpoint
CREATE INDEX "idx_field_metadata_module" ON "field_metadata_cache" USING btree ("zoho_module");--> statement-breakpoint
CREATE INDEX "idx_field_metadata_last_synced" ON "field_metadata_cache" USING btree ("last_synced");--> statement-breakpoint
CREATE INDEX "idx_form_configurations_active" ON "form_configurations" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_form_configurations_lead_source" ON "form_configurations" USING btree ("lead_source_tag");--> statement-breakpoint
CREATE INDEX "idx_form_submissions_form_name" ON "form_submissions" USING btree ("form_name");--> statement-breakpoint
CREATE INDEX "idx_form_submissions_zoho_module" ON "form_submissions" USING btree ("zoho_module");--> statement-breakpoint
CREATE INDEX "idx_form_submissions_sync_status" ON "form_submissions" USING btree ("sync_status");--> statement-breakpoint
CREATE INDEX "idx_form_submissions_processing_status" ON "form_submissions" USING btree ("processing_status");--> statement-breakpoint
CREATE INDEX "idx_form_submissions_zoho_crm_id" ON "form_submissions" USING btree ("zoho_crm_id");--> statement-breakpoint
CREATE INDEX "idx_oauth_tokens_provider" ON "oauth_tokens" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "idx_oauth_tokens_active" ON "oauth_tokens" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_submission_logs_submission_id" ON "submission_logs" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "idx_townhall_registrations_email" ON "townhall_registrations" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_townhall_registrations_created_at" ON "townhall_registrations" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_workflow_executions_workflow_id" ON "workflow_executions" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "idx_workflow_executions_status" ON "workflow_executions" USING btree ("status");