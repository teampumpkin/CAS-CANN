import { useState } from "react";
import { motion } from "framer-motion";
import { Video, UploadCloud, Eye, EyeOff, Trash2, X } from "lucide-react";

/**
 * Recordings moderation.
 *
 * UI only for this pass. The row below is placeholder content — there is no
 * recordings API or storage backend yet, so nothing here uploads, reads, or
 * writes. The Recording shape is what that endpoint should return.
 */

interface Recording {
  id: string;
  title: string;
  fileName: string;
  /** Human-readable, e.g. "195.3 KB". Formatting belongs server-side. */
  fileSize: string;
  audience: string;
  published: boolean;
}

const SAMPLE_RECORDINGS: Recording[] = [
  {
    id: "1",
    title: "Test Recording Upload",
    fileName: "test-recording.mp4",
    fileSize: "195.3 KB",
    audience: "cas member",
    published: true,
  },
];

export default function RecordingsPanel() {
  const [items] = useState<Recording[]>(SAMPLE_RECORDINGS);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
          Upload member-only recordings. Files are stored via the configured storage
          backend and streamed to members through an authenticated endpoint (never a
          public link).
        </p>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          aria-expanded={showForm}
          className="h-11 px-5 shrink-0 rounded-xl bg-gradient-to-r from-[#3BA9E0] to-[#4BD6C0] text-white text-sm font-semibold flex items-center gap-2 hover:brightness-110 transition"
          data-testid="button-upload-recording"
        >
          {showForm ? (
            <>
              <X className="w-4 h-4" aria-hidden="true" />
              Close
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" aria-hidden="true" />
              Upload recording
            </>
          )}
        </button>
      </div>

      {showForm && <NewRecordingForm onCancel={() => setShowForm(false)} />}

      {/* List */}
      <div className="rounded-2xl border border-white/10 bg-[#0f1a28] overflow-hidden">
        {items.length === 0 ? (
          <div className="py-16 text-center px-6">
            <Video className="w-10 h-10 text-slate-600 mx-auto mb-3" aria-hidden="true" />
            <p className="text-white font-semibold mb-1">No recordings yet</p>
            <p className="text-slate-400 text-sm">
              Uploaded recordings will appear here, each with its own member access
              level.
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
              data-testid="row-recording"
            >
              <div className="w-11 h-11 rounded-xl bg-[#0f2a2f] border border-[#00DD89]/20 flex items-center justify-center shrink-0">
                <Video className="w-[18px] h-[18px] text-[#4BE0AC]" aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-slate-100 text-[15px] font-medium truncate">
                  {item.title}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 truncate">
                  {[item.fileName, item.fileSize, item.audience].join(" · ")}
                </div>
              </div>

              <span
                className={`shrink-0 h-10 px-4 rounded-xl text-sm font-medium flex items-center gap-2 border ${
                  item.published
                    ? "bg-[#0f2a24] border-[#00DD89]/25 text-[#7BE3B8]"
                    : "bg-white/5 border-white/10 text-slate-400"
                }`}
                data-testid="badge-recording-state"
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
                data-testid="button-delete-recording"
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


/* ---------------------------------------------------------------------------
   New recording form.

   UI only: the file input selects a file but nothing is uploaded, and there is
   no storage backend behind it yet. Field names match what the recordings
   endpoint should accept.
--------------------------------------------------------------------------- */

/** Mirrors the access tiers agreed for gated content. */
const ACCESS_LEVELS = ["Public", "Members", "CANN only"];

function NewRecordingForm({ onCancel }: { onCancel: () => void }) {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-[#0f1a28] p-6"
      data-testid="form-new-recording"
    >
      <h3 className="text-white font-semibold mb-5">New recording</h3>

      <div className="space-y-4">
        {/* Drop zone */}
        <div>
          <span className="block text-xs text-slate-400 mb-1.5">
            Recording file<span className="text-[#4EC8F0]"> *</span>
          </span>
          <label
            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/15 bg-[#0b131f]/40 py-14 px-6 cursor-pointer hover:border-[#00AFE6]/40 hover:bg-[#0b131f]/70 transition-colors"
            data-testid="dropzone-recording"
          >
            <span className="w-12 h-12 rounded-xl bg-[#132234] border border-white/5 flex items-center justify-center">
              <UploadCloud className="w-5 h-5 text-[#4EC8F0]" aria-hidden="true" />
            </span>
            <span className="text-slate-200 text-sm">
              {fileName ?? "Click to choose a video file"}
            </span>
            <span className="text-xs text-slate-500">MP4, MOV, WebM…</span>
            <input
              type="file"
              name="file"
              accept="video/mp4,video/quicktime,video/webm"
              className="sr-only"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
              data-testid="input-recording-file"
            />
          </label>
        </div>

        <label className="block">
          <span className="block text-xs text-slate-400 mb-1.5">
            Title<span className="text-[#4EC8F0]"> *</span>
          </span>
          <input
            name="title"
            placeholder="e.g. AL Amyloidosis Masterclass"
            className="w-full h-11 rounded-lg bg-[#0b131f] border border-white/10 px-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#00AFE6]/50"
          />
        </label>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-xs text-slate-400 mb-1.5">Who can access</span>
            <select
              name="accessLevel"
              defaultValue=""
              className="w-full h-11 rounded-lg bg-[#0b131f] border border-white/10 px-3 text-sm text-slate-200 focus:outline-none focus:border-[#00AFE6]/50"
            >
              <option value="" />
              {ACCESS_LEVELS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-xs text-slate-400 mb-1.5">Recorded on</span>
            <input
              name="recordedOn"
              type="date"
              className="w-full h-11 rounded-lg bg-[#0b131f] border border-white/10 px-3 text-sm text-slate-200 focus:outline-none focus:border-[#00AFE6]/50"
            />
          </label>
        </div>

        <label className="block">
          <span className="block text-xs text-slate-400 mb-1.5">Description</span>
          <textarea
            name="description"
            rows={3}
            placeholder="Short summary of the recording"
            className="w-full rounded-lg bg-[#0b131f] border border-white/10 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#00AFE6]/50 resize-y"
          />
        </label>

        <label className="flex items-center gap-2.5 text-sm text-slate-300 cursor-pointer pt-1">
          <input
            type="checkbox"
            name="publishImmediately"
            defaultChecked
            className="w-4 h-4 rounded accent-[#00AFE6]"
          />
          Publish immediately
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 px-5 rounded-xl bg-[#131f2d] border border-white/10 text-slate-300 text-sm font-medium hover:text-white hover:bg-[#182636] transition"
          data-testid="button-cancel-recording"
        >
          Cancel
        </button>
        <button
          type="button"
          className="h-11 px-5 rounded-xl bg-gradient-to-r from-[#3BA9E0] to-[#4BD6C0] text-white text-sm font-semibold flex items-center gap-2 hover:brightness-110 transition"
          data-testid="button-submit-recording"
        >
          <UploadCloud className="w-4 h-4" aria-hidden="true" />
          Upload recording
        </button>
      </div>
    </motion.div>
  );
}
