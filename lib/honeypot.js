/**
 * Honeypot — deljeno izmedju formi (klijent) i ruta (server).
 *
 * ⚠️ ZASTO JE OVO SVOJ MODUL. U MAIN-u je ime polja bilo LITERAL u obe forme, uz komentar
 * „jer bi import iz `lib/rate-limit.js` povukao `ioredis` u klijentski bundle" — i uz test
 * koji cita `.jsx` fajlove kao tekst da dve strane ne odu na razlicito ime.
 *
 * `ioredis` ovde vise ne postoji, ali razlog nije nestao — samo je dvaput promenio ime.
 * Na Cloudflare-u je `rate-limit.js` radio `import('cloudflare:workers')`; posle prelaska na
 * Vercel uvozi Neon drajver preko `@/db`. Nijedno od toga nema sta da trazi u klijentskom
 * bundle-u. Umesto da se ime polja opet duplira i cuva testom nad tekstom fajla, izdvojeno
 * je u modul koji obe strane STVARNO uvoze. Razilazenje time postaje nemoguce, ne samo
 * uhvatljivo.
 *
 * Isti obrazac kao `lib/form-options.js`: jedan izvor koji uvoze i forma i validacija.
 */

export const HONEYPOT_FIELD = 'company_website';

/**
 * ⚠️ Provera je "PRISUTAN I NIJE PRAZAN", nikad "mora postojati". Chatbot gadja
 * `/api/callback` a nije forma i polje moze izostati kod starijeg kesiranog klijenta —
 * da ruta zahteva prisustvo, Chatbot bi pukao. Rate limit ga svejedno pokriva.
 */
export function isHoneypotTripped(data) {
  const value = data?.[HONEYPOT_FIELD];
  return typeof value === 'string' && value.trim() !== '';
}
