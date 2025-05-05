/**
 * Script to copy source files to dist directory
 */

import { copy } from "https://deno.land/std@0.220.1/fs/copy.ts";
import { ensureDir } from "https://deno.land/std@0.220.1/fs/ensure_dir.ts";

const SOURCE_DIR = "./src";
const DIST_DIR = "./dist";

async function copyFiles() {
  console.log("Copying files from src to dist...");

  try {
    // Ensure dist directory exists
    await ensureDir(DIST_DIR);
    
    // Copy all files from src to dist
    await copy(SOURCE_DIR, DIST_DIR, { overwrite: true });
    
    console.log("Files copied successfully!");
  } catch (error) {
    console.error("Error copying files:", error);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await copyFiles();
}