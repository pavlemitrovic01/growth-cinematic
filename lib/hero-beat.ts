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
