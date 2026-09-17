import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createCameraRig, moonPosition, SUN_RADIUS, sunPosition, sunVisible, truckZ } from '@/lib/hero-scene';
import { cameraProgress } from '@/lib/hero-beat';
import { TRUCK_DESIGN, truckBounds, truckBoxes } from '@/lib/hero-truck';
import { ROAD_CORRIDOR, TERRAIN_STYLE, terrainHeight } from '@/lib/hero-terrain';

/**
 * Kamera u heroju -- razmak od kamiona, stubova i tla, i kompozicija prema tekstu (`RD2`, `RD10`).
 *
 * ⚠️ ZASTO. Do `RD2` je kamera na 52,84-59,90% skrola prolazila KROZ prikolicu (poglavlje 02), a na
 * 72,88% na 0,34 jedinice od stuba desno od puta. Zidovi se crtaju samo spolja, pa se iznutra videla
 * donja strana ivice krova i zadnja strana kabine (Pavlov snimak, 2026-09-17). Kamera je uz to gledala
 * u sredinu kamiona, pa je 65-82% kamiona stajalo ispod kolone teksta.
 *
 * ⚠️ KAMION I TLO SE CITAJU IZ ISTIH PODATAKA KOJE SCENA CRTA (`RD10`): `TRUCK_DESIGN` iz `lib/hero-truck.ts`
 * i `terrainHeight` iz `lib/hero-terrain.ts`. Do `RD10` su ovde bile prepisane brojke kutija i kupa.
 * Plan kamere iz `RD2` izmeren je po okviru kamiona x +/-2,73, y 0,2-6,54, z -10,96-13,4 -- zato kamion
 * mora da ostane u tom okviru.
 *
 * ⚠️ UPISANO BROJKAMA ostaje: stubovi (30 komada, x +/-10,6 naizmenicno, paran indeks levo, z = 42 - 20*i,
 * telo poluprecnika 0,08 do visine 5,7, lampa 0,16 na vrhu) i kolona teksta (`.is-enhanced .journey-beat`:
 * od 6vw, sirina min(62vw, 880px)).
 *
 * ⚠️ STUBOVI I TLO ZAVISE OD TAJMINGA (`L30`). Kamion vozi po skrolu, a kamera ide po `cameraProgress`, pa
 * test koristi isto mapiranje kao `HeroExperience.tsx`, a ne sam skrol.
 *
 * Granice: kamion >= 2, stub >= 1, ispod teksta najvise 25% kamiona na 1440x900; iznad tla van puta >= 1,5, a
 * iznad puta >= 0,5 -- nizak kadar za 02 iz `RD2` namerno ide 0,89 iznad asfalta, a near ravan kamere je 0,1.
 * Skrol se uzorkuje sredinama 100 000 intervala. Svaki uslov ima svoj `it` blok (`LESSONS` L19).
 *
 * ⚠️ SUNCE (NOCU MESEC), `RD10`: sa visim brdima disk je izlazio iz planine (Pavle: „da sunce/mesec ne izlaze
 * iz planine"). Meri se da je donja ivica diska bar 1 iznad tla na svom mestu i da izmedju kamere i donje
 * ivice diska nijedna tacka zraka nije ispod tla -- 2000 tacaka voznje, 64 tacke po zraku.
 */
const BEATS = 4;
const SAMPLES = 100000;
const TRUCK = truckBounds(TRUCK_DESIGN);
const CAMERA_ENVELOPE = { min: [-2.73, 0.2, -10.96], max: [2.73, 6.54, 13.4] };
const TRUCK_CLEARANCE = 2;
const POLE_CLEARANCE = 1;
const GROUND_CLEARANCE = 1.5;
const ROAD_CLEARANCE = 0.5;
const TEXT_SHARE_MAX = 0.25;
const POLES = Array.from({ length: 30 }, (_, i) => ({ x: (i % 2 ? 1 : -1) * 10.6, z: 42 - i * 20 }));
const POLE_TOP = 5.7;
const TRUCK_BOXES = truckBoxes(TRUCK_DESIGN);
const SCREENS = [[1440, 900], [1920, 1080], [1280, 1024], [1024, 650]];
const SUN_SAMPLES = 2000;
const SUN_GROUND_CLEARANCE = 1;
const SUN_SIGHT = 700;
// Pavle, 2026-09-17, oznaka na snimku kadra 01 (2000x1094): „mesec treba biti ovde" -- centar ~ (990, 120).
const MOON_MARK = { x: (990 / 2000) * 2 - 1, y: 1 - (120 / 1094) * 2 };
const MOON_FRAMES = [0.3, 1 / 3, 0.38, 0.42];
// Pavle, 2026-09-17, oznake na snimku kadra 02 (2000x1103, skrol ~0,70): „sunce da se prvo nalazi dole i da izlazi
// ka gore" -- donja oznaka ~ (1190, 485), gornja ~ (1275, 105).
const SUN_LOW_MARK = { x: (1190 / 2000) * 2 - 1, y: 1 - (485 / 1103) * 2 };
const SUN_HIGH_MARK = { x: (1275 / 2000) * 2 - 1, y: 1 - (105 / 1103) * 2 };
const SUN_RISE_FRAMES = [0.5333, 0.58, 0.63, 0.67, 0.7, 0.74];

/** Rastojanje tacke od kutije kamiona; negativno kad je tacka unutra. */
function truckDistance([x, y, z]) {
  const q = [x, y, z].map((v, i) => Math.max(TRUCK.min[i] - v, v - TRUCK.max[i]));
  const outside = Math.hypot(...q.map((v) => Math.max(v, 0)));
  return outside + Math.min(Math.max(...q), 0);
}

/** Najmanje rastojanje kamere od tela ili lampe bilo kog stuba. */
function poleDistance(x, y, z) {
  let best = Infinity;
  for (const pole of POLES) {
    const across = Math.hypot(x - pole.x, z - pole.z);
    const body = y <= POLE_TOP ? across - 0.08 : Math.hypot(across, y - POLE_TOP) - 0.08;
    const lamp = Math.hypot(across, y - POLE_TOP) - 0.16;
    best = Math.min(best, body, lamp);
  }
  return best;
}


/** Spaja uzastopne uzorke ispod granice u opsege skrola, npr. "52.84-59.90%". */
function ranges(flags) {
  const out = [];
  let start = -1;
  for (let s = 0; s <= flags.length; s++) {
    if (s < flags.length && flags[s] && start < 0) start = s;
    if ((s === flags.length || !flags[s]) && start >= 0) {
      out.push(`${((start / flags.length) * 100).toFixed(2)}-${((s / flags.length) * 100).toFixed(2)}%`);
      start = -1;
    }
  }
  return out;
}

/** Tacke po povrsini kutija kamiona, za merenje kompozicije. */
function truckSurface() {
  const points = [];
  const n = 16;
  for (const [w, h, d, x, y, z] of TRUCK_BOXES) {
    for (let i = 0; i <= n; i++) {
      for (let j = 0; j <= n; j++) {
        const u = i / n - 0.5;
        const v = j / n - 0.5;
        for (const s of [-0.5, 0.5]) {
          points.push([x + s * w, y + u * h, z + v * d], [x + u * w, y + s * h, z + v * d], [x + u * w, y + v * h, z + s * d]);
        }
      }
    }
  }
  return points;
}

/** Udeo kamiona (po povrsini na ekranu) koji stoji ispod kolone teksta, kao u `render`-u scene. */
function textShare(place, progress, [width, height], surface) {
  const position = new THREE.Vector3();
  const target = new THREE.Vector3();
  const lens = place(progress, cameraProgress(progress, BEATS), position, target);
  const camera = new THREE.PerspectiveCamera(lens.fov, width / height, 0.1, 700);
  camera.filmOffset = -lens.shift * camera.getFilmWidth() * camera.aspect * 2 * Math.tan(THREE.MathUtils.degToRad(lens.fov) / 2);
  camera.updateProjectionMatrix();
  camera.position.copy(position);
  camera.lookAt(target);
  camera.updateMatrixWorld();

  const columns = 160;
  const rows = 100;
  const grid = new Uint8Array(columns * rows);
  const point = new THREE.Vector3();
  const z = truckZ(progress);
  for (const [x, y, dz] of surface) {
    point.set(x, y, z + dz).project(camera);
    if (point.z < -1 || point.z > 1 || Math.abs(point.x) > 1 || Math.abs(point.y) > 1) continue;
    const col = Math.min(columns - 1, Math.floor(((point.x + 1) / 2) * columns));
    const row = Math.min(rows - 1, Math.floor(((1 - point.y) / 2) * rows));
    grid[row * columns + col] = 1;
  }
  const left = 0.06 * width;
  const right = left + Math.min(0.62 * width, 880);
  let cells = 0;
  let under = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (!grid[row * columns + col]) continue;
      cells++;
      const px = ((col + 0.5) / columns) * width;
      if (px >= left && px <= right) under++;
    }
  }
  return { cells, share: cells ? under / cells : 1 };
}

function measure() {
  const place = createCameraRig();
  const position = new THREE.Vector3();
  const target = new THREE.Vector3();
  const nearTruck = new Array(SAMPLES).fill(false);
  const nearPole = new Array(SAMPLES).fill(false);
  const nearGround = new Array(SAMPLES).fill(false);
  const nearRoad = new Array(SAMPLES).fill(false);
  const min = {
    truck: { d: Infinity, p: 0 },
    pole: { d: Infinity, p: 0 },
    ground: { d: Infinity, p: 0 },
    road: { d: Infinity, p: 0 },
  };

  for (let s = 0; s < SAMPLES; s++) {
    const p = (s + 0.5) / SAMPLES;
    place(p, cameraProgress(p, BEATS), position, target);
    const onRoad = Math.abs(position.x) <= ROAD_CORRIDOR;
    const above = position.y - terrainHeight(position.x, position.z, TERRAIN_STYLE);
    const d = {
      truck: truckDistance([position.x, position.y, position.z - truckZ(p)]),
      pole: poleDistance(position.x, position.y, position.z),
      ground: onRoad ? Infinity : above,
      road: onRoad ? above : Infinity,
    };
    nearTruck[s] = d.truck < TRUCK_CLEARANCE;
    nearPole[s] = d.pole < POLE_CLEARANCE;
    nearGround[s] = d.ground < GROUND_CLEARANCE;
    nearRoad[s] = d.road < ROAD_CLEARANCE;
    for (const key of Object.keys(min)) if (d[key] < min[key].d) min[key] = { d: d[key], p };
  }

  const sunBlocked = new Array(SUN_SAMPLES).fill(false);
  let sunAboveGround = { d: Infinity, p: 0 };
  for (let s = 0; s < SUN_SAMPLES; s++) {
    const p = (s + 0.5) / SUN_SAMPLES;
    place(p, cameraProgress(p, BEATS), position, target);
    const discs = [moonPosition(p, position), ...(sunVisible(p) ? [sunPosition(p, position)] : [])];
    for (const [sx, sy, sz] of discs) {
      const bottom = sy - SUN_RADIUS;
      const above = bottom - terrainHeight(sx, sz, TERRAIN_STYLE);
      if (above < sunAboveGround.d) sunAboveGround = { d: above, p };
      // Mesec i sunce su nebeska tela: zrak ka donjoj ivici diska se prati do 700 jedinica, iza brda i grebena.
      const ray = new THREE.Vector3(sx - position.x, bottom - position.y, sz - position.z).normalize();
      for (let k = 1; k <= 64; k++) {
        const d = (SUN_SIGHT * k) / 64;
        if (terrainHeight(position.x + ray.x * d, position.z + ray.z * d, TERRAIN_STYLE) > position.y + ray.y * d) {
          sunBlocked[s] = true;
          break;
        }
      }
    }
  }

  const moonOnScreen = MOON_FRAMES.map((p) =>
    [[2000, 1094], [1440, 900]].map(([width, height]) => {
      const lens = place(p, cameraProgress(p, BEATS), position, target);
      const camera = new THREE.PerspectiveCamera(lens.fov, width / height, 0.1, 700);
      camera.filmOffset = -lens.shift * camera.getFilmWidth() * camera.aspect * 2 * Math.tan(THREE.MathUtils.degToRad(lens.fov) / 2);
      camera.updateProjectionMatrix();
      camera.position.copy(position);
      camera.lookAt(target);
      camera.updateMatrixWorld();
      const [mx, my, mz] = moonPosition(p, position);
      const ndc = new THREE.Vector3(mx, my, mz).project(camera);
      return { x: ndc.x, y: ndc.y, visible: ndc.z > -1 && ndc.z < 1 };
    }),
  );

  const surface = truckSurface();
  const composition = [0, 1 / 3, 2 / 3, 1].map((p) => SCREENS.map((screen) => textShare(place, p, screen, surface)));

  const sunOnScreen = SUN_RISE_FRAMES.map((p) => {
    const lens = place(p, cameraProgress(p, BEATS), position, target);
    const camera = new THREE.PerspectiveCamera(lens.fov, 2000 / 1103, 0.1, 700);
    camera.filmOffset = -lens.shift * camera.getFilmWidth() * camera.aspect * 2 * Math.tan(THREE.MathUtils.degToRad(lens.fov) / 2);
    camera.updateProjectionMatrix();
    camera.position.copy(position);
    camera.lookAt(target);
    camera.updateMatrixWorld();
    const sun = new THREE.Vector3(...sunPosition(p, position));
    const inFront = sun.clone().applyMatrix4(camera.matrixWorldInverse).z < 0;
    const ndc = sun.project(camera);
    return { p, x: ndc.x, y: ndc.y, inFront };
  });

  const lens = place(0, cameraProgress(0, BEATS), position, target);

  return {
    sunOnScreen,
    truckRanges: ranges(nearTruck),
    poleRanges: ranges(nearPole),
    groundRanges: ranges(nearGround),
    roadRanges: ranges(nearRoad),
    sunBlockedRanges: ranges(sunBlocked),
    sunAboveGround,
    moonOnScreen,
    min,
    composition,
    first: { position: position.toArray(), target: target.toArray(), fov: lens.fov, shift: lens.shift },
  };
}

const metrics = measure();

describe('kamera u heroju ne prolazi kroz kamion, pored stuba ni kroz tlo (RD2, RD10)', () => {
  it('1 -- kamera nigde nije blize od 2 jedinice kamionu', () => {
    expect(metrics.truckRanges).toEqual([]);
  });

  it('2 -- kamera nigde nije blize od 1 jedinice stubu', () => {
    expect(metrics.poleRanges).toEqual([]);
  });

  it('3 -- van puta kamera je cele voznje bar 1,5 jedinice iznad tla', () => {
    expect(metrics.groundRanges).toEqual([]);
  });

  it('8 -- iznad puta kamera je bar 0,5 jedinice iznad asfalta', () => {
    expect(metrics.roadRanges).toEqual([]);
  });

  it('9 -- mesec i sunce ne izlaze iz planine: donja ivica diska bar 1 iznad tla na svom mestu', () => {
    console.log(
      `izmereno: mesec/sunce iznad tla min ${metrics.sunAboveGround.d.toFixed(2)} na ${(metrics.sunAboveGround.p * 100).toFixed(2)}%`,
    );
    expect(metrics.sunAboveGround.d).toBeGreaterThanOrEqual(SUN_GROUND_CLEARANCE);
  });

  it('10 -- nijedno brdo ne zaklanja donju ivicu meseca ni sunca od kamere', () => {
    expect(metrics.sunBlockedRanges).toEqual([]);
  });

  it('12 -- u poglavlju 02 sunce krece dole kod donje oznake i penje se do gornje', () => {
    console.log(
      `izmereno: sunce NDC 2000x1103, dole (${SUN_LOW_MARK.x.toFixed(2)}, ${SUN_LOW_MARK.y.toFixed(2)}) gore (${SUN_HIGH_MARK.x.toFixed(2)}, ${SUN_HIGH_MARK.y.toFixed(2)}) | ` +
        metrics.sunOnScreen.map((s) => `p ${s.p.toFixed(2)} (${s.x.toFixed(2)}, ${s.y.toFixed(2)})${s.inFront ? '' : ' iza'}`).join(' | '),
    );
    const [first] = metrics.sunOnScreen;
    const atMark = metrics.sunOnScreen.find((s) => s.p === 0.7);
    const rising = metrics.sunOnScreen.every((s, i, all) => i === 0 || s.y > all[i - 1].y);
    const inView = metrics.sunOnScreen.every((s) => s.inFront && Math.abs(s.x) <= 1 && Math.abs(s.y) <= 1);
    expect(inView).toBe(true);
    expect(rising).toBe(true);
    expect(Math.abs(first.x - SUN_LOW_MARK.x) <= 0.25 && Math.abs(first.y - SUN_LOW_MARK.y) <= 0.12).toBe(true);
    expect(Math.abs(atMark.x - SUN_HIGH_MARK.x) <= 0.25 && Math.abs(atMark.y - SUN_HIGH_MARK.y) <= 0.15).toBe(true);
  });

  it('13 -- sunce se ne vidi nocu (uvod i 01), a vidi se kroz 02', () => {
    const night = Array.from({ length: 47 }, (_, i) => i / 100);
    expect(night.some((p) => sunVisible(p))).toBe(false);
    expect(SUN_RISE_FRAMES.every((p) => sunVisible(p))).toBe(true);
  });

  it('11 -- u poglavlju 01 mesec stoji gde ga je Pavle oznacio: gore, na sredini neba', () => {
    const rows = metrics.moonOnScreen.map((screens, i) =>
      `p ${MOON_FRAMES[i].toFixed(2)}: ` + screens.map((m) => `(${m.x.toFixed(2)}, ${m.y.toFixed(2)})`).join(' / '),
    );
    console.log(`izmereno: mesec NDC, 2000x1094 / 1440x900, cilj (${MOON_MARK.x.toFixed(2)}, ${MOON_MARK.y.toFixed(2)}) | ${rows.join(' | ')}`);
    const near = metrics.moonOnScreen.flat().every(
      (m) => m.visible && Math.abs(m.x - MOON_MARK.x) <= 0.25 && Math.abs(m.y - MOON_MARK.y) <= 0.12,
    );
    expect(near).toBe(true);
  });

  it('7 -- kamion ostaje u okviru po kome je izmeren plan kamere iz RD2', () => {
    const inside = [0, 1, 2].every((i) => TRUCK.min[i] >= CAMERA_ENVELOPE.min[i] && TRUCK.max[i] <= CAMERA_ENVELOPE.max[i]);
    console.log(`izmereno: okvir kamiona min ${TRUCK.min.map((v) => v.toFixed(2)).join(', ')} | max ${TRUCK.max.map((v) => v.toFixed(2)).join(', ')}`);
    expect(inside).toBe(true);
  });

  it('4 -- prvi kadar: kamera, meta i objektiv na pocetku skrola', () => {
    const { position, target, fov, shift } = metrics.first;
    expect([...position, ...target, fov, shift].map((v) => Number(v.toFixed(6)))).toEqual([-14, 5, -33, 0, 3.3, 7, 40, 0.3]);
  });

  it('5 -- na sredini svakog poglavlja najvise 25% kamiona ispod kolone teksta (1440x900)', () => {
    const shares = metrics.composition.map((row) => Number((row[0].share * 100).toFixed(1)));
    expect(metrics.composition.every((row) => row[0].cells > 0)).toBe(true);
    expect(shares.every((share) => share <= TEXT_SHARE_MAX * 100)).toBe(true);
  });

  it('6 -- model je obisao celu voznju i sve ekrane (L20)', () => {
    const f = (m) => `${m.d.toFixed(2)} na ${(m.p * 100).toFixed(2)}%`;
    console.log(
      `izmereno: uzoraka ${SAMPLES} | kamion min ${f(metrics.min.truck)} | stub min ${f(metrics.min.pole)}` +
        ` | iznad tla van puta min ${f(metrics.min.ground)} | iznad puta min ${f(metrics.min.road)}`,
    );
    SCREENS.forEach(([w, h], i) => {
      console.log(
        `izmereno: ispod teksta ${w}x${h} uvod/01/02/03 ` +
          metrics.composition.map((row) => `${(row[i].share * 100).toFixed(1)}%`).join(' / '),
      );
    });
    expect(Number.isFinite(metrics.min.truck.d)).toBe(true);
    expect(metrics.composition).toHaveLength(4);
  });
});
