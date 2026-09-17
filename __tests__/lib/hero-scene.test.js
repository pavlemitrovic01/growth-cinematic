import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createCameraRig, truckZ } from '@/lib/hero-scene';
import { cameraProgress } from '@/lib/hero-beat';

/**
 * Kamera u heroju -- razmak od kamiona, stubova i brda, i kompozicija prema tekstu (`RD2`).
 *
 * ⚠️ ZASTO. Do `RD2` je kamera na 52,84-59,90% skrola prolazila KROZ prikolicu (poglavlje 02), a na
 * 72,88% na 0,34 jedinice od stuba desno od puta. Zidovi se crtaju samo spolja, pa se iznutra videla
 * donja strana ivice krova i zadnja strana kabine (Pavlov snimak, 2026-09-17). Kamera je uz to gledala
 * u sredinu kamiona, pa je 65-82% kamiona stajalo ispod kolone teksta.
 *
 * ⚠️ MODEL JE UPISAN BROJKAMA, kao `BEATS = 4` u `hero-beat.test.js`. Ako se kamion, stubovi, brda ili
 * kolona teksta promene, ovo se menja zajedno sa njima:
 * - kamion: `addBox` kutije i tockovi iz `lib/hero-scene.ts`, u koordinatama kamiona; za razmak se
 *   koristi njihova unija -- x +/-2,73 (retrovizori), y od 0,2 do 6,54, z od -10,96 do 13,4;
 * - stubovi: 30 komada, x +/-10,6 naizmenicno (paran indeks levo), z = 42 - 20*i, telo poluprecnika
 *   0,08 do visine 5,7, lampa poluprecnika 0,16 na vrhu;
 * - brda: 58 kupa, x = +/-(17 + 5*(i%5)), z = 42 - 12*i, poluprecnik 2,4 + i%4, visina 2,5 + 0,44*((37*i)%9),
 *   osnova na -0,1 -- racunaju se kao prave kupe, bez pet strana;
 * - kolona teksta: `.is-enhanced .journey-beat` -- od 6vw, sirina min(62vw, 880px).
 *
 * ⚠️ STUBOVI I BRDA ZAVISE OD TAJMINGA. Kamion vozi po skrolu, a kamera ide po `cameraProgress`, pa se
 * trenutak prolaska menja sa svakom promenom plana, pauze ili tezine. Test zato koristi isto mapiranje
 * kao `HeroExperience.tsx`, a ne sam skrol.
 *
 * Granice: kamion >= 2 (najmanji razmak koji je stara putanja imala van prolaza kroz prikolicu bio je
 * 2,25), stub i brdo >= 1, ispod teksta najvise 25% kamiona na 1440x900. Skrol se uzorkuje sredinama
 * 100 000 intervala. Svaki uslov ima svoj `it` blok (`LESSONS` L19).
 */
const BEATS = 4;
const SAMPLES = 100000;
const TRUCK = { min: [-2.73, 0.2, -10.96], max: [2.73, 6.54, 13.4] };
const TRUCK_CLEARANCE = 2;
const POLE_CLEARANCE = 1;
const HILL_CLEARANCE = 1;
const TEXT_SHARE_MAX = 0.25;
const POLES = Array.from({ length: 30 }, (_, i) => ({ x: (i % 2 ? 1 : -1) * 10.6, z: 42 - i * 20 }));
const POLE_TOP = 5.7;
const HILLS = Array.from({ length: 58 }, (_, i) => ({
  x: (i % 2 ? 1 : -1) * (17 + (i % 5) * 5),
  z: 42 - i * 12,
  radius: 2.4 + (i % 4),
  height: 2.5 + ((i * 37) % 9) * 0.44,
}));
const TRUCK_BOXES = [
  [4.3, 3.7, 3.7, 0, 2.65, -6.9],
  [4.15, 4.4, 3.3, 0, 2.95, -3.6],
  [3.8, 1.35, 2.6, 0, 1.55, -9.55],
  [4.55, 4.9, 15, 0, 4, 5.75],
  [4.64, 0.28, 15.12, 0, 1.55, 5.75],
  [4.7, 0.18, 15.3, 0, 6.45, 5.75],
  ...[-7.3, -2.6, 1, 7.6, 10.8].flatMap((z) => [-2.18, 2.18].map((x) => [0.5, 1.64, 1.64, x, 1.02, z])),
];
const SCREENS = [[1440, 900], [1920, 1080], [1280, 1024], [1024, 650]];

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

/** Najmanje rastojanje kamere od bilo kog brda (kupa; iznad vrha -- od vrha). */
function hillDistance(x, y, z) {
  let best = Infinity;
  for (const hill of HILLS) {
    const across = Math.hypot(x - hill.x, z - hill.z);
    const rise = (y + 0.1) / hill.height;
    const d = rise >= 1 ? Math.hypot(across, y - (hill.height - 0.1)) : across - hill.radius * (1 - rise);
    best = Math.min(best, d);
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
  const nearHill = new Array(SAMPLES).fill(false);
  const min = { truck: { d: Infinity, p: 0 }, pole: { d: Infinity, p: 0 }, hill: { d: Infinity, p: 0 } };

  for (let s = 0; s < SAMPLES; s++) {
    const p = (s + 0.5) / SAMPLES;
    place(p, cameraProgress(p, BEATS), position, target);
    const d = {
      truck: truckDistance([position.x, position.y, position.z - truckZ(p)]),
      pole: poleDistance(position.x, position.y, position.z),
      hill: hillDistance(position.x, position.y, position.z),
    };
    nearTruck[s] = d.truck < TRUCK_CLEARANCE;
    nearPole[s] = d.pole < POLE_CLEARANCE;
    nearHill[s] = d.hill < HILL_CLEARANCE;
    for (const key of Object.keys(min)) if (d[key] < min[key].d) min[key] = { d: d[key], p };
  }

  const surface = truckSurface();
  const composition = [0, 1 / 3, 2 / 3, 1].map((p) => SCREENS.map((screen) => textShare(place, p, screen, surface)));

  const lens = place(0, cameraProgress(0, BEATS), position, target);
  return {
    truckRanges: ranges(nearTruck),
    poleRanges: ranges(nearPole),
    hillRanges: ranges(nearHill),
    min,
    composition,
    first: { position: position.toArray(), target: target.toArray(), fov: lens.fov, shift: lens.shift },
  };
}

const metrics = measure();

describe('kamera u heroju ne prolazi kroz kamion, pored stuba ni kroz brdo (RD2)', () => {
  it('1 -- kamera nigde nije blize od 2 jedinice kamionu', () => {
    expect(metrics.truckRanges).toEqual([]);
  });

  it('2 -- kamera nigde nije blize od 1 jedinice stubu', () => {
    expect(metrics.poleRanges).toEqual([]);
  });

  it('3 -- kamera nigde nije blize od 1 jedinice brdu', () => {
    expect(metrics.hillRanges).toEqual([]);
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
        ` | brdo min ${f(metrics.min.hill)}`,
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
