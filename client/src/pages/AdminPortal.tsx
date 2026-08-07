import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard, Users, CalendarCog, MapPinned, LogOut, Search, X, Plus,
  Trash2, Eye, EyeOff, MapPin, CheckCircle2, ShieldCheck, Mail, Building2, ExternalLink, Loader2,
} from "lucide-react";

// ---- design tokens (match CAS site: Rosarivo serif + cyan→green) ----
const GRAD = "bg-gradient-to-r from-[#00AFE6] to-[#00DD89]";
const GRAD_BTN = `${GRAD} text-white border-0 shadow-lg hover:shadow-xl hover:shadow-[#00AFE6]/30 transition-all rounded-xl`;
const ICON_TILE = "bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-xl flex items-center justify-center";
const PANEL = "rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-white/[0.03] shadow-sm";
const NAV_ACTIVE = `${GRAD} text-white shadow-md shadow-[#00AFE6]/25`;
const NAV_IDLE = "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5";

type Section = "leads" | "resources" | "map";

interface Lead {
  id: number; formName: string; name: string; email: string;
  discipline?: string | null; institution?: string | null; wantsMap: boolean;
  syncStatus: string; zohoCrmId?: string | null; createdAt?: string;
}
interface EventRow {
  id: number; title: string; description?: string; eventDate: string; eventType: string;
  location?: string; meetingLink?: string; recordingUrl?: string; accessLevel: string; isPublished: boolean;
}
interface Candidate {
  submissionId: number; name: string; city?: string; province?: string; address?: string; phone?: string; email?: string; discipline?: string;
}
interface Clinic {
  id: number; name: string; city?: string; province: string; address?: string; phone?: string; isPublished: boolean; submissionId?: number;
}

const fmtDate = (s?: string) => (s ? new Date(s).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" }) : "—");

const NAV: { key: Section; label: string; icon: typeof Users }[] = [
  { key: "leads", label: "Leads", icon: Users },
  { key: "resources", label: "Resources & Events", icon: CalendarCog },
  { key: "map", label: "Services Map", icon: MapPinned },
];

export default function AdminPortal() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [section, setSection] = useState<Section>("leads");

  const { data: auth, isLoading: authLoading } = useQuery<any>({ queryKey: ["/api/auth/me"] });
  const member = auth?.member;
  const isAdmin = member?.role === "admin";

  const logout = useMutation({
    mutationFn: async () => (await apiRequest("POST", "/api/auth/logout", {})).json(),
    onSuccess: () => { queryClient.clear(); setLocation("/login"); },
  });

  if (authLoading) {
    return <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#00AFE6]" /></div>;
  }
  if (!auth?.success) { setLocation("/login"); return null; }
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] flex items-center justify-center px-4">
        <div className={`${PANEL} p-8 text-center max-w-md`}>
          <div className={`${ICON_TILE} h-14 w-14 mx-auto mb-4`}><ShieldCheck className="w-7 h-7 text-[#00AFE6]" /></div>
          <h1 className="text-xl font-bold font-rosarivo text-slate-900 dark:text-white">Admin access required</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Your account ({member?.email}) doesn't have admin permissions.</p>
          <Button className={`${GRAD_BTN} mt-5`} onClick={() => setLocation("/members-portal")}>Back to portal</Button>
        </div>
      </div>
    );
  }

  const active = NAV.find((n) => n.key === section)!;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] lg:flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:shrink-0 border-r border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl">
        <div className="sticky top-0 flex flex-col h-screen p-5">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className={`${ICON_TILE} h-9 w-9`}><LayoutDashboard className="w-4.5 h-4.5 text-[#00AFE6]" /></div>
            <div>
              <p className="text-sm font-bold font-rosarivo text-slate-900 dark:text-white leading-none">Admin Console</p>
              <p className="text-[11px] text-slate-400">Canadian Amyloidosis Society</p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-gradient-to-br from-[#00AFE6]/10 via-[#00DD89]/5 to-transparent p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className={`${ICON_TILE} h-11 w-11 shrink-0`}><ShieldCheck className="w-5 h-5 text-[#00AFE6]" /></div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white truncate text-sm">{member?.fullName}</p>
                <span className="inline-block rounded-full bg-[#00AFE6]/15 text-[#0092c4] dark:text-[#4dd0f5] border border-[#00AFE6]/30 px-2 py-0.5 text-[10px] font-semibold mt-0.5">ADMINISTRATOR</span>
              </div>
            </div>
          </div>
          <nav className="flex flex-col gap-1.5">
            {NAV.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setSection(key)} data-testid={`admin-tab-${key}`}
                className={`flex items-center gap-3 rounded-xl font-medium transition-all text-left w-full justify-start px-4 py-3 ${section === key ? NAV_ACTIVE : NAV_IDLE}`}>
                <Icon className="w-[18px] h-[18px] shrink-0" /><span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto pt-5 space-y-1.5">
            <button onClick={() => setLocation("/members-portal")} className={`flex items-center gap-3 rounded-xl w-full px-4 py-2.5 text-sm ${NAV_IDLE}`}>
              <ExternalLink className="w-4 h-4" /> Member view
            </button>
            <Button variant="outline" onClick={() => logout.mutate()} className="w-full justify-start rounded-xl border-slate-300 dark:border-white/15" data-testid="admin-logout">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Mobile top nav */}
        <div className="lg:hidden border-b border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><div className={`${ICON_TILE} h-9 w-9`}><LayoutDashboard className="w-4 h-4 text-[#00AFE6]" /></div><p className="font-bold font-rosarivo text-slate-900 dark:text-white text-sm">Admin Console</p></div>
            <Button variant="outline" size="sm" onClick={() => logout.mutate()} className="rounded-xl"><LogOut className="w-4 h-4" /></Button>
          </div>
          <div className="flex gap-1.5 overflow-x-auto -mx-1 px-1">
            {NAV.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setSection(key)} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm shrink-0 ${section === key ? NAV_ACTIVE : NAV_IDLE}`}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold font-rosarivo text-slate-900 dark:text-white">
              <span className="bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent">{active.label}</span>
            </h1>
          </div>
          {section === "leads" && <LeadsSection />}
          {section === "resources" && <ResourcesSection toast={toast} />}
          {section === "map" && <MapSection toast={toast} />}
        </main>
      </div>
    </div>
  );
}

// ============================ Leads ============================
function LeadsSection() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const { data, isLoading } = useQuery<{ leads: Lead[] }>({ queryKey: ["/api/admin/leads"] });
  const { data: detail } = useQuery<{ lead: any }>({ queryKey: [`/api/admin/leads/${selected}`], enabled: selected != null });
  const leads = data?.leads || [];
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return leads;
    return leads.filter((l) => [l.name, l.email, l.institution, l.formName].filter(Boolean).some((v) => String(v).toLowerCase().includes(s)));
  }, [leads, q]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search leads by name, email, institution…" className="pl-10 rounded-xl" data-testid="admin-leads-search" />
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400">{filtered.length} of {leads.length} leads</span>
      </div>

      <div className={`${PANEL} overflow-hidden`}>
        {isLoading ? (
          <div className="py-16 text-center"><Loader2 className="w-7 h-7 animate-spin text-[#00AFE6] mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400">No leads found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200/70 dark:border-white/10">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Institution</th>
                  <th className="px-4 py-3 font-semibold hidden lg:table-cell">Form</th>
                  <th className="px-4 py-3 font-semibold">Map</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02]" data-testid={`lead-row-${l.id}`}>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{l.name}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{l.email}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 hidden md:table-cell">{l.institution || "—"}</td>
                    <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">{l.formName}</td>
                    <td className="px-4 py-3">{l.wantsMap ? <span className="inline-flex items-center gap-1 rounded-full bg-[#00DD89]/15 text-[#00a866] dark:text-[#4ff0b0] px-2 py-0.5 text-xs font-semibold"><MapPin className="w-3 h-3" />Yes</span> : <span className="text-slate-400 text-xs">No</span>}</td>
                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{fmtDate(l.createdAt)}</td>
                    <td className="px-4 py-3 text-right"><button onClick={() => setSelected(l.id)} className="text-[#0092c4] dark:text-[#4dd0f5] font-medium hover:underline text-xs" data-testid={`lead-view-${l.id}`}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected != null && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md h-full bg-white dark:bg-[#0f1626] shadow-2xl overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-rosarivo text-slate-900 dark:text-white">Lead detail</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            {!detail ? <Loader2 className="w-6 h-6 animate-spin text-[#00AFE6]" /> : (
              <div className="space-y-2">
                <p className="text-xs text-slate-400">Submission #{detail.lead.id} · {detail.lead.formName} · {fmtDate(detail.lead.createdAt)}</p>
                <div className="rounded-xl border border-slate-200/70 dark:border-white/10 divide-y divide-slate-100 dark:divide-white/5">
                  {Object.entries(detail.lead.submissionData || {}).map(([k, v]) => (
                    <div key={k} className="flex gap-3 px-3 py-2 text-sm">
                      <span className="w-40 shrink-0 text-slate-400 break-words">{k}</span>
                      <span className="text-slate-800 dark:text-slate-200 break-words">{typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================ Resources & Events ============================
const EMPTY_EVENT = { title: "", eventType: "webinar", eventDate: "", location: "", meetingLink: "", recordingUrl: "", accessLevel: "cas_member", description: "", isPublished: true };

function ResourcesSection({ toast }: { toast: any }) {
  const [form, setForm] = useState<any>(EMPTY_EVENT);
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = useQuery<{ events: EventRow[] }>({ queryKey: ["/api/admin/events"] });
  const events = data?.events || [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
  const create = useMutation({
    mutationFn: async (body: any) => (await apiRequest("POST", "/api/admin/events", body)).json(),
    onSuccess: (r) => { if (r.success) { toast({ title: "Event created" }); setForm(EMPTY_EVENT); setShowForm(false); invalidate(); } else toast({ title: "Error", description: r.message, variant: "destructive" }); },
  });
  const update = useMutation({
    mutationFn: async ({ id, body }: any) => (await apiRequest("PUT", `/api/admin/events/${id}`, body)).json(),
    onSuccess: () => invalidate(),
  });
  const remove = useMutation({
    mutationFn: async (id: number) => (await apiRequest("DELETE", `/api/admin/events/${id}`, {})).json(),
    onSuccess: () => { toast({ title: "Event deleted" }); invalidate(); },
  });

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage member events, webinars & recordings shown in the portal.</p>
        <Button className={GRAD_BTN} onClick={() => setShowForm((s) => !s)} data-testid="admin-add-event">
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}{showForm ? "Close" : "Add event"}
        </Button>
      </div>

      {showForm && (
        <div className={`${PANEL} p-5 mb-5`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="rounded-xl border border-slate-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm md:col-span-2" placeholder="Title *" value={form.title} onChange={(e) => set("title", e.target.value)} data-testid="event-title" />
            <select className="rounded-xl border border-slate-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm" value={form.eventType} onChange={(e) => set("eventType", e.target.value)}>
              <option value="webinar">Webinar</option><option value="conference">Conference</option><option value="workshop">Workshop</option><option value="recording">Recording</option>
            </select>
            <input type="datetime-local" className="rounded-xl border border-slate-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm" value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} data-testid="event-date" />
            <input className="rounded-xl border border-slate-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm" placeholder="Location (e.g. Virtual)" value={form.location} onChange={(e) => set("location", e.target.value)} />
            <select className="rounded-xl border border-slate-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm" value={form.accessLevel} onChange={(e) => set("accessLevel", e.target.value)}>
              <option value="cas_member">CAS members</option><option value="cann_member">CANN members</option><option value="cas_cann_member">CAS &amp; CANN</option><option value="admin">Admins</option>
            </select>
            <input className="rounded-xl border border-slate-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm" placeholder="Meeting link (for upcoming)" value={form.meetingLink} onChange={(e) => set("meetingLink", e.target.value)} />
            <input className="rounded-xl border border-slate-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm" placeholder="Recording URL (for past)" value={form.recordingUrl} onChange={(e) => set("recordingUrl", e.target.value)} />
            <textarea className="rounded-xl border border-slate-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => set("description", e.target.value)} />
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 md:col-span-2">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => set("isPublished", e.target.checked)} /> Publish immediately
            </label>
          </div>
          <div className="flex justify-end mt-4">
            <Button className={GRAD_BTN} disabled={create.isPending} onClick={() => create.mutate(form)} data-testid="event-save">
              {create.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}Create event
            </Button>
          </div>
        </div>
      )}

      <div className={`${PANEL} overflow-hidden`}>
        {isLoading ? <div className="py-14 text-center"><Loader2 className="w-6 h-6 animate-spin text-[#00AFE6] mx-auto" /></div>
        : events.length === 0 ? <div className="py-14 text-center text-slate-500 dark:text-slate-400">No events yet. Add one above.</div>
        : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {events.map((ev) => (
              <div key={ev.id} className="flex items-center gap-4 px-4 py-3" data-testid={`event-row-${ev.id}`}>
                <div className={`${ICON_TILE} h-10 w-10 shrink-0`}><CalendarCog className="w-5 h-5 text-[#00AFE6]" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center rounded-full ${GRAD} text-white px-2 py-0.5 text-[11px] font-semibold capitalize`}>{ev.eventType}</span>
                    <span className="font-medium text-slate-900 dark:text-white truncate">{ev.title}</span>
                    {ev.recordingUrl && <span className="text-[11px] text-slate-400">· recording</span>}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{fmtDate(ev.eventDate)} · {ev.location || "—"} · {ev.accessLevel.replace("_", " ")}</p>
                </div>
                <button onClick={() => update.mutate({ id: ev.id, body: { isPublished: !ev.isPublished } })} title={ev.isPublished ? "Published — click to unpublish" : "Draft — click to publish"} className={`shrink-0 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${ev.isPublished ? "bg-[#00DD89]/15 text-[#00a866] dark:text-[#4ff0b0]" : "bg-slate-100 dark:bg-white/5 text-slate-500"}`} data-testid={`event-publish-${ev.id}`}>
                  {ev.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}{ev.isPublished ? "Published" : "Draft"}
                </button>
                <button onClick={() => remove.mutate(ev.id)} className="shrink-0 text-slate-400 hover:text-red-500" data-testid={`event-delete-${ev.id}`}><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================ Services Map ============================
function MapSection({ toast }: { toast: any }) {
  const { data: cand, isLoading: candLoading } = useQuery<{ candidates: Candidate[] }>({ queryKey: ["/api/admin/map/candidates"] });
  const { data: pub, isLoading: pubLoading } = useQuery<{ clinics: Clinic[] }>({ queryKey: ["/api/admin/map/clinics"] });
  const candidates = cand?.candidates || [];
  const clinics = pub?.clinics || [];

  const refresh = () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/map/candidates"] }); queryClient.invalidateQueries({ queryKey: ["/api/admin/map/clinics"] }); };
  const add = useMutation({
    mutationFn: async (submissionId: number) => (await apiRequest("POST", "/api/admin/map/clinics", { submissionId })).json(),
    onSuccess: (r) => { if (r.success) { toast({ title: "Added to map" }); refresh(); } else toast({ title: "Error", description: r.message, variant: "destructive" }); },
  });
  const toggle = useMutation({
    mutationFn: async ({ id, isPublished }: any) => (await apiRequest("PUT", `/api/admin/map/clinics/${id}`, { isPublished })).json(),
    onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: async (id: number) => (await apiRequest("DELETE", `/api/admin/map/clinics/${id}`, {})).json(),
    onSuccess: () => { toast({ title: "Removed from map" }); refresh(); },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Candidates */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#0092c4] dark:text-[#4dd0f5] mb-3">Candidates from leads (opted into map)</h3>
        <div className={`${PANEL} overflow-hidden`}>
          {candLoading ? <div className="py-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-[#00AFE6] mx-auto" /></div>
          : candidates.length === 0 ? <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">No pending clinics from leads.</div>
          : (
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {candidates.map((c) => (
                <div key={c.submissionId} className="flex items-center gap-3 px-4 py-3" data-testid={`map-candidate-${c.submissionId}`}>
                  <div className={`${ICON_TILE} h-9 w-9 shrink-0`}><Building2 className="w-4 h-4 text-[#00AFE6]" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-white truncate text-sm">{c.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{[c.city, c.province].filter(Boolean).join(", ") || "location unknown"}{c.address ? ` · ${c.address}` : ""}</p>
                  </div>
                  <Button size="sm" className={GRAD_BTN} disabled={!c.province || add.isPending} title={!c.province ? "No province on this lead" : "Add to map"} onClick={() => add.mutate(c.submissionId)} data-testid={`map-add-${c.submissionId}`}>
                    <Plus className="w-4 h-4 mr-1" />Add
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Published */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#0092c4] dark:text-[#4dd0f5] mb-3">On the map</h3>
        <div className={`${PANEL} overflow-hidden`}>
          {pubLoading ? <div className="py-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-[#00AFE6] mx-auto" /></div>
          : clinics.length === 0 ? <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">No clinics on the map yet.</div>
          : (
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {clinics.map((c) => (
                <div key={c.id} className="flex items-center gap-3 px-4 py-3" data-testid={`map-clinic-${c.id}`}>
                  <div className={`${ICON_TILE} h-9 w-9 shrink-0`}><MapPin className="w-4 h-4 text-[#00AFE6]" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-white truncate text-sm">{c.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{[c.city, c.province].filter(Boolean).join(", ")}</p>
                  </div>
                  <button onClick={() => toggle.mutate({ id: c.id, isPublished: !c.isPublished })} className={`shrink-0 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${c.isPublished ? "bg-[#00DD89]/15 text-[#00a866] dark:text-[#4ff0b0]" : "bg-slate-100 dark:bg-white/5 text-slate-500"}`} data-testid={`map-toggle-${c.id}`}>
                    {c.isPublished ? <CheckCircle2 className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}{c.isPublished ? "Live" : "Hidden"}
                  </button>
                  <button onClick={() => remove.mutate(c.id)} className="shrink-0 text-slate-400 hover:text-red-500" data-testid={`map-remove-${c.id}`}><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
