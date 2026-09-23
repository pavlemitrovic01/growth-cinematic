import { describe, it, expect } from 'vitest';
import { observedFor, groupByObserved, afterHydration } from '@/lib/motion-reveal';

/**
 * `RD1` — koji element posmatrac vidljivosti gleda za metu pokreta. Bez browsera: vitest ovde radi
 * u `node` okruzenju, pa su elementi obicni objekti sa `parentElement` i `hasAttribute`.
 *
 * ⚠️ ZASTO POSTOJI. `[data-wipe]` je skriven isecanjem na nultu povrsinu (`clip-path` u
 * `app/globals.css`), a browser racuna presek POSLE isecanja: posmatrac na samoj meti javlja
 * „ne ukrsta se, presek 0x0" i nikad vise. Izmereno 2026-09-16 u Pavlovom browseru (manifest `RD1`,
 * „Nalaz merenja"). Posledica: nijedan naslov sa `data-wipe` nije mogao da se pojavi — ni na
 * podstranicama ni na naslovnoj — a watchdog iz `app/layout.tsx` je u vidljivom tabu vec razoruzan.
 *
 * ⚠️ Svaka tvrdnja u svom `it` bloku (`LESSONS` L19); poredjenje po identitetu (`toBe`), jer su
 * lazni elementi strukturno isti i `toEqual` bi ih proglasio jednakim.
 */

function el(attrs = [], parentElement = null) {
  return { parentElement, hasAttribute: (name) => attrs.includes(name) };
}

describe('observedFor', () => {
  it('[data-wipe] se posmatra preko roditelja, jer je sam isecen na nultu povrsinu', () => {
    const header = el();
    const h1 = el(['data-wipe'], header);
    expect(observedFor(h1)).toBe(header);
  });

  it('mete koje se ne seku (reveal, stagger, line) posmatraju se same', () => {
    const section = el();
    for (const attr of ['data-reveal', 'data-stagger', 'data-line']) {
      const target = el([attr], section);
      expect(observedFor(target)).toBe(target);
    }
  });

  it('[data-wipe] bez roditelja ostaje posmatran sam, umesto da pukne', () => {
    const orphan = el(['data-wipe']);
    expect(observedFor(orphan)).toBe(orphan);
  });
});

describe('groupByObserved', () => {
  it('roditelj koji je i sam meta deli jedno posmatranje sa svojim wipe naslovom', () => {
    const section = el(['data-line']);
    const h2 = el(['data-wipe'], section);
    const groups = groupByObserved([section, h2]);
    expect(groups.size).toBe(1);
    const group = groups.get(section) ?? [];
    expect(group).toHaveLength(2);
    expect(group[0]).toBe(section);
    expect(group[1]).toBe(h2);
  });

  it('svaka meta zavrsi u tacno jednoj grupi', () => {
    const header = el();
    const h1 = el(['data-wipe'], header);
    const block = el(['data-reveal']);
    const all = [...groupByObserved([h1, block]).values()].flat();
    expect(all).toHaveLength(2);
    expect(all.includes(h1)).toBe(true);
    expect(all.includes(block)).toBe(true);
  });
});

/**
 * `H2` (2026-09-23) — kada sme da se dira DOM.
 *
 * ⚠️ ZASTO POSTOJI. Posmatrac je dodavao `is-in` dok React jos hidrira deo stabla koji se strimuje,
 * pa je React prijavljivao neslaganje atributa koje „nece ispraviti": element nosi klasu koju React
 * ne zna da postoji, i sledece iscrtavanje tog dela bi je skinulo — a sadrzaj iza `:not(.is-in)` je
 * skriven. Izmereno pre popravke: 22 upozorenja na 30 ucitavanja (10 ruta x 3 prolaza).
 *
 * Zato se rad odlaze do `load`, pa jos jedan kadar. Host je najmanji mogucí (`readyState`, `load`,
 * `requestAnimationFrame`), da se ponasanje proverava bez browsera.
 */
function host() {
  const h = {
    vreme: 0,
    kadrovi: [],
    tajmeri: [],
    now: () => h.vreme,
    requestAnimationFrame: (fn) => { h.kadrovi.push(fn); return h.kadrovi.length; },
    cancelAnimationFrame: (id) => { h.kadrovi[id - 1] = null; },
    setTimeout: (fn, ms) => { h.tajmeri.push({ fn, kada: h.vreme + ms }); return h.tajmeri.length; },
    clearTimeout: (id) => { h.tajmeri[id - 1] = null; },
    /** odigra jedan kadar; `ms` pomera sat pre njega */
    kadar(ms = 16) { h.vreme += ms; h.tajmeriNaRedu(); const red = h.kadrovi.splice(0); red.forEach((fn) => fn && fn()); },
    /** pomera sat BEZ kadra — tako izgleda tab u kome kadrovi ne stizu */
    bezKadra(ms) { h.vreme += ms; h.tajmeriNaRedu(); },
    tajmeriNaRedu() {
      for (const t of h.tajmeri) if (t && t.kada <= h.vreme) { t.fn(); h.tajmeri[h.tajmeri.indexOf(t)] = null; }
    },
  };
  return h;
}

describe('afterHydration', () => {
  it('ne pokrece posao dok React nije preuzeo metu', () => {
    const h = host();
    let pokrenuto = 0;
    afterHydration(h, () => false, () => { pokrenuto += 1; });
    for (let i = 0; i < 5; i++) h.kadar();
    expect(pokrenuto).toBe(0);
  });

  it('pokrece posao u prvom kadru posle preuzimanja', () => {
    const h = host();
    let preuzeto = false;
    let pokrenuto = 0;
    afterHydration(h, () => preuzeto, () => { pokrenuto += 1; });
    h.kadar();
    expect(pokrenuto).toBe(0);
    preuzeto = true;
    h.kadar();
    expect(pokrenuto).toBe(1);
  });

  it('pokrece posao samo jednom', () => {
    const h = host();
    let pokrenuto = 0;
    afterHydration(h, () => true, () => { pokrenuto += 1; });
    h.kadar();
    h.kadar();
    expect(pokrenuto).toBe(1);
  });

  /* ⚠️ Rok postoji da watchdog ne ostane jedina zastita: ako znak preuzimanja nikad ne stigne
   *  (React promeni unutrasnjost), sadrzaj se otkriva svakako, i to PRE nego sto watchdog na 3 s
   *  skine `js-motion`. */
  it('posle roka pokrece posao i bez preuzimanja', () => {
    const h = host();
    let pokrenuto = 0;
    afterHydration(h, () => false, () => { pokrenuto += 1; }, 2500);
    h.kadar(2000);
    expect(pokrenuto).toBe(0);
    h.kadar(600);
    expect(pokrenuto).toBe(1);
  });

  /* ⚠️ Ni znak preuzimanja ne sme da visi o kadru: izmereno u produkcijskom buildu, u jednom prolazu
   *  kadar nije stigao 2,6 s, pa je sadrzaj cekao rok iako je React metu preuzeo na 172 ms. */
  it('primecuje preuzimanje i kad kadrovi ne stizu', () => {
    const h = host();
    let preuzeto = false;
    let pokrenuto = 0;
    afterHydration(h, () => preuzeto, () => { pokrenuto += 1; }, 2500);
    h.bezKadra(60);
    expect(pokrenuto).toBe(0);
    preuzeto = true;
    h.bezKadra(60);
    expect(pokrenuto).toBe(1);
  });

  /* ⚠️ Rok NE SME da visi o kadru. Izmereno u produkcijskom buildu: kadar je jednom kasnio 2,6 s, a
   *  rok se proveravao samo unutar njega — pa je sadrzaj stajao skriven dok kadar ne stigne. */
  it('rok pokrece posao i kad kadrovi uopste ne stizu', () => {
    const h = host();
    let pokrenuto = 0;
    afterHydration(h, () => false, () => { pokrenuto += 1; }, 2500);
    h.bezKadra(2600);
    expect(pokrenuto).toBe(1);
  });

  it('kad posao krene po kadru, tajmer se gasi i ne pokrece ga drugi put', () => {
    const h = host();
    let pokrenuto = 0;
    afterHydration(h, () => true, () => { pokrenuto += 1; }, 2500);
    h.kadar();
    h.bezKadra(5000);
    expect(pokrenuto).toBe(1);
  });

  /* ⚠️ Promena rute gasi efekat pre nego sto kadar stigne; posao tada NE SME da se pokrene, inace
   *  posmatrac ostane na staroj strani. */
  it('otkazivanje zaustavlja i kadar i tajmer', () => {
    const h = host();
    let preuzeto = false;
    let pokrenuto = 0;
    const otkazi = afterHydration(h, () => preuzeto, () => { pokrenuto += 1; }, 2500);
    otkazi();
    preuzeto = true;
    h.kadar();
    h.bezKadra(5000);
    expect(pokrenuto).toBe(0);
  });

  /* Kad je meta vec preuzeta u trenutku montiranja, nema sta da se ceka. */
  it('pokrece posao odmah ako je meta vec preuzeta', () => {
    const h = host();
    let pokrenuto = 0;
    afterHydration(h, () => true, () => { pokrenuto += 1; });
    expect(pokrenuto).toBe(1);
  });
});
