import { relations } from "drizzle-orm/relations";
import { automationWorkflows, workflowExecutions, actionExecutions, formSubmissions, submissionLogs } from "./schema";

export const workflowExecutionsRelations = relations(workflowExecutions, ({one, many}) => ({
	automationWorkflow: one(automationWorkflows, {
		fields: [workflowExecutions.workflowId],
		references: [automationWorkflows.id]
	}),
	actionExecutions: many(actionExecutions),
}));

export const automationWorkflowsRelations = relations(automationWorkflows, ({many}) => ({
	workflowExecutions: many(workflowExecutions),
}));

export const actionExecutionsRelations = relations(actionExecutions, ({one}) => ({
	workflowExecution: one(workflowExecutions, {
		fields: [actionExecutions.executionId],
		references: [workflowExecutions.id]
	}),
}));

export const submissionLogsRelations = relations(submissionLogs, ({one}) => ({
	formSubmission: one(formSubmissions, {
		fields: [submissionLogs.submissionId],
		references: [formSubmissions.id]
	}),
}));

export const formSubmissionsRelations = relations(formSubmissions, ({many}) => ({
	submissionLogs: many(submissionLogs),
}));