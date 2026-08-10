import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  PlugZap,
  Search,
  X,
  Info,
} from "lucide-react";

import MapPreview, { type PreviewPin } from "./MapPreview";
import { lookupCityCoordinates, normalizeProvinceCode } from "@/data/canadianCities";

/**
 * Services Map moderation.
 *
 * Left column: Leads that opted into the map and are not yet published.
 * Right column: what is currently live.
 *
 * Publishing goes through a preview step — the admin sees exactly where the pin
 * will land on the public map before confirming, because an address that
 * geocodes to the wrong city is not obvious from a text row.
 */

interface Candidate {
  zohoRecordId: string;
  clinicName: string | null;
  contactName: string | null;
  email: string | null;
  designation: string | null;
  subspecialty: string | null;
  amyloidosisType: string | null;
  street: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  phone: string | null;
  fax: string | null;
}

interface PublishedClinic {
  id: number;
  zohoRecordId: string;
  clinicName: string;
  city: string | null;
  province: string | null;
  latitude: string | null;
  longitude: string | null;
}

type Load =
  | { status: "loading" }
  | { status: "ready"; candidates: Candidate[]; published: PublishedClinic[]; approvalFieldPresent: boolean }
  | { status: "not-connected"; message: string; detail?: string }
  | { status: "error"; message: string; detail?: string };

function resolveCoords(city: string | null, province: string | null) {
  return lookupCityCoordinates(city, province);
}

function locationLabel(c: { city: string | null; province: string | null; street: string | null }) {
  const parts = [c.city, c.province ? normalizeProvinceCode(c.province).toUpperCase() : null]
    .filter(Boolean)
    .join(", ");
  if (parts) return c.street ? `${parts} · ${c.street}` : parts;
  return "location unknown";
}

export default function ServicesMapPanel() {
  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [query, setQuery] = useState("");
  const [reviewing, setReviewing] = useState<Candidate | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/map/candidates", { credentials: "include" });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setLoad({
          status: "ready",
          candidates: body.candidates ?? [],
          published: body.published ?? [],
          approvalFieldPresent: !!body.approvalFieldPresent,
        });
      } else if (res.status === 503) {
        setLoad({ status: "not-connected", message: body.message });
      } else {
        setLoad({ status: "error", message: body.message ?? "Could not load candidates.", detail: body.detail });
      }
    } catch {
      setLoad({ status: "error", message: "Could not reach the server." });
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const publishedPins: PreviewPin[] = useMemo(() => {
    if (load.status !== "ready") return [];
    return load.published
      .map((p) => {
        const lat = p.latitude ? Number(p.latitude) : null;
        const lng = p.longitude ? Number(p.longitude) : null;
        if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) return null;
        return { id: String(p.id), name: p.clinicName, lat, lng };
      })
      .filter((p): p is PreviewPin => !!p);
  }, [load]);

  const candidatePin: PreviewPin | null = useMemo(() => {
    if (!reviewing) return null;
    const coords = resolveCoords(reviewing.city, reviewing.province);
    if (!coords) return null;
    return {
      id: reviewing.zohoRecordId,
      name: reviewing.clinicName ?? "Unnamed clinic",
      lat: coords.lat,
      lng: coords.lng,
    };
  }, [reviewing]);

  const confirmPublish = async () => {
    if (!reviewing) return;
    setBusyId(reviewing.zohoRecordId);
    const coords = resolveCoords(reviewing.city, reviewing.province);
    try {
      const res = await fetch("/api/admin/map/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          zohoRecordId: reviewing.zohoRecordId,
          clinicName: reviewing.clinicName ?? "Unnamed clinic",
          street: reviewing.street,
          city: reviewing.city,
          province: reviewing.province ? normalizeProvinceCode(reviewing.province) : null,
          postalCode: reviewing.postalCode,
          phone: reviewing.phone,
          fax: reviewing.fax,
          latitude: coords?.lat ?? null,
          longitude: coords?.lng ?? null,
          coordinateSource: coords ? "city_lookup" : null,
          contactName: reviewing.contactName,
          designation: reviewing.designation,
          subspecialty: reviewing.subspecialty,
          amyloidosisType: reviewing.amyloidosisType,
        }),
      });
      if (res.ok) {
        setReviewing(null);
        await fetchAll();
      }
    } finally {
      setBusyId(null);
    }
  };

  const unpublish = async (zohoRecordId: string) => {
    setBusyId(zohoRecordId);
    try {
      await fetch(`/api/admin/map/published/${encodeURIComponent(zohoRecordId)}`, {
        method: "DELETE",
        credentials: "include",
      });
      await fetchAll();
    } finally {
      setBusyId(null);
    }
  };

  // ---- non-ready states -----------------------------------------------------

  if (load.status === "loading") {
    return (
      <Shell>
        <div className="py-24 flex flex-col items-center">
          <Loader2 className="w-7 h-7 animate-spin text-[#00AFE6] mb-3" />
          <p className="text-slate-400 text-sm">Loading map candidates…</p>
        </div>
      </Shell>
    );
  }

  if (load.status === "not-connected") {
    return (
      <Shell>
        <div className="py-20 flex flex-col items-center text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-[#2a2113] border border-amber-500/25 flex items-center justify-center mb-5">
            <PlugZap className="w-7 h-7 text-amber-400" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">Zoho CRM is not connected</h3>
          <p className="text-slate-400 text-sm max-w-md mb-4">{load.message}</p>
          {load.detail && (
            <pre className="text-left text-[11px] text-slate-500 bg-black/30 border border-white/10 rounded-lg p-3 mb-6 max-w-xl overflow-x-auto whitespace-pre-wrap">
              {load.detail}
            </pre>
          )}
          <a
            href="/oauth/zoho/connect"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white text-sm font-semibold"
          >
            Authorize Zoho CRM
          </a>
        </div>
      </Shell>
    );
  }

  if (load.status === "error") {
    return (
      <Shell>
        <div className="py-20 flex flex-col items-center text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-[#2a1616] border border-red-500/25 flex items-center justify-center mb-5">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">Couldn't load candidates</h3>
          <p className="text-slate-400 text-sm mb-4">{load.message}</p>
          {load.detail && (
            <pre className="text-left text-[11px] text-slate-500 bg-black/30 border border-white/10 rounded-lg p-3 mb-6 max-w-xl overflow-x-auto whitespace-pre-wrap">
              {load.detail}
            </pre>
          )}
          <button
            onClick={fetchAll}
            className="px-5 py-2.5 rounded-xl bg-[#182636] border border-white/10 text-slate-200 text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      </Shell>
    );
  }

  const needle = query.trim().toLowerCase();
  const candidates = needle
    ? load.candidates.filter((c) =>
        [c.clinicName, c.city, c.contactName, c.email]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(needle)),
      )
    : load.candidates;

  return (
    <div className="space-y-5">
      {!load.approvalFieldPresent && (
        <div className="flex items-start gap-2.5 rounded-xl bg-[#1d2436] border border-amber-500/20 p-3">
          <Info className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-200/80 leading-relaxed">
            The <code className="font-mono">Map_Approved</code> field does not exist in Zoho yet, so
            approvals are recorded here only and are not mirrored to the CRM. Create the field and
            they will sync automatically from then on.
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ---------------- Candidates ---------------- */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[#4EC8F0] text-sm font-semibold tracking-wide uppercase">
              Candidates from Leads (opted into map)
            </h3>
            <span className="text-xs text-slate-500" data-testid="text-candidate-count">
              {candidates.length}
            </span>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by clinic, city, or contact…"
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0f1a28] border border-white/10 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#00AFE6]/50"
              data-testid="input-map-filter"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0f1a28] overflow-hidden max-h-[560px] overflow-y-auto">
            {candidates.length === 0 ? (
              <div className="py-16 text-center px-6">
                <CheckCircle2 className="w-10 h-10 text-[#00DD89] mx-auto mb-3" />
                <p className="text-white font-semibold mb-1">Nothing awaiting review</p>
                <p className="text-slate-400 text-sm">
                  Every member who opted in has been reviewed.
                </p>
              </div>
            ) : (
              candidates.map((c) => {
                const coords = resolveCoords(c.city, c.province);
                return (
                  <div
                    key={c.zohoRecordId}
                    className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                    data-testid="row-map-candidate"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#132234] border border-white/5 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-[#4EC8F0]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-slate-100 text-sm font-medium truncate">
                        {c.clinicName ?? "Unnamed clinic"}
                      </div>
                      <div className="text-xs text-slate-500 truncate">{locationLabel(c)}</div>
                    </div>
                    <button
                      onClick={() => setReviewing(c)}
                      disabled={!coords}
                      title={coords ? "Review and publish" : "No usable location — cannot place a pin"}
                      className="shrink-0 h-9 px-4 rounded-xl bg-gradient-to-r from-[#0d6f8f] to-[#0e7d5c] text-white text-sm font-medium flex items-center gap-1.5 hover:brightness-125 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      data-testid="button-review-candidate"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ---------------- Published ---------------- */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[#4EC8F0] text-sm font-semibold tracking-wide uppercase">
              On the map
            </h3>
            <span className="text-xs text-slate-500" data-testid="text-published-count">
              {load.published.length}
            </span>
          </div>

          {load.published.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#0f1a28] p-3 mb-3">
              <MapPreview existing={publishedPins} width={620} height={430} />
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-[#0f1a28] overflow-hidden">
            {load.published.length === 0 ? (
              <div className="py-16 text-center px-6">
                <MapPin className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-white font-semibold mb-1">The map is empty</p>
                <p className="text-slate-400 text-sm">
                  Approve a candidate and it will appear here and on the public map.
                </p>
              </div>
            ) : (
              load.published.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0"
                  data-testid="row-map-published"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0f2a2f] border border-[#00DD89]/25 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#00DD89]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-slate-100 text-sm font-medium truncate">
                      {p.clinicName}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {[p.city, p.province?.toUpperCase()].filter(Boolean).join(", ") || "—"}
                    </div>
                  </div>
                  <span className="shrink-0 px-3 py-1.5 rounded-lg bg-[#0f2a2f] border border-[#00DD89]/30 text-[#4BE0AC] text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Live
                  </span>
                  <button
                    onClick={() => unpublish(p.zohoRecordId)}
                    disabled={busyId === p.zohoRecordId}
                    title="Remove from the public map"
                    className="shrink-0 w-9 h-9 rounded-xl bg-[#241a1a] border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-[#2e1f1f] transition disabled:opacity-40"
                    data-testid="button-unpublish"
                  >
                    {busyId === p.zohoRecordId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* ---------------- Preview / confirm ---------------- */}
      <AnimatePresence>
        {reviewing && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReviewing(null)}
          >
            <motion.div
              className="bg-[#0e1826] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              data-testid="modal-map-preview"
            >
              <div className="flex items-start justify-between gap-4 p-5 border-b border-white/10">
                <div className="min-w-0">
                  <h3 className="text-white text-lg font-semibold truncate">
                    {reviewing.clinicName ?? "Unnamed clinic"}
                  </h3>
                  <p className="text-sm text-slate-400">{locationLabel(reviewing)}</p>
                </div>
                <button
                  onClick={() => setReviewing(null)}
                  className="w-9 h-9 rounded-xl bg-white/5 text-slate-300 flex items-center justify-center hover:bg-white/10 shrink-0"
                  aria-label="Close preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 grid md:grid-cols-[1.4fr_1fr] gap-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                    Preview — where this pin will appear
                  </p>
                  <MapPreview existing={publishedPins} candidate={candidatePin} />
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00DD89]" /> This clinic
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#38566f]" /> Already on the map
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Record details</p>
                  <Detail label="Contact" value={reviewing.contactName} />
                  <Detail label="Designation" value={reviewing.designation} />
                  <Detail label="Sub-specialty" value={reviewing.subspecialty} />
                  <Detail label="Amyloidosis type" value={reviewing.amyloidosisType} />
                  <Detail label="Email" value={reviewing.email} />
                  <Detail label="Street" value={reviewing.street} />
                  <Detail label="City" value={reviewing.city} />
                  <Detail label="Province" value={reviewing.province} />
                  <Detail label="Postal code" value={reviewing.postalCode} />
                  <Detail label="Phone" value={reviewing.phone} />

                  {candidatePin ? (
                    <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                      Positioned from the city, accurate to roughly the city centre. Street-level
                      geocoding is not applied yet.
                    </p>
                  ) : (
                    <p className="text-[11px] text-amber-400 leading-relaxed pt-1">
                      No usable location on this record — it cannot be placed on the map.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-5 border-t border-white/10">
                <button
                  onClick={() => setReviewing(null)}
                  className="h-11 px-5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10"
                  data-testid="button-cancel-publish"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPublish}
                  disabled={!candidatePin || busyId === reviewing.zohoRecordId}
                  className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
                  data-testid="button-confirm-publish"
                >
                  {busyId === reviewing.zohoRecordId ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Approve &amp; publish
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1a28] overflow-hidden">{children}</div>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className="text-slate-200 text-right break-words min-w-0">{value || "—"}</span>
    </div>
  );
}
