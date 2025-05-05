import { serve } from "https://deno.land/std@0.220.1/http/server.ts";
import { serveDir } from "https://deno.land/std@0.220.1/http/file_server.ts";

// Configuration
const PORT = 8000;
const ROOT_DIR = "./src";

console.log(`Starting phoneme generator server on http://localhost:${PORT}`);

await serve((req) => {
  const url = new URL(req.url);
  console.log(`${req.method} ${url.pathname}`);

  // Special handling for WebAssembly files
  if (url.pathname.endsWith('.wasm')) {
    console.log(`Serving WebAssembly file: ${url.pathname}`);
    return new Response(await Deno.readFile(`${ROOT_DIR}${url.pathname}`), {
      headers: {
        "Content-Type": "application/wasm",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  // Serve static files from src directory
  return serveDir(req, {
    fsRoot: ROOT_DIR,
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
}, { port: PORT });