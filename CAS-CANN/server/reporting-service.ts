import { storage } from './storage';
import { zohoCRMService } from './zoho-crm-service';
import { fieldMetadataCacheService } from './field-metadata-cache-service';
import type { FormSubmission } from '@shared/schema';
import { z } from 'zod';

// Report request validation schemas
export const reportFiltersSchema = z.object({
  formName: z.string().optional(),
  zohoModule: z.enum(['Leads', 'Contacts']).optional(),
  processingStatus: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
  syncStatus: z.enum(['pending', 'synced', 'failed']).optional(),
  dateFrom: z.string().optional(), // ISO date string
  dateTo: z.string().optional(),
  includeCustomFields: z.boolean().default(false),
  groupBy: z.enum(['form_name', 'date', 'status']).optional(),
  limit: z.number().min(1).max(1000).default(100),
});

export type ReportFilters = z.infer<typeof reportFiltersSchema>;

export interface ReportMetrics {
  totalSubmissions: number;
  successfulSubmissions: number;
  failedSubmissions: number;
  pendingSubmissions: number;
  successRate: number;
  averageProcessingTime: number; // in milliseconds
  topFormsByVolume: Array<{ formName: string; count: number }>;
  submissionsByStatus: Array<{ status: string; count: number }>;
  dailySubmissions: Array<{ date: string; count: number }>;
}

export interface CRMFieldValue {
  fieldName: string;
  fieldLabel: string;
  value: any;
  isCustomField: boolean;
}

export interface EnhancedSubmissionRecord {
  submission: FormSubmission;
  crmFields?: CRMFieldValue[];
  zohoCrmData?: any;
}

export interface ReportResponse {
  metadata: {
    totalRecords: number;
    filteredRecords: number;
    generatedAt: string;
    filters: ReportFilters;
  };
  metrics: ReportMetrics;
  submissions: EnhancedSubmissionRecord[];
}

export class ReportingService {
  private static instance: ReportingService;

  static getInstance(): ReportingService {
    if (!ReportingService.instance) {
      ReportingService.instance = new ReportingService();
    }
    return ReportingService.instance;
  }

  /**
   * Generate comprehensive report with metrics and data
   */
  async generateReport(filters: ReportFilters): Promise<ReportResponse> {
    console.log('[Reports] Generating report with filters:', filters);
    
    const startTime = Date.now();

    try {
      // Get form submissions from database
      const submissions = await this.getFormSubmissions(filters);
      console.log(`[Reports] Retrieved ${submissions.length} form submissions`);

      // Generate metrics
      const metrics = await this.calculateMetrics(submissions, filters);

      // Enhance submissions with CRM data if requested
      let enhancedSubmissions: EnhancedSubmissionRecord[] = [];
      if (filters.includeCustomFields && submissions.length > 0) {
        enhancedSubmissions = await this.enhanceWithCRMData(submissions.slice(0, filters.limit));
      } else {
        enhancedSubmissions = submissions.slice(0, filters.limit).map(s => ({ submission: s }));
      }

      const report: ReportResponse = {
        metadata: {
          totalRecords: submissions.length,
          filteredRecords: enhancedSubmissions.length,
          generatedAt: new Date().toISOString(),
          filters,
        },
        metrics,
        submissions: enhancedSubmissions,
      };

      const duration = Date.now() - startTime;
      console.log(`[Reports] Report generated in ${duration}ms`);

      return report;

    } catch (error) {
      console.error('[Reports] Error generating report:', error);
      throw error;
    }
  }

  /**
   * Get form submissions with filters
   */
  private async getFormSubmissions(filters: ReportFilters): Promise<FormSubmission[]> {
    const dbFilters: any = {};

    if (filters.formName) {
      dbFilters.formName = filters.formName;
    }
    if (filters.zohoModule) {
      dbFilters.zohoModule = filters.zohoModule;
    }
    if (filters.processingStatus) {
      dbFilters.processingStatus = filters.processingStatus;
    }
    if (filters.syncStatus) {
      dbFilters.syncStatus = filters.syncStatus;
    }
    if (filters.dateFrom) {
      dbFilters.dateFrom = new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      dbFilters.dateTo = new Date(filters.dateTo);
    }

    return await storage.getFormSubmissions(dbFilters);
  }

  /**
   * Calculate comprehensive metrics from submissions
   */
  private async calculateMetrics(submissions: FormSubmission[], filters: ReportFilters): Promise<ReportMetrics> {
    const totalSubmissions = submissions.length;
    const successfulSubmissions = submissions.filter(s => s.syncStatus === 'synced').length;
    const failedSubmissions = submissions.filter(s => s.syncStatus === 'failed').length;
    const pendingSubmissions = submissions.filter(s => s.syncStatus === 'pending').length;
    const successRate = totalSubmissions > 0 ? (successfulSubmissions / totalSubmissions) * 100 : 0;

    // Calculate average processing time (for completed submissions)
    const completedSubmissions = submissions.filter(s => s.processingStatus === 'completed');
    const averageProcessingTime = completedSubmissions.length > 0
      ? completedSubmissions.reduce((sum, s) => {
          const processingTime = s.updatedAt && s.createdAt 
            ? s.updatedAt.getTime() - s.createdAt.getTime()
            : 0;
          return sum + processingTime;
        }, 0) / completedSubmissions.length
      : 0;

    // Top forms by volume
    const formCounts: { [formName: string]: number } = {};
    submissions.forEach(s => {
      formCounts[s.formName] = (formCounts[s.formName] || 0) + 1;
    });
    const topFormsByVolume = Object.entries(formCounts)
      .map(([formName, count]) => ({ formName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Submissions by status
    const statusCounts: { [status: string]: number } = {};
    submissions.forEach(s => {
      const key = `${s.processingStatus}_${s.syncStatus}`;
      statusCounts[key] = (statusCounts[key] || 0) + 1;
    });
    const submissionsByStatus = Object.entries(statusCounts)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

    // Daily submissions (last 30 days)
    const dailySubmissions: Array<{ date: string; count: number }> = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const count = submissions.filter(s => {
        const submissionDate = s.createdAt?.toISOString().split('T')[0] || '';
        return submissionDate === dateStr;
      }).length;
      
      dailySubmissions.push({ date: dateStr, count });
    }

    return {
      totalSubmissions,
      successfulSubmissions,
      failedSubmissions,
      pendingSubmissions,
      successRate: Math.round(successRate * 100) / 100, // round to 2 decimal places
      averageProcessingTime: Math.round(averageProcessingTime),
      topFormsByVolume,
      submissionsByStatus,
      dailySubmissions,
    };
  }

  /**
   * Enhance submissions with CRM field data
   */
  private async enhanceWithCRMData(submissions: FormSubmission[]): Promise<EnhancedSubmissionRecord[]> {
    const enhanced: EnhancedSubmissionRecord[] = [];

    for (const submission of submissions) {
      const record: EnhancedSubmissionRecord = { submission };

      // Get field metadata for this module
      const cachedFields = await fieldMetadataCacheService.getCachedFields(submission.zohoModule);

      if (cachedFields.length > 0) {
        // Map submission data to CRM fields
        const crmFields: CRMFieldValue[] = [];
        const submissionData = submission.submissionData as any;

        for (const [key, value] of Object.entries(submissionData)) {
          // Find matching field in cache
          const fieldMetadata = cachedFields.find(f => 
            f.fieldApiName.toLowerCase() === key.toLowerCase() ||
            f.fieldLabel.toLowerCase().includes(key.toLowerCase())
          );

          if (fieldMetadata) {
            crmFields.push({
              fieldName: fieldMetadata.fieldApiName,
              fieldLabel: fieldMetadata.fieldLabel,
              value,
              isCustomField: fieldMetadata.isCustomField,
            });
          }
        }

        record.crmFields = crmFields;
      }

      // If submission was synced to Zoho, try to get the actual CRM data
      if (submission.zohoCrmId && submission.syncStatus === 'synced') {
        try {
          const crmRecord = await zohoCRMService.getRecord(submission.zohoModule, submission.zohoCrmId);
          if (crmRecord) {
            record.zohoCrmData = crmRecord;
          }
        } catch (error) {
          console.warn(`[Reports] Could not fetch CRM data for record ${submission.zohoCrmId}:`, error);
        }
      }

      enhanced.push(record);
    }

    return enhanced;
  }

  /**
   * Query Zoho CRM using COQL (Zoho's SQL-like query language)
   */
  async executeZohoQuery(coqlQuery: string): Promise<any> {
    console.log('[Reports] Executing Zoho COQL query:', coqlQuery);
    
    try {
      // Use Zoho's query API endpoint
      const response = await (zohoCRMService as any).makeRequest('/coql', 'POST', {
        select_query: coqlQuery
      });

      console.log('[Reports] COQL query executed successfully');
      return response;

    } catch (error) {
      console.error('[Reports] COQL query failed:', error);
      throw new Error(`COQL query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get lead summary from Zoho CRM using COQL
   */
  async getLeadSummaryFromCRM(filters: {
    dateFrom?: string;
    dateTo?: string;
    sourceForm?: string;
  } = {}): Promise<{
    totalLeads: number;
    leadsByStatus: Array<{ status: string; count: number }>;
    leadsBySource: Array<{ source: string; count: number }>;
    recentLeads: Array<any>;
  }> {
    try {
      const baseQuery = "SELECT id, Full_Name, Email, Lead_Status, Lead_Source, Created_Time, Source_Form FROM Leads";
      let whereClause = "WHERE Created_Time IS NOT NULL";
      
      if (filters.dateFrom) {
        whereClause += ` AND Created_Time >= '${filters.dateFrom}'`;
      }
      if (filters.dateTo) {
        whereClause += ` AND Created_Time <= '${filters.dateTo}'`;
      }
      if (filters.sourceForm) {
        whereClause += ` AND Source_Form = '${filters.sourceForm}'`;
      }
      
      const fullQuery = `${baseQuery} ${whereClause} ORDER BY Created_Time DESC LIMIT 1000`;
      const result = await this.executeZohoQuery(fullQuery);
      
      const leads = result.data || [];
      
      // Aggregate data
      const totalLeads = leads.length;
      
      const leadsByStatus: { [status: string]: number } = {};
      const leadsBySource: { [source: string]: number } = {};
      
      leads.forEach((lead: any) => {
        // Count by status
        const status = lead.Lead_Status || 'Unknown';
        leadsByStatus[status] = (leadsByStatus[status] || 0) + 1;
        
        // Count by source
        const source = lead.Source_Form || lead.Lead_Source || 'Unknown';
        leadsBySource[source] = (leadsBySource[source] || 0) + 1;
      });

      return {
        totalLeads,
        leadsByStatus: Object.entries(leadsByStatus).map(([status, count]) => ({ status, count })),
        leadsBySource: Object.entries(leadsBySource).map(([source, count]) => ({ source, count })),
        recentLeads: leads.slice(0, 10), // Most recent 10
      };

    } catch (error) {
      console.error('[Reports] Error getting lead summary from CRM:', error);
      throw error;
    }
  }

  /**
   * Export report data as CSV
   */
  async exportReportAsCSV(filters: ReportFilters): Promise<string> {
    const report = await this.generateReport(filters);
    
    // Create CSV headers
    const headers = [
      'ID', 'Form Name', 'Created At', 'Processing Status', 'Sync Status', 
      'Zoho CRM ID', 'Error Message', 'Retry Count'
    ];
    
    // Add custom field headers if included
    if (filters.includeCustomFields && report.submissions.length > 0) {
      const firstSubmission = report.submissions[0];
      if (firstSubmission.crmFields) {
        firstSubmission.crmFields.forEach(field => {
          headers.push(`CRM_${field.fieldLabel}`);
        });
      }
    }
    
    // Create CSV rows
    const rows = report.submissions.map(item => {
      const s = item.submission;
      const row = [
        s.id,
        s.formName,
        s.createdAt?.toISOString() || '',
        s.processingStatus,
        s.syncStatus,
        s.zohoCrmId || '',
        s.errorMessage || '',
        s.retryCount
      ];
      
      // Add CRM field values if included
      if (item.crmFields) {
        item.crmFields.forEach(field => {
          row.push(String(field.value || ''));
        });
      }
      
      return row;
    });
    
    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    
    return csvContent;
  }
}

export const reportingService = ReportingService.getInstance();