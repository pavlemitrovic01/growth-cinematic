#!/usr/bin/env node
/**
 * verify-nojs — dokazuje da je sadrzaj citljiv BEZ JavaScripta, na svakoj ruti.
 *
 * ⚠️ ADAPTIRANO, NE PREPISANO. Izvorni projekat (`C:/dev/growth/scripts/verify-nojs.mjs`)
 * cilja jedan konkretan uzrok: framer-motion pece `initial` stanje u SSR HTML kao obican
 * inline `opacity:0`, koji se bez JS-a nikad ne ponisti. Ovaj projekat nema framer-motion,
 * pa bi doslovan prenos proveravao problem koji ne postoji.
 *
 * Ovde je rizik drugi: hero je 3D scena koja se ucitava dinamicki, a copy oko nje mora
 * postojati i kad se scena nikad ne pokrene (mobilni, reduced-motion, saveData, WebGL pao).
 * Zato skripta meri PRISUSTVO teksta u serverskom HTML-u, a ne odsustvo jednog stila —
 * i uz to i dalje trazi stilove koji sakrivaju, jer su jeftini za proveru.
 *
 * Upotreba:
 *   node scripts/verify-nojs.mjs                # protiv servera na :5173
 *   node scripts/verify-nojs.mjs --port 5199
 *
 * ⚠️ Trazi POKRENUT server (`npm run dev` ili `node scripts/preview.mjs`). Ne pokrece ga
 * sam — pozivalac bira da li meri dev ili build.
 */

const PORT = (() => {
  const i = process.argv.indexOf('--port');
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : '5173';
})();
const BASE = `http://localhost:${PORT}`;

/** Minimum teksta koji ruta mora imati u serverskom HTML-u, i markeri koji moraju postojati. */
const ROUTES = [
  { path: '/', min: 1500, needs: ['Straight answers', 'partner carriers', 'Apply'] },
  { path: '/apply', min: 900, needs: ['Class A', 'Consent is not a condition', 'company_website'] },
  { path: '/for-carriers', min: 700, needs: ['Consent is not a condition', 'company_website'] },
  { path: '/how-it-works', min: 1200, needs: ['One honest caveat', 'as little as 3'] },
  { path: '/about', min: 900, needs: ['Nate Mikic'] },
  // ⚠️ Bez doslovnog markera. Prva verzija je trazila frazu prepisanu iz izvornog projekta i
  // pala je cim je FAQ legitimno prepisan — provera koja puca na tacnu izmenu teksta meri
  // pogresnu stvar. Umesto toga se dole proverava da je SVAKI odgovor iz `lib/faq.js`
  // prisutan u serverskom HTML-u; to je ono sto no-JS ugovor stvarno trazi, i prati sadrzaj samo.
  { path: '/faq', min: 2000, needs: [], everyFaqAnswer: true },
  { path: '/contact', min: 500, needs: ['Consent is not a condition'] },
  { path: '/privacy', min: 2000, needs: ['Where Your Information Is Stored', 'Telephone Consumer Protection Act'] },
  { path: '/terms', min: 900, needs: ['not a motor carrier'] },
  { path: '/truckers-lounge', min: 500, needs: ['Truckers'] },
  { path: '/nepostojeca-ruta-za-proveru', min: 200, needs: ['Wrong exit'], status: 404 },
];

/** Telefon mora biti dohvatljiv sa SVAKE rute — bez JS-a je to jedini izlaz. */
const PHONE = '(240) 226-3786';

/** Inline stilovi koji sadrzaj cine nevidljivim ili ga izbacuju iz kadra. */
const HIDING = [
  { name: 'opacity:0', re: /style="[^"]*opacity\s*:\s*0(?!\.)/ },
  { name: 'display:none', re: /style="[^"]*display\s*:\s*none/ },
  { name: 'visibility:hidden', re: /style="[^"]*visibility\s*:\s*hidden/ },
];

/**
 * Elementi koji SMEJU startovati skriveni — imenovani, ne pretpostavljeni.
 * Svaki izuzetak nosi razlog; „ne izgleda kao problem" nije razlog.
 */
const ALLOWED_HIDDEN = [
  // Honeypot je van ekrana po dizajnu (SEC2). Ne koristi display:none bas zato sto
  // deo botova takva polja preskace; pozicioniran je van kadra kroz klasu, ne inline.
  'company_website',
];

function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const fails = [];
const rows = [];

for (const route of ROUTES) {
  const expected = route.status ?? 200;
  let res, html;
  try {
    res = await fetch(BASE + route.path);
    html = await res.text();
  } catch (error) {
    fails.push(`${route.path} — server nedostupan: ${error.message}`);
    continue;
  }

  if (res.status !== expected) fails.push(`${route.path} — status ${res.status}, ocekivan ${expected}`);

  const text = textOf(html);
  if (text.length < route.min) {
    fails.push(`${route.path} — samo ${text.length} znakova teksta, minimum ${route.min}`);
  }

  for (const marker of route.needs) {
    if (!html.includes(marker)) fails.push(`${route.path} — nedostaje marker: "${marker}"`);
  }

  // Sklopljen `<details>` drzi odgovor u DOM-u, pa mora biti u serverskom HTML-u — i za
  // pretragu i za citac ekrana. Odgovori se citaju iz `lib/faq.js`, pa provera prati sadrzaj.
  if (route.everyFaqAnswer) {
    const { FAQ_ITEMS } = await import('../lib/faq.js');
    const missing = FAQ_ITEMS.filter((item) => !textOf(html).includes(textOf(item.a).slice(0, 60)));
    if (missing.length) {
      fails.push(`${route.path} — ${missing.length}/${FAQ_ITEMS.length} FAQ odgovora nije u HTML-u: ${missing.map((m) => m.id).join(', ')}`);
    }
  }

  if (!html.includes(PHONE)) fails.push(`${route.path} — telefon nije dohvatljiv bez JS-a`);

  for (const rule of HIDING) {
    const hits = html.match(new RegExp(rule.re.source, 'g')) ?? [];
    const unexplained = hits.filter((hit) => !ALLOWED_HIDDEN.some((ok) => {
      const at = html.indexOf(hit);
      return html.slice(Math.max(0, at - 300), at + 300).includes(ok);
    }));
    if (unexplained.length) {
      fails.push(`${route.path} — ${unexplained.length}x ${rule.name} bez obrazlozenja`);
    }
  }

  rows.push([route.path, String(res.status), String(text.length)]);
}

const width = Math.max(...rows.map((r) => r[0].length), 6);
console.log('ruta'.padEnd(width), 'st   znakova');
for (const [p, s, n] of rows) console.log(p.padEnd(width), s.padEnd(4), n.padStart(6));

console.log();
if (fails.length) {
  console.error(`FAIL — ${fails.length} nalaza:`);
  for (const f of fails) console.error('  · ' + f);
  process.exit(1);
}
console.log(`PASS — ${rows.length} ruta, sadrzaj i telefon dostupni bez JavaScripta.`);
