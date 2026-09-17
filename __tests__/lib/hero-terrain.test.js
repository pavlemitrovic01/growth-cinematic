import { describe, it, expect } from 'vitest';
import { terrainHeight, ROAD_CORRIDOR } from '@/lib/hero-terrain';

/**
 * Tlo hero scene -- `RD10`.
 *
 * ⚠️ ZASTO. Tlo je jedna povrsina cija visina dolazi iz `terrainHeight`. Ako se tlo digne u koridoru puta,
 * prekrije asfalt i stubove (x ±10,6), a nagla promena visine bi napravila zid -- oba bi se videla tek u
 * pravom browseru. Uzorkuje se mreza cele voznje (z od 130 do -640) za oba stila.
 *
 * Svaki uslov ima svoj `it` blok (`LESSONS` L19).
 */
const STYLES = ['blaga', 'visa'];
const STEP = 0.5;

function scan(style) {
  let corridorMax = 0;
  let polesMax = 0;
  let lowest = Infinity;
  let highest = 0;
  let steepest = 0;
  for (let z = 130; z >= -640; z -= 2) {
    for (let x = -260; x <= 260; x += STEP) {
      const h = terrainHeight(x, z, style);
      if (Math.abs(x) <= ROAD_CORRIDOR) corridorMax = Math.max(corridorMax, Math.abs(h));
      lowest = Math.min(lowest, h);
      highest = Math.max(highest, h);
      steepest = Math.max(
        steepest,
        Math.abs(terrainHeight(x + STEP, z, style) - h),
        Math.abs(terrainHeight(x, z - STEP, style) - h),
      );
    }
    for (const x of [-10.6, 10.6]) polesMax = Math.max(polesMax, Math.abs(terrainHeight(x, z, style)));
  }
  return { corridorMax, polesMax, lowest, highest, steepest };
}

const metrics = Object.fromEntries(STYLES.map((style) => [style, scan(style)]));

describe('tlo hero scene (RD10)', () => {
  it('1 -- u koridoru puta (|x| <= 12) tlo je na visini 0, u oba stila', () => {
    expect(STYLES.map((s) => metrics[s].corridorMax)).toEqual([0, 0]);
  });

  it('2 -- stubovi (x +/-10,6) stoje na tlu visine 0', () => {
    expect(STYLES.map((s) => metrics[s].polesMax)).toEqual([0, 0]);
  });

  it('3 -- tlo nigde ne pada ispod puta', () => {
    expect(STYLES.every((s) => metrics[s].lowest >= 0)).toBe(true);
  });

  it('4 -- tlo je neprekidno: susedne tacke na 0,5 jedinice razlikuju se najvise 1', () => {
    expect(STYLES.every((s) => metrics[s].steepest <= 1)).toBe(true);
  });

  it('5 -- tlo se stvarno dize van puta, i vise u stilu `visa` (L20)', () => {
    for (const s of STYLES) {
      console.log(
        `izmereno: ${s} | najvise ${metrics[s].highest.toFixed(2)} | najstrmije ${metrics[s].steepest.toFixed(3)} na 0,5`,
      );
    }
    expect(metrics.blaga.highest).toBeGreaterThan(5);
    expect(metrics.visa.highest).toBeGreaterThan(metrics.blaga.highest);
  });
});
