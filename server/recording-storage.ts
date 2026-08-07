import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";

/**
 * Pluggable storage backend for member recording files.
 *
 * The feature code (upload + streaming endpoints) only talks to this interface,
 * so the storage backend can be swapped (e.g. to S3/GCS) by providing another
 * implementation of `RecordingStorage` and exporting it as `recordingStorage`
 * below — without changing any route/UI code.
 */
export interface StoredObjectInfo {
  size: number;
  contentType?: string;
}

export interface RecordingStorage {
  /** Persist a file (from a local temp path) under `key`. Returns size/contentType. */
  put(key: string, sourcePath: string, contentType?: string): Promise<StoredObjectInfo>;
  /** Return size/contentType for `key`, or null if it doesn't exist. */
  stat(key: string): Promise<StoredObjectInfo | null>;
  /** Readable stream for `key`; when `range` is given, only those bytes (inclusive). */
  createReadStream(key: string, range?: { start: number; end: number }): NodeJS.ReadableStream;
  /** Remove the object (no-op if missing). */
  delete(key: string): Promise<void>;
}

/** Default implementation: local disk under RECORDINGS_DIR (mount durable storage here in prod). */
class LocalDiskStorage implements RecordingStorage {
  constructor(private baseDir: string) {
    fs.mkdirSync(this.baseDir, { recursive: true });
  }
  private full(key: string) {
    // prevent path traversal
    const safe = key.replace(/\.\.(\/|\\|$)/g, "");
    return path.join(this.baseDir, safe);
  }
  async put(key: string, sourcePath: string, contentType?: string): Promise<StoredObjectInfo> {
    const dest = this.full(key);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    await pipeline(fs.createReadStream(sourcePath), fs.createWriteStream(dest));
    return { size: fs.statSync(dest).size, contentType };
  }
  async stat(key: string): Promise<StoredObjectInfo | null> {
    try {
      return { size: fs.statSync(this.full(key)).size };
    } catch {
      return null;
    }
  }
  createReadStream(key: string, range?: { start: number; end: number }): NodeJS.ReadableStream {
    return range
      ? fs.createReadStream(this.full(key), { start: range.start, end: range.end })
      : fs.createReadStream(this.full(key));
  }
  async delete(key: string): Promise<void> {
    try {
      fs.unlinkSync(this.full(key));
    } catch {
      /* already gone */
    }
  }
}

const RECORDINGS_DIR = process.env.RECORDINGS_DIR || path.join(process.cwd(), "uploads", "recordings");

// Swap this export for an S3/GCS implementation of RecordingStorage when ready.
export const recordingStorage: RecordingStorage = new LocalDiskStorage(RECORDINGS_DIR);

/** Temp dir used by multer before handing the file to the storage adapter. */
export const RECORDINGS_TMP_DIR = path.join(RECORDINGS_DIR, ".tmp");
fs.mkdirSync(RECORDINGS_TMP_DIR, { recursive: true });
