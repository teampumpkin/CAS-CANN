import { storage } from './storage';
import { reportingService } from './reporting-service';
import { fieldMetadataCacheService } from './field-metadata-cache-service';
import type { FormSubmission } from '@shared/schema';
import { z } from 'zod';

// Notification configuration schema
export const notificationConfigSchema = z.object({
  emailEnabled: z.boolean().default(true),
  weeklyReportEnabled: z.boolean().default(true),
  realTimeAlertsEnabled: z.boolean().default(false),
  alertEmailAddresses: z.array(z.string().email()).default([]),
  reportEmailAddresses: z.array(z.string().email()).default([]),
  weeklyReportDay: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).default('monday'),
  alertThresholds: z.object({
    failureRatePercent: z.number().min(0).max(100).default(10), // Alert if failure rate > 10%
    noSubmissionsHours: z.number().min(1).max(168).default(24), // Alert if no submissions for 24 hours
    syncDelayMinutes: z.number().min(5).max(1440).default(30), // Alert if sync delayed > 30 minutes
  }).default({}),
});

export type NotificationConfig = z.infer<typeof notificationConfigSchema>;

export interface WeeklyReportSummary {
  weekOf: string;
  totalSubmissions: number;
  successfulSync: number;
  failedSync: number;
  successRate: number;
  topForms: Array<{ formName: string; count: number }>;
  errorSummary: Array<{ error: string; count: number }>;
  processingStats: {
    averageProcessingTime: number;
    slowestForms: Array<{ formName: string; avgTime: number }>;
  };
  recommendations: string[];
}

export interface AlertNotification {
  id: string;
  type: 'failure_rate' | 'no_submissions' | 'sync_delay' | 'oauth_issue';
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  details: any;
  createdAt: Date;
  resolved: boolean;
}

export class NotificationService {
  private static instance: NotificationService;
  private config: NotificationConfig;
  private weeklyTimer?: NodeJS.Timeout;
  private alertTimer?: NodeJS.Timeout;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  constructor() {
    // Default configuration - in production this would come from database
    this.config = notificationConfigSchema.parse({
      alertEmailAddresses: ['admin@amyloid.ca'], // Default admin email
      reportEmailAddresses: ['admin@amyloid.ca'],
    });

    this.initialize();
  }

  /**
   * Initialize notification service and start timers
   */
  private async initialize() {
    console.log('[Notifications] Initializing notification service...');
    
    try {
      // Load configuration from database or environment
      await this.loadConfiguration();
      
      // Start weekly report timer if enabled
      if (this.config.weeklyReportEnabled) {
        this.scheduleWeeklyReports();
      }
      
      // Start real-time alert monitoring if enabled
      if (this.config.realTimeAlertsEnabled) {
        this.startAlertMonitoring();
      }

      console.log('[Notifications] Service initialized successfully');
      console.log(`[Notifications] Weekly reports: ${this.config.weeklyReportEnabled ? 'ENABLED' : 'DISABLED'}`);
      console.log(`[Notifications] Real-time alerts: ${this.config.realTimeAlertsEnabled ? 'ENABLED' : 'DISABLED'}`);

    } catch (error) {
      console.error('[Notifications] Failed to initialize:', error);
    }
  }

  /**
   * Load notification configuration
   */
  private async loadConfiguration() {
    // In production, this would load from database
    // For now, using environment variables and defaults
    const emailAddresses = process.env.NOTIFICATION_EMAILS?.split(',') || ['admin@amyloid.ca'];
    
    this.config = notificationConfigSchema.parse({
      emailEnabled: process.env.NOTIFICATIONS_ENABLED !== 'false',
      weeklyReportEnabled: process.env.WEEKLY_REPORTS_ENABLED !== 'false',
      realTimeAlertsEnabled: process.env.REAL_TIME_ALERTS_ENABLED === 'true',
      alertEmailAddresses: emailAddresses,
      reportEmailAddresses: emailAddresses,
    });
  }

  /**
   * Schedule weekly reports
   */
  private scheduleWeeklyReports() {
    const now = new Date();
    const targetDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(this.config.weeklyReportDay);
    
    // Calculate next occurrence of the target day at 9:00 AM
    const nextReport = new Date(now);
    nextReport.setDate(now.getDate() + (targetDay - now.getDay() + 7) % 7);
    nextReport.setHours(9, 0, 0, 0);
    
    // If the target day is today but time has passed, schedule for next week
    if (nextReport <= now) {
      nextReport.setDate(nextReport.getDate() + 7);
    }

    const msUntilNext = nextReport.getTime() - now.getTime();
    console.log(`[Notifications] Next weekly report scheduled for: ${nextReport.toISOString()}`);

    this.weeklyTimer = setTimeout(async () => {
      await this.sendWeeklyReport();
      // Schedule next week's report
      this.scheduleWeeklyReports();
    }, msUntilNext);
  }

  /**
   * Start alert monitoring
   */
  private startAlertMonitoring() {
    // Check alerts every 5 minutes
    this.alertTimer = setInterval(async () => {
      await this.checkAlerts();
    }, 5 * 60 * 1000);
    
    console.log('[Notifications] Real-time alert monitoring started (5-minute intervals)');
  }

  /**
   * Generate and send weekly report
   */
  async sendWeeklyReport(): Promise<WeeklyReportSummary> {
    console.log('[Notifications] Generating weekly report...');
    
    try {
      const weekOf = new Date();
      weekOf.setDate(weekOf.getDate() - 7); // Last week
      
      const summary = await this.generateWeeklyReportSummary(weekOf);
      
      if (this.config.emailEnabled && this.config.reportEmailAddresses.length > 0) {
        await this.sendEmailReport(summary);
      }

      console.log('[Notifications] Weekly report generated and sent successfully');
      return summary;

    } catch (error) {
      console.error('[Notifications] Failed to generate weekly report:', error);
      throw error;
    }
  }

  /**
   * Generate weekly report summary
   */
  async generateWeeklyReportSummary(weekOf: Date): Promise<WeeklyReportSummary> {
    const weekStart = new Date(weekOf);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    // Get report data for the week
    const report = await reportingService.generateReport({
      dateFrom: weekStart.toISOString(),
      dateTo: weekEnd.toISOString(),
      includeCustomFields: false,
      limit: 1000,
    });

    const submissions = report.submissions.map(s => s.submission);

    // Calculate stats
    const totalSubmissions = submissions.length;
    const successfulSync = submissions.filter(s => s.syncStatus === 'synced').length;
    const failedSync = submissions.filter(s => s.syncStatus === 'failed').length;
    const successRate = totalSubmissions > 0 ? (successfulSync / totalSubmissions) * 100 : 0;

    // Top forms
    const formCounts: { [formName: string]: number } = {};
    submissions.forEach(s => {
      formCounts[s.formName] = (formCounts[s.formName] || 0) + 1;
    });
    const topForms = Object.entries(formCounts)
      .map(([formName, count]) => ({ formName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Error summary
    const errorCounts: { [error: string]: number } = {};
    submissions.filter(s => s.errorMessage).forEach(s => {
      const error = s.errorMessage!.substring(0, 100); // Truncate long errors
      errorCounts[error] = (errorCounts[error] || 0) + 1;
    });
    const errorSummary = Object.entries(errorCounts)
      .map(([error, count]) => ({ error, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Processing stats
    const completedSubmissions = submissions.filter(s => s.processingStatus === 'completed');
    const averageProcessingTime = completedSubmissions.length > 0
      ? completedSubmissions.reduce((sum, s) => {
          const time = s.updatedAt && s.createdAt 
            ? s.updatedAt.getTime() - s.createdAt.getTime()
            : 0;
          return sum + time;
        }, 0) / completedSubmissions.length
      : 0;

    const formProcessingTimes: { [formName: string]: { total: number; count: number } } = {};
    completedSubmissions.forEach(s => {
      if (s.updatedAt && s.createdAt) {
        const time = s.updatedAt.getTime() - s.createdAt.getTime();
        if (!formProcessingTimes[s.formName]) {
          formProcessingTimes[s.formName] = { total: 0, count: 0 };
        }
        formProcessingTimes[s.formName].total += time;
        formProcessingTimes[s.formName].count += 1;
      }
    });

    const slowestForms = Object.entries(formProcessingTimes)
      .map(([formName, stats]) => ({
        formName,
        avgTime: stats.total / stats.count,
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 3);

    // Generate recommendations
    const recommendations: string[] = [];
    if (successRate < 90) {
      recommendations.push(`Success rate is ${successRate.toFixed(1)}% - investigate sync failures`);
    }
    if (averageProcessingTime > 30000) {
      recommendations.push(`Average processing time is ${(averageProcessingTime / 1000).toFixed(1)}s - consider optimization`);
    }
    if (errorSummary.length > 0) {
      recommendations.push(`${errorSummary.length} error types detected - review error patterns`);
    }
    if (totalSubmissions === 0) {
      recommendations.push('No submissions this week - verify form integration is working');
    }

    return {
      weekOf: weekStart.toISOString().split('T')[0],
      totalSubmissions,
      successfulSync,
      failedSync,
      successRate: Math.round(successRate * 100) / 100,
      topForms,
      errorSummary,
      processingStats: {
        averageProcessingTime: Math.round(averageProcessingTime),
        slowestForms,
      },
      recommendations,
    };
  }

  /**
   * Check for alert conditions
   */
  private async checkAlerts() {
    try {
      console.log('[Notifications] Checking alert conditions...');

      const alerts: AlertNotification[] = [];

      // Check failure rate
      const recentReport = await reportingService.generateReport({
        dateFrom: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last 24 hours
        includeCustomFields: false,
        limit: 1000,
      });

      const recentSubmissions = recentReport.submissions.map(s => s.submission);
      const failureRate = recentSubmissions.length > 0
        ? (recentSubmissions.filter(s => s.syncStatus === 'failed').length / recentSubmissions.length) * 100
        : 0;

      if (failureRate > this.config.alertThresholds.failureRatePercent) {
        alerts.push({
          id: `failure-rate-${Date.now()}`,
          type: 'failure_rate',
          severity: failureRate > 50 ? 'high' : failureRate > 25 ? 'medium' : 'low',
          title: 'High Failure Rate Detected',
          message: `Current failure rate is ${failureRate.toFixed(1)}% (threshold: ${this.config.alertThresholds.failureRatePercent}%)`,
          details: {
            failureRate,
            threshold: this.config.alertThresholds.failureRatePercent,
            recentSubmissions: recentSubmissions.length,
            recentFailures: recentSubmissions.filter(s => s.syncStatus === 'failed').length,
          },
          createdAt: new Date(),
          resolved: false,
        });
      }

      // Check for no submissions
      const hoursThreshold = this.config.alertThresholds.noSubmissionsHours;
      const cutoffTime = new Date(Date.now() - hoursThreshold * 60 * 60 * 1000);
      const recentSubmissionsCount = recentSubmissions.filter(s => 
        s.createdAt && new Date(s.createdAt) > cutoffTime
      ).length;

      if (recentSubmissionsCount === 0) {
        alerts.push({
          id: `no-submissions-${Date.now()}`,
          type: 'no_submissions',
          severity: 'medium',
          title: 'No Recent Submissions',
          message: `No form submissions received in the last ${hoursThreshold} hours`,
          details: {
            hoursThreshold,
            lastSubmissionTime: recentSubmissions.length > 0 
              ? Math.max(...recentSubmissions.map(s => s.createdAt?.getTime() || 0))
              : null,
          },
          createdAt: new Date(),
          resolved: false,
        });
      }

      // Send alerts if any were generated
      if (alerts.length > 0) {
        console.log(`[Notifications] Generated ${alerts.length} alerts`);
        if (this.config.emailEnabled) {
          await this.sendAlertEmails(alerts);
        }
      } else {
        console.log('[Notifications] No alerts triggered');
      }

    } catch (error) {
      console.error('[Notifications] Error checking alerts:', error);
    }
  }

  /**
   * Send email report (mock implementation - would use real email service in production)
   */
  private async sendEmailReport(summary: WeeklyReportSummary): Promise<void> {
    console.log('[Notifications] Sending weekly email report...');
    
    // Mock email content - in production would use email template service
    const emailContent = this.generateEmailReportContent(summary);
    
    // Log the email content (in production, this would actually send the email)
    console.log('[Email] Weekly Report Email Content:');
    console.log('-----------------------------------');
    console.log(`To: ${this.config.reportEmailAddresses.join(', ')}`);
    console.log(`Subject: CANN Lead Capture Weekly Report - Week of ${summary.weekOf}`);
    console.log('-----------------------------------');
    console.log(emailContent);
    console.log('-----------------------------------');
    
    // In production, you would integrate with:
    // - AWS SES
    // - SendGrid
    // - Mailgun
    // - Nodemailer with SMTP
    console.log('[Notifications] ✅ Weekly report email sent (mock)');
  }

  /**
   * Send alert emails
   */
  private async sendAlertEmails(alerts: AlertNotification[]): Promise<void> {
    console.log('[Notifications] Sending alert emails...');
    
    for (const alert of alerts) {
      const emailContent = this.generateAlertEmailContent(alert);
      
      console.log('[Email] Alert Email Content:');
      console.log('----------------------------');
      console.log(`To: ${this.config.alertEmailAddresses.join(', ')}`);
      console.log(`Subject: [${alert.severity.toUpperCase()}] ${alert.title}`);
      console.log('----------------------------');
      console.log(emailContent);
      console.log('----------------------------');
    }
    
    console.log('[Notifications] ✅ Alert emails sent (mock)');
  }

  /**
   * Generate email report content
   */
  private generateEmailReportContent(summary: WeeklyReportSummary): string {
    return `
📊 CANN Lead Capture Weekly Report
Week of ${summary.weekOf}

📈 SUMMARY METRICS
• Total Submissions: ${summary.totalSubmissions}
• Successful Sync: ${summary.successfulSync}
• Failed Sync: ${summary.failedSync}
• Success Rate: ${summary.successRate}%

📋 TOP PERFORMING FORMS
${summary.topForms.map((form, i) => `${i + 1}. ${form.formName}: ${form.count} submissions`).join('\n')}

⚠️ ERROR SUMMARY
${summary.errorSummary.length > 0 
  ? summary.errorSummary.map((error, i) => `${i + 1}. ${error.error}: ${error.count} occurrences`).join('\n')
  : 'No errors reported this week ✅'
}

⏱️ PERFORMANCE STATS
• Average Processing Time: ${(summary.processingStats.averageProcessingTime / 1000).toFixed(1)}s
• Slowest Forms:
${summary.processingStats.slowestForms.map((form, i) => 
  `  ${i + 1}. ${form.formName}: ${(form.avgTime / 1000).toFixed(1)}s`).join('\n')}

💡 RECOMMENDATIONS
${summary.recommendations.length > 0 
  ? summary.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')
  : 'System is performing well! ✅'
}

---
This is an automated report from the CANN Lead Capture System.
For questions or support, contact the technical team.
    `.trim();
  }

  /**
   * Generate alert email content
   */
  private generateAlertEmailContent(alert: AlertNotification): string {
    return `
🚨 CANN Lead Capture Alert

SEVERITY: ${alert.severity.toUpperCase()}
ALERT TYPE: ${alert.type.replace('_', ' ').toUpperCase()}

${alert.message}

DETAILS:
${JSON.stringify(alert.details, null, 2)}

TIMESTAMP: ${alert.createdAt.toISOString()}

---
This is an automated alert from the CANN Lead Capture System.
Please investigate and resolve this issue promptly.
    `.trim();
  }

  /**
   * Update notification configuration
   */
  async updateConfiguration(newConfig: Partial<NotificationConfig>): Promise<void> {
    this.config = notificationConfigSchema.parse({ ...this.config, ...newConfig });
    
    // Restart timers with new configuration
    if (this.weeklyTimer) {
      clearTimeout(this.weeklyTimer);
      this.weeklyTimer = undefined;
    }
    if (this.alertTimer) {
      clearInterval(this.alertTimer);
      this.alertTimer = undefined;
    }
    
    // Reinitialize
    await this.initialize();
    
    console.log('[Notifications] Configuration updated and service restarted');
  }

  /**
   * Get current configuration
   */
  getConfiguration(): NotificationConfig {
    return { ...this.config };
  }

  /**
   * Manually trigger weekly report generation
   */
  async generateWeeklyReportNow(): Promise<WeeklyReportSummary> {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    return await this.generateWeeklyReportSummary(lastWeek);
  }

  /**
   * Manually trigger alert check
   */
  async checkAlertsNow(): Promise<void> {
    await this.checkAlerts();
  }

  /**
   * Export CSV report via email
   */
  async sendCSVReport(filters: any = {}): Promise<void> {
    console.log('[Notifications] Generating CSV report for email...');
    
    try {
      const csvContent = await reportingService.exportReportAsCSV(filters);
      
      // In production, this would attach the CSV to an email
      console.log('[Email] CSV Report Email:');
      console.log('To: ', this.config.reportEmailAddresses.join(', '));
      console.log('Subject: CANN Lead Capture Data Export');
      console.log('CSV Content Length:', csvContent.length);
      console.log('✅ CSV report prepared for email delivery');
      
    } catch (error) {
      console.error('[Notifications] Failed to generate CSV report:', error);
      throw error;
    }
  }

  /**
   * Cleanup timers on service shutdown
   */
  destroy(): void {
    if (this.weeklyTimer) {
      clearTimeout(this.weeklyTimer);
    }
    if (this.alertTimer) {
      clearInterval(this.alertTimer);
    }
    console.log('[Notifications] Service destroyed and timers cleared');
  }
}

export const notificationService = NotificationService.getInstance();