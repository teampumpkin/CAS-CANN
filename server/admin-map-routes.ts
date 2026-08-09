/**
 * Services map admin endpoints.
 *
 * Zoho access is READ-ONLY except for one narrowly-scoped write that an admin
 * explicitly triggers: stamping Map_Approved on a Lead when they publish or
 * unpublish it. That write is skipped entirely until the Map_Approved custom
 * field exists in the CRM (see scripts/create-map-approval-field.ts), so the
 * console is fully usable before the schema change lands — approval simply
 * lives in Postgres until then.
 *
 * Nothing here runs on a timer. The only writer to map_clinics is an admin
 * pressing a button.
 */

import type { Express, Request, Response } from "express";
import { requireAdmin } from "./admin-auth-routes";
import { zohoCRMService } from "./zoho-crm-service";
import { storage } from "./storage";
import { ensureMapClinicsTable } from "./migrations/add-map-clinics";

const CANDIDATE_FIELDS = [
  "id",
  "Full_Name",
  "Email",
  "Company",
  "Designation",
  "Services_Map_Inclusion",
  "Map_Clinic_Name",
  "Map_Street",
  "Map_City",
  "Map_Province",
  "Map_Postal_Code",
  "Map_Clinic_Phone",
  "Map_Clinic_Fax",
  "Amyloidosis_Type",
  "Professional_Designation",
  // Zoho's API name for this one is lowercase.
  "subspecialty",
].join(",");

const APPROVAL_FIELD = "Map_Approved";
const ZOHO_PAGE_SIZE = 200;
const MAX_PAGES = 5; // 1000 leads — well beyond current volume

/** Cached so we don't re-read module metadata on every request. */
let approvalFieldExists: boolean | null = null;

async function hasApprovalField(): Promise<boolean> {
  if (approvalFieldExists !== null) return approvalFieldExists;
  try {
    const fields = await zohoCRMService.getModuleFields("Leads");
    approvalFieldExists = fields.some((f) => f.api_name === APPROVAL_FIELD);
  } catch {
    approvalFieldExists = false;
  }
  return approvalFieldExists;
}

function toCandidate(r: any) {
  return {
    zohoRecordId: r.id,
    clinicName: r.Map_Clinic_Name || r.Company || null,
    contactName: r.Full_Name ?? null,
    email: r.Email ?? null,
    designation: r.Professional_Designation ?? r.Designation ?? null,
    subspecialty: r.subspecialty ?? null,
    amyloidosisType: r.Amyloidosis_Type ?? null,
    street: r.Map_Street ?? null,
    city: r.Map_City ?? null,
    province: r.Map_Province ?? null,
    postalCode: r.Map_Postal_Code ?? null,
    phone: r.Map_Clinic_Phone ?? null,
    fax: r.Map_Clinic_Fax ?? null,
    approvalStatus: r[APPROVAL_FIELD] ?? null,
  };
}

function zohoUnavailable(message: string) {
  return /no.*token|not authorized|invalid.*token|INVALID_TOKEN|OAUTH/i.test(message);
}

export function registerAdminMapRoutes(app: Express): void {
  /**
   * GET /api/admin/map/candidates
   * Read-only. Every Lead that opted into the services map, annotated with
   * whether it is already published.
   */
  app.get("/api/admin/map/candidates", requireAdmin, async (_req: Request, res: Response) => {
    try {
      await ensureMapClinicsTable();

      const includeApproval = await hasApprovalField();
      const fields = includeApproval
        ? `${CANDIDATE_FIELDS},${APPROVAL_FIELD}`
        : CANDIDATE_FIELDS;

      const collected: any[] = [];
      for (let page = 1; page <= MAX_PAGES; page++) {
        const { data, info } = await zohoCRMService.listRecords("Leads", {
          page,
          per_page: ZOHO_PAGE_SIZE,
          fields,
        });
        collected.push(...data);
        if (!info?.more_records) break;
      }

      const optedIn = collected
        .filter((r) => r.Services_Map_Inclusion === "Yes")
        .map(toCandidate);

      const published = await storage.getMapClinics();
      const publishedIds = new Set(published.map((p) => p.zohoRecordId));

      res.json({
        candidates: optedIn.filter((c) => !publishedIds.has(c.zohoRecordId)),
        published,
        scanned: collected.length,
        approvalFieldPresent: includeApproval,
      });
    } catch (error: any) {
      const message = String(error?.message ?? error);
      if (zohoUnavailable(message)) {
        res.status(503).json({
          code: "zoho_not_connected",
          message: "Zoho CRM is not connected. Authorize at /oauth/zoho/connect, then reload.",
        });
        return;
      }
      console.error("[AdminMap] candidates failed:", message);
      res.status(502).json({ code: "zoho_error", message: "Could not load map candidates." });
    }
  });

  /**
   * POST /api/admin/map/publish
   * Admin-triggered. Writes the published row to Postgres, then mirrors the
   * decision to Zoho only if Map_Approved exists.
   */
  app.post("/api/admin/map/publish", requireAdmin, async (req: Request, res: Response) => {
    const {
      zohoRecordId, clinicName, street, city, province, postalCode, phone, fax,
      latitude, longitude, coordinateSource,
      contactName, designation, subspecialty, amyloidosisType,
    } = req.body ?? {};

    if (!zohoRecordId || !clinicName) {
      res.status(400).json({ message: "zohoRecordId and clinicName are required" });
      return;
    }

    try {
      await ensureMapClinicsTable();

      const saved = await storage.upsertMapClinic({
        zohoRecordId: String(zohoRecordId),
        clinicName: String(clinicName),
        street: street ?? null,
        city: city ?? null,
        province: province ?? null,
        postalCode: postalCode ?? null,
        phone: phone ?? null,
        fax: fax ?? null,
        latitude: latitude != null ? String(latitude) : null,
        longitude: longitude != null ? String(longitude) : null,
        coordinateSource: coordinateSource ?? "city_lookup",
        contactName: contactName ?? null,
        designation: designation ?? null,
        subspecialty: subspecialty ?? null,
        amyloidosisType: amyloidosisType ?? null,
        publishedBy: req.admin?.email ?? null,
      });

      let mirroredToZoho = false;
      if (await hasApprovalField()) {
        try {
          await zohoCRMService.updateRecord("Leads", String(zohoRecordId), {
            [APPROVAL_FIELD]: "Approved",
          });
          mirroredToZoho = true;
        } catch (err: any) {
          // A CRM mirror failure must not lose the admin's decision.
          console.error("[AdminMap] Zoho approval mirror failed:", err?.message ?? err);
        }
      }

      res.json({ clinic: saved, mirroredToZoho });
    } catch (error: any) {
      console.error("[AdminMap] publish failed:", error?.message ?? error);
      res.status(500).json({ message: "Could not publish this clinic." });
    }
  });

  /**
   * DELETE /api/admin/map/published/:zohoRecordId
   * Removes a clinic from the public map. This is also the path for honouring
   * a withdrawal of map consent.
   */
  app.delete("/api/admin/map/published/:zohoRecordId", requireAdmin, async (req: Request, res: Response) => {
    const { zohoRecordId } = req.params;
    try {
      await ensureMapClinicsTable();
      const removed = await storage.deleteMapClinicByZohoId(zohoRecordId);
      if (!removed) {
        res.status(404).json({ message: "Not currently published" });
        return;
      }

      let mirroredToZoho = false;
      if (await hasApprovalField()) {
        try {
          await zohoCRMService.updateRecord("Leads", zohoRecordId, {
            [APPROVAL_FIELD]: "Rejected",
          });
          mirroredToZoho = true;
        } catch (err: any) {
          console.error("[AdminMap] Zoho rejection mirror failed:", err?.message ?? err);
        }
      }

      res.json({ removed: true, mirroredToZoho });
    } catch (error: any) {
      console.error("[AdminMap] unpublish failed:", error?.message ?? error);
      res.status(500).json({ message: "Could not remove this clinic." });
    }
  });

  /** Public read model for the map itself. No auth — this is what visitors see. */
  app.get("/api/map/clinics", async (_req: Request, res: Response) => {
    try {
      await ensureMapClinicsTable();
      const clinics = await storage.getMapClinics();
      res.json({
        clinics: clinics.map((c) => ({
          id: c.id,
          name: c.clinicName,
          city: c.city,
          province: c.province,
          street: c.street,
          postalCode: c.postalCode,
          phone: c.phone,
          contactName: c.contactName,
          designation: c.designation,
          subspecialty: c.subspecialty,
          amyloidosisType: c.amyloidosisType,
          lat: c.latitude ? Number(c.latitude) : null,
          lng: c.longitude ? Number(c.longitude) : null,
        })),
      });
    } catch (error: any) {
      console.error("[Map] public read failed:", error?.message ?? error);
      res.status(500).json({ clinics: [] });
    }
  });
}
