import * as THREE from 'three';
import {
  buildHalos, buildSky, DAWN_GROUND, discMaterial, LIGHT_STYLE, NIGHT_FOG_DENSITY, roadsideHalos, starMaterial,
  STREET_LIGHTS, truckHalos,
} from './hero-light';
import { buildRoad, ROAD_DESIGN } from './hero-road';
import { asphaltTexture, buildTerrain, TERRAIN_STYLE } from './hero-terrain';
import { buildTruck, TRUCK_DESIGN } from './hero-truck';

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (a: number, b: number, value: number) => {
  const x = clamp((value-a)/(b-a)); return x*x*(3-2*x);
};

type Vec3 = readonly [number, number, number];

/**
 * Kadar poglavlja: tacka u koju kamera gleda (koordinate kamiona), vertikalni ugao objektiva u
 * stepenima i pomeraj slike udesno kao udeo sirine ekrana -- da kamion stoji desno od teksta.
 */
export type CameraShot = { target: Vec3; fov: number; shift: number };

/**
 * Plan kamere (`RD2`). `path` su polozaji kamere u koordinatama KAMIONA (x i y apsolutni, z se dodaje na
 * polozaj kamiona), ravnomerno po napretku kamere: tacka `k` je tacna u `k / (path.length - 1)`. Sa
 * sedam tacaka poglavlja su parne tacke, a neparne vode kameru izmedju njih. `shots` ima po jedan kadar
 * za svako poglavlje.
 *
 * ⚠️ Plan je podatak van `createHeroScene` da bi `__tests__/lib/hero-scene.test.js` merio razmak kamere
 * i kompoziciju na istom planu koji scena crta.
 */
export type CameraPlan = { path: readonly Vec3[]; shots: readonly CameraShot[] };

/**
 * Kamera „Kran" (Pavle, 2026-09-17, izbor od tri varijante): siroko spreda za uvod, straga uz prikolicu
 * za 01, nisko i usko spreda za 02 (poglavlje sa blagom pauzom), pa preko kamiona i pogled niz put za 03.
 *
 * ⚠️ Svaki kadar drzi kamion desno od kolone teksta, a putanja zaobilazi kamion, stubove i brda. Test
 * u `__tests__/lib/hero-scene.test.js` meri oba -- promena tacke ovde moze da vrati kameru u prikolicu
 * ili pored stuba, jer se trenutak prolaska pored stuba menja sa svakom tackom.
 */
export const CAMERA_PLAN: CameraPlan = {
  path: [[-14, 5, -40], [-15, 6.5, -8], [-18, 8, 38], [-8, 7.5, 0], [-6, 1.1, -34], [-3, 15, -6], [5, 22, 34]],
  shots: [
    { target: [0, 3.3, 0], fov: 40, shift: .3 },
    { target: [0, 3.3, 0], fov: 44, shift: .25 },
    { target: [0, 3.2, -6], fov: 26, shift: .3 },
    { target: [0, 2, -25], fov: 50, shift: .35 },
  ],
};

/** Polozaj kamiona po z: vozi 235 jedinica dok skrol ide od 4 % do 96 %. */
export const truckZ = (progress: number) => 7 - smoothstep(.04, .96, progress) * 235;

/** Poluprecnik diska meseca i sunca. */
export const SUN_RADIUS = 3.1;

/** Udaljenost diska meseca i sunca od kamere. */
export const SUN_DISTANCE = 110;

/**
 * Pravac meseca od kamere: nebesko telo, uvek na istoj udaljenosti i u istom pravcu, pa se ne pomera dok kamera
 * vozi -- samo dok se okrece. Pravac je izracunat iz kadrova 01 (napredak 0,30-0,42, ekrani 2000x1094 i 1440x900)
 * tako da mesec kroz celo poglavlje stoji oko mesta koje je Pavle oznacio (2026-09-17: „mesec treba biti ovde"):
 * gore, na sredini neba iznad puta.
 */
const MOON_DIRECTION: Vec3 = [0.1103, 0.1553, -0.9817];

/**
 * Pravac sunca od kamere na pocetku i na kraju izlaska. Izracunat iz kadra 02 (napredak 0,70, ekran 2000x1103) iz
 * dve Pavlove oznake (2026-09-17: „sunce da se prvo nalazi dole i da izlazi ka gore"): nisko, tik iznad brda, pa
 * gore desno od sredine neba. Kamera u 02 gleda unazad, pa je sunce iza kamiona.
 *
 * ⚠️ Donji pravac je ~1,6° iznad tacne oznake (y 0,0912 -> 0,12): na oznaci je donja ivica diska na pocetku 02 bila
 * iza brda (51,85-54,10% skrola sa 0,11), a to je bas „izlazenje iz planine" koje Pavle nije hteo.
 */
const SUN_LOW: Vec3 = [0.3702, 0.12, 0.9245];
const SUN_HIGH: Vec3 = [0.3301, 0.2451, 0.9116];

/** Sunce se pojavljuje dok se kamera okrece ka 02 (tada nije u kadru); noci pre toga pripada mesec. */
export const SUN_APPEARS = 0.47;

export const sunVisible = (progress: number) => progress >= SUN_APPEARS;

const skyPoint = ([x, y, z]: Vec3, from: { x: number; y: number; z: number }): [number, number, number] => {
  const length = Math.hypot(x, y, z);
  return [from.x + (x / length) * SUN_DISTANCE, from.y + (y / length) * SUN_DISTANCE, from.z + (z / length) * SUN_DISTANCE];
};

/**
 * Polozaj meseca u svetu za dati napredak skrola i polozaj kamere. U zoru se pravac podize.
 *
 * ⚠️ `RD10`: do sada je disk stajao na jednom mestu u svetu (x 28, z -135) i penjao se iz tla, pa je sa visim
 * brdima izlazio iz planine i crtao se ispred udaljenog grebena (Pavle: „da sunce/mesec ne izlaze iz planine").
 * Disk se crta prvi i ne upisuje dubinu, pa ga brda uvek zaklanjaju, a `__tests__/lib/hero-scene.test.js` meri da
 * nijedno brdo ne stoji na zraku ka njemu i da je u 01 na oznacenom mestu.
 */
export function moonPosition(progress: number, from: { x: number; y: number; z: number }): [number, number, number] {
  const [x, rise, z] = MOON_DIRECTION;
  return skyPoint([x, rise + smoothstep(.42, .98, progress) * .25, z], from);
}

/**
 * Polozaj sunca: kroz poglavlje 02 (skrol 0,5333-0,74) penje se od donjeg do gornjeg pravca, pa kako se kamera
 * digne ka 03 izlazi iz kadra na gore. Isti test meri zrak ka njemu i gde je na ekranu u 02.
 */
export function sunPosition(progress: number, from: { x: number; y: number; z: number }): [number, number, number] {
  const t = smoothstep(.5333, .74, progress);
  return skyPoint([
    SUN_LOW[0] + (SUN_HIGH[0] - SUN_LOW[0]) * t,
    SUN_LOW[1] + (SUN_HIGH[1] - SUN_LOW[1]) * t,
    SUN_LOW[2] + (SUN_HIGH[2] - SUN_LOW[2]) * t,
  ], from);
}

/**
 * Postavlja polozaj kamere i tacku u koju gleda, i vraca objektiv. Kamion prati `progress` (skrol), a
 * kamera prati `camera` (`cameraProgress` iz `lib/hero-beat.ts`).
 */
export function createCameraRig(plan: CameraPlan = CAMERA_PLAN) {
  const toVector = ([x, y, z]: Vec3) => new THREE.Vector3(x, y, z);
  const path = new THREE.CatmullRomCurve3(plan.path.map(toVector));
  const aims = new THREE.CatmullRomCurve3(plan.shots.map(shot => toVector(shot.target)));
  const point = new THREE.Vector3();
  const segments = plan.shots.length - 1;
  return (progress: number, camera: number, position: THREE.Vector3, target: THREE.Vector3) => {
    const z = truckZ(progress);
    const at = clamp(camera);
    path.getPoint(at, point);
    position.set(point.x, point.y, z + point.z);
    aims.getPoint(at, point);
    target.set(point.x, point.y, z + point.z);
    const index = Math.min(segments - 1, Math.floor(at * segments));
    const blend = smoothstep(0, 1, at * segments - index);
    const from = plan.shots[index], to = plan.shots[index + 1];
    return { fov: from.fov + (to.fov - from.fov) * blend, shift: from.shift + (to.shift - from.shift) * blend };
  };
}

export function createHeroScene(host: HTMLElement) {
  const canvas = document.createElement('canvas');
  host.appendChild(canvas);
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'low-power' }); }
  catch(error) { canvas.remove(); throw error; }
  const scene = new THREE.Scene();
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    const geometry = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    const textures = new Set<THREE.Texture>();
    scene.traverse(object => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
        geometry.add(object.geometry);
        for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
          materials.add(material);
          for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
        }
      }
      if(object instanceof THREE.InstancedMesh) object.dispose();
      if(object instanceof THREE.DirectionalLight || object instanceof THREE.SpotLight) object.shadow.dispose();
    });
    geometry.forEach(g=>g.dispose());
    materials.forEach(m=>m.dispose());
    textures.forEach(t=>t.dispose());
    renderer.dispose(); renderer.forceContextLoss(); canvas.remove(); scene.clear();
  };
  try {
    const narrow = false;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = .98;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Fog sits a shade lighter and cooler than the sky, so distance fades toward it and the
    // truck, road and midground separate from the background instead of sinking into one black.
    // The sky dome (RD3) covers the whole frame; the clear colour stays behind it.
    const nightFog = new THREE.Color('#0d1a16');
    scene.background = new THREE.Color('#07110d');
    const fog = new THREE.FogExp2(nightFog.clone(),NIGHT_FOG_DENSITY);
    scene.fog = fog;
    const camera = new THREE.PerspectiveCamera(46,1,.1,700);
    const world = new THREE.Group(); scene.add(world);
      // Glossy asphalt catches the warm rim, the lamps and the headlights like a damp night road, also after the
      // opening frame (RD3); the texture keeps the colour and only adds a surface (RD10).
      const asphalt = asphaltTexture();
      // RD13: the asphalt is lifted with the ground at dawn, so the road in 03 stops reading as night.
      const road = new THREE.Mesh(
        new THREE.PlaneGeometry(18, 700),
        new THREE.MeshStandardMaterial({ color: "#232d28", roughness: LIGHT_STYLE.asphaltRoughness, metalness: 0.02, map: asphalt, roughnessMap: asphalt }),
      );
      road.rotation.x = -Math.PI / 2;
      road.position.set(0, 0, -230);
      road.receiveShadow = true;
      world.add(road);
      // American road (RD11): yellow left edge, white right edge, long gaps between dashes, guardrail,
      // delineators and two truck stops; merged by material, no new lights or shadows.
      world.add(buildRoad(ROAD_DESIGN));

      const poleMat = new THREE.MeshStandardMaterial({ color: "#33382d", roughness: 0.82 });
      // Light sources skip tone mapping, so exposure doesn't dim them.
      const lampMat = new THREE.MeshBasicMaterial({ color: "#f5c47b", toneMapped: false });

      const poles = new THREE.InstancedMesh(new THREE.CylinderGeometry(.06,.08,5.7,7), poleMat, 30);
      const lamps = new THREE.InstancedMesh(new THREE.SphereGeometry(.16,8,6), lampMat, 30);
      const prop = new THREE.Object3D();
      STREET_LIGHTS.forEach(([x, y, z], i) => {
        prop.position.set(x, y / 2, z); prop.updateMatrix();
        poles.setMatrixAt(i, prop.matrix);
        prop.position.y = y; prop.updateMatrix(); lamps.setMatrixAt(i, prop.matrix);
      });
      world.add(poles, lamps);
      // Soft halos around the lamps and the truck stops (RD3): one draw call, no new lights or shadows.
      const roadsideGlow = buildHalos(roadsideHalos(), LIGHT_STYLE.haloStrength);
      world.add(roadsideGlow.points);
      // Rolling hills and a distant ridge instead of five-sided cones (RD10). The height is a pure function shared
      // with the camera test, so the camera, the poles and the sun are measured against the same ground.
      const terrain = buildTerrain(TERRAIN_STYLE);
      world.add(terrain);
      const terrainMaterial = terrain.material as THREE.MeshStandardMaterial;
      const roadMaterial = road.material as THREE.MeshStandardMaterial;
      const roadTint = roadMaterial.color.clone();

      const truck = new THREE.Group();
      truck.position.set(0, 0, 7);
      scene.add(truck);
      const built = buildTruck(TRUCK_DESIGN);
      truck.add(built.group);
      const axles = built.axles;
      // Headlights glow toward the camera in front, tail lights from behind; one draw call that follows the truck.
      const truckGlow = buildHalos(truckHalos(TRUCK_DESIGN), LIGHT_STYLE.haloStrength);
      truck.add(truckGlow.points);
      if (!narrow) {
        for (const light of built.headlights) {
          // Neutral-warm and aimed closer, so the pool lands in front of the cab where the opening camera looks.
          const beam = new THREE.SpotLight("#fff0d2", 85, 55, 0.3, 0.65, 1.2);
          beam.position.copy(light);
          beam.target.position.set(light.x, 0, -20);
          truck.add(beam, beam.target);
        }
      }

      // Night fill: a stronger hemisphere with a lifted ground color keeps dark surfaces off pure black.
      const ambient = new THREE.HemisphereLight("#8f9f95", "#1c241b", 1.28);
      scene.add(ambient);
      // Cool teal fill from the front-left, where the camera starts. Light and target follow the
      // truck in render(), so the shadow frustum stays around it; the default covers only ±5 units
      // around the origin, which the truck leaves within seconds.
      const moonOffset = new THREE.Vector3(-14, 15, -16);
      const moon = new THREE.DirectionalLight("#9cc7c1", 1.9);
      moon.position.copy(truck.position).add(moonOffset);
      moon.target.position.copy(truck.position);
      scene.add(moon.target);
      moon.castShadow = !narrow;
      moon.shadow.mapSize.set(1024, 1024);
      moon.shadow.camera.left = -16;
      moon.shadow.camera.right = 16;
      moon.shadow.camera.top = 16;
      moon.shadow.camera.bottom = -16;
      moon.shadow.camera.near = 1;
      moon.shadow.camera.far = 70;
      moon.shadow.camera.updateProjectionMatrix();
      moon.shadow.normalBias = 0.02;
      scene.add(moon);
      // Warm rim from behind-right: a light warm tone at night that shifts to amber and rises with dawn.
      const sunrise = new THREE.DirectionalLight("#ffcf9f", 1.2);
      sunrise.position.set(18, 11, 32);
      scene.add(sunrise);
      // RD13: dawn fill from the sun side, higher up and without a shadow, so the ground facing the camera in 03
      // stops reading as night. Off at night; no extra draw call.
      const dawnFill = new THREE.DirectionalLight("#ffd9b0", 0);
      dawnFill.position.set(26, 30, 34);
      scene.add(dawnFill);
      const rimNight = new THREE.Color('#ffcf9f');
      const rimDawn = new THREE.Color('#ffb365');
      // The disc sits far away in the sky: drawn first and without depth, so every hill in front of it covers it.
      // RD3: out of the fog the discs keep their own colour -- 110 units away the fog used to paint them 66 % grey.
      const moonDisc = new THREE.Mesh(new THREE.SphereGeometry(SUN_RADIUS, 24, 18), discMaterial());
      moonDisc.renderOrder = -1;
      const sunDisc = new THREE.Mesh(moonDisc.geometry, discMaterial());
      sunDisc.renderOrder = -1;
      scene.add(moonDisc, sunDisc);
      // Sky in a gradient, horizon in the fog colour, soft glow around the sun and the moon (RD3).
      const sky = buildSky();
      scene.add(sky.dome);

      const starsGeo = new THREE.BufferGeometry();
      const starCount = narrow ? 170 : 360;
      const starData = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i += 1) {
        starData[i * 3] = (Math.random() - 0.5) * 240;
        starData[i * 3 + 1] = 12 + Math.random() * 70;
        starData[i * 3 + 2] = 30 - Math.random() * 330;
      }
      starsGeo.setAttribute("position", new THREE.BufferAttribute(starData, 3));
      const starMat = starMaterial();
      const starField = new THREE.Points(starsGeo, starMat);
      scene.add(starField);

      const placeCamera = createCameraRig();

    const fogDawn = new THREE.Color(LIGHT_STYLE.dawnFog);
    const skyColors = {
      horizon: fog.color,
      zenith: new THREE.Color(),
      glow: new THREE.Color(LIGHT_STYLE.glow.color),
      moonTint: new THREE.Color(LIGHT_STYLE.glow.moonColor),
    };
    const nightZenith = new THREE.Color(LIGHT_STYLE.zenith.night);
    // RD13: the ground albedo is very dark on purpose (RD10); at dawn the sky lifts it instead of a new light.
    const ambientNight = new THREE.Color('#8f9f95');
    const ambientDawn = new THREE.Color(DAWN_GROUND.skyFill);
    const terrainLift = new THREE.Color(1, 1, 1);
    // Podizanje nosi i topao ton, da tlo u zoru prestane da bude zelenkasto-sivo.
    const liftTint = new THREE.Color(...DAWN_GROUND.liftTint);
    const dawnZenith = new THREE.Color(LIGHT_STYLE.zenith.dawn);
    const sunDir = new THREE.Vector3();
    const moonDir = new THREE.Vector3();
    const lookAt = new THREE.Vector3();
    const buffer = new THREE.Vector2();
    const resize = () => {
      const width = host.clientWidth, height = host.clientHeight;
      renderer.setSize(width,height,false);
      camera.aspect = width/Math.max(1,height);
      camera.updateProjectionMatrix();
      renderer.getDrawingBufferSize(buffer);
      roadsideGlow.update(fog.density, buffer.y / 2);
      truckGlow.update(fog.density, buffer.y / 2);
    };
    const render = (p: number, cameraAt = p) => {
      if(disposed) return;
      const drive=smoothstep(.04,.96,p);
      truck.position.z=truckZ(p);
      moon.position.set(moonOffset.x,moonOffset.y,truck.position.z+moonOffset.z);
      moon.target.position.set(0,0,truck.position.z);
      axles.forEach(axle=>{axle.rotation.x=drive*-48});
      const lens=placeCamera(p,cameraAt,camera.position,lookAt);
      camera.fov=lens.fov;
      // Shift is a share of the screen width, so the truck lands right of the text at any aspect ratio.
      camera.filmOffset=-lens.shift*camera.getFilmWidth()*camera.aspect*2*Math.tan(THREE.MathUtils.degToRad(lens.fov)/2);
      camera.updateProjectionMatrix();
      camera.lookAt(lookAt);
      const daylight=smoothstep(.42,.98,p);
      fog.color.copy(nightFog).lerp(fogDawn,daylight);
      fog.density=NIGHT_FOG_DENSITY+(LIGHT_STYLE.dawnDensity-NIGHT_FOG_DENSITY)*daylight;
      // Dawn end values match the previous curve; only the starting frame changed.
      ambient.intensity=1.28+daylight*(.74+DAWN_GROUND.skyBoost);
      ambient.color.copy(ambientNight).lerp(ambientDawn,daylight);
      terrainLift.setScalar(1).lerp(liftTint,daylight).multiplyScalar(1+(DAWN_GROUND.groundLift-1)*daylight);
      terrainMaterial.color.copy(terrainLift);
      roadMaterial.color.copy(roadTint).multiplyScalar(1+(DAWN_GROUND.groundLift-1)*daylight*.7);
      dawnFill.intensity=DAWN_GROUND.frontFill*daylight;
      moon.intensity=1.9*(1-daylight*.8);
      sunrise.intensity=1.2+daylight*2.2;
      sunrise.color.copy(rimNight).lerp(rimDawn,daylight);
      renderer.toneMappingExposure=.98+daylight*.14;
      moonDisc.position.set(...moonPosition(p,camera.position));
      sunDisc.position.set(...sunPosition(p,camera.position));
      sunDisc.visible=sunVisible(p);
      starMat.opacity=1-daylight*.95;
      skyColors.zenith.copy(nightZenith).lerp(dawnZenith,daylight);
      sunDir.copy(sunDisc.position).sub(camera.position).normalize();
      moonDir.copy(moonDisc.position).sub(camera.position).normalize();
      sky.update(camera.position, skyColors,
        { dir: sunDir, glow: sunDisc.visible ? LIGHT_STYLE.glow.sun*smoothstep(.47,.6,p) : 0 },
        { dir: moonDir, glow: LIGHT_STYLE.glow.moon*(1-daylight) });
      roadsideGlow.update(fog.density, buffer.y / 2);
      truckGlow.update(fog.density, buffer.y / 2);
      renderer.render(scene,camera);
      host.dataset.triangles=String(renderer.info.render.triangles);
    };
    resize();
    return { render, resize, dispose, drawCalls: () => renderer.info.render.calls };
  } catch(error) { dispose(); throw error; }
}
