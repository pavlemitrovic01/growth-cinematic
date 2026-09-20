import * as THREE from 'three';
import { ROAD_DESIGN, roadsideParts } from './hero-road';
import type { TruckDesign } from './hero-truck';

/**
 * Svetlo i vazduh hero scene (`RD3`): nebo van magle, meki oreoli oko svetala i nebo u prelazu.
 *
 * ⚠️ ZASTO. Pavle 2026-09-15: „kao da je magla i da se sunce jedva probija kroz maglu". Izmereno 2026-09-19: disk
 * sunca i meseca stoji 110 jedinica od kamere, a `FogExp2` 0,0095 ga na toj udaljenosti boji 66 % bojom magle --
 * zato su bili sivo-bez. Zvezde isto. Sjaj farova i lampi video se samo u uvodu.
 *
 * ⚠️ Oreoli su tacke sa sopstvenim shaderom, ne nova svetla: nista ne baca senku, a svi oreoli pored puta su jedan
 * draw poziv, svi na kamionu jos jedan. Velicina je poluprecnik u jedinicama sveta (tacka se skalira objektivom),
 * pa `__tests__/lib/hero-scene.test.js` meri razmak kamere od oreola istim brojem koji scena crta.
 *
 * ⚠️ Uvozi ga samo `lib/hero-scene.ts`, koji se ucitava odlozeno.
 */

type Vec3 = readonly [number, number, number];

/** Udeo boje magle u boji tacke na rastojanju `distance` -- ista formula kao `FogExp2` u three.js. */
export const fogShare = (distance: number, density: number) => 1 - Math.exp(-((density * distance) ** 2));

/** Gustina magle nocu (`RD10`): odvaja planove, a daleki greben tone u nju. */
export const NIGHT_FOG_DENSITY = 0.0095;

/** Lampe na stubovima: 30 komada naizmenicno levo i desno, na svakih 20 jedinica. */
export const STREET_LIGHTS: readonly Vec3[] = Array.from({ length: 30 }, (_, i) => [(i % 2 ? 1 : -1) * 10.6, 5.7, 42 - i * 20]);

/** Oreol: centar, poluprecnik u jedinicama sveta, boja, i smer u koji svetlo gleda ([0, 0, 0] -- na sve strane). */
export type Halo = { at: Vec3; radius: number; color: string; facing: Vec3 };

/**
 * Izabrano svetlo (`RD3`, Pavle 2026-09-19, od sest varijanti uzivo: „Biram 3" -- „3 zlatna sredina" izmedju 2 i 4):
 * oreoli i sjajniji asfalt, bistra topla zora -- redja magla, brda u slojevima, nebo od sivo-plavog gore do toplog
 * horizonta, blag sjaj oko sunca. Disk ostaje `#ffd392`; svetli veo zore na dnu kadra je uklonjen.
 *
 * ⚠️ Horizont neba JE boja magle u tom trenutku, pa daleka brda tonu u nebo bez ivice. Ko menja boju magle, menja i
 * horizont. Svetlija i redja magla u zoru otkriva siluete u daljini (`LESSONS` L34) -- proveriti na snimku.
 */
export const LIGHT_STYLE = {
  /** Jacina oreola (dodaje se boji ispod). */
  haloStrength: 0.55,
  /** Hrapavost asfalta: 0,68 do `RD3`; manja = odsjaj farova, lampi i zore i posle uvoda. */
  asphaltRoughness: 0.45,
  /** Gustina magle u punoj zori (nocu `NIGHT_FOG_DENSITY`). */
  dawnDensity: 0.0045,
  /** Boja magle i horizonta u punoj zori (do `RD3` braon `#6c513b`). */
  dawnFog: '#b98468',
  /** Vrh neba nocu i u punoj zori. */
  zenith: { night: '#040a08', dawn: '#3b4757' },
  /** Sjaj oko sunca i oko meseca. */
  glow: { color: '#ffe2c4', sun: 1, moonColor: '#b9cfc8', moon: 0.35 },
  /** Disk meseca i sunca -- van magle i bez tone mappinga, pa ostaje ove boje. */
  disc: '#ffd392',
} as const;

/**
 * Zora na tlu (`RD13`, Pavle 2026-09-20: „Zavrsni kadar je previse taman, kao da je noc a pre toga izadje sunce").
 * Izmereno pre izmene: na 0,88 skrola kadar je 24,7 prosecne svetline -- ispod noci (28,6), a zavrsni 44,7.
 *
 * ⚠️ ZASTO OVAKO. Tlo je namerno vrlo tamno (`#1b2417`/`#101b14`, `RD10`), a toplo svetlo zore pada pod ~17 stepeni,
 * pa ravno tlo od njega dobija malo; daleka brda izgledaju svetlo samo zato sto ih magla boji u boju neba. Zato zora
 * podize sam albedo tla i asfalta i dolazi kroz nebo (ambijent), umesto da se dodaje jos jedan jak reflektor.
 */
export const DAWN_GROUND = {
  /** Boja „neba" u ambijentalnom svetlu u zoru (nocu `#8f9f95`). */
  skyFill: '#c49a7c',
  /** Dodatna jacina ambijenta u punoj zori (uz postojecih +0,74). */
  skyBoost: 1.5,
  /** Mnozilac boje terena u punoj zori; asfalt dobija 70 % istog. */
  groundLift: 2.6,
  /** Topao ton koji ide uz podizanje, da tlo u zoru ne ostane zelenkasto-sivo. */
  liftTint: [1, 0.9, 0.78] as const,
  /** Jacina toplog fill svetla sa strane sunca u punoj zori (bez senke). */
  frontFill: 2.4,
} as const;

/**
 * Disk meseca i sunca: van magle i bez tone mappinga, pa na 110 jedinica ostaje svoje boje. Crta se prvi i ne upisuje
 * dubinu, pa ga svako brdo ispred zaklanja (`RD10`).
 */
export const discMaterial = () =>
  new THREE.MeshBasicMaterial({ color: LIGHT_STYLE.disc, depthWrite: false, fog: false, toneMapped: false });

/** Zvezde: van magle -- stoje 30 do 330 jedinica daleko, gde bi ih magla progutala. */
export const starMaterial = () => new THREE.PointsMaterial({ color: '#dbe0ce', size: 0.15, transparent: true, fog: false });

// Boje svetala na kamionu, iste kao materijali u `lib/hero-truck.ts`.
const TRUCK_LIGHT_COLORS: Partial<Record<string, string>> = { head: '#fff4c8', tail: '#d3432d', amber: '#f5c47b' };

/** Oreoli na kamionu (koordinate kamiona): farovi gledaju napred, zadnja svetla nazad, zuta svetla na sve strane. */
export function truckHalos(design: TruckDesign): Halo[] {
  const halos: Halo[] = [];
  for (const part of design.parts) {
    const color = TRUCK_LIGHT_COLORS[part.material];
    if (!color) continue;
    const size = part.shape === 'box' ? Math.max(...part.size) / 2 : part.radius;
    const facing: Vec3 = part.shape === 'disc' ? [0, 0, part.facing] : [0, 0, 0];
    halos.push({ at: part.at, radius: size * 5, color, facing });
  }
  return halos;
}

/** Oreoli pored puta (koordinate sveta): lampe na stubovima i svetla truck stop-ova. */
export function roadsideHalos(): Halo[] {
  const halos: Halo[] = STREET_LIGHTS.map((at) => ({ at, radius: 1.3, color: '#f5c47b', facing: [0, 0, 0] }));
  for (const part of roadsideParts(ROAD_DESIGN)) {
    if (part.material !== 'lamp') continue;
    const color = part.tint ?? '#fff0d2';
    const long = Math.max(...part.size);
    const axis = part.size.indexOf(long);
    // Duga svetla (trake ispod nadstresnice, prozori) dobijaju niz oreola, kratka jedan.
    const count = long > 6 ? Math.round(long / 5) : 1;
    const radius = Math.min(3.2, 0.5 + Math.min(long, 5) * 0.55);
    for (let i = 0; i < count; i++) {
      const at = [...part.at] as [number, number, number];
      at[axis] += count > 1 ? (i / (count - 1) - 0.5) * (long - 2) : 0;
      halos.push({ at, radius, color, facing: [0, 0, 0] });
    }
  }
  return halos;
}

/** Oreoli kao tacke sa sopstvenim shaderom: velicina u jedinicama sveta, magla gasi sjaj, farovi gledaju napred. */
export function buildHalos(halos: Halo[], strength: number) {
  const positions: number[] = [];
  const radii: number[] = [];
  const tints: number[] = [];
  const facings: number[] = [];
  const color = new THREE.Color();
  const rgb = { r: 0, g: 0, b: 0 };
  for (const halo of halos) {
    positions.push(...halo.at);
    radii.push(halo.radius);
    color.set(halo.color).getRGB(rgb, THREE.SRGBColorSpace);
    tints.push(rgb.r, rgb.g, rgb.b);
    facings.push(...halo.facing);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('radius', new THREE.Float32BufferAttribute(radii, 1));
  geometry.setAttribute('tint', new THREE.Float32BufferAttribute(tints, 3));
  geometry.setAttribute('facing', new THREE.Float32BufferAttribute(facings, 3));
  const material = new THREE.ShaderMaterial({
    uniforms: { scale: { value: 450 }, density: { value: NIGHT_FOG_DENSITY }, strength: { value: strength } },
    vertexShader: /* glsl */ `
      attribute float radius;
      attribute vec3 tint;
      attribute vec3 facing;
      uniform float scale;
      uniform float density;
      uniform float strength;
      varying vec3 vTint;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vec4 view = viewMatrix * world;
        float depth = -view.z;
        vec3 aim = mat3(modelMatrix) * facing;
        float facingEye = dot(aim, aim) > 0.0 ? smoothstep(-0.1, 0.7, dot(normalize(aim), normalize(cameraPosition - world.xyz))) : 1.0;
        vTint = tint * strength * facingEye * exp(-density * density * depth * depth);
        gl_Position = projectionMatrix * view;
        gl_PointSize = depth > 0.0 ? 2.0 * radius * projectionMatrix[1][1] * scale / depth : 0.0;
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vTint;
      void main() {
        float r = length(gl_PointCoord * 2.0 - 1.0);
        if (r >= 1.0) discard;
        gl_FragColor = vec4(vTint * pow(1.0 - r, 2.4), 1.0);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  const update = (density: number, scale: number) => {
    material.uniforms.density.value = density;
    material.uniforms.scale.value = scale;
  };
  return { points, update };
}

/**
 * Nebo u prelazu: kupola oko kamere, horizont u boji magle (pa se brda stapaju s njim bez ivice), gore tamnije, i
 * meki sjaj oko sunca i meseca. Crta se prva, bez dubine; disk, brda i sve ostalo idu preko nje.
 */
export function buildSky() {
  const uniforms = {
    horizon: { value: new THREE.Vector3() },
    zenith: { value: new THREE.Vector3() },
    glow: { value: new THREE.Vector3() },
    moonTint: { value: new THREE.Vector3() },
    sunDir: { value: new THREE.Vector3(0, 1, 0) },
    moonDir: { value: new THREE.Vector3(0, 1, 0) },
    sunGlow: { value: 0 },
    moonGlow: { value: 0 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vDir = world.xyz - cameraPosition;
        gl_Position = projectionMatrix * viewMatrix * world;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 horizon;
      uniform vec3 zenith;
      uniform vec3 glow;
      uniform vec3 moonTint;
      uniform vec3 sunDir;
      uniform vec3 moonDir;
      uniform float sunGlow;
      uniform float moonGlow;
      varying vec3 vDir;
      void main() {
        vec3 d = normalize(vDir);
        vec3 color = mix(horizon, zenith, pow(smoothstep(0.0, 0.5, d.y), 0.8));
        float s = max(dot(d, sunDir), 0.0);
        color += glow * sunGlow * (pow(s, 120.0) * 0.5 + pow(s, 24.0) * 0.2);
        float m = max(dot(d, moonDir), 0.0);
        color += moonTint * moonGlow * (pow(m, 120.0) * 0.5 + pow(m, 16.0) * 0.18);
        // Blagi sum protiv pruga u gradijentu na 8 bita.
        color += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
        gl_FragColor = vec4(color, 1.0);
      }`,
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 16), material);
  dome.renderOrder = -2;
  dome.frustumCulled = false;
  const rgb = { r: 0, g: 0, b: 0 };
  const toSrgb = (color: THREE.Color, target: THREE.Vector3) => {
    color.getRGB(rgb, THREE.SRGBColorSpace);
    target.set(rgb.r, rgb.g, rgb.b);
  };
  const update = (
    at: THREE.Vector3,
    colors: { horizon: THREE.Color; zenith: THREE.Color; glow: THREE.Color; moonTint: THREE.Color },
    sun: { dir: THREE.Vector3; glow: number },
    moon: { dir: THREE.Vector3; glow: number },
  ) => {
    dome.position.copy(at);
    toSrgb(colors.horizon, uniforms.horizon.value);
    toSrgb(colors.zenith, uniforms.zenith.value);
    toSrgb(colors.glow, uniforms.glow.value);
    toSrgb(colors.moonTint, uniforms.moonTint.value);
    uniforms.sunDir.value.copy(sun.dir);
    uniforms.sunGlow.value = sun.glow;
    uniforms.moonDir.value.copy(moon.dir);
    uniforms.moonGlow.value = moon.glow;
  };
  return { dome, update };
}
