import { describe, it, expect } from 'vitest';
import { beatOpacity, cameraProgress, BEAT_HOLD } from '@/lib/hero-beat';

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

/**
 * Kamera -- jedna blaga pauza, u poglavlju 02 (`RD2`).
 *
 * ⚠️ ZASTAJE KADAR, NE KAMION (Pavle, 2026-09-17: „Kamion ne mora da stane"), i to samo u poglavlju
 * gde je tekst najbitniji (02, „$0 Cost to drivers"). Meri se koliki deo putanje kamera predje dok je
 * tekst poglavlja pun (pozicija na najvise `BEAT_HOLD` od centra), po poglavlju. Do `RD2`: 26,7% u
 * poglavljima 01 i 02, po 13,3% u uvodu i 03.
 *
 * ⚠️ Vrsna brzina se meri kao nagib u odnosu na ravnomerno kretanje (1 = kao do `RD2`). Pauza i tezina
 * sabijaju pokret u pretapanje, pa granica cuva od skoka.
 */
const PAUSED_CHAPTER = 2;
const PAUSED_TRAVEL_MAX = 0.1;
const PEAK_SPEED_MAX = 8;

function measureCamera() {
  const travel = new Array(BEATS).fill(0);
  let previous = cameraProgress(0, BEATS);
  let backwards = 0;
  let peak = 0;

  for (let s = 1; s <= SAMPLES; s++) {
    const progress = s / SAMPLES;
    const camera = cameraProgress(progress, BEATS);
    const step = camera - previous;
    if (step < -1e-12) backwards++;
    peak = Math.max(peak, step * SAMPLES);
    const position = ((s - 0.5) / SAMPLES) * (BEATS - 1);
    const nearest = Math.round(position);
    if (Math.abs(position - nearest) <= BEAT_HOLD) travel[nearest] += step;
    previous = camera;
  }

  return { start: cameraProgress(0, BEATS), end: cameraProgress(1, BEATS), backwards, peak, travel };
}

const camera = measureCamera();

describe('kamera: jedna blaga pauza, u poglavlju 02 (RD2)', () => {
  it('6 -- kamera pocinje na 0 i zavrsava na 1', () => {
    expect(camera.start).toBe(0);
    expect(camera.end).toBeCloseTo(1, 12);
  });

  it('7 -- kamera ide samo napred', () => {
    expect(camera.backwards).toBe(0);
  });

  it('8 -- dok je tekst poglavlja 02 pun, kamera predje najvise 10% putanje', () => {
    console.log(
      `izmereno: kamera dok je tekst pun ${camera.travel.map((t) => (t * 100).toFixed(1) + '%').join(' / ')}` +
        ` | vrsna brzina ${camera.peak.toFixed(2)}x`,
    );
    expect(camera.travel[PAUSED_CHAPTER]).toBeLessThanOrEqual(PAUSED_TRAVEL_MAX);
  });

  it('9 -- pauza je samo jedna: ostala poglavlja se krecu vise od 10% putanje', () => {
    const others = camera.travel.filter((_, i) => i !== PAUSED_CHAPTER);
    expect(others.every((travel) => travel > PAUSED_TRAVEL_MAX)).toBe(true);
  });

  it('10 -- vrsna brzina kamere najvise 8x ravnomerne (bez skoka)', () => {
    expect(camera.peak).toBeLessThanOrEqual(PEAK_SPEED_MAX);
  });
});
