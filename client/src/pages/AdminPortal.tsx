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
  Video, UploadCloud, FileVideo,
} from "lucide-react";

// ---- design tokens (match CAS site: Rosarivo serif + cyan→green) ----
const GRAD = "bg-gradient-to-r from-[#00AFE6] to-[#00DD89]";
const GRAD_BTN = `${GRAD} text-white border-0 shadow-lg hover:shadow-xl hover:shadow-[#00AFE6]/30 transition-all rounded-xl`;
const ICON_TILE = "bg-gradient-to-br from-[#00AFE6]/20 to-[#00DD89]/20 rounded-xl flex items-center justify-center";
const PANEL = "rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-white/[0.03] shadow-sm";
const NAV_ACTIVE = `${GRAD} text-white shadow-md shadow-[#00AFE6]/25`;
const NAV_IDLE = "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5";
const FIELD =
  "w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AFE6]/40 focus:border-[#00AFE6]/50 transition";

function Labeled({ label, required, children, className = "" }: { label: string; required?: boolean; children: any; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
        {label}{required && <span className="text-[#00AFE6]"> *</span>}
      </span>
      {children}
    </label>
  );
}

type Section = "leads" | "resources" | "recordings" | "map";

interface Lead {
  id: number; name: string; email: string;
  phone?: string | null; discipline?: string | null; subspecialty?: string | null;
  institution?: string | null; amyloidosisType?: string | null;
  wantsCAS?: boolean; wantsCANN?: boolean; wantsMap: boolean; communications?: boolean;
  formName: string; sourceForm?: string; syncStatus: string; zohoCrmId?: string | null; createdAt?: string;
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
  { key: "recordings", label: "Recordings", icon: Video },
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
          {section === "recordings" && <RecordingsSection toast={toast} />}
          {section === "map" && <MapSection toast={toast} />}
        </main>
      </div>
    </div>
  );
}

// ============================ Leads ============================
const YesNo = ({ v }: { v?: boolean }) =>
  v ? <span className="inline-flex items-center rounded-full bg-[#00DD89]/15 text-[#00a866] dark:text-[#4ff0b0] px-2 py-0.5 text-xs font-semibold">Yes</span>
    : <span className="text-slate-400 text-xs">No</span>;

function LeadsSection() {
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery<{ leads: Lead[] }>({ queryKey: ["/api/admin/leads"] });
  const leads = data?.leads || [];
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return leads;
    return leads.filter((l) => [l.name, l.email, l.institution, l.discipline, l.formName].filter(Boolean).some((v) => String(v).toLowerCase().includes(s)));
  }, [leads, q]);

  const TH = "px-4 py-3 font-semibold whitespace-nowrap";
  const TD = "px-4 py-3 whitespace-nowrap";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search leads…" className="pl-10 rounded-xl" data-testid="admin-leads-search" />
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
            <table className="text-sm min-w-max">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-200/70 dark:border-white/10">
                  <th className={TH}>Name</th>
                  <th className={TH}>Email</th>
                  <th className={TH}>Phone</th>
                  <th className={TH}>Discipline</th>
                  <th className={TH}>Subspecialty</th>
                  <th className={TH}>Institution</th>
                  <th className={TH}>Amyloidosis Type</th>
                  <th className={TH}>CAS</th>
                  <th className={TH}>CANN</th>
                  <th className={TH}>Services Map</th>
                  <th className={TH}>Comms</th>
                  <th className={TH}>Form</th>
                  <th className={TH}>Sync</th>
                  <th className={TH}>Zoho ID</th>
                  <th className={TH}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02]" data-testid={`lead-row-${l.id}`}>
                    <td className={`${TD} font-medium text-slate-900 dark:text-white`}>{l.name}</td>
                    <td className={`${TD} text-slate-600 dark:text-slate-300`}>{l.email}</td>
                    <td className={`${TD} text-slate-600 dark:text-slate-300`}>{l.phone || "—"}</td>
                    <td className={`${TD} text-slate-600 dark:text-slate-300`}>{l.discipline || "—"}</td>
                    <td className={`${TD} text-slate-600 dark:text-slate-300`}>{l.subspecialty || "—"}</td>
                    <td className={`${TD} text-slate-600 dark:text-slate-300`}>{l.institution || "—"}</td>
                    <td className={`${TD} text-slate-600 dark:text-slate-300`}>{l.amyloidosisType || "—"}</td>
                    <td className={TD}><YesNo v={l.wantsCAS} /></td>
                    <td className={TD}><YesNo v={l.wantsCANN} /></td>
                    <td className={TD}><YesNo v={l.wantsMap} /></td>
                    <td className={TD}><YesNo v={l.communications} /></td>
                    <td className={`${TD} text-slate-500`}>{l.formName}</td>
                    <td className={TD}>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${l.syncStatus === "synced" ? "bg-[#00DD89]/15 text-[#00a866] dark:text-[#4ff0b0]" : l.syncStatus === "failed" ? "bg-red-500/15 text-red-500" : "bg-slate-100 dark:bg-white/5 text-slate-500"}`}>{l.syncStatus}</span>
                    </td>
                    <td className={`${TD} text-slate-500`}>{l.zohoCrmId || "—"}</td>
                    <td className={`${TD} text-slate-500`}>{fmtDate(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-xs text-slate-400 mt-2">Scroll horizontally to see all columns →</p>
    </div>
  );
}

// ============================ Resources & Events ============================
const EMPTY_EVENT = {
  title: "", eventType: "webinar", audience: "everyone", eventDate: "", timeLabel: "", location: "", format: "",
  presentationTitle: "", speaker: "", topic: "", cmeCredits: "", registrationStatus: "", registrationUrl: "",
  meetingLink: "", recordingUrl: "", accessLevel: "cas_member", requiresCannMembership: false, description: "", isPublished: true,
};

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
        <div className={`${PANEL} p-6 mb-5`}>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">New event</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Labeled label="Title" required className="md:col-span-2">
              <input className={FIELD} placeholder="e.g. CANN Educational Series" value={form.title} onChange={(e) => set("title", e.target.value)} data-testid="event-title" />
            </Labeled>
            <Labeled label="Presentation title" className="md:col-span-2">
              <input className={FIELD} placeholder="Session/talk title (optional)" value={form.presentationTitle} onChange={(e) => set("presentationTitle", e.target.value)} />
            </Labeled>
            <Labeled label="Speaker(s)">
              <input className={FIELD} placeholder="e.g. Dr. Jane Doe, RN" value={form.speaker} onChange={(e) => set("speaker", e.target.value)} />
            </Labeled>
            <Labeled label="Topic">
              <input className={FIELD} placeholder="Session topic (optional)" value={form.topic} onChange={(e) => set("topic", e.target.value)} />
            </Labeled>
            <Labeled label="Event type">
              <select className={FIELD} value={form.eventType} onChange={(e) => set("eventType", e.target.value)}>
                <option value="webinar">Webinar</option><option value="meeting">Meeting</option><option value="conference">Conference</option><option value="workshop">Workshop</option><option value="townhall">Townhall</option>
              </select>
            </Labeled>
            <Labeled label="Audience">
              <select className={FIELD} value={form.audience} onChange={(e) => set("audience", e.target.value)} data-testid="event-audience">
                <option value="everyone">Everyone (public pages)</option>
                <option value="members">Members only (portal)</option>
                <option value="both">Both public &amp; members</option>
              </select>
            </Labeled>
            <Labeled label="Date">
              <input type="datetime-local" className={FIELD} value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} data-testid="event-date" />
            </Labeled>
            <Labeled label="Time (label)">
              <input className={FIELD} placeholder="e.g. 5:00 PM – 6:00 PM EST" value={form.timeLabel} onChange={(e) => set("timeLabel", e.target.value)} />
            </Labeled>
            <Labeled label="Location">
              <input className={FIELD} placeholder="e.g. Toronto, ON" value={form.location} onChange={(e) => set("location", e.target.value)} />
            </Labeled>
            <Labeled label="Format">
              <input className={FIELD} placeholder="e.g. Virtual / In-person" value={form.format} onChange={(e) => set("format", e.target.value)} />
            </Labeled>
            <Labeled label="CME credits">
              <input className={FIELD} placeholder="e.g. 1 hour" value={form.cmeCredits} onChange={(e) => set("cmeCredits", e.target.value)} />
            </Labeled>
            <Labeled label="Registration status">
              <input className={FIELD} placeholder="e.g. Registration is open" value={form.registrationStatus} onChange={(e) => set("registrationStatus", e.target.value)} />
            </Labeled>
            <Labeled label="Registration link">
              <input className={FIELD} placeholder="https://…" value={form.registrationUrl} onChange={(e) => set("registrationUrl", e.target.value)} />
            </Labeled>
            <Labeled label="Meeting link (virtual join)">
              <input className={FIELD} placeholder="https://…" value={form.meetingLink} onChange={(e) => set("meetingLink", e.target.value)} />
            </Labeled>
            <Labeled label="Member access level">
              <select className={FIELD} value={form.accessLevel} onChange={(e) => set("accessLevel", e.target.value)}>
                <option value="cas_member">CAS members</option><option value="cann_member">CANN members</option><option value="cas_cann_member">CAS &amp; CANN</option><option value="admin">Admins</option>
              </select>
            </Labeled>
            <Labeled label="Description" className="md:col-span-2">
              <textarea rows={3} className={FIELD} placeholder="Short summary of the event" value={form.description} onChange={(e) => set("description", e.target.value)} />
            </Labeled>
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input type="checkbox" checked={form.requiresCannMembership} onChange={(e) => set("requiresCannMembership", e.target.checked)} /> Requires CANN membership
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => set("isPublished", e.target.checked)} /> Publish immediately
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <Button variant="outline" className="rounded-xl" onClick={() => setShowForm(false)}>Cancel</Button>
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

// ============================ Recordings (file upload) ============================
const humanSize = (n?: number) => {
  if (!n) return "—";
  const u = ["B", "KB", "MB", "GB"]; let i = 0, v = n;
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(1)} ${u[i]}`;
};

function uploadRecording(fd: FormData, onProgress: (p: number) => void): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/recordings");
    xhr.withCredentials = true;
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => { try { resolve(JSON.parse(xhr.responseText)); } catch { reject(new Error("Bad response")); } };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(fd);
  });
}

function RecordingsSection({ toast }: { toast: any }) {
  const { data, isLoading } = useQuery<{ events: any[] }>({ queryKey: ["/api/admin/events"] });
  const recordings = (data?.events || []).filter((e) => e.recordingStorageKey || e.eventType === "recording");
  const [form, setForm] = useState<any>({ title: "", accessLevel: "cas_member", eventDate: "", description: "", isPublished: true });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pct, setPct] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });

  const submit = async () => {
    if (!file) return toast({ title: "Choose a video file first", variant: "destructive" });
    if (!form.title) return toast({ title: "Title is required", variant: "destructive" });
    const fd = new FormData();
    fd.append("file", file);
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    setUploading(true); setPct(0);
    try {
      const r = await uploadRecording(fd, setPct);
      if (r.success) { toast({ title: "Recording uploaded" }); setFile(null); setForm({ title: "", accessLevel: "cas_member", eventDate: "", description: "", isPublished: true }); setShowForm(false); invalidate(); }
      else toast({ title: "Upload failed", description: r.message, variant: "destructive" });
    } catch { toast({ title: "Upload failed", variant: "destructive" }); }
    finally { setUploading(false); }
  };

  const toggle = useMutation({ mutationFn: async ({ id, isPublished }: any) => (await apiRequest("PUT", `/api/admin/events/${id}`, { isPublished })).json(), onSuccess: invalidate });
  const remove = useMutation({ mutationFn: async (id: number) => (await apiRequest("DELETE", `/api/admin/events/${id}`, {})).json(), onSuccess: () => { toast({ title: "Recording deleted" }); invalidate(); } });

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">Upload member-only recordings. Files are stored via the configured storage backend and streamed to members through an authenticated endpoint (never a public link).</p>
        <Button className={GRAD_BTN} onClick={() => setShowForm((s) => !s)} data-testid="recording-add">
          {showForm ? <X className="w-4 h-4 mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />}{showForm ? "Close" : "Upload recording"}
        </Button>
      </div>

      {/* Upload form — only via CTA */}
      {showForm && (
        <div className={`${PANEL} p-6 mb-5`}>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">New recording</h3>
          <Labeled label="Recording file" required>
            <label className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed ${file ? "border-[#00AFE6]/60 bg-[#00AFE6]/5" : "border-slate-300 dark:border-white/15"} px-6 py-8 cursor-pointer text-center`}>
              <input type="file" accept="video/*,audio/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} data-testid="recording-file" />
              <div className={`${ICON_TILE} h-12 w-12`}>{file ? <FileVideo className="w-6 h-6 text-[#00AFE6]" /> : <UploadCloud className="w-6 h-6 text-[#00AFE6]" />}</div>
              {file ? <div><p className="font-medium text-slate-900 dark:text-white text-sm">{file.name}</p><p className="text-xs text-slate-500">{humanSize(file.size)}</p></div>
                    : <div><p className="font-medium text-slate-700 dark:text-slate-200 text-sm">Click to choose a video file</p><p className="text-xs text-slate-400">MP4, MOV, WebM…</p></div>}
            </label>
          </Labeled>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Labeled label="Title" required className="md:col-span-2">
              <input className={FIELD} placeholder="e.g. AL Amyloidosis Masterclass" value={form.title} onChange={(e) => set("title", e.target.value)} data-testid="recording-title" />
            </Labeled>
            <Labeled label="Who can access">
              <select className={FIELD} value={form.accessLevel} onChange={(e) => set("accessLevel", e.target.value)}>
                <option value="cas_member">CAS members</option><option value="cann_member">CANN members</option><option value="cas_cann_member">CAS &amp; CANN</option><option value="admin">Admins</option>
              </select>
            </Labeled>
            <Labeled label="Recorded on">
              <input type="datetime-local" className={FIELD} value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} />
            </Labeled>
            <Labeled label="Description" className="md:col-span-2">
              <textarea rows={3} className={FIELD} placeholder="Short summary of the recording" value={form.description} onChange={(e) => set("description", e.target.value)} />
            </Labeled>
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 md:col-span-2">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => set("isPublished", e.target.checked)} /> Publish immediately
            </label>
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden"><div className={`${GRAD} h-full transition-all`} style={{ width: `${pct}%` }} /></div>
              <p className="text-xs text-slate-500 mt-1">Uploading… {pct}%</p>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-5">
            <Button variant="outline" className="rounded-xl" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button className={GRAD_BTN} disabled={uploading} onClick={submit} data-testid="recording-upload">
              {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}Upload recording
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      <div className={`${PANEL} overflow-hidden`}>
        {isLoading ? <div className="py-14 text-center"><Loader2 className="w-6 h-6 animate-spin text-[#00AFE6] mx-auto" /></div>
        : recordings.length === 0 ? <div className="py-14 text-center text-slate-500 dark:text-slate-400">No recordings uploaded yet.</div>
        : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {recordings.map((r) => (
              <div key={r.id} className="flex items-center gap-4 px-4 py-3" data-testid={`recording-row-${r.id}`}>
                <div className={`${ICON_TILE} h-10 w-10 shrink-0`}><Video className="w-5 h-5 text-[#00AFE6]" /></div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 dark:text-white truncate">{r.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{r.recordingFileName || "—"} · {humanSize(r.recordingSizeBytes)} · {String(r.accessLevel).replace("_", " ")}</p>
                </div>
                <button onClick={() => toggle.mutate({ id: r.id, isPublished: !r.isPublished })} className={`shrink-0 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${r.isPublished ? "bg-[#00DD89]/15 text-[#00a866] dark:text-[#4ff0b0]" : "bg-slate-100 dark:bg-white/5 text-slate-500"}`} data-testid={`recording-publish-${r.id}`}>
                  {r.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}{r.isPublished ? "Published" : "Draft"}
                </button>
                <button onClick={() => remove.mutate(r.id)} className="shrink-0 text-slate-400 hover:text-red-500" data-testid={`recording-delete-${r.id}`}><Trash2 className="w-4 h-4" /></button>
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
