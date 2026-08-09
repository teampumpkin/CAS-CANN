import { useEffect, useState } from "react";

/**
 * Homepage "Network Reach" figures, served from Postgres.
 *
 * Each figure is derived from live data; `isOverride` marks the ones CAS has
 * deliberately pinned to a different value.
 */

export interface SiteStat {
  key: string;
  label: string;
  derived: number;
  value: string;
  isOverride: boolean;
  note: string | null;
}

export function useSiteStats() {
  const [stats, setStats] = useState<SiteStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/site/stats");
        if (!res.ok) throw new Error(String(res.status));
        const body = await res.json();
        if (!cancelled) setStats(body.stats ?? []);
      } catch {
        // Leave the panel empty rather than showing invented figures.
        if (!cancelled) setStats([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const byKey = (key: string) => stats.find((s) => s.key === key);

  return { stats, loading, byKey };
}
