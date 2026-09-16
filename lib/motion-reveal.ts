/**
 * Koji element posmatrac vidljivosti gleda za datu metu pokreta (`components/Motion.tsx`).
 *
 * ⚠️ `RD1` (2026-09-16): izdvojeno da bi se ponasanje moglo proveriti bez browsera — vitest ovde
 * radi u `node` okruzenju, bez DOM-a (`__tests__/motion-reveal.test.js`).
 */

/** Najmanje sto logika trazi od elementa; `HTMLElement` ga zadovoljava. */
export type MotionTarget<T> = {
  readonly parentElement: T | null;
  hasAttribute(name: string): boolean;
};

export function observedFor<T extends MotionTarget<T>>(target: T): T {
  /**
   * ⚠️ `[data-wipe]` se posmatra preko RODITELJA. Skriveno stanje (`app/globals.css`,
   * `clip-path: inset(-.3em 100% -.3em -.3em)`) sece metu na nultu povrsinu, a browser racuna presek
   * POSLE tog isecanja: posmatrac na samoj meti javlja „ne ukrsta se, presek 0x0" i nikad vise, pa
   * `is-in` ne stize, a watchdog je u vidljivom tabu vec razoruzan. Izmereno u Pavlovom browseru
   * (manifest `RD1`, „Nalaz merenja"). Roditelj nije isecen, pa ga posmatrac vidi normalno; klasa i
   * dalje ide na samu metu.
   */
  if (target.hasAttribute('data-wipe') && target.parentElement) return target.parentElement;
  return target;
}

/** Grupise mete po posmatranom elementu: vise meta moze deliti jedno posmatranje. */
export function groupByObserved<T extends MotionTarget<T>>(targets: Iterable<T>): Map<T, T[]> {
  const groups = new Map<T, T[]>();
  for (const target of targets) {
    const observed = observedFor(target);
    const group = groups.get(observed);
    if (group) group.push(target);
    else groups.set(observed, [target]);
  }
  return groups;
}
