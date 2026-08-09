/**
 * Admin console data endpoints — STRICTLY READ-ONLY.
 *
 * Every handler here issues GET requests to Zoho and nothing else. No POST,
 * PUT, PATCH, or DELETE against the CRM is permitted from this module; writes
 * to Zoho happen only through explicit, manual operator action elsewhere.
 *
 * All routes are behind requireAdmin (session cookie), never the shared
 * automation API key.
 */

import type { Express, Request, Response } from "express";
import { requireAdmin } from "./admin-auth-routes";
import { zohoCRMService } from "./zoho-crm-service";

/** Fields pulled for the Leads list. Keep in sync with the client's LeadRow. */
const LEAD_FIELDS = [
  "id",
  "First_Name",
  "Last_Name",
  "Full_Name",
  "Email",
  "Company",
  "Designation",
  "Lead_Source",
  "Record_Type",
  "Amyloidosis_Type",
  "CAS_Communications",
  "CANN_Communications",
  "CANN_Member",
  "Services_Map_Inclusion",
  "Map_Clinic_Name",
  "Map_City",
  "Map_Province",
  "Created_Time",
  "Form_Submission_Date",
].join(",");

const MAX_PER_PAGE = 200;
const DEFAULT_PER_PAGE = 50;

function clampInt(value: unknown, fallback: number, min: number, max: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

export function registerAdminDataRoutes(app: Express): void {
  /**
   * GET /api/admin/leads
   *
   * Read-only passthrough of Zoho Leads for the console. Returns Zoho's
   * pagination envelope so the client can page without guessing.
   */
  app.get("/api/admin/leads", requireAdmin, async (req: Request, res: Response) => {
    const page = clampInt(req.query.page, 1, 1, 1000);
    const perPage = clampInt(req.query.per_page, DEFAULT_PER_PAGE, 1, MAX_PER_PAGE);

    try {
      const { data, info } = await zohoCRMService.listRecords("Leads", {
        page,
        per_page: perPage,
        fields: LEAD_FIELDS,
        sort_by: "Created_Time",
        sort_order: "desc",
      });

      res.json({
        leads: data.map((r: any) => ({
          id: r.id,
          name:
            r.Full_Name ||
            [r.First_Name, r.Last_Name].filter(Boolean).join(" ") ||
            null,
          email: r.Email ?? null,
          company: r.Company ?? null,
          designation: r.Designation ?? null,
          leadSource: r.Lead_Source ?? null,
          recordType: r.Record_Type ?? null,
          amyloidosisType: r.Amyloidosis_Type ?? null,
          casCommunications: r.CAS_Communications ?? null,
          cannCommunications: r.CANN_Communications ?? null,
          cannMember: r.CANN_Member ?? null,
          servicesMapInclusion: r.Services_Map_Inclusion ?? null,
          mapClinicName: r.Map_Clinic_Name ?? null,
          mapCity: r.Map_City ?? null,
          mapProvince: r.Map_Province ?? null,
          createdTime: r.Form_Submission_Date ?? r.Created_Time ?? null,
        })),
        page,
        perPage,
        count: info?.count ?? data.length,
        moreRecords: info?.more_records ?? false,
      });
    } catch (error: any) {
      const message = String(error?.message ?? error);

      // No OAuth token yet is the expected first-run state — say so plainly
      // instead of surfacing a generic 500.
      if (/no.*token|not authorized|invalid.*token|INVALID_TOKEN|OAUTH/i.test(message)) {
        res.status(503).json({
          code: "zoho_not_connected",
          message:
            "Zoho CRM is not connected. Authorize at /oauth/zoho/connect, then reload.",
        });
        return;
      }

      console.error("[AdminData] Failed to list leads:", message);
      res.status(502).json({
        code: "zoho_error",
        message: "Could not load leads from Zoho CRM.",
      });
    }
  });
}
