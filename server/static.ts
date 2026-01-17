import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export function serveStatic(app: Express) {
  // Handle both bundled (dist/index.js) and source (server/index.ts) execution
  // When bundled: import.meta.dirname = dist/, look for dist/public
  // When running from source with tsx: import.meta.dirname = server/, look for dist/public from project root
  let distPath = path.resolve(import.meta.dirname, "public");
  
  if (!fs.existsSync(distPath)) {
    // Fallback: try from project root (for tsx execution)
    distPath = path.resolve(import.meta.dirname, "..", "dist", "public");
  }

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }
  
  log(`Serving static files from: ${distPath}`);

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
