import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/**
 * Kamion hero scene kao podatak (`RD10`).
 *
 * ⚠️ ZASTO POSTOJI. Do `RD10` je kamion bio 26 kutija i 20 zasebnih cilindara u `createHeroScene`, a test
 * razmaka kamere je te mere drzao prepisane. Sada je oblik niz delova (`TruckPart`), iz kog se prave i
 * mesh (`buildTruck`) i okvir za test (`truckBounds`, `truckBoxes`) -- jedan izvor.
 *
 * ⚠️ Koordinate su koordinate KAMIONA: prednji kraj je na -z, zadnji na +z, y od puta. Boje su iz
 * `S1-LOOK` i ne menjaju se ovde (DECISIONS). Uvozi ga samo `lib/hero-scene.ts` (odlozen chunk).
 */

type Vec3 = readonly [number, number, number];

export type TruckMaterial = 'olive' | 'dark' | 'chrome' | 'glass' | 'trailer' | 'head' | 'tail' | 'amber';

export type TruckPart =
  | { shape: 'box'; size: Vec3; at: Vec3; material: TruckMaterial; radius?: number; tilt?: number }
  | { shape: 'cylinder'; radius: number; length: number; axis: 'x' | 'y' | 'z'; at: Vec3; material: TruckMaterial }
  | { shape: 'disc'; radius: number; at: Vec3; facing: -1 | 1; material: TruckMaterial };

export type TruckDesign = {
  parts: readonly TruckPart[];
  /** Z osovina; tockovi su na x ±`wheelX`, visina osovine `wheelY`. */
  axles: readonly number[];
  wheelX: number;
  wheelY: number;
  wheelRadius: number;
  wheelWidth: number;
  /** Farovi (svetlo koje baca snop), po jedan za svaku x vrednost. */
  headlights: { x: readonly number[]; y: number; z: number };
};

const box = (size: Vec3, at: Vec3, material: TruckMaterial, radius?: number, tilt?: number): TruckPart => ({
  shape: 'box', size, at, material, radius, tilt,
});
const mirror = (fn: (side: -1 | 1) => TruckPart): TruckPart[] => [fn(-1), fn(1)];

/**
 * Americki tegljac sa dugom haubom i suvom prikolicom (`RD10`): zaobljene ivice, hauba sa resetkom, kabina
 * sa spavacim delom i spojlerom, rezervoari, dva auspuha, blatobrani, tockovi sa felnom, zadnja vrata sa
 * svetlima. Ostaje u okviru kamiona iz `RD2` (x ±2,73, y 0,2-6,54, z -10,96-13,4), jer je po tom okviru
 * izmeren plan kamere.
 */
export const TRUCK_DESIGN: TruckDesign = {
  parts: [
    // Hauba, kabina, spavaci deo, spojler.
    box([3.2, 1.45, 3.1], [0, 2.05, -9.25], 'olive', 0.32),
    box([3.9, 2.95, 2.55], [0, 3.15, -6.45], 'olive', 0.35),
    box([3.9, 3.5, 3.2], [0, 3.4, -3.55], 'olive', 0.35),
    box([3.7, 0.95, 2.9], [0, 5.45, -3.7], 'olive', 0.4, 0.12),
    ...mirror((side) => box([0.62, 0.32, 2.0], [side * 2.15, 2.02, -7.3], 'olive', 0.14)),
    ...mirror((side) => box([0.25, 0.7, 2.3], [side * 1.95, 1.45, -6.3], 'olive', 0.1)),
    // Resetka u hromiranom okviru, branik.
    box([2.25, 1.15, 0.1], [0, 2.05, -10.84], 'dark'),
    box([2.55, 0.12, 0.1], [0, 2.66, -10.88], 'chrome'),
    box([2.55, 0.12, 0.1], [0, 1.44, -10.88], 'chrome'),
    ...mirror((side) => box([0.12, 1.35, 0.1], [side * 1.22, 2.05, -10.88], 'chrome')),
    ...Array.from({ length: 7 }, (_, i) => box([0.05, 1.05, 0.06], [-0.9 + i * 0.3, 2.05, -10.9], 'chrome')),
    box([3.9, 0.42, 0.36], [0, 1.12, -10.72], 'chrome', 0.12),
    // Staklo.
    box([3.25, 1.05, 0.08], [0, 3.95, -7.74], 'glass', undefined, -0.2),
    ...mirror((side) => box([0.06, 0.85, 1.25], [side * 1.96, 3.9, -6.55], 'glass')),
    // Retrovizori.
    ...mirror((side) => box([0.55, 0.05, 0.05], [side * 2.28, 3.9, -7.55], 'chrome')),
    ...mirror((side) => box([0.14, 0.62, 0.26], [side * 2.6, 3.85, -7.55], 'dark')),
    // Rezervoari i auspusi.
    ...mirror((side) => ({ shape: 'cylinder', radius: 0.42, length: 1.7, axis: 'z', at: [side * 2.05, 1.35, -4.4], material: 'chrome' })),
    ...mirror((side) => ({ shape: 'cylinder', radius: 0.1, length: 3.1, axis: 'y', at: [side * 2.05, 4.3, -5.3], material: 'chrome' })),
    // Sasija, sedlo, blatobrani.
    ...mirror((side) => box([0.3, 0.32, 14.5], [side * 0.85, 1.05, 1.0], 'dark')),
    box([2.3, 0.18, 1.3], [0, 1.48, -0.9], 'dark'),
    ...mirror((side) => box([0.62, 0.72, 0.05], [side * 2.18, 0.92, 2.05], 'dark')),
    ...mirror((side) => box([0.62, 0.72, 0.05], [side * 2.18, 0.92, 12.1], 'dark')),
    // Prikolica: telo, donja i gornja ivica, zadnji branik, vrata.
    box([4.5, 4.72, 15.1], [0, 4.07, 5.75], 'trailer', 0.07),
    box([4.5, 0.28, 15.1], [0, 1.62, 5.75], 'dark', 0.05),
    box([4.56, 0.1, 15.15], [0, 6.45, 5.75], 'chrome'),
    box([3.9, 0.22, 0.22], [0, 0.95, 13.05], 'dark'),
    ...[-1.7, -0.5, 0.5, 1.7].map((x) => box([0.05, 4.2, 0.05], [x, 4.05, 13.33], 'chrome')),
    // Svetla.
    ...mirror((side) => ({ shape: 'disc', radius: 0.22, at: [side * 1.35, 1.95, -10.87], facing: -1, material: 'head' })),
    ...mirror((side) => ({ shape: 'disc', radius: 0.16, at: [side * 1.7, 1.65, 13.36], facing: 1, material: 'tail' })),
    ...mirror((side) => ({ shape: 'disc', radius: 0.07, at: [side * 2.05, 6.25, 13.36], facing: 1, material: 'tail' })),
    ...[-0.35, 0, 0.35].map((x): TruckPart => ({ shape: 'disc', radius: 0.06, at: [x, 6.25, 13.36], facing: 1, material: 'tail' })),
    ...[-0.5, 2.75, 6, 9.25, 12.5].flatMap((z) => mirror((side) => box([0.04, 0.1, 0.18], [side * 2.27, 1.95, z], 'amber'))),
    ...[-0.7, -0.35, 0, 0.35, 0.7].map((x) => box([0.18, 0.07, 0.07], [x, 4.62, -7.72], 'amber')),
  ],
  axles: [-7.3, -2.6, 1.0, 7.6, 10.8],
  wheelX: 2.18,
  wheelY: 1.02,
  wheelRadius: 0.82,
  wheelWidth: 0.5,
  headlights: { x: [-1.35, 1.35], y: 1.95, z: -10.75 },
};

/** Okvir dela u koordinatama kamiona: [min, max]. Nagnute kutije se racunaju po zarotiranim uglovima. */
function partBounds(part: TruckPart): [Vec3, Vec3] {
  const [x, y, z] = part.at;
  if (part.shape === 'disc') return [[x - part.radius, y - part.radius, z - 0.01], [x + part.radius, y + part.radius, z + 0.01]];
  if (part.shape === 'cylinder') {
    const half = part.length / 2;
    const r = part.radius;
    const e: Vec3 = part.axis === 'x' ? [half, r, r] : part.axis === 'y' ? [r, half, r] : [r, r, half];
    return [[x - e[0], y - e[1], z - e[2]], [x + e[0], y + e[1], z + e[2]]];
  }
  const [w, h, d] = part.size;
  const tilt = part.tilt ?? 0;
  const ey = Math.abs((h / 2) * Math.cos(tilt)) + Math.abs((d / 2) * Math.sin(tilt));
  const ez = Math.abs((h / 2) * Math.sin(tilt)) + Math.abs((d / 2) * Math.cos(tilt));
  return [[x - w / 2, y - ey, z - ez], [x + w / 2, y + ey, z + ez]];
}

/** Okviri svih delova i tockova, kao [sirina, visina, dubina, x, y, z] -- za merenje kompozicije. */
export function truckBoxes(design: TruckDesign): [number, number, number, number, number, number][] {
  const out: [number, number, number, number, number, number][] = design.parts.map((part) => {
    const [min, max] = partBounds(part);
    return [max[0] - min[0], max[1] - min[1], max[2] - min[2], (min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
  });
  for (const z of design.axles) {
    for (const side of [-1, 1]) {
      out.push([design.wheelWidth, design.wheelRadius * 2, design.wheelRadius * 2, side * design.wheelX, design.wheelY, z]);
    }
  }
  return out;
}

/** Unija okvira svih delova i tockova -- ono sto kamera ne sme da presece. */
export function truckBounds(design: TruckDesign): { min: [number, number, number]; max: [number, number, number] } {
  const min: [number, number, number] = [Infinity, Infinity, Infinity];
  const max: [number, number, number] = [-Infinity, -Infinity, -Infinity];
  for (const [w, h, d, x, y, z] of truckBoxes(design)) {
    const lo = [x - w / 2, y - h / 2, z - d / 2];
    const hi = [x + w / 2, y + h / 2, z + d / 2];
    for (let i = 0; i < 3; i++) {
      min[i] = Math.min(min[i], lo[i]);
      max[i] = Math.max(max[i], hi[i]);
    }
  }
  return { min, max };
}

/** Rebra na limu prikolice: svetla slika sa tamnijim uspravnim linijama, mnozi boju prikolice. */
function ribTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 8;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 64, 8);
    ctx.fillStyle = '#d9d9d9';
    ctx.fillRect(0, 0, 5, 8);
    ctx.fillStyle = '#efefef';
    ctx.fillRect(5, 0, 3, 8);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(24, 1);
  return texture;
}

function partGeometry(part: TruckPart): THREE.BufferGeometry {
  let geometry: THREE.BufferGeometry;
  if (part.shape === 'disc') {
    geometry = new THREE.CircleGeometry(part.radius, 14);
    if (part.facing < 0) geometry.rotateY(Math.PI);
  } else if (part.shape === 'cylinder') {
    geometry = new THREE.CylinderGeometry(part.radius, part.radius, part.length, 20);
    if (part.axis === 'x') geometry.rotateZ(Math.PI / 2);
    if (part.axis === 'z') geometry.rotateX(Math.PI / 2);
  } else {
    const [w, h, d] = part.size;
    geometry = part.radius ? new RoundedBoxGeometry(w, h, d, 3, part.radius) : new THREE.BoxGeometry(w, h, d);
    if (part.tilt) geometry.rotateX(part.tilt);
  }
  geometry.translate(part.at[0], part.at[1], part.at[2]);
  return geometry.index ? geometry.toNonIndexed() : geometry;
}

/** Zaobljena guma: profil sa mekim ivicama, okrenut oko x ose. */
function tireGeometry(radius: number, width: number): THREE.BufferGeometry {
  const inner = radius * 0.62;
  const round = width * 0.28;
  const half = width / 2;
  const points: THREE.Vector2[] = [];
  points.push(new THREE.Vector2(inner, -half));
  for (let i = 0; i <= 6; i++) {
    const a = -Math.PI / 2 + (i / 6) * (Math.PI / 2);
    points.push(new THREE.Vector2(radius - round + Math.cos(a) * round, -half + round + Math.sin(a) * round));
  }
  for (let i = 0; i <= 6; i++) {
    const a = (i / 6) * (Math.PI / 2);
    points.push(new THREE.Vector2(radius - round + Math.cos(a) * round, half - round + Math.sin(a) * round));
  }
  points.push(new THREE.Vector2(inner, half));
  const geometry = new THREE.LatheGeometry(points, 28);
  geometry.rotateZ(Math.PI / 2);
  return geometry;
}

/** Felna sa glavcinom i navrtkama, okrenuta ka spolja (`side`). */
function rimGeometry(radius: number, width: number, side: -1 | 1): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const disc = new THREE.CylinderGeometry(radius * 0.62, radius * 0.62, width * 1.02, 24);
  disc.rotateZ(Math.PI / 2);
  parts.push(disc);
  const hub = new THREE.CylinderGeometry(radius * 0.2, radius * 0.24, 0.12, 16);
  hub.rotateZ(Math.PI / 2);
  hub.translate(side * (width * 0.51 + 0.05), 0, 0);
  parts.push(hub);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const lug = new THREE.BoxGeometry(0.05, 0.06, 0.06);
    lug.translate(side * (width * 0.51 + 0.02), Math.cos(a) * radius * 0.36, Math.sin(a) * radius * 0.36);
    parts.push(lug);
  }
  return mergeGeometries(parts.map((g) => (g.index ? g.toNonIndexed() : g)));
}

/**
 * Pravi kamion: delovi spojeni u po jedan mesh za svaki materijal (malo draw poziva), tockovi po osovini da
 * bi se okretali. Vraca grupu, osovine za okretanje i farove (za snop svetla).
 */
export function buildTruck(design: TruckDesign): { group: THREE.Group; axles: THREE.Object3D[]; headlights: THREE.Vector3[] } {
  // No environment map: metal has nothing to reflect and renders black. Low metalness lets the existing lights
  // shape the cab, dark parts and trailer. The cab olive is the mildest of the reviewed tones (2026-09-15).
  const materials: Record<TruckMaterial, THREE.Material> = {
    olive: new THREE.MeshStandardMaterial({ color: '#34472d', metalness: 0.2, roughness: 0.24 }),
    dark: new THREE.MeshStandardMaterial({ color: '#1c231d', metalness: 0.22, roughness: 0.27 }),
    chrome: new THREE.MeshStandardMaterial({ color: '#b9b9ad', metalness: 0.55, roughness: 0.3 }),
    glass: new THREE.MeshStandardMaterial({ color: '#223a31', roughness: 0.08, metalness: 0.1 }),
    trailer: new THREE.MeshStandardMaterial({ color: '#d8d3c5', metalness: 0.1, roughness: 0.34, map: ribTexture() }),
    // Light sources skip tone mapping, so exposure doesn't dim them.
    head: new THREE.MeshBasicMaterial({ color: '#fff4c8', toneMapped: false }),
    tail: new THREE.MeshBasicMaterial({ color: '#d3432d', toneMapped: false }),
    amber: new THREE.MeshBasicMaterial({ color: '#f5c47b', toneMapped: false }),
  };
  const tire = new THREE.MeshStandardMaterial({ color: '#121514', roughness: 0.9 });
  const group = new THREE.Group();

  const byMaterial = new Map<TruckMaterial, THREE.BufferGeometry[]>();
  for (const part of design.parts) {
    const list = byMaterial.get(part.material) ?? [];
    list.push(partGeometry(part));
    byMaterial.set(part.material, list);
  }
  for (const [key, geometries] of byMaterial) {
    const mesh = new THREE.Mesh(mergeGeometries(geometries), materials[key]);
    const lit = mesh.material instanceof THREE.MeshStandardMaterial;
    mesh.castShadow = lit;
    mesh.receiveShadow = lit;
    group.add(mesh);
  }

  const logoCanvas = document.createElement('canvas');
  logoCanvas.width = 1024;
  logoCanvas.height = 256;
  const ctx = logoCanvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#263420';
    ctx.font = '800 132px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('G R O W T H', 512, 172);
  }
  const logoTexture = new THREE.CanvasTexture(logoCanvas);
  logoTexture.colorSpace = THREE.SRGBColorSpace;
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(8.9, 2.25), new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true }));
  logo.rotation.y = -Math.PI / 2;
  logo.position.set(-2.29, 4.0, 5.3);
  const otherLogo = logo.clone();
  otherLogo.rotation.y = Math.PI / 2;
  otherLogo.position.x = 2.29;
  group.add(logo, otherLogo);

  const axles: THREE.Object3D[] = [];
  for (const z of design.axles) {
    const axle = new THREE.Group();
    axle.position.set(0, design.wheelY, z);
    const tires: THREE.BufferGeometry[] = [];
    const rims: THREE.BufferGeometry[] = [];
    for (const side of [-1, 1] as const) {
      const x = side * design.wheelX;
      const t = tireGeometry(design.wheelRadius, design.wheelWidth);
      t.translate(x, 0, 0);
      tires.push(t.index ? t.toNonIndexed() : t);
      const r = rimGeometry(design.wheelRadius, design.wheelWidth, side);
      r.translate(x, 0, 0);
      rims.push(r);
    }
    axle.add(new THREE.Mesh(mergeGeometries(tires), tire), new THREE.Mesh(mergeGeometries(rims), materials.chrome));
    group.add(axle);
    axles.push(axle);
  }

  const headlights = design.headlights.x.map((x) => new THREE.Vector3(x, design.headlights.y, design.headlights.z));
  return { group, axles, headlights };
}
