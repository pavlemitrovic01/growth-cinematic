import { describe, it, expect } from 'vitest';
import { beatOpacity } from '@/lib/hero-beat';

/**
 * Kriva vidljivosti hero poglavlja -- cetiri uslova iz audita 2026-09 (`L-03`).
 *
 * ⚠️ SVAKI USLOV IMA SVOJ `it` BLOK, NAMERNO. `LESSONS` L19: vise prekrsaja pod istom tvrdnjom
 * se ne vidi jer `expect` prekida blok na prvom. U odvojenim blokovima svaki uslov nosi svoje
 * crveno, pa falsifikacija pokazuje TACNO koji je pao.
 *
 * ⚠️ MODEL. `HeroExperience.tsx` mapira skrol hera na `[0, beats.length - 1]`, a poglavlje `i`
 * dobija `beatOpacity(pozicija - i)`. `CinematicHome.tsx` renderuje cetiri `[data-beat]`
 * clanka, pa je `BEATS = 4`. Uzorkuje se sredinama intervala, da nijedno merenje ne padne
 * tacno na granicu zone (0,4 / 0,6) i ne zavisi od zaokruzivanja.
 */
const BEATS = 4;
const SAMPLES = 10000;

function measure() {
  let minSumTopTwo = Infinity;
  let fullCount = 0;
  let doubleCount = 0;
  let holdCount = 0;
  let crossCount = 0;

  for (let s = 0; s < SAMPLES; s++) {
    const position = ((BEATS - 1) * (s + 0.5)) / SAMPLES;
    const opacities = [];
    for (let i = 0; i < BEATS; i++) opacities.push(beatOpacity(position - i));
    opacities.sort((a, b) => b - a);
    const [top1, top2] = opacities;

    minSumTopTwo = Math.min(minSumTopTwo, top1 + top2);
    if (top1 === 1) fullCount++;
    if (top2 >= 0.2) doubleCount++;
    if (top1 === 1 && top2 === 0) holdCount++;
    if (top1 < 1 && top2 > 0) crossCount++;
  }

  // Poglavlje je centrirano kad je pozicija ceo broj; tada je najblizi sused na udaljenosti 1.
  let maxNeighbourCentered = 0;
  for (let centre = 0; centre < BEATS; centre++) {
    for (let i = 0; i < BEATS; i++) {
      if (i === centre) continue;
      maxNeighbourCentered = Math.max(maxNeighbourCentered, beatOpacity(centre - i));
    }
  }

  return {
    samples: SAMPLES,
    minSumTopTwo,
    fullShare: fullCount / SAMPLES,
    doubleShare: doubleCount / SAMPLES,
    maxNeighbourCentered,
    holdCount,
    crossCount,
  };
}

const metrics = measure();

describe('hero kriva "drzi pa predaj" (audit L-03)', () => {
  it('1 -- zbir dva najbliza poglavlja nigde ne pada ispod 0,9', () => {
    expect(metrics.minSumTopTwo).toBeGreaterThanOrEqual(0.9);
  });

  it('2 -- bar 75% skrola ima poglavlje na PUNOJ vidljivosti', () => {
    expect(metrics.fullShare).toBeGreaterThanOrEqual(0.75);
  });

  it('3 -- dvostruka ekspozicija (oba >= 0,2) ostaje ispod 20% skrola', () => {
    expect(metrics.doubleShare).toBeLessThanOrEqual(0.2);
  });

  it('4 -- kad je poglavlje centrirano, nijedan sused se ne vidi jace od 0,05', () => {
    expect(metrics.maxNeighbourCentered).toBeLessThanOrEqual(0.05);
  });

  it('5 -- model je obisao obe zone krive, i drzanje i pretapanje (L20)', () => {
    console.log(
      `izmereno: uzoraka ${metrics.samples}` +
        ` | min zbir ${metrics.minSumTopTwo.toFixed(4)}` +
        ` | puno ${(metrics.fullShare * 100).toFixed(2)}%` +
        ` | dvostruka ekspozicija ${(metrics.doubleShare * 100).toFixed(2)}%` +
        ` | sused kad je centrirano ${metrics.maxNeighbourCentered}`,
    );
    expect(metrics.samples).toBe(SAMPLES);
    expect(metrics.holdCount).toBeGreaterThan(0);
    expect(metrics.crossCount).toBeGreaterThan(0);
  });
});
