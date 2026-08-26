import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Plus, Eye, EyeOff, Trash2, X } from "lucide-react";

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
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-slate-400 text-sm">
          Manage member events, webinars &amp; recordings shown in the portal.
        </p>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          aria-expanded={showForm}
          className="h-11 px-5 shrink-0 rounded-xl bg-gradient-to-r from-[#3BA9E0] to-[#4BD6C0] text-white text-sm font-semibold flex items-center gap-2 hover:brightness-110 transition"
          data-testid="button-add-event"
        >
          {showForm ? (
            <>
              <X className="w-4 h-4" aria-hidden="true" />
              Close
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" aria-hidden="true" />
              Add event
            </>
          )}
        </button>
      </div>

      {showForm && <NewEventForm onCancel={() => setShowForm(false)} />}

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


/* ---------------------------------------------------------------------------
   New event form.

   UI only: fields are uncontrolled and nothing is submitted. Field names match
   what the events endpoint should accept, so wiring this up later is adding a
   handler rather than rebuilding the form.
--------------------------------------------------------------------------- */

const EVENT_TYPES = ["Webinar", "Recording", "Conference", "Meeting", "Townhall"];
const AUDIENCES = ["Public", "CAS member", "CANN member"];
/** Mirrors the access tiers agreed for gated content. */
const ACCESS_LEVELS = ["Public", "Members", "CANN only"];

function NewEventForm({ onCancel }: { onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-[#0f1a28] p-6"
      data-testid="form-new-event"
    >
      <h3 className="text-white font-semibold mb-5">New event</h3>

      <div className="space-y-4">
        <Field label="Title" required>
          <Input name="title" placeholder="e.g. CANN Educational Series" />
        </Field>

        <Field label="Presentation title">
          <Input name="presentationTitle" placeholder="Session/talk title (optional)" />
        </Field>

        <Row>
          <Field label="Speaker(s)">
            <Input name="speakers" placeholder="e.g. Dr. Jane Doe, RN" />
          </Field>
          <Field label="Topic">
            <Input name="topic" placeholder="Session topic (optional)" />
          </Field>
        </Row>

        <Row>
          <Field label="Event type">
            <Select name="eventType" options={EVENT_TYPES} />
          </Field>
          <Field label="Audience">
            <Select name="audience" options={AUDIENCES} />
          </Field>
        </Row>

        <Row>
          <Field label="Date">
            <Input name="date" type="date" />
          </Field>
          <Field label="Time (label)">
            <Input name="time" placeholder="e.g. 5:00 PM – 6:00 PM EST" />
          </Field>
        </Row>

        <Row>
          <Field label="Location">
            <Input name="location" placeholder="e.g. Toronto, ON" />
          </Field>
          <Field label="Format">
            <Input name="format" placeholder="e.g. Virtual / In-person" />
          </Field>
        </Row>

        <Row>
          <Field label="CME credits">
            <Input name="cmeCredits" placeholder="e.g. 1 hour" />
          </Field>
          <Field label="Registration status">
            <Input name="registrationStatus" placeholder="e.g. Registration is open" />
          </Field>
        </Row>

        <Row>
          <Field label="Registration link">
            <Input name="registrationUrl" type="url" placeholder="https://..." />
          </Field>
          <Field label="Meeting link (virtual join)">
            <Input name="meetingUrl" type="url" placeholder="https://..." />
          </Field>
        </Row>

        <Row>
          <Field label="Member access level">
            <Select name="accessLevel" options={ACCESS_LEVELS} />
          </Field>
          <div />
        </Row>

        <Field label="Description">
          <textarea
            name="description"
            rows={3}
            placeholder="Short summary of the event"
            className="w-full rounded-lg bg-[#0b131f] border border-white/10 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#00AFE6]/50 resize-y"
          />
        </Field>

        <div className="grid md:grid-cols-2 gap-4 pt-1">
          <Checkbox name="requiresCannMembership" label="Requires CANN membership" />
          <Checkbox name="publishImmediately" label="Publish immediately" defaultChecked />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 px-5 rounded-xl bg-[#131f2d] border border-white/10 text-slate-300 text-sm font-medium hover:text-white hover:bg-[#182636] transition"
          data-testid="button-cancel-event"
        >
          Cancel
        </button>
        <button
          type="button"
          className="h-11 px-5 rounded-xl bg-gradient-to-r from-[#3BA9E0] to-[#4BD6C0] text-white text-sm font-semibold flex items-center gap-2 hover:brightness-110 transition"
          data-testid="button-create-event"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Create event
        </button>
      </div>
    </motion.div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid md:grid-cols-2 gap-4">{children}</div>;
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-slate-400 mb-1.5">
        {label}
        {required && <span className="text-[#4EC8F0]"> *</span>}
      </span>
      {children}
    </label>
  );
}

function Input({
  name,
  type = "text",
  placeholder,
}: {
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      className="w-full h-11 rounded-lg bg-[#0b131f] border border-white/10 px-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#00AFE6]/50"
    />
  );
}

function Select({ name, options }: { name: string; options: string[] }) {
  return (
    <select
      name={name}
      defaultValue=""
      className="w-full h-11 rounded-lg bg-[#0b131f] border border-white/10 px-3 text-sm text-slate-200 focus:outline-none focus:border-[#00AFE6]/50"
    >
      <option value="" />
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-slate-300 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="w-4 h-4 rounded accent-[#00AFE6]"
      />
      {label}
    </label>
  );
}
