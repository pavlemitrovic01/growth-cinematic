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

/** Najmanje sto `afterHydration` trazi od prozora; `Window` ga zadovoljava. */
export type HydrationHost = {
  now(): number;
  requestAnimationFrame(handler: () => void): number;
  cancelAnimationFrame(handle: number): void;
  setTimeout(handler: () => void, ms: number): number;
  clearTimeout(handle: number): void;
};

/**
 * Pokrece `run` tek kad `hydrated()` kaze da je React preuzeo metu — ili kad istekne `rok`.
 * Vraca funkciju koja otkazuje cekanje.
 *
 * ⚠️ `H2` (2026-09-23). Posmatrac je ranije dodavao `is-in` cim se `Motion` montira, a to je usred
 * hidratacije. React tada prijavi neslaganje atributa i kaze da ga NECE ispraviti: element nosi
 * klasu koju React ne zna da postoji, pa bi je sledece iscrtavanje tog dela skinulo i sadrzaj iza
 * `:not(.is-in)` bi se ponovo sakrio. Izmereno pre popravke: 22 upozorenja na 30 ucitavanja
 * (10 ruta x 3 prolaza).
 *
 * ⚠️ ZASTO NE `load`. Prva verzija je cekala `load` pa jedan kadar — i to je izmereno NEDOVOLJNO:
 * na `/terms` je `load` bio na 391 ms, klasa na 483 ms, a upozorenje je i dalje stiglo, jer React u
 * dev-u hidrira deo stabla POSLE `load`-a. Rezultat: 23 upozorenja, isto kao pre popravke. Zato se
 * ceka znak sa same mete (`components/Motion.tsx` gleda da li je React zakacio svoj cvor na nju).
 *
 * ⚠️ ZASTO ROK. Ako taj znak nikad ne stigne (React promeni unutrasnjost), posao se pokrece svakako
 * i to PRE nego sto watchdog iz `app/layout.tsx` na 3 s skine `js-motion`: tada se sadrzaj vidi
 * animirano umesto da odjednom iskoci. Watchdog ostaje poslednja zastita, ne prva.
 *
 * ⚠️ ZASTO ROK IMA SVOJ TAJMER, A NE SAMO PROVERU U KADRU. Izmereno u produkcijskom buildu: kadar je
 * jednom kasnio 2,6 s (kadrovi ne stizu dok se nista ne animira). Rok koji se proverava samo unutar
 * kadra tada ne moze da se okine, pa je sadrzaj stajao skriven do watchdog-a.
 */
export function afterHydration(host: HydrationHost, hydrated: () => boolean, run: () => void, rok = 2500): () => void {
  const KORAK = 50;
  let frame = 0;
  let poller = 0;
  let rokTimer = 0;
  let done = false;
  const clear = () => {
    if (frame) { host.cancelAnimationFrame(frame); frame = 0; }
    if (poller) { host.clearTimeout(poller); poller = 0; }
  };
  const finish = () => {
    if (done) return;
    done = true;
    clear();
    if (rokTimer) host.clearTimeout(rokTimer);
    run();
  };
  /** ⚠️ Provera ide i kroz kadar i kroz kratak tajmer: kadar je brz kad ga ima, tajmer radi i kad ga nema. */
  const poll = () => {
    if (done) return;
    clear();
    if (hydrated()) { finish(); return; }
    frame = host.requestAnimationFrame(poll);
    poller = host.setTimeout(poll, KORAK);
  };
  poll();
  rokTimer = host.setTimeout(finish, rok);
  return () => {
    if (done) return;
    done = true;
    clear();
    if (rokTimer) host.clearTimeout(rokTimer);
  };
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
