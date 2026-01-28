import { storage } from "./storage";
import { zohoCRMService } from "./zoho-crm-service";
import { zohoCampaignsService } from "./zoho-campaigns-service";
import { TemplateResolver } from "./template-resolver";
import type { AutomationWorkflow, InsertWorkflowExecution, InsertActionExecution } from "@shared/schema";

interface TriggerEvaluationResult {
  shouldExecute: boolean;
  triggerData?: any;
}

interface ActionExecutionResult {
  success: boolean;
  result?: any;
  error?: string;
}

class WorkflowExecutionEngine {
  async evaluateTrigger(workflow: AutomationWorkflow, context: any = {}): Promise<TriggerEvaluationResult> {
    const { triggerType, triggerConfig } = workflow;

    switch (triggerType) {
      case "manual":
        return { shouldExecute: true, triggerData: context };

      case "crm_record_created":
        return this.evaluateCRMRecordCreated(triggerConfig, context);

      case "crm_record_updated":
        return this.evaluateCRMRecordUpdated(triggerConfig, context);

      case "crm_field_changed":
        return this.evaluateCRMFieldChanged(triggerConfig, context);

      case "scheduled":
        return this.evaluateScheduled(triggerConfig, context);

      default:
        console.warn(`[Workflow Engine] Unknown trigger type: ${triggerType}`);
        return { shouldExecute: false };
    }
  }

  private async evaluateCRMRecordCreated(config: any, context: any): Promise<TriggerEvaluationResult> {
    const { module, conditions } = config;

    if (context.module !== module) {
      return { shouldExecute: false };
    }

    if (conditions && !this.evaluateConditions(conditions, context.record)) {
      return { shouldExecute: false };
    }

    return { shouldExecute: true, triggerData: context };
  }

  private async evaluateCRMRecordUpdated(config: any, context: any): Promise<TriggerEvaluationResult> {
    const { module, conditions } = config;

    if (context.module !== module) {
      return { shouldExecute: false };
    }

    if (conditions && !this.evaluateConditions(conditions, context.record)) {
      return { shouldExecute: false };
    }

    return { shouldExecute: true, triggerData: context };
  }

  private async evaluateCRMFieldChanged(config: any, context: any): Promise<TriggerEvaluationResult> {
    const { module, field, conditions } = config;

    if (context.module !== module) {
      return { shouldExecute: false };
    }

    if (context.changedFields && !context.changedFields.includes(field)) {
      return { shouldExecute: false };
    }

    if (conditions && !this.evaluateConditions(conditions, context.record)) {
      return { shouldExecute: false };
    }

    return { shouldExecute: true, triggerData: context };
  }

  private async evaluateScheduled(config: any, context: any): Promise<TriggerEvaluationResult> {
    return { shouldExecute: true, triggerData: { scheduledAt: new Date(), ...context } };
  }

  private evaluateConditions(conditions: any[], record: any): boolean {
    return conditions.every(condition => {
      const { field, operator, value } = condition;
      const recordValue = record[field];

      switch (operator) {
        case "equals":
          return recordValue === value;
        case "not_equals":
          return recordValue !== value;
        case "contains":
          return recordValue && recordValue.toString().includes(value);
        case "not_contains":
          return !recordValue || !recordValue.toString().includes(value);
        case "greater_than":
          return recordValue > value;
        case "less_than":
          return recordValue < value;
        case "is_empty":
          return !recordValue || recordValue === "";
        case "is_not_empty":
          return recordValue && recordValue !== "";
        default:
          console.warn(`[Workflow Engine] Unknown operator: ${operator}`);
          return false;
      }
    });
  }

  async executeWorkflow(workflowId: number, context: any = {}): Promise<number> {
    const workflow = await storage.getAutomationWorkflow(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    if (workflow.status !== "active") {
      throw new Error(`Workflow ${workflowId} is not active`);
    }

    console.log(`[Workflow Engine] Executing workflow: ${workflow.name} (ID: ${workflowId})`);

    const evaluation = await this.evaluateTrigger(workflow, context);
    if (!evaluation.shouldExecute) {
      console.log(`[Workflow Engine] Trigger conditions not met for workflow ${workflowId} - creating skipped execution`);
      
      const executionData: InsertWorkflowExecution = {
        workflowId: workflow.id,
        status: "skipped",
        triggerData: evaluation.triggerData,
        executionContext: context,
      };

      const execution = await storage.createWorkflowExecution(executionData);
      await storage.updateWorkflowExecution(execution.id, {
        status: "skipped",
        errorMessage: "Trigger conditions not met",
        completedAt: new Date(),
        duration: 0,
      });
      
      return execution.id;
    }

    const executionData: InsertWorkflowExecution = {
      workflowId: workflow.id,
      status: "running",
      triggerData: evaluation.triggerData,
      executionContext: context,
    };

    const execution = await storage.createWorkflowExecution(executionData);
    const startTime = Date.now();

    try {
      const globalConditions = workflow.conditions as any[] || [];
      if (globalConditions.length > 0) {
        const conditionsPass = this.evaluateConditions(globalConditions, context.record || context);
        if (!conditionsPass) {
          await storage.updateWorkflowExecution(execution.id, {
            status: "skipped",
            errorMessage: "Global conditions not met",
            completedAt: new Date(),
            duration: Date.now() - startTime,
          });
          return execution.id;
        }
      }

      const actions = workflow.actions as any[];
      let executionContextData = { 
        ...context, 
        ...evaluation.triggerData,
        NOW: new Date().toISOString(),
        TODAY: new Date().toISOString().split('T')[0],
        TIMESTAMP: Date.now(),
      };

      for (const action of actions) {
        const resolvedAction = TemplateResolver.resolveObject(action, executionContextData);
        const actionResult = await this.executeAction(execution.id, resolvedAction, executionContextData);
        
        if (!actionResult.success) {
          await storage.updateWorkflowExecution(execution.id, {
            status: "failed",
            errorMessage: `Action failed: ${actionResult.error}`,
            completedAt: new Date(),
            duration: Date.now() - startTime,
          });
          throw new Error(`Action execution failed: ${actionResult.error}`);
        }

        executionContextData = { ...executionContextData, ...actionResult.result };
      }

      await storage.updateWorkflowExecution(execution.id, {
        status: "completed",
        completedAt: new Date(),
        duration: Date.now() - startTime,
      });

      await storage.incrementExecutionCount(workflow.id);

      console.log(`[Workflow Engine] Successfully completed workflow ${workflowId}, execution ${execution.id}`);
      return execution.id;

    } catch (error) {
      console.error(`[Workflow Engine] Error executing workflow ${workflowId}:`, error);
      await storage.updateWorkflowExecution(execution.id, {
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
        duration: Date.now() - startTime,
      });
      throw error;
    }
  }

  private async executeAction(executionId: number, action: any, context: any): Promise<ActionExecutionResult> {
    const { type, config } = action;
    
    const actionExecution: InsertActionExecution = {
      executionId,
      actionType: type,
      actionConfig: config,
      status: "running",
    };

    const actionRecord = await storage.createActionExecution(actionExecution);
    const startTime = Date.now();

    try {
      let result: any;

      switch (type) {
        case "add_to_campaign":
          result = await this.executeAddToCampaign(config, context);
          break;
        case "send_email":
          result = await this.executeSendEmail(config, context);
          break;
        case "update_crm_field":
          result = await this.executeUpdateCRMField(config, context);
          break;
        case "create_crm_record":
          result = await this.executeCreateCRMRecord(config, context);
          break;
        case "wait":
          result = await this.executeWait(config);
          break;
        case "http_request":
          result = await this.executeHttpRequest(config, context);
          break;
        default:
          throw new Error(`Unknown action type: ${type}`);
      }

      await storage.updateActionExecution(actionRecord.id, {
        status: "completed",
        result,
        completedAt: new Date(),
        duration: Date.now() - startTime,
      });

      return { success: true, result };

    } catch (error) {
      console.error(`[Workflow Engine] Action execution error:`, error);
      await storage.updateActionExecution(actionRecord.id, {
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
        duration: Date.now() - startTime,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  private async executeAddToCampaign(config: any, context: any): Promise<any> {
    const { listKey, email, firstName, lastName, additionalFields } = config;
    
    const contactEmail = email || context.record?.Email || context.email;
    if (!contactEmail) {
      throw new Error("No email address provided for add_to_campaign action");
    }

    const contactInfo: any = {
      email: contactEmail,
      firstName: firstName || context.record?.First_Name || context.firstName,
      lastName: lastName || context.record?.Last_Name || context.lastName,
    };

    if (additionalFields) {
      Object.assign(contactInfo, additionalFields);
    }

    const result = await zohoCampaignsService.addSubscriber(listKey, contactInfo);
    console.log(`[Workflow Engine] Added subscriber ${contactEmail} to list ${listKey}`);
    return { subscriberAdded: true, email: contactEmail, listKey, response: result };
  }

  private async executeSendEmail(config: any, context: any): Promise<any> {
    const { campaignKey, scheduleTime } = config;

    if (scheduleTime) {
      const result = await zohoCampaignsService.scheduleCampaign(campaignKey, new Date(scheduleTime));
      console.log(`[Workflow Engine] Scheduled campaign ${campaignKey} for ${scheduleTime}`);
      return { campaignScheduled: true, campaignKey, scheduleTime, response: result };
    } else {
      const result = await zohoCampaignsService.sendCampaign(campaignKey);
      console.log(`[Workflow Engine] Sent campaign ${campaignKey}`);
      return { campaignSent: true, campaignKey, response: result };
    }
  }

  private async executeUpdateCRMField(config: any, context: any): Promise<any> {
    const { module, recordId, field, value } = config;
    
    const targetRecordId = recordId || context.record?.id || context.recordId;
    if (!targetRecordId) {
      throw new Error("No record ID provided for update_crm_field action");
    }

    const updateData = { [field]: value };
    const result = await zohoCRMService.updateRecord(module, targetRecordId, updateData);
    console.log(`[Workflow Engine] Updated ${module} record ${targetRecordId}, field ${field}`);
    return { recordUpdated: true, module, recordId: targetRecordId, field, value, response: result };
  }

  private async executeCreateCRMRecord(config: any, context: any): Promise<any> {
    const { module, data } = config;
    
    const recordData = { ...data };
    
    Object.keys(recordData).forEach(key => {
      if (typeof recordData[key] === 'string' && recordData[key].startsWith('{{') && recordData[key].endsWith('}}')) {
        const contextKey = recordData[key].slice(2, -2).trim();
        recordData[key] = context.record?.[contextKey] || context[contextKey] || recordData[key];
      }
    });

    const result = await zohoCRMService.createRecord(module, recordData);
    console.log(`[Workflow Engine] Created ${module} record:`, result.id);
    return { recordCreated: true, module, recordId: result.id, response: result };
  }

  private async executeWait(config: any): Promise<any> {
    const { duration } = config;
    await new Promise(resolve => setTimeout(resolve, duration * 1000));
    console.log(`[Workflow Engine] Waited for ${duration} seconds`);
    return { waited: true, duration };
  }

  private async executeHttpRequest(config: any, context: any): Promise<any> {
    const { url, method, headers, body } = config;
    
    let processedBody = body;
    if (typeof body === 'string') {
      processedBody = body.replace(/\{\{(\w+)\}\}/g, (_, key) => {
        return context.record?.[key] || context[key] || '';
      });
    }

    const response = await fetch(url, {
      method: method || 'GET',
      headers: headers || {},
      body: processedBody ? JSON.stringify(processedBody) : undefined,
    });

    const responseData = await response.json();
    console.log(`[Workflow Engine] HTTP ${method || 'GET'} request to ${url}: ${response.status}`);
    return { httpRequestComplete: true, url, status: response.status, response: responseData };
  }

  async executeWorkflowsByTrigger(triggerType: string, context: any): Promise<number[]> {
    const workflows = await storage.getAutomationWorkflows({ status: "active", triggerType });
    const executionIds: number[] = [];

    for (const workflow of workflows) {
      try {
        const executionId = await this.executeWorkflow(workflow.id, context);
        executionIds.push(executionId);
      } catch (error) {
        console.error(`[Workflow Engine] Failed to execute workflow ${workflow.id}:`, error);
      }
    }

    return executionIds;
  }
}

export const workflowExecutionEngine = new WorkflowExecutionEngine();
