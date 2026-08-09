import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Loader2,
  AlertTriangle,
  PlugZap,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search,
  Mail,
  Building2,
} from "lucide-react";

/**
 * Leads tab — read-only view of Zoho CRM Leads.
 *
 * Reads GET /api/admin/leads only. Nothing in this panel writes to the CRM.
 */

export interface LeadRow {
  id: string;
  name: string | null;
  email: string | null;
  company: string | null;
  designation: string | null;
  leadSource: string | null;
  recordType: string | null;
  amyloidosisType: string | null;
  casCommunications: string | null;
  cannMember: string | null;
  servicesMapInclusion: string | null;
  createdTime: string | null;
}

interface LeadsResponse {
  leads: LeadRow[];
  page: number;
  perPage: number;
  count: number;
  moreRecords: boolean;
}

type State =
  | { status: "loading" }
  | { status: "ready"; data: LeadsResponse }
  | { status: "not-connected"; message: string }
  | { status: "error"; message: string };

const PER_PAGE = 50;

export default function LeadsPanel() {
  const [page, setPage] = useState(1);
  const [state, setState] = useState<State>({ status: "loading" });
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (targetPage: number, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setState({ status: "loading" });

    try {
      const res = await fetch(
        `/api/admin/leads?page=${targetPage}&per_page=${PER_PAGE}`,
        { credentials: "include" },
      );
      const body = await res.json().catch(() => ({}));

      if (res.ok) {
        setState({ status: "ready", data: body });
      } else if (res.status === 503 && body.code === "zoho_not_connected") {
        setState({ status: "not-connected", message: body.message });
      } else {
        setState({
          status: "error",
          message: body.message ?? "Could not load leads.",
        });
      }
    } catch {
      setState({
        status: "error",
        message: "Could not reach the server.",
      });
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  // ---- states ---------------------------------------------------------------

  if (state.status === "loading") {
    return (
      <Panel>
        <div className="py-24 flex flex-col items-center">
          <Loader2 className="w-7 h-7 animate-spin text-[#00AFE6] mb-3" />
          <p className="text-slate-400 text-sm">Loading leads from Zoho CRM…</p>
        </div>
      </Panel>
    );
  }

  if (state.status === "not-connected") {
    return (
      <Panel>
        <div className="py-20 flex flex-col items-center text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-[#2a2113] border border-amber-500/25 flex items-center justify-center mb-5">
            <PlugZap className="w-7 h-7 text-amber-400" aria-hidden="true" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">
            Zoho CRM is not connected
          </h3>
          <p className="text-slate-400 text-sm max-w-md leading-relaxed mb-6">
            {state.message}
          </p>
          <a
            href="/oauth/zoho/connect"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white text-sm font-semibold"
            data-testid="link-zoho-connect"
          >
            Authorize Zoho CRM
          </a>
        </div>
      </Panel>
    );
  }

  if (state.status === "error") {
    return (
      <Panel>
        <div className="py-20 flex flex-col items-center text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-[#2a1616] border border-red-500/25 flex items-center justify-center mb-5">
            <AlertTriangle className="w-7 h-7 text-red-400" aria-hidden="true" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">
            Couldn't load leads
          </h3>
          <p className="text-slate-400 text-sm max-w-md mb-6">{state.message}</p>
          <button
            onClick={() => load(page)}
            className="px-5 py-2.5 rounded-xl bg-[#182636] border border-white/10 text-slate-200 text-sm font-semibold"
            data-testid="button-leads-retry"
          >
            Try again
          </button>
        </div>
      </Panel>
    );
  }

  const { leads, moreRecords, count } = state.data;
  const needle = query.trim().toLowerCase();
  const visible = needle
    ? leads.filter((l) =>
        [l.name, l.email, l.company, l.designation]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(needle)),
      )
    : leads;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter this page by name, email, institution…"
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#0f1a28] border border-white/10 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#00AFE6]/50"
            data-testid="input-leads-filter"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500" data-testid="text-leads-count">
            {visible.length} of {leads.length} on this page
            {count ? ` · ${count} total` : ""}
          </span>
          <button
            onClick={() => load(page, true)}
            disabled={refreshing}
            className="h-11 px-4 rounded-xl bg-[#131f2d] border border-white/10 text-slate-300 hover:text-white text-sm flex items-center gap-2 disabled:opacity-60"
            data-testid="button-leads-refresh"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <Panel>
        {visible.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#132234] border border-white/5 flex items-center justify-center mb-5">
              <Users className="w-7 h-7 text-[#00AFE6]" aria-hidden="true" />
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">
              {needle ? "No matches on this page" : "No leads found"}
            </h3>
            <p className="text-slate-400 text-sm max-w-md">
              {needle
                ? "Try a different search term, or clear the filter."
                : "Zoho CRM returned no lead records."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-leads">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-white/5">
                  <Th>Name</Th>
                  <Th>Institution</Th>
                  <Th>Type</Th>
                  <Th>Consents</Th>
                  <Th>Submitted</Th>
                </tr>
              </thead>
              <tbody>
                {visible.map((lead, i) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: Math.min(i * 0.012, 0.3) }}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                    data-testid="row-lead"
                  >
                    <Td>
                      <div className="text-slate-100 font-medium">
                        {lead.name ?? "—"}
                      </div>
                      {lead.email && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Mail className="w-3 h-3 shrink-0" aria-hidden="true" />
                          <span className="truncate">{lead.email}</span>
                        </div>
                      )}
                    </Td>
                    <Td>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        {lead.company && (
                          <Building2
                            className="w-3.5 h-3.5 shrink-0 text-slate-500"
                            aria-hidden="true"
                          />
                        )}
                        <span className="truncate max-w-[220px]">
                          {lead.company ?? "—"}
                        </span>
                      </div>
                      {lead.designation && (
                        <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[220px]">
                          {lead.designation}
                        </div>
                      )}
                    </Td>
                    <Td>
                      <span className="text-slate-300">
                        {lead.recordType ?? lead.leadSource ?? "—"}
                      </span>
                      {lead.amyloidosisType && (
                        <div className="text-xs text-slate-500 mt-0.5">
                          {lead.amyloidosisType}
                        </div>
                      )}
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-1">
                        {lead.cannMember === "Yes" && <Tag tone="cyan">CANN</Tag>}
                        {lead.casCommunications === "Yes" && (
                          <Tag tone="slate">Comms</Tag>
                        )}
                        {lead.servicesMapInclusion === "Yes" && (
                          <Tag tone="green">Map</Tag>
                        )}
                        {!lead.cannMember &&
                          !lead.casCommunications &&
                          !lead.servicesMapInclusion && (
                            <span className="text-slate-600">—</span>
                          )}
                      </div>
                    </Td>
                    <Td>
                      <span className="text-slate-400 text-xs whitespace-nowrap">
                        {formatDate(lead.createdTime)}
                      </span>
                    </Td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="h-10 px-4 rounded-xl bg-[#131f2d] border border-white/10 text-slate-300 text-sm flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          data-testid="button-leads-prev"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          Previous
        </button>
        <span className="text-xs text-slate-500">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!moreRecords}
          className="h-10 px-4 rounded-xl bg-[#131f2d] border border-white/10 text-slate-300 text-sm flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          data-testid="button-leads-next"
        >
          Next
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------- */

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1a28] overflow-hidden">
      {children}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="font-semibold px-5 py-3.5">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-5 py-3.5 align-top">{children}</td>;
}

function Tag({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "cyan" | "green" | "slate";
}) {
  const tones = {
    cyan: "bg-[#00AFE6]/15 text-[#4EC8F0] border-[#00AFE6]/30",
    green: "bg-[#00DD89]/15 text-[#4BE0AC] border-[#00DD89]/30",
    slate: "bg-white/5 text-slate-400 border-white/10",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
