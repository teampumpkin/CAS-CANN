import { useState } from "react";
import { motion } from "framer-motion";
import { Video, UploadCloud, Eye, EyeOff, Trash2 } from "lucide-react";

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
          className="h-11 px-5 shrink-0 rounded-xl bg-gradient-to-r from-[#3BA9E0] to-[#4BD6C0] text-white text-sm font-semibold flex items-center gap-2 hover:brightness-110 transition"
          data-testid="button-upload-recording"
        >
          <UploadCloud className="w-4 h-4" aria-hidden="true" />
          Upload recording
        </button>
      </div>

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
