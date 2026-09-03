/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

/**
 * Prenos konfiguracije iz Workers bindinga u `process.env`.
 *
 * ⚠️ Zasto ovde a ne na pozivnim mestima: `lib/email.js` je prenet iz MAIN-a
 * (`C:/dev/growth`) neizmenjen, zajedno sa svojim testovima koji ga mock-uju preko
 * `process.env`. Prepisivanje na `import { env } from "cloudflare:workers"` bi
 * `isEmailConfigured()` moralo da pretvori u async funkciju, sto se dalje prenosi na
 * sve tri API rute i na tri test fajla — sve to da bi se procitala jedna vrednost.
 *
 * `nodejs_compat` je ukljucen (`vite.config.ts`), pa `process` ovde postoji. Kopiranje
 * je uslovno (`??=`) da lokalni `.dev.vars` ili pravi Node env nikad ne budu pregazeni.
 *
 * Kopiraju se ISKLJUCIVO string vrednosti — D1/R2/ASSETS bindingovi su objekti i u
 * `process.env` nemaju sta da traze; njih citaju `db/index.ts` i `lib/rate-limit.js`
 * direktno iz `cloudflare:workers`.
 */
function hydrateProcessEnv(env: Env): void {
  const target = globalThis.process?.env;
  if (!target) return;
  for (const [key, value] of Object.entries(env as Record<string, unknown>)) {
    if (typeof value === "string") target[key] ??= value;
  }
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    hydrateProcessEnv(env);
    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
