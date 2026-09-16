import { describe, it, expect } from 'vitest';
import { observedFor, groupByObserved } from '@/lib/motion-reveal';

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
