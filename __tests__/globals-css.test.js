import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Statican nadzor nad `app/globals.css`. Bez browsera — ovo su tvrdnje o SAMOM fajlu.
 *
 * ⚠️ ZASTO POSTOJI OVAKAV OBLIK. `K1` je krenuo da svede fajl na „jedna deklaracija po
 * selektoru" i merenjem dokazao da to ovde NIJE mehanicki posao: od 109 preklapanja samo
 * jedno se moglo spojiti bez promene izgleda, jer redosled nosi kaskadu (vidi `LESSONS` L26).
 * Zato ovde ne stoji zabrana preklapanja nego CENZUS — broj koji sme da se promeni samo u
 * batchu koji svesno menja CSS, isto kao `G1/C` za atribute pokreta.
 *
 * ⚠️ Dve tvrdnje, dva `it` bloka (`LESSONS` L19): u jednom bloku bi prvi `expect` prekidao
 * drugi, pa se druga tvrdnja nikad ne bi mogla dokazati crvenom.
 */

const CSS_PATH = 'app/globals.css';
const src = fs.readFileSync(CSS_PATH, 'utf8');
// komentari -> razmaci, prelomi sacuvani, pa pozicije i linije ostaju tacne
const clean = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));

/** Pravila sa kontekstom at-pravila u kome zive; `@keyframes` blokovi se preskacu. */
function parseRules() {
  const rules = [];
  const stack = [];
  let buf = '';
  let inKeyframes = 0;
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (c === '{') {
      const prelude = buf.trim().replace(/\s+/g, ' ');
      buf = '';
      if (prelude.startsWith('@')) {
        if (/^@(keyframes|font-face|property)/.test(prelude)) inKeyframes++;
        stack.push({ kind: 'at', prelude });
      } else if (inKeyframes) {
        stack.push({ kind: 'keyframe' });
      } else {
        const ctx = stack.filter((s) => s.kind === 'at').map((s) => s.prelude).join(' && ') || '(top)';
        rules.push({ ctx, sels: prelude.split(',').map((s) => s.trim()).filter(Boolean) });
        stack.push({ kind: 'rule' });
      }
    } else if (c === '}') {
      const top = stack.pop();
      if (top && top.kind === 'at' && /^@(keyframes|font-face|property)/.test(top.prelude)) inKeyframes--;
      buf = '';
    } else {
      buf += c;
    }
  }
  return rules;
}

function sourceText() {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (/\.(tsx?|jsx?|mjs)$/.test(entry.name)) out.push(fs.readFileSync(p, 'utf8'));
    }
  };
  for (const dir of ['app', 'components', 'lib']) walk(dir);
  return out.join('\n');
}

describe('globals.css', () => {
  it('K1/A — census suvisnih deklaracija (ista selektor+kontekst vise puta)', () => {
    const seen = new Map();
    for (const r of parseRules()) {
      for (const sel of r.sels) {
        const key = r.ctx + ' ||| ' + sel;
        seen.set(key, (seen.get(key) || 0) + 1);
      }
    }
    /* ⚠️ MERI SE BROJ SUVISNIH DEKLARACIJA, NE BROJ SELEKTORA SA PREKLAPANJEM.
     *  Prva verzija je brojala selektore i falsifikacija ju je oborila: dodavanje CETVRTE
     *  pojave vec duplikovanog `.foot-tag` nije pomerilo broj, pa bi takva regresija prosla
     *  neprimeceno. Suma `(pojava - 1)` po grupi hvata svako novo dupliranje. */
    const redundant = [...seen.values()].reduce((sum, n) => sum + (n - 1), 0);

    /* ⚠️ BROJ SE MENJA SAMO U BATCHU KOJI SVESNO MENJA CSS, nikad kao zaseban „fix testa".
     *  `K1` ga je spustio za dva: spojen `[data-line]::before` i uklonjena mrtva
     *  `.contact-sub`. Ono sto ostaje NIJE nered — izmereno je da tim pravilima redosled
     *  nosi izgled (`LESSONS` L26). Ko spusti broj, mora da dokaze da se render nije pomerio.
     *  `RD15` ga je podigao za dva (141 -> 143): `.journey-shade` sada ima ogledalo (`journey-shade-right`)
     *  koje prati stranu aktivnog poglavlja, pa isti selektor postoji u dva konteksta, i `.journey-beat`
     *  dobija centrirani finale u desktop media query-ju. Oba su namerna i izmerena. */
    expect(redundant).toBe(143);
  });

  it('K1/B — nijedna klasa u CSS-u nije bez ijednog pomena u izvoru', () => {
    /* ⚠️ `url(...)` SE BRISE PRE TRAZENJA KLASA (T1, 2026-09-14). Putanja fajla nije selektor, a
     *  `url("/fonts/arimo-v36-latin.woff2")` je dala "klasu" `woff2` bez ijednog pomena u izvoru —
     *  lazan nalaz iste vrste kao `subpage--*` ispod (`LESSONS` L18). */
    const selectors = clean.replace(/url\([^)]*\)/g, 'url()');
    const declared = new Set([...selectors.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]));
    const code = sourceText();

    /* ⚠️ IME KLASE NE MORA DA POSTOJI DOSLOVNO U IZVORU. `PageShell.tsx:11` ga sklapa u
     *  runtime-u: `'subpage subpage--' + variant`, pa `subpage--article` i `subpage--form`
     *  nikad ne stoje kao string. Prva verzija ove provere ih je zato prijavila kao mrtve —
     *  provera je bila kriva, ne CSS (`LESSONS` L18). Zato se priznaje i pomen PREFIKSA do
     *  `--`, sto je tacno oblik u kome se ime sklapa. */
    const mentioned = (cls) => {
      if (code.includes(cls)) return true;
      const cut = cls.lastIndexOf('--');
      return cut > 0 && code.includes(cls.slice(0, cut + 2));
    };
    const orphans = [...declared].filter((cls) => !mentioned(cls)).sort();

    /* ⚠️ Trazi se POMEN U IZVORU, ne pojava u renderovanom HTML-u: 26 klasa je dinamicko
     *  (`consent-*`, `error-*`, `form-done`, `is-*`), pa ih staticki render nikad ne pokaze —
     *  a zive su. `K1` je ovim merilom nasao tacno tri mrtve (`contact-h2`, `contact-sub`,
     *  `home-noscript`) i obrisao ih. */
    expect(orphans).toEqual([]);
  });
});
