#!/usr/bin/env node

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get port from environment variable or use default
const port = process.env.PORT || 8080;

console.log(`🚀 Starting NearMe Frontend on port ${port}`);

// Start the Vite preview server
const viteProcess = spawn(
  "npx",
  ["vite", "preview", "--host", "0.0.0.0", "--port", port.toString()],
  {
    stdio: "inherit",
    shell: true,
    cwd: __dirname,
  }
);

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...");
  viteProcess.kill("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down server...");
  viteProcess.kill("SIGTERM");
  process.exit(0);
});

viteProcess.on("close", (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

viteProcess.on("error", (error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
