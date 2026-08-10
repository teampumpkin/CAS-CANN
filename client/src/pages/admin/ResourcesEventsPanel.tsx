import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Plus, Eye, EyeOff, Trash2 } from "lucide-react";

/**
 * Resources & Events moderation.
 *
 * UI only for this pass. The rows below are placeholder content matching the
 * agreed design — there is no events/resources API yet, so nothing here reads
 * or writes. Swap SAMPLE_ITEMS for a fetch when the endpoint exists; the row
 * shape is already what that endpoint should return.
 */

type ItemKind = "Webinar" | "Recording" | "Conference";

interface ResourceEvent {
  id: string;
  kind: ItemKind;
  title: string;
  /** Small qualifier shown after the title, e.g. "· recording". */
  note?: string;
  date: string;
  location: string | null;
  audience: string;
  published: boolean;
}

const SAMPLE_ITEMS: ResourceEvent[] = [
  {
    id: "1",
    kind: "Webinar",
    title: "CANN Educational Series — Nov 2026",
    date: "Nov 20, 2026",
    location: "Virtual",
    audience: "cas member",
    published: true,
  },
  {
    id: "2",
    kind: "Webinar",
    title: "CANN Webinar: Cardiac Amyloidosis Update",
    date: "Aug 13, 2026",
    location: "Virtual",
    audience: "cas member",
    published: true,
  },
  {
    id: "3",
    kind: "Recording",
    title: "Test Recording Upload",
    date: "Aug 7, 2026",
    location: null,
    audience: "cas member",
    published: true,
  },
  {
    id: "4",
    kind: "Conference",
    title: "Recorded: Amyloidosis Diagnosis Masterclass",
    note: "recording",
    date: "Jul 7, 2026",
    location: "Toronto",
    audience: "cas member",
    published: true,
  },
];

export default function ResourcesEventsPanel() {
  const [items] = useState<ResourceEvent[]>(SAMPLE_ITEMS);

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-slate-400 text-sm">
          Manage member events, webinars &amp; recordings shown in the portal.
        </p>
        <button
          type="button"
          className="h-11 px-5 shrink-0 rounded-xl bg-gradient-to-r from-[#3BA9E0] to-[#4BD6C0] text-white text-sm font-semibold flex items-center gap-2 hover:brightness-110 transition"
          data-testid="button-add-event"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add event
        </button>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-white/10 bg-[#0f1a28] overflow-hidden">
        {items.length === 0 ? (
          <div className="py-16 text-center px-6">
            <CalendarDays className="w-10 h-10 text-slate-600 mx-auto mb-3" aria-hidden="true" />
            <p className="text-white font-semibold mb-1">Nothing published yet</p>
            <p className="text-slate-400 text-sm">
              Events, webinars and recordings you add will appear here.
            </p>
          </div>
        ) : (
          items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: Math.min(i * 0.04, 0.3) }}
              className="flex items-center gap-4 px-4 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
              data-testid="row-resource-event"
            >
              <div className="w-11 h-11 rounded-xl bg-[#132234] border border-white/5 flex items-center justify-center shrink-0">
                <CalendarDays className="w-[18px] h-[18px] text-[#4EC8F0]" aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <KindBadge kind={item.kind} />
                  <span className="text-slate-100 text-[15px] font-medium truncate">
                    {item.title}
                  </span>
                  {item.note && (
                    <span className="text-xs text-slate-500 shrink-0">· {item.note}</span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 truncate">
                  {[item.date, item.location ?? "—", item.audience].join(" · ")}
                </div>
              </div>

              <span
                className={`shrink-0 h-10 px-4 rounded-xl text-sm font-medium flex items-center gap-2 border ${
                  item.published
                    ? "bg-[#0f2a24] border-[#00DD89]/25 text-[#7BE3B8]"
                    : "bg-white/5 border-white/10 text-slate-400"
                }`}
                data-testid="badge-publish-state"
              >
                {item.published ? (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                )}
                {item.published ? "Published" : "Hidden"}
              </span>

              <button
                type="button"
                aria-label={`Delete ${item.title}`}
                className="shrink-0 w-10 h-10 rounded-xl text-slate-500 hover:text-red-400 hover:bg-white/5 flex items-center justify-center transition-colors"
                data-testid="button-delete-event"
              >
                <Trash2 className="w-[18px] h-[18px]" aria-hidden="true" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function KindBadge({ kind }: { kind: ItemKind }) {
  return (
    <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gradient-to-r from-[#5CC8F5] to-[#5FE3B4] text-[#0b1420]">
      {kind}
    </span>
  );
}
