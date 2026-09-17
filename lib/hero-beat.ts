/**
 * Vidljivost hero poglavlja u zavisnosti od udaljenosti skrola od njegovog centra.
 *
 * ⚠️ ZASTO POSTOJI KAO ZASEBAN MODUL. Do `M7` je kriva bila jedan izraz u
 * `HeroExperience.tsx` i nije se mogla izmeriti bez browsera. Audit 2026-09 (`L-03`) je izmerio
 * sta je taj izraz radio: `1 - abs(d) * 1.65` je poglavlje drzalo na punoj vidljivosti samo u
 * jednoj tacki, na sredini izmedju dva poglavlja oba su bila na 0,175, a na 39% skrola nijedno
 * nije bilo ni do pola vidljivo. Cista funkcija se meri direktno -- vidi
 * `__tests__/lib/hero-beat.test.js`.
 *
 * ⚠️ NE SELITI U `lib/hero-scene.ts`. Taj modul uvozi three.js i ucitava se odlozeno, samo na
 * desktopu (dinamicki `import` u `HeroExperience.tsx`). Staticki uvoz iz komponente bi povukao
 * three.js u glavni bundle, pa bi ga preuzimali i telefoni koji scenu nikad ne pokrecu.
 */

/** Do ove udaljenosti poglavlje DRZI punu vidljivost. */
export const BEAT_HOLD = 0.4;

/** Od ove udaljenosti se vise ne vidi; izmedju to dvoje linearno PREDAJE sledecem. */
export const BEAT_HANDOFF = 0.6;

export function beatOpacity(distance: number): number {
  const d = Math.abs(distance);
  if (d <= BEAT_HOLD) return 1;
  if (d >= BEAT_HANDOFF) return 0;
  // Linearno predavanje: sto ovo poglavlje izgubi, sledece dobije, pa je zbir uvek 1.
  return (BEAT_HANDOFF - d) / (BEAT_HANDOFF - BEAT_HOLD);
}

/**
 * Poglavlje sa BLAGOM PAUZOM kamere (`RD2`): tekst koji je u heroju najbitniji -- 02, „$0 Cost to
 * drivers. Always." (Pavle, 2026-09-17). Samo jedno; ostala poglavlja teku bez pauze.
 */
export const CAMERA_PAUSE_CHAPTER = 2;

/** Jacina pauze: 0 -- bez pauze; 1 -- kadar stoji dok je tekst pun. Blaga je pola. */
export const CAMERA_PAUSE = 0.5;

/** Tezina pokreta: 0 -- stalna brzina; 1 -- kamera se zaustavlja u centru svakog poglavlja. */
export const CAMERA_WEIGHT = 0.6;

const ease = (x: number) => x * x * (3 - 2 * x);

/**
 * Deo segmenta koji se ZAVRSAVA poglavljem sa pauzom `pause`: normalna brzina dok se cita prethodno
 * poglavlje, brze kroz pretapanje, a `1 - pause` dok se cita poglavlje sa pauzom. Brzina je neprekidna;
 * visak se nadoknadjuje u pretapanju (`lift`), pa prethodno poglavlje ne ubrzava.
 */
function intoPause(within: number, pause: number): number {
  const span = 1 - 2 * BEAT_HOLD;
  if (within <= BEAT_HOLD) return within;
  if (within >= 1 - BEAT_HOLD) return 1 - (1 - pause) * (1 - within);
  const u = (within - BEAT_HOLD) / span;
  const lift = (span + pause * BEAT_HOLD) / span - (2 - pause) / 2;
  return BEAT_HOLD + span * (u - pause * (u ** 3 - u ** 4 / 2) + lift * (3 * u * u - 2 * u ** 3));
}

/**
 * Napredak kamere po planu za dati napredak skrola hera.
 *
 * Model je isti kao za poglavlja: pozicija `progress * (beats - 1)`, a tekst poglavlja je pun dok je
 * pozicija na najvise `BEAT_HOLD` od njegovog centra. Centri poglavlja su tacni za svaku vrednost
 * pauze i tezine, pa kadar poglavlja ne zavisi od njih.
 *
 * ⚠️ Zivi ovde, a ne u `lib/hero-scene.ts`, iz istog razloga kao `beatOpacity`: komponenta ga zove
 * svaki frejm, a staticki uvoz scene bi povukao three.js u glavni bundle.
 */
export function cameraProgress(
  progress: number,
  beats: number,
  pause = CAMERA_PAUSE,
  weight = CAMERA_WEIGHT,
  pauseChapter = CAMERA_PAUSE_CHAPTER,
): number {
  const segments = beats - 1;
  if (segments < 1) return progress;
  const position = Math.min(1, Math.max(0, progress)) * segments;
  const index = Math.min(segments - 1, Math.floor(position));
  let within = position - index;
  if (index + 1 === pauseChapter) within = intoPause(within, pause);
  if (index === pauseChapter) within = 1 - intoPause(1 - within, pause);
  within = (1 - weight) * within + weight * ease(within);
  return (index + within) / segments;
}
