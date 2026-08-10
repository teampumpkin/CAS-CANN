import { useEffect, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import LeadsPanel from "./admin/LeadsPanel";
import ServicesMapPanel from "./admin/ServicesMapPanel";
import ResourcesEventsPanel from "./admin/ResourcesEventsPanel";
import {
  LayoutGrid,
  ShieldCheck,
  Users,
  CalendarDays,
  Video,
  MapPin,
  ExternalLink,
  LogOut,
  Loader2,
  Inbox,
} from "lucide-react";

/**
 * Admin Console shell.
 *
 * UI only for this pass: the sidebar, tab navigation, and an empty state per
 * tab. No data is loaded yet — each tab is a placeholder until its workstream
 * lands (see docs/SERVICES_MAP_AND_MEMBER_ACCESS_PLAN_2026-08-07.md).
 *
 * Deliberately dark-only. The console is a back-office surface with its own
 * visual identity, so colours are literal rather than `dark:` variants — it
 * looks identical regardless of the public site's theme setting.
 */

interface AdminProfile {
  id: number;
  email: string;
  role: "admin" | "superadmin";
}

type TabId = "leads" | "resources" | "recordings" | "services-map";

interface TabDef {
  id: TabId;
  label: string;
  /** Hidden tabs keep their definition but are not routed or shown in the nav. */
  hidden?: boolean;
  title: string;
  icon: typeof Users;
  emptyTitle: string;
  emptyBody: string;
}

const TABS: TabDef[] = [
  {
    id: "leads",
    label: "Leads",
    title: "Leads",
    icon: Users,
    emptyTitle: "No leads to show yet",
    emptyBody:
      "Registrations captured from the join forms will appear here once this view is connected to the CRM.",
  },
  {
    id: "resources",
    label: "Resources & Events",
    title: "Resources & Events",
    icon: CalendarDays,
    emptyTitle: "No resources or events yet",
    emptyBody:
      "Published resources, newsletters, and event listings will be managed from this tab.",
  },
  {
    id: "recordings",
    label: "Recordings",
    title: "Recordings",
    icon: Video,
    emptyTitle: "No recordings yet",
    emptyBody:
      "Call and webinar recordings will be listed here, each with its own member access level.",
  },
  {
    id: "services-map",
    label: "Services Map",
    title: "Services Map",
    icon: MapPin,
    emptyTitle: "No clinics awaiting review",
    emptyBody:
      "Members who opted into the services map will appear here for approval before they reach the public map.",
  },
];

const DEFAULT_TAB: TabId = "leads";

export default function AdminConsole() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/admin/:tab");
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [checking, setChecking] = useState(true);

  const activeTab =
    TABS.find((t) => t.id === params?.tab && !t.hidden)?.id ?? DEFAULT_TAB;
  const active = TABS.find((t) => t.id === activeTab)!;

  // Console is admin-only. Bounce to the login screen when there is no session.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/auth/me", { credentials: "include" });
        if (cancelled) return;
        if (res.ok) {
          setAdmin((await res.json()).admin);
        } else {
          navigate("/admin");
        }
      } catch {
        if (!cancelled) navigate("/admin");
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      navigate("/admin");
    }
  };

  if (checking) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-[#0c141f] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#00AFE6] mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading console…</p>
        </div>
      </div>
    );
  }

  if (!admin) return null; // redirecting

  const displayName = admin.email.split("@")[0].replace(/[._-]+/g, " ");

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-[#0e1826] flex flex-col lg:flex-row">
      {/* ===================================================================
          Sidebar
      =================================================================== */}
      <aside className="w-full lg:w-80 shrink-0 bg-[#0c141f] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col p-5 gap-5">
        {/* Brand */}
        <div className="flex items-center gap-3 px-1 pt-1">
          <div className="w-12 h-12 rounded-xl bg-[#122232] border border-[#00AFE6]/25 flex items-center justify-center shrink-0">
            <LayoutGrid className="w-5 h-5 text-[#00AFE6]" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="font-serif text-xl text-white leading-tight">
              Admin Console
            </h1>
            <p className="text-xs text-slate-400 truncate">
              Canadian Amyloidosis Society
            </p>
          </div>
        </div>

        {/* Signed-in admin */}
        <div className="rounded-2xl bg-[#131f2d] border border-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#0f2a2f] border border-[#00DD89]/25 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#00DD89]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p
                className="text-white font-semibold capitalize truncate"
                data-testid="text-console-admin-name"
              >
                {displayName}
              </p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#00AFE6]/15 text-[#4EC8F0] border border-[#00AFE6]/30">
                {admin.role === "superadmin" ? "Administrator" : admin.role}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex flex-col gap-1.5" aria-label="Admin sections">
          {TABS.filter((tab) => !tab.hidden).map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              // wouter's <Link> renders the anchor itself — nesting an <a>
              // inside it produces invalid <a> in <a> markup.
              <Link
                key={tab.id}
                href={`/admin/${tab.id}`}
                aria-current={isActive ? "page" : undefined}
                data-testid={`link-console-${tab.id}`}
                className={`flex items-center justify-start gap-3 px-4 py-3.5 rounded-2xl text-[15px] transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-[#00AFE6] to-[#00DD89] text-white font-semibold shadow-lg shadow-[#00AFE6]/20"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="mt-auto pt-6 flex flex-col gap-3">
          <a
            href="/"
            className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white transition-colors py-2"
            data-testid="link-console-member-view"
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            Member view
          </a>
          <button
            onClick={handleSignOut}
            className="flex items-center justify-start gap-3 w-full px-4 py-3.5 rounded-2xl bg-[#131f2d] border border-white/5 text-slate-200 hover:text-white hover:bg-[#182636] transition-colors"
            data-testid="button-console-signout"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ===================================================================
          Content
      =================================================================== */}
      <main className="flex-1 min-w-0 p-6 md:p-10">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h2
            className="font-serif text-4xl md:text-[2.6rem] bg-gradient-to-r from-[#00AFE6] to-[#00DD89] bg-clip-text text-transparent mb-8 leading-tight"
            data-testid="text-console-title"
          >
            {active.title}
          </h2>

          {activeTab === "leads" ? (
            <LeadsPanel />
          ) : activeTab === "services-map" ? (
            <ServicesMapPanel />
          ) : activeTab === "resources" ? (
            <ResourcesEventsPanel />
          ) : (
            <EmptyState
              icon={active.icon}
              title={active.emptyTitle}
              body={active.emptyBody}
            />
          )}
        </motion.div>
      </main>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Placeholder shown in every tab until its data layer is built.
--------------------------------------------------------------------------- */
function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Users;
  title: string;
  body: string;
}) {
  return (
    <div
      className="rounded-2xl border border-dashed border-white/10 bg-[#0f1a28] px-6 py-20 flex flex-col items-center text-center"
      data-testid="empty-state"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#132234] border border-white/5 flex items-center justify-center mb-5">
        <Icon className="w-7 h-7 text-[#00AFE6]" aria-hidden="true" />
      </div>
      <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm max-w-md leading-relaxed">{body}</p>
      <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
        <Inbox className="w-3.5 h-3.5" aria-hidden="true" />
        Nothing to display yet
      </div>
    </div>
  );
}
