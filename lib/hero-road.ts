import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { type Pad, TRUCK_STOP_PADS, wornPaintTexture } from './hero-terrain';

/**
 * Americki put hero scene (`RD11`): linije, zastitna ograda, stubici sa reflektorima i dva truck stop-a.
 *
 * ⚠️ ZASTO OVAKO. Put je u svakom kadru, pa ga cita americki: na autoputu je leva ivicna linija zuta, desna bela, a
 * isprekidane linije imaju duge pauze (MUTCD: 3 m linija, 9 m razmak). Razmera je 1 jedinica ~ 0,52 m (sirina
 * kamiona). Kamion vozi ka -z, pa je desno +x.
 *
 * ⚠️ Sve je spojeno po materijalu -- linije, ograda i stubici su tri draw poziva, kao i linije pre `RD11`; oba
 * truck stop-a jos pet -- i nista ne baca senku i ne dodaje svetlo. Delovi su podatak (`roadsideParts`), pa `__tests__/lib/hero-scene.test.js` meri razmak kamere i
 * zrak ka mesecu i suncu na istim kutijama koje scena crta.
 *
 * ⚠️ Uvozi ga samo `lib/hero-scene.ts`, koji se ucitava odlozeno.
 */

type Vec3 = readonly [number, number, number];

export type RoadsideMaterial = 'steel' | 'reflector' | 'structure' | 'trailer' | 'lot' | 'lamp';

/** Kutija u koordinatama sveta. `tint` je boja reflektora ili svetla (materijali sa bojom po temenu). */
export type RoadsidePart = { size: Vec3; at: Vec3; material: RoadsideMaterial; tint?: string; truckStop?: boolean };

export type RoadDesign = {
  /** Opseg puta po z (od blizu ka daleko). */
  from: number;
  to: number;
  /** Isprekidane linije izmedju traka. */
  lanes: { x: readonly number[]; width: number; dash: number; period: number; color: string };
  /** Pune ivicne linije: leva zuta, desna bela. */
  edges: readonly { x: number; width: number; color: string }[];
  /** Reflektujuci markeri na putu: u pauzama isprekidanih linija (beli) i uz levu ivicu (zuti). */
  markers: { every: number; size: Vec3; white: string; yellow: string };
  /** Zastitna ograda: lice W-profila na `x`, vrh na `top`; stubovi na svakih `post`. */
  rail: { x: number; top: number; height: number; depth: number; post: number };
  /** Deonice ograde po strani (from > to); izmedju njih stoje stubici. */
  rails: readonly { side: -1 | 1; from: number; to: number }[];
  /** Stubici sa reflektorom; boja reflektora prati ivicnu liniju (levo zuta, desno bela). */
  delineator: { x: number; height: number; every: number; left: string; right: string };
  /** Platoi truck stop-ova (prazno = bez njih); isti platoi ravnaju tlo u `lib/hero-terrain.ts`. */
  truckStops: readonly Pad[];
};

export const ROAD_DESIGN: RoadDesign = {
  from: 118,
  to: -578,
  lanes: { x: [-3, 3], width: 0.16, dash: 5.9, period: 23.4, color: '#e2d8b6' },
  edges: [
    { x: -8.2, width: 0.18, color: '#c99b3c' },
    { x: 8.2, width: 0.18, color: '#a9a992' },
  ],
  markers: { every: 46.8, size: [0.22, 0.05, 0.14], white: '#dcd6c0', yellow: '#d9a441' },
  rail: { x: 9.7, top: 1.35, height: 0.6, depth: 0.16, post: 3.65 },
  rails: [
    { side: -1, from: 118, to: 40 },
    { side: -1, from: -110, to: -230 },
    { side: -1, from: -380, to: -500 },
    { side: 1, from: 80, to: -20 },
    { side: 1, from: -170, to: -290 },
    { side: 1, from: -420, to: -540 },
  ],
  delineator: { x: 9.9, height: 2.1, every: 23.4, left: '#d9a441', right: '#dcd6c0' },
  truckStops: TRUCK_STOP_PADS,
};

/** Gustina izlizane boje po jedinici duzine, kao ivicne linije pre `RD11` (160 ponavljanja na 700). */
const PAINT_REPEAT = 160 / 700;

const box = (size: Vec3, at: Vec3, material: RoadsideMaterial, tint?: string): RoadsidePart => ({ size, at, material, tint });

/**
 * Truck stop kao svetla u daljini: osvetljena nadstresnica, niska zgrada sa osvetljenim prozorima, cetiri parkirana
 * tegljaca kao siluete, stubovi rasvete i visok stub sa praznim tablama -- bez teksta i marke.
 */
function truckStopParts(pad: Pad): RoadsidePart[] {
  const s = pad.side;
  const mid = (pad.from + pad.to) / 2;
  // u = udaljenost od sredine puta, w = z; x u svetu je s * u.
  const at = (u: number, y: number, w: number): Vec3 => [s * u, y, w];
  const light = '#fff0d2';
  const parts: RoadsidePart[] = [];
  const lotNear = pad.near + 2;
  const lotFar = pad.far - 25;
  parts.push(box([lotFar - lotNear, 0.04, pad.from - pad.to - 8], at((lotNear + lotFar) / 2, 0.02, mid), 'lot'));

  // Nadstresnica: krov na stubovima, svetla ispod i svetla traka na ivicama.
  const canopy = { u: pad.near + 18, w: mid + 15, across: 26, along: 40, under: 9.5, depth: 1.6 };
  parts.push(box([canopy.across, canopy.depth, canopy.along], at(canopy.u, canopy.under + canopy.depth / 2, canopy.w), 'structure'));
  for (const du of [-8, 8]) for (const dw of [-15, 0, 15]) parts.push(box([0.7, canopy.under, 0.7], at(canopy.u + du, canopy.under / 2, canopy.w + dw), 'structure'));
  for (const dw of [-14, -7, 0, 7, 14]) parts.push(box([canopy.across - 3, 0.12, 1.3], at(canopy.u, canopy.under - 0.06, canopy.w + dw), 'lamp', light));
  for (const du of [-canopy.across / 2, canopy.across / 2]) parts.push(box([0.2, 0.5, canopy.along], at(canopy.u + du, canopy.under + canopy.depth / 2, canopy.w), 'lamp', light));

  // Zgrada sa pojasom osvetljenih prozora prema putu.
  parts.push(box([22, 7, 25], at(pad.near + 51, 3.5, mid - 27), 'structure'));
  parts.push(box([0.2, 1.8, 20], at(pad.near + 40 - 0.1, 2.4, mid - 27), 'lamp', '#f7e3c0'));

  // Parkirani tegljaci: prikolica, kabina i hauba; gornja svetla zuta, zadnja crvena.
  for (const u of [36, 44, 52, 60].map((du) => pad.near + du)) {
    const w = mid + 18;
    parts.push(box([5, 4.8, 26], at(u, 3.8, w), 'trailer'));
    parts.push(box([5, 4.2, 6], at(u, 3.1, w - 17), 'structure'));
    parts.push(box([3.6, 2.2, 5], at(u, 2.1, w - 22.5), 'structure'));
    for (const dx of [-2.3, 2.3]) {
      parts.push(box([0.2, 0.2, 0.2], at(u + dx, 6.3, w - 12.9), 'lamp', '#f5c47b'));
      parts.push(box([0.25, 0.25, 0.1], at(u + dx, 1.7, w + 13.05), 'lamp', '#d3432d'));
    }
  }

  // Stubovi rasvete na parkingu.
  for (const [u, dw] of [[pad.near + 32, -8], [pad.near + 74, 25], [pad.near + 74, -25]]) {
    parts.push(box([0.4, 16, 0.4], at(u, 8, mid + dw), 'structure'));
    parts.push(box([2.2, 0.35, 1.1], at(u, 16, mid + dw), 'lamp', light));
  }

  // Stub sa dve prazne table, na daljem kraju platoa (ne na zraku ka suncu u 02). Nizak (Pavle: „tabla treba biti
  // nize"): visoka tabla jutarnjeg truck stop-a se u 01 kroz maglu videla kao silueta na nebu pored teksta.
  const sign = { u: pad.near + 6, w: pad.to + 8 };
  parts.push(box([1, 13, 1], at(sign.u, 6.5, sign.w), 'structure'));
  parts.push(box([9.4, 7, 0.8], at(sign.u, 13, sign.w), 'structure'));
  for (const y of [14.6, 11.4]) parts.push(box([8.6, 2.9, 0.9], at(sign.u, y, sign.w), 'lamp', '#e9dcc0'));

  return parts.map((part) => ({ ...part, truckStop: true }));
}

/** Svi delovi pored puta kao kutije: stubovi ograde, stubici, reflektori, markeri i truck stop. */
export function roadsideParts(design: RoadDesign): RoadsidePart[] {
  const parts: RoadsidePart[] = [];
  const { rail, delineator, markers } = design;
  const inRail = (side: -1 | 1, z: number) => design.rails.some((r) => r.side === side && z <= r.from + 2 && z >= r.to - 2);

  for (const r of design.rails) {
    const postX = r.side * (rail.x + 0.24);
    for (let z = r.from; z >= r.to; z -= rail.post) parts.push(box([0.26, rail.top - 0.05, 0.26], [postX, (rail.top - 0.05) / 2, z], 'steel'));
    // Reflektori na vrhu ograde, istim ritmom kao stubici.
    const tint = r.side < 0 ? delineator.left : delineator.right;
    for (let z = r.from - 6; z >= r.to; z -= delineator.every) parts.push(box([0.1, 0.16, 0.06], [r.side * rail.x, rail.top + 0.08, z], 'reflector', tint));
  }

  for (const side of [-1, 1] as const) {
    const tint = side < 0 ? delineator.left : delineator.right;
    for (let z = design.from; z >= design.to; z -= delineator.every) {
      if (inRail(side, z)) continue;
      parts.push(box([0.16, delineator.height, 0.1], [side * delineator.x, delineator.height / 2, z], 'steel'));
      parts.push(box([0.2, 0.32, 0.12], [side * delineator.x, delineator.height - 0.3, z], 'reflector', tint));
    }
  }

  const { lanes } = design;
  for (let z = design.from - lanes.dash - (lanes.period - lanes.dash) / 2; z >= design.to; z -= markers.every) {
    for (const x of lanes.x) parts.push(box(markers.size, [x, markers.size[1] / 2, z], 'reflector', markers.white));
    parts.push(box(markers.size, [design.edges[0].x + 0.35, markers.size[1] / 2, z - lanes.period], 'reflector', markers.yellow));
  }

  for (const pad of design.truckStops) parts.push(...truckStopParts(pad));
  return parts;
}

/**
 * Prepreke za kameru i za zrak ka mesecu i suncu: kutije delova koji stoje uspravno i okviri deonica ograde.
 * `truckStop` oznacava delove truck stop-a.
 */
export function roadsideBoxes(design: RoadDesign): { min: Vec3; max: Vec3; truckStop: boolean }[] {
  const boxes = roadsideParts(design)
    .filter((part) => part.material !== 'lot' && part.size[1] > 0.1)
    .map(({ size, at, truckStop }) => ({
      min: [at[0] - size[0] / 2, at[1] - size[1] / 2, at[2] - size[2] / 2] as Vec3,
      max: [at[0] + size[0] / 2, at[1] + size[1] / 2, at[2] + size[2] / 2] as Vec3,
      truckStop: !!truckStop,
    }));
  for (const r of design.rails) {
    const inner = r.side * (design.rail.x - design.rail.depth);
    const outer = r.side * design.rail.x;
    boxes.push({
      min: [Math.min(inner, outer), design.rail.top - design.rail.height, r.to],
      max: [Math.max(inner, outer), design.rail.top, r.from],
      truckStop: false,
    });
  }
  return boxes;
}

/** Ravna traka boje na asfaltu, sa bojom po temenu i UV-om koji ponavlja izlizanu boju po duzini. */
function paintGeometry(design: RoadDesign): THREE.BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const colors: number[] = [];
  const color = new THREE.Color();
  const strip = (x: number, width: number, near: number, far: number, hex: string) => {
    const [x0, x1] = [x - width / 2, x + width / 2];
    const v = (near - far) * PAINT_REPEAT;
    color.set(hex);
    // Dva trougla okrenuta nagore.
    const corners = [[x0, near, 0, 0], [x1, near, 1, 0], [x1, far, 1, v], [x0, near, 0, 0], [x1, far, 1, v], [x0, far, 0, v]];
    for (const [cx, cz, u, cv] of corners) {
      positions.push(cx, 0.013, cz);
      uvs.push(u, cv);
      colors.push(color.r, color.g, color.b);
    }
  };
  for (const edge of design.edges) strip(edge.x, edge.width, design.from, design.to, edge.color);
  const { lanes } = design;
  for (let z = design.from; z - lanes.dash >= design.to; z -= lanes.period) {
    for (const x of lanes.x) strip(x, lanes.width, z, z - lanes.dash, lanes.color);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  return geometry;
}

/** W-profil ograde izvucen duz svake deonice, lice prema putu. */
function railGeometry(design: RoadDesign): THREE.BufferGeometry {
  const { rail } = design;
  const base = rail.top - rail.height;
  const step = rail.height / 6;
  // (koliko je tacka blize putu od lica, visina)
  const profile = [[0, 0], [rail.depth, step], [rail.depth, 2 * step], [0, 3 * step], [rail.depth, 4 * step], [rail.depth, 5 * step], [0, 6 * step]];
  const positions: number[] = [];
  for (const r of design.rails) {
    for (let i = 0; i < profile.length - 1; i++) {
      const [a, b] = [profile[i], profile[i + 1]];
      const ax = r.side * (rail.x - a[0]);
      const bx = r.side * (rail.x - b[0]);
      const [ay, by] = [base + a[1], base + b[1]];
      positions.push(ax, ay, r.from, bx, by, r.from, bx, by, r.to, ax, ay, r.from, bx, by, r.to, ax, ay, r.to);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(new Array((positions.length / 3) * 2).fill(0), 2));
  geometry.computeVertexNormals();
  return geometry;
}

/** Meka svetla mrlja na tlu ispod nadstresnice. */
function poolTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.55, 'rgba(255,255,255,0.45)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

export function buildRoad(design: RoadDesign): THREE.Group {
  const group = new THREE.Group();
  group.add(new THREE.Mesh(paintGeometry(design), new THREE.MeshBasicMaterial({ vertexColors: true, alphaMap: wornPaintTexture(), transparent: true })));

  const materials: Record<RoadsideMaterial, () => THREE.Material> = {
    steel: () => new THREE.MeshStandardMaterial({ color: '#6f766c', metalness: 0.45, roughness: 0.5, side: THREE.DoubleSide }),
    reflector: () => new THREE.MeshBasicMaterial({ vertexColors: true }),
    structure: () => new THREE.MeshStandardMaterial({ color: '#1c231d', roughness: 0.8 }),
    trailer: () => new THREE.MeshStandardMaterial({ color: '#d8d3c5', metalness: 0.1, roughness: 0.34 }),
    lot: () => new THREE.MeshStandardMaterial({ color: '#232d28', roughness: 0.9 }),
    // Svetla truck stop-a su mnogo jaca od 1: kroz maglu se vide kao svetla u daljini do ~220 jedinica, pa nestaju.
    lamp: () => new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false, color: new THREE.Color(16, 16, 16) }),
  };
  const byMaterial = new Map<RoadsideMaterial, THREE.BufferGeometry[]>([['steel', [railGeometry(design)]]]);
  const color = new THREE.Color();
  for (const part of roadsideParts(design)) {
    const geometry = new THREE.BoxGeometry(...part.size).toNonIndexed();
    geometry.translate(...part.at);
    if (part.material === 'reflector' || part.material === 'lamp') {
      color.set(part.tint ?? '#ffffff');
      const count = geometry.getAttribute('position').count;
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(Array.from({ length: count }, () => [color.r, color.g, color.b]).flat(), 3));
    }
    const list = byMaterial.get(part.material) ?? [];
    list.push(geometry);
    byMaterial.set(part.material, list);
  }
  for (const [key, geometries] of byMaterial) group.add(new THREE.Mesh(mergeGeometries(geometries), materials[key]()));

  if (design.truckStops.length) {
    // Svetle mrlje ispod nadstresnica: jedna povrsina za sve truck stop-ove, jedan draw poziv.
    const pools = design.truckStops.map((pad) =>
      new THREE.PlaneGeometry(40, 54).rotateX(-Math.PI / 2).translate(pad.side * (pad.near + 18), 0.06, (pad.from + pad.to) / 2 + 15),
    );
    group.add(new THREE.Mesh(
      mergeGeometries(pools),
      new THREE.MeshBasicMaterial({ map: poolTexture(), color: '#fff0d2', transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false }),
    ));
  }
  return group;
}
