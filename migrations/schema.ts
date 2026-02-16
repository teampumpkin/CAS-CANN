import { pgTable, index, serial, varchar, jsonb, timestamp, unique, boolean, integer, text, foreignKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const actionType = pgEnum("action_type", ['add_to_campaign', 'send_email', 'update_crm_field', 'create_crm_record', 'wait', 'http_request'])
export const executionStatus = pgEnum("execution_status", ['pending', 'running', 'completed', 'failed', 'skipped'])
export const logStatus = pgEnum("log_status", ['success', 'failed', 'in_progress'])
export const operation = pgEnum("operation", ['received', 'field_sync', 'crm_push', 'retry_attempt'])
export const processingStatus = pgEnum("processing_status", ['pending', 'processing', 'completed', 'failed'])
export const syncStatus = pgEnum("sync_status", ['pending', 'synced', 'failed'])
export const triggerType = pgEnum("trigger_type", ['crm_record_created', 'crm_record_updated', 'crm_field_changed', 'manual', 'scheduled'])
export const workflowStatus = pgEnum("workflow_status", ['active', 'paused', 'archived'])


export const campaignSyncs = pgTable("campaign_syncs", {
	id: serial().primaryKey().notNull(),
	zohoCampaignId: varchar("zoho_campaign_id", { length: 100 }).notNull(),
	campaignName: varchar("campaign_name", { length: 255 }).notNull(),
	listId: varchar("list_id", { length: 100 }),
	metadata: jsonb(),
	lastSyncedAt: timestamp("last_synced_at", { mode: 'string' }).defaultNow(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_campaign_syncs_zoho_id").using("btree", table.zohoCampaignId.asc().nullsLast().op("text_ops")),
]);

export const eventAdmins = pgTable("event_admins", {
	id: serial().primaryKey().notNull(),
	username: varchar({ length: 100 }).notNull(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("event_admins_username_unique").on(table.username),
]);

export const fieldMappings = pgTable("field_mappings", {
	id: serial().primaryKey().notNull(),
	zohoModule: varchar("zoho_module", { length: 100 }).notNull(),
	fieldName: varchar("field_name", { length: 255 }).notNull(),
	fieldType: varchar("field_type", { length: 50 }).notNull(),
	isCustomField: boolean("is_custom_field").default(false).notNull(),
	picklistValues: jsonb("picklist_values"),
	isRequired: boolean("is_required").default(false).notNull(),
	maxLength: integer("max_length"),
	lastSyncedAt: timestamp("last_synced_at", { mode: 'string' }).defaultNow(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_field_mappings_zoho_module").using("btree", table.zohoModule.asc().nullsLast().op("text_ops")),
	unique("unique_zoho_module_field").on(table.zohoModule, table.fieldName),
]);

export const fieldMetadataCache = pgTable("field_metadata_cache", {
	id: serial().primaryKey().notNull(),
	zohoModule: varchar("zoho_module", { length: 100 }).notNull(),
	fieldApiName: varchar("field_api_name", { length: 255 }).notNull(),
	fieldLabel: varchar("field_label", { length: 255 }).notNull(),
	dataType: varchar("data_type", { length: 50 }).notNull(),
	isCustomField: boolean("is_custom_field").default(false).notNull(),
	isRequired: boolean("is_required").default(false).notNull(),
	maxLength: integer("max_length"),
	picklistValues: jsonb("picklist_values"),
	fieldMetadata: jsonb("field_metadata"),
	lastSynced: timestamp("last_synced", { mode: 'string' }).defaultNow(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_field_metadata_last_synced").using("btree", table.lastSynced.asc().nullsLast().op("timestamp_ops")),
	index("idx_field_metadata_module").using("btree", table.zohoModule.asc().nullsLast().op("text_ops")),
	unique("unique_module_field_api").on(table.zohoModule, table.fieldApiName),
]);

export const formConfigurations = pgTable("form_configurations", {
	id: serial().primaryKey().notNull(),
	formName: varchar("form_name", { length: 255 }).notNull(),
	zohoModule: varchar("zoho_module", { length: 100 }).default('Leads').notNull(),
	fieldMappings: jsonb("field_mappings"),
	isActive: boolean("is_active").default(true).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	leadSourceTag: text("lead_source_tag"),
	displayFields: text("display_fields").array(),
	submitFields: jsonb("submit_fields"),
	strictMapping: boolean("strict_mapping").default(true).notNull(),
	autoCreateFields: boolean("auto_create_fields").default(false).notNull(),
	zohoLayoutId: varchar("zoho_layout_id", { length: 100 }),
	zohoLayoutName: varchar("zoho_layout_name", { length: 255 }),
}, (table) => [
	index("idx_form_configurations_active").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
	index("idx_form_configurations_lead_source").using("btree", table.leadSourceTag.asc().nullsLast().op("text_ops")),
	unique("form_configurations_form_name_unique").on(table.formName),
]);

export const oauthTokens = pgTable("oauth_tokens", {
	id: serial().primaryKey().notNull(),
	provider: varchar({ length: 50 }).notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	scope: text(),
	tokenType: varchar("token_type", { length: 50 }).default('Bearer'),
	isActive: boolean("is_active").default(true).notNull(),
	lastRefreshed: timestamp("last_refreshed", { mode: 'string' }).defaultNow(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_oauth_tokens_active").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
	index("idx_oauth_tokens_provider").using("btree", table.provider.asc().nullsLast().op("text_ops")),
]);

export const resources = pgTable("resources", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	fileUrl: varchar("file_url", { length: 500 }).notNull(),
	fileName: varchar("file_name", { length: 255 }).notNull(),
	fileType: varchar("file_type", { length: 50 }).notNull(),
	fileSize: varchar("file_size", { length: 50 }),
	amyloidosisType: varchar("amyloidosis_type", { length: 50 }).notNull(),
	resourceType: varchar("resource_type", { length: 100 }).notNull(),
	category: varchar({ length: 100 }).notNull(),
	audience: varchar({ length: 100 }).notNull(),
	language: varchar({ length: 10 }).default('en').notNull(),
	region: varchar({ length: 50 }).default('national').notNull(),
	isPublic: boolean("is_public").default(true).notNull(),
	requiresLogin: boolean("requires_login").default(false).notNull(),
	submittedBy: varchar("submitted_by", { length: 255 }),
	moderatedBy: varchar("moderated_by", { length: 255 }),
	isApproved: boolean("is_approved").default(false).notNull(),
	tags: text().array(),
	downloadCount: integer("download_count").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	submitterRole: varchar("submitter_role", { length: 255 }),
	submitterOrganization: varchar("submitter_organization", { length: 255 }),
	consentAgreed: boolean("consent_agreed").default(false),
	phiConfirmation: boolean("phi_confirmation").default(false),
	editorialCharter: boolean("editorial_charter").default(false),
});

export const townhallRegistrations = pgTable("townhall_registrations", {
	id: serial().primaryKey().notNull(),
	firstName: varchar("first_name", { length: 100 }).notNull(),
	lastName: varchar("last_name", { length: 100 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	institution: varchar({ length: 255 }).notNull(),
	isCannMember: boolean("is_cann_member").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_townhall_registrations_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("idx_townhall_registrations_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: text().notNull(),
	password: text().notNull(),
}, (table) => [
	unique("users_username_unique").on(table.username),
]);

export const workflowExecutions = pgTable("workflow_executions", {
	id: serial().primaryKey().notNull(),
	workflowId: integer("workflow_id").notNull(),
	status: executionStatus().default('pending').notNull(),
	triggerData: jsonb("trigger_data"),
	executionContext: jsonb("execution_context"),
	errorMessage: text("error_message"),
	startedAt: timestamp("started_at", { mode: 'string' }).defaultNow(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	duration: integer(),
}, (table) => [
	index("idx_workflow_executions_status").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("idx_workflow_executions_workflow_id").using("btree", table.workflowId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.workflowId],
			foreignColumns: [automationWorkflows.id],
			name: "workflow_executions_workflow_id_automation_workflows_id_fk"
		}).onDelete("cascade"),
]);

export const actionExecutions = pgTable("action_executions", {
	id: serial().primaryKey().notNull(),
	executionId: integer("execution_id").notNull(),
	actionType: actionType("action_type").notNull(),
	actionConfig: jsonb("action_config").notNull(),
	status: executionStatus().default('pending').notNull(),
	result: jsonb(),
	errorMessage: text("error_message"),
	startedAt: timestamp("started_at", { mode: 'string' }).defaultNow(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	duration: integer(),
}, (table) => [
	index("idx_action_executions_execution_id").using("btree", table.executionId.asc().nullsLast().op("int4_ops")),
	index("idx_action_executions_status").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.executionId],
			foreignColumns: [workflowExecutions.id],
			name: "action_executions_execution_id_workflow_executions_id_fk"
		}).onDelete("cascade"),
]);

export const formSubmissions = pgTable("form_submissions", {
	id: serial().primaryKey().notNull(),
	formName: varchar("form_name", { length: 255 }).notNull(),
	submissionData: jsonb("submission_data").notNull(),
	sourceForm: varchar("source_form", { length: 255 }).notNull(),
	zohoModule: varchar("zoho_module", { length: 100 }).default('Leads').notNull(),
	zohoCrmId: varchar("zoho_crm_id", { length: 100 }),
	processingStatus: processingStatus("processing_status").default('pending').notNull(),
	syncStatus: syncStatus("sync_status").default('pending').notNull(),
	errorMessage: text("error_message"),
	retryCount: integer("retry_count").default(0).notNull(),
	lastRetryAt: timestamp("last_retry_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	nextRetryAt: timestamp("next_retry_at", { mode: 'string' }),
	lastSyncAt: timestamp("last_sync_at", { mode: 'string' }),
}, (table) => [
	index("idx_form_submissions_form_name").using("btree", table.formName.asc().nullsLast().op("text_ops")),
	index("idx_form_submissions_processing_status").using("btree", table.processingStatus.asc().nullsLast().op("enum_ops")),
	index("idx_form_submissions_sync_status").using("btree", table.syncStatus.asc().nullsLast().op("enum_ops")),
	index("idx_form_submissions_zoho_crm_id").using("btree", table.zohoCrmId.asc().nullsLast().op("text_ops")),
	index("idx_form_submissions_zoho_module").using("btree", table.zohoModule.asc().nullsLast().op("text_ops")),
]);

export const submissionLogs = pgTable("submission_logs", {
	id: serial().primaryKey().notNull(),
	submissionId: integer("submission_id").notNull(),
	operation: operation().notNull(),
	status: logStatus().notNull(),
	details: jsonb(),
	errorMessage: text("error_message"),
	duration: integer(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_submission_logs_submission_id").using("btree", table.submissionId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.submissionId],
			foreignColumns: [formSubmissions.id],
			name: "submission_logs_submission_id_form_submissions_id_fk"
		}).onDelete("cascade"),
]);

export const automationWorkflows = pgTable("automation_workflows", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	triggerType: triggerType("trigger_type").notNull(),
	triggerConfig: jsonb("trigger_config").notNull(),
	conditions: jsonb(),
	actions: jsonb().notNull(),
	status: workflowStatus().default('active').notNull(),
	executionCount: integer("execution_count").default(0).notNull(),
	lastExecutedAt: timestamp("last_executed_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_automation_workflows_status").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("idx_automation_workflows_trigger_type").using("btree", table.triggerType.asc().nullsLast().op("enum_ops")),
]);

export const appliedMigrations = pgTable("applied_migrations", {
	id: serial().primaryKey().notNull(),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	appliedAt: timestamp("applied_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	unique("applied_migrations_migration_name_key").on(table.migrationName),
]);
