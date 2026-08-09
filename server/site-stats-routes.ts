/**
 * Homepage "Network Reach" figures.
 *
 * Every figure is DERIVED from live Postgres data. A row in site_stats
 * overrides one, for the case where CAS counts something the database does not
 * hold. The response always reports both, so the admin console (and anyone
 * reading the API) can see when a displayed number differs from reality.
 *
 * Public and read-only. Overrides are written by an authenticated admin.
 */

import type { Express, Request, Response } from "express";
import { db } from "./db";
import { sql } from "drizzle-orm";
import { requireAdmin } from "./admin-auth-routes";
import { ensureMapClinicsTable } from "./migrations/add-map-clinics";

export interface SiteStat {
  key: string;
  label: string;
  /** What is actually in the database right now. */
  derived: number;
  /** What the site displays — the override when present, else the derived count. */
  value: string;
  isOverride: boolean;
  note: string | null;
}

const STAT_KEYS = [
  "healthcare_providers",
  "provinces",
  "major_cities",
  "resources",
] as const;

async function derive() {
  const one = async (query: any, fallback = 0) => {
    try {
      const r = await db.execute(query);
      return Number((r.rows[0] as any)?.n ?? fallback);
    } catch {
      return fallback;
    }
  };

  const [providers, provinces, cities, resources] = await Promise.all([
    one(sql`SELECT count(*)::int AS n FROM map_clinics`),
    one(sql`SELECT count(DISTINCT lower(province))::int AS n FROM map_clinics WHERE province IS NOT NULL AND province <> ''`),
    one(sql`SELECT count(DISTINCT lower(city))::int AS n FROM map_clinics WHERE city IS NOT NULL AND city <> ''`),
    one(sql`SELECT count(*)::int AS n FROM resources WHERE is_approved = true AND is_public = true`),
  ]);

  return {
    healthcare_providers: providers,
    provinces,
    major_cities: cities,
    resources,
  } as Record<(typeof STAT_KEYS)[number], number>;
}

const LABELS: Record<string, string> = {
  healthcare_providers: "Healthcare Providers",
  provinces: "Provinces & Territories",
  major_cities: "Major Cities",
  resources: "Resources Available",
};

async function loadOverrides(): Promise<Map<string, { value: string | null; note: string | null }>> {
  const map = new Map<string, { value: string | null; note: string | null }>();
  try {
    const r = await db.execute(sql`SELECT stat_key, manual_value, note FROM site_stats`);
    for (const row of r.rows as any[]) {
      map.set(row.stat_key, { value: row.manual_value ?? null, note: row.note ?? null });
    }
  } catch {
    // Table not created yet — every figure simply falls back to derived.
  }
  return map;
}

export function registerSiteStatsRoutes(app: Express): void {
  /** Public. Powers the homepage Network Reach panel. */
  app.get("/api/site/stats", async (_req: Request, res: Response) => {
    try {
      await ensureMapClinicsTable();
      const [derived, overrides] = await Promise.all([derive(), loadOverrides()]);

      const stats: SiteStat[] = STAT_KEYS.map((key) => {
        const override = overrides.get(key);
        const hasOverride = !!override?.value;
        return {
          key,
          label: LABELS[key],
          derived: derived[key],
          value: hasOverride ? override!.value! : String(derived[key]),
          isOverride: hasOverride,
          note: override?.note ?? null,
        };
      });

      res.json({ stats });
    } catch (error: any) {
      console.error("[SiteStats] read failed:", error?.message ?? error);
      res.status(500).json({ stats: [] });
    }
  });

  /**
   * Admin-only. Sets or clears an override.
   * Send manualValue: null to go back to the derived figure.
   */
  app.put("/api/admin/site/stats/:key", requireAdmin, async (req: Request, res: Response) => {
    const { key } = req.params;
    const { manualValue, note } = req.body ?? {};

    if (!(STAT_KEYS as readonly string[]).includes(key)) {
      res.status(400).json({ message: `Unknown stat key: ${key}` });
      return;
    }
    if (manualValue != null && String(manualValue).length > 30) {
      res.status(400).json({ message: "manualValue must be 30 characters or fewer" });
      return;
    }

    try {
      await ensureMapClinicsTable();
      await db.execute(sql`
        INSERT INTO site_stats (stat_key, manual_value, note, updated_by, updated_at)
        VALUES (${key}, ${manualValue ?? null}, ${note ?? null}, ${req.admin?.email ?? null}, NOW())
        ON CONFLICT (stat_key) DO UPDATE SET
          manual_value = EXCLUDED.manual_value,
          note         = EXCLUDED.note,
          updated_by   = EXCLUDED.updated_by,
          updated_at   = NOW()
      `);
      res.json({ updated: true, key, manualValue: manualValue ?? null });
    } catch (error: any) {
      console.error("[SiteStats] write failed:", error?.message ?? error);
      res.status(500).json({ message: "Could not update this figure." });
    }
  });
}
