/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import { protectResponse, rejectCrossOrigin } from '../lib/security';
import { IS_LIVE } from '../lib/seo';
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  // ⚠️ Opcion: hosting.json ga ne deklarise, pa je na runtime-u undefined. Vidi guard u fetch().
  IMAGES?: {
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
  if (!target || !env) return;
  // `Env` nema index potpis, pa direktan cast na Record TypeScript odbija — ide preko
  // `unknown`, sto je i tacnije: ovde se namerno gleda oblik koji tip ne opisuje.
  for (const [key, value] of Object.entries(env as unknown as Record<string, unknown>)) {
    if (typeof value === "string") target[key] ??= value;
  }
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    hydrateProcessEnv(env);
    const url = new URL(request.url);

    const api = url.pathname.startsWith('/api/');
    const protect = (response: Response) => protectResponse(response, { dev: process.env.NODE_ENV === 'development', live: IS_LIVE, api });
    if (api && request.method === 'POST' && rejectCrossOrigin(request)) {
      return protect(Response.json({ error: 'Cross-origin request rejected' }, { status: 403 }));
    }
    if (url.pathname === "/_vinext/image") {
      /**
       * ⚠️ Bez ASSETS bindinga ovaj endpoint ne moze da radi — `fetchAsset` bi bacio
       * TypeError i posetilac bi dobio 500. Izmereno u dev-u, gde vite sam servira statiku
       * pa binding ne postoji. U produkciji ga platforma vezuje, ali endpoint je javan i ne
       * sme da odgovara petsticom ni u jednom okruzenju.
       *
       * 404 je ovde tacniji od 500: bez bindinga optimizovana varijanta stvarno ne postoji.
       */
      if (!env.ASSETS) {
        console.warn("[image] ASSETS binding ne postoji — endpoint nije dostupan.");
        return protect(new Response("Not Found", { status: 404 }));
      }
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return protect(await handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        /**
         * ⚠️ `env.IMAGES` NE POSTOJI na ovom projektu. `.openai/hosting.json` deklarise
         * samo `d1`; images binding se tamo ne moze ni ukljuciti. Bez ove provere
         * `env.IMAGES.input(...)` baca TypeError i endpoint vraca 500 — izmereno.
         *
         * Sajt to danas ne primecuje jer ne koristi `next/image` (jedina slika je obican
         * `<img>` iz statike), ali je `/_vinext/image` javno dohvatljiv i svako ga moze
         * pogoditi. Gore: cim neko doda `next/image`, slike tiho pucaju u produkciji.
         *
         * Zato degradacija umesto pada: vraca se NEOPTIMIZOVAN original. Slika je i dalje
         * ispravna, samo veca. Kad binding jednom postoji, ova grana se sama prestane koristiti.
         */
        transformImage: async (body, { width, format, quality }) => {
          if (!env.IMAGES) {
            console.warn("[image] IMAGES binding ne postoji — vracam neoptimizovan original.");
            return new Response(body);
          }
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths));
    }

    return protect(await handler.fetch(request, env, ctx));
  },
};

export default worker;
