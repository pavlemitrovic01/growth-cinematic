import * as THREE from 'three';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';

/**
 * Tlo i put hero scene (`RD10`).
 *
 * ⚠️ ZASTO POSTOJI. Do `RD10` su brda bila 58 kupa sa pet strana i `flatShading`, a put ravna ploca bez
 * teksture -- Pavle: „okruzenje mi previse izgleda kao lego kockice". Tlo je sada jedna povrsina cija je
 * visina CISTA funkcija `terrainHeight`, pa isti oblik koriste i mesh i test razmaka kamere
 * (`__tests__/lib/hero-scene.test.js`) -- bez prepisanih brojki koje odlutaju (pouka iz `RD2`).
 *
 * ⚠️ Uvozi ga samo `lib/hero-scene.ts`, koji se ucitava odlozeno; staticki uvoz iz komponente bi povukao
 * three.js u glavni bundle.
 */

export type TerrainStyle = 'blaga' | 'visa';

/**
 * Stil tla u sceni: visa brda i daleki greben (Pavle, 2026-09-17, izbor od tri kombinacije: „najvise mi se
 * svidja 3"). Test razmaka kamere i sunca meri bas ovaj.
 */
export const TERRAIN_STYLE: TerrainStyle = 'visa';

/**
 * Ravan plato pored puta (`RD11`, truck stop): `side` je strana puta (+1 desno u smeru voznje), `near`-`far`
 * udaljenost od sredine puta, `from`-`to` opseg po z (from > to). Van platoa tlo se vraca u brda preko `margin`.
 */
export type Pad = { side: -1 | 1; near: number; far: number; from: number; to: number; margin: number };

/**
 * Dva truck stop-a (Pavle, 2026-09-19, izbor od cetiri varijante: kombinacija 2 i 3, „konacno je"):
 * - nocni, desno ispred kamiona: svetla kroz celo 01, nadstresnica i tabla pred kraj 01;
 * - jutarnji, levo, izmedju teksta i puta u 03.
 *
 * ⚠️ Mesta su izmerena po kadru. Nocni blize putu ili blize kamionu upada u 02 ispod naslova „$0" (kamera tamo gleda
 * unazad, pa je desna strana puta levo na ekranu); jutarnji je dovoljno daleko da ga u 01 skriva magla.
 */
const PAD_NIGHT: Pad = { side: 1, near: 35, far: 130, from: -150, to: -240, margin: 30 };
const PAD_DAWN: Pad = { side: -1, near: 20, far: 115, from: -285, to: -375, margin: 30 };

export const TRUCK_STOP_PADS: readonly Pad[] = [PAD_NIGHT, PAD_DAWN];

/** Udeo platoa u tacki: 1 na platou, blago do 0 na `margin` od njega. */
function padMask(x: number, z: number, pads: readonly Pad[]): number {
  let mask = 0;
  for (const pad of pads) {
    if (Math.sign(x) !== pad.side) continue;
    const d = Math.abs(x);
    const across = Math.max(pad.near - d, 0, d - pad.far);
    const along = Math.max(pad.to - z, 0, z - pad.from);
    mask = Math.max(mask, 1 - ease(clamp01(Math.hypot(across, along) / pad.margin)));
  }
  return mask;
}

/** Do ove udaljenosti od sredine puta tlo je ravno: put (±9), bankina i stubovi (±10,6). */
export const ROAD_CORRIDOR = 12;

/** Ivica puta; tlo pocinje tu, na visini 0. */
const ROAD_EDGE = 9;

const STYLES: Record<TerrainStyle, { rise: number; riseEnd: number; hills: number; far: number; ridge: number }> = {
  // Niska, meka brda i otvoren pejzaz.
  blaga: { rise: 2.5, riseEnd: 70, hills: 4.5, far: 9, ridge: 0 },
  // Visa brda i daleki greben, slojevi u dubini.
  visa: { rise: 5, riseEnd: 55, hills: 9, far: 20, ridge: 34 },
};

const noise = new ImprovedNoise();
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const ease = (x: number) => x * x * (3 - 2 * x);

/** Visina tla u svetu (koordinate scene, ne kamiona). Deterministicka: isti ulaz, ista visina. */
export function terrainHeight(x: number, z: number, style: TerrainStyle): number {
  const d = Math.abs(x);
  if (d <= ROAD_CORRIDOR) return 0;
  const s = STYLES[style];
  const side = x < 0 ? 0 : 41.7;
  let rolling = 0;
  let amplitude = 1;
  let frequency = 1 / 38;
  for (let octave = 0; octave < 3; octave++) {
    rolling += amplitude * (noise.noise(x * frequency + side, z * frequency, 0.37 * octave) * 0.5 + 0.5);
    amplitude *= 0.5;
    frequency *= 2.1;
  }
  rolling = clamp01(rolling / 1.75);
  const near = ease(clamp01((d - ROAD_CORRIDOR) / (s.riseEnd - ROAD_CORRIDOR)));
  const far = ease(clamp01((d - 60) / 140));
  const ridge = s.ridge * ease(clamp01((d - 150) / 70)) * (0.55 + 0.45 * (noise.noise(z / 95, side, 3.1) * 0.5 + 0.5));
  return Math.max(0, near * (s.rise + s.hills * rolling) + far * s.far * rolling + ridge) * (1 - padMask(x, z, TRUCK_STOP_PADS));
}

/**
 * Jedna povrsina za obe strane puta, od ivice puta do 260 jedinica. Kolone su gusce uz put, gde kamera
 * prilazi. Boje su iz `S1-LOOK`: bankina `#1b2417` uz put, greben `#101b14` gore; pojas uz sam put dobija
 * ton asfalta, pa bankina prelazi u tlo bez ostre ivice.
 */
export function buildTerrain(style: TerrainStyle): THREE.Mesh {
  const columns = 64;
  const rows = 190;
  const zNear = 130;
  const zFar = -640;
  const shoulder = new THREE.Color('#1b2417');
  const ridge = new THREE.Color('#101b14');
  const asphalt = new THREE.Color('#232d28');
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const color = new THREE.Color();

  for (const sign of [-1, 1]) {
    const base = positions.length / 3;
    for (let row = 0; row <= rows; row++) {
      const z = zNear + ((zFar - zNear) * row) / rows;
      for (let column = 0; column <= columns; column++) {
        const t = column / columns;
        const x = sign * (ROAD_EDGE + (260 - ROAD_EDGE) * t ** 1.8);
        const y = terrainHeight(x, z, style);
        positions.push(x, y, z);
        const d = Math.abs(x);
        color.copy(shoulder).lerp(ridge, clamp01(y / 7));
        color.lerp(asphalt, 0.45 * (1 - clamp01((d - ROAD_EDGE) / 3.5)));
        colors.push(color.r, color.g, color.b);
      }
    }
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const a = base + row * (columns + 1) + column;
        const b = a + 1;
        const c = a + columns + 1;
        const e = c + 1;
        // Obe strane moraju biti okrenute nagore bez obzira na smer kolona.
        if (sign < 0) indices.push(a, c, b, b, c, e);
        else indices.push(a, b, c, b, e, c);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }));
}

/** Seeded pseudo-slucajni brojevi, da tekstura bude ista pri svakom ucitavanju. */
function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/**
 * Tekstura asfalta: sitna zrnca i blage mrlje, u sivoj skali. Mnozi boju puta iz `S1-LOOK`, pa boja ostaje
 * ista, samo dobija povrsinu; ista slika je i mapa hrapavosti, pa tamnije mrlje blago sijaju.
 */
export function asphaltTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const next = random(7);
    const image = ctx.createImageData(size, size);
    for (let i = 0; i < size * size; i++) {
      const blotch = noise.noise((i % size) / 40, Math.floor(i / size) / 40, 5.3) * 0.5 + 0.5;
      const v = Math.round(255 * (0.88 + 0.08 * blotch + 0.04 * next()));
      image.data.set([v, v, v, 255], i * 4);
    }
    ctx.putImageData(image, 0, 0);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 110);
  return texture;
}

/** Izlizana boja linija: alfa sa rupicama i mekim krajevima, boja linije ostaje ista. */
export function wornPaintTexture(): THREE.CanvasTexture {
  const width = 16;
  const height = 128;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const next = random(11);
    const image = ctx.createImageData(width, height);
    for (let i = 0; i < width * height; i++) {
      const wear = next() < 0.18 ? 0.35 : 0.85 + 0.15 * next();
      const v = Math.round(255 * wear);
      image.data.set([v, v, v, 255], i * 4);
    }
    ctx.putImageData(image, 0, 0);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}
