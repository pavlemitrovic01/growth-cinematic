import * as THREE from 'three';

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
    const night = new THREE.Color('#07110d');
    // Fog sits a shade lighter and cooler than the sky, so distance fades toward it and the
    // truck, road and midground separate from the background instead of sinking into one black.
    const nightFog = new THREE.Color('#0d1a16');
    const background = night.clone();
    scene.background = background;
    const fog = new THREE.FogExp2(nightFog.clone(),.0095);
    scene.fog = fog;
    const camera = new THREE.PerspectiveCamera(46,1,.1,700);
    const world = new THREE.Group(); scene.add(world);
      // Slightly glossy asphalt catches the warm rim and the headlights like a damp night road.
      const road = new THREE.Mesh(
        new THREE.PlaneGeometry(18, 700),
        new THREE.MeshStandardMaterial({ color: "#232d28", roughness: 0.68, metalness: 0.02 }),
      );
      road.rotation.x = -Math.PI / 2;
      road.position.set(0, 0, -230);
      road.receiveShadow = true;
      world.add(road);
      const shoulderMat = new THREE.MeshStandardMaterial({ color: "#1b2417", roughness: 1 });
      for (const x of [-28, 28]) {
        const ground = new THREE.Mesh(new THREE.PlaneGeometry(38, 700), shoulderMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.set(x, -0.025, -230);
        world.add(ground);
      }
      const lineMat = new THREE.MeshBasicMaterial({ color: "#e2d8b6" });

      const laneCount = 120;
      const markerGeometry = new THREE.PlaneGeometry(0.13, 4.3);
      const markers = new THREE.InstancedMesh(markerGeometry, lineMat, laneCount);
      const marker = new THREE.Object3D();
      marker.rotation.x = -Math.PI / 2;
      for (let i = 0; i < laneCount; i++) {
        marker.position.set(i % 2 ? 3 : -3, 0.012, 85 - Math.floor(i / 2) * 11);
        marker.updateMatrix();
        markers.setMatrixAt(i, marker.matrix);
      }
      world.add(markers);
      const edgeMat = new THREE.MeshBasicMaterial({ color: "#a9a992" });
      for (const x of [-8.2, 8.2]) {
        const edge = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 700), edgeMat);
        edge.rotation.x = -Math.PI / 2;
        edge.position.set(x, 0.014, -230);
        world.add(edge);
      }

      const poleMat = new THREE.MeshStandardMaterial({ color: "#33382d", roughness: 0.82 });
      // Light sources skip tone mapping, so exposure doesn't dim them.
      const lampMat = new THREE.MeshBasicMaterial({ color: "#f5c47b", toneMapped: false });

      const poles = new THREE.InstancedMesh(new THREE.CylinderGeometry(.06,.08,5.7,7), poleMat, 30);
      const lamps = new THREE.InstancedMesh(new THREE.SphereGeometry(.16,8,6), lampMat, 30);
      const prop = new THREE.Object3D();
      for (let i=0;i<30;i++) {
        const side = i % 2 ? 1 : -1;
        prop.position.set(side * 10.6, 2.85, 42 - i * 20); prop.updateMatrix();
        poles.setMatrixAt(i, prop.matrix);
        prop.position.y = 5.7; prop.updateMatrix(); lamps.setMatrixAt(i, prop.matrix);
      }
      world.add(poles, lamps);
      const ridgeMat = new THREE.MeshStandardMaterial({ color: "#101b14", roughness: 1, flatShading: true });

      const hills = new THREE.InstancedMesh(new THREE.ConeGeometry(1,1,5), ridgeMat, 58);
      for (let i=0;i<58;i++) {
        const height=2.5+((i*37)%9)*.44;
        prop.position.set((i%2?1:-1)*(17+(i%5)*5),height/2-.1,42-i*12);
        prop.rotation.y=i*.91; prop.scale.set(2.4+i%4,height,2.4+i%4);
        prop.updateMatrix(); hills.setMatrixAt(i,prop.matrix);
      }
      world.add(hills);
      const truck = new THREE.Group();
      truck.position.set(0, 0, 7);
      scene.add(truck);
      // No environment map: metal has nothing to reflect and renders black. Low metalness lets
      // the existing lights shape the cab, dark parts and trailer.
      // Chrome and glass drop metalness for the same reason, so the grille, bumper, hubs and windshield
      // read instead of vanishing. The cab olive is lifted to the mildest of the reviewed tones
      // (2026-09-15); lighter ones read as mouse grey.
      const olive = new THREE.MeshStandardMaterial({ color: "#34472d", metalness: 0.2, roughness: 0.24 });
      const dark = new THREE.MeshStandardMaterial({ color: "#1c231d", metalness: 0.22, roughness: 0.27 });
      const chrome = new THREE.MeshStandardMaterial({ color: "#b9b9ad", metalness: 0.55, roughness: 0.3 });
      const glass = new THREE.MeshStandardMaterial({ color: "#223a31", roughness: 0.08, metalness: 0.1 });
      const tire = new THREE.MeshStandardMaterial({ color: "#121514", roughness: 0.9 });
      const trailer = new THREE.MeshStandardMaterial({ color: "#d8d3c5", metalness: 0.1, roughness: 0.34 });
      const addBox = (w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
        mesh.position.set(x, y, z);
        mesh.castShadow = !narrow;
        mesh.receiveShadow = !narrow;
        truck.add(mesh);
        return mesh;
      };
      addBox(4.3, 3.7, 3.7, olive, 0, 2.65, -6.9);
      addBox(4.15, 4.4, 3.3, olive, 0, 2.95, -3.6);
      addBox(3.8, 1.35, 2.6, olive, 0, 1.55, -9.55);
      addBox(3.2, 0.55, 0.16, chrome, 0, 1.1, -10.88);
      addBox(3.2, 1.28, 0.08, dark, 0, 2.8, -8.78);
      addBox(3.55, 1.18, 0.09, glass, 0, 3.47, -8.78);
      addBox(4.25, 0.16, 15.2, chrome, 0, 1.22, 5.6);
      addBox(4.55, 4.9, 15, trailer, 0, 4.0, 5.75);
      addBox(4.64, 0.28, 15.12, dark, 0, 1.55, 5.75);
      addBox(4.7, 0.18, 15.3, chrome, 0, 6.45, 5.75);

      const logoCanvas = document.createElement("canvas");
      logoCanvas.width = 1024;
      logoCanvas.height = 256;
      const ctx = logoCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#263420";
        ctx.font = "800 132px Arial";
        ctx.textAlign = "center";
        ctx.fillText("G R O W T H", 512, 172);
      }
      const logoTexture = new THREE.CanvasTexture(logoCanvas);
      logoTexture.colorSpace = THREE.SRGBColorSpace;
      const logoPanel = new THREE.Mesh(new THREE.PlaneGeometry(8.9, 2.25), new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true }));
      logoPanel.rotation.y = -Math.PI / 2;
      logoPanel.position.set(-2.29, 4.0, 5.3);
      truck.add(logoPanel);
      const secondLogo = logoPanel.clone();
      secondLogo.rotation.y = Math.PI / 2;
      secondLogo.position.x = 2.29;
      truck.add(secondLogo);
      // Simple grille and mirror details preserve the prototype's stylized truck.
      for(let i=0;i<8;i++) addBox(.09, .65, .1, chrome, -1.05+i*.3, 1.85, -10.88);
      for(const side of [-1,1]) {
        addBox(.6,.07,.07,chrome,side*2.3,3.45,-7.3);
        addBox(.16,.55,.25,dark,side*2.65,3.5,-7.3);
      }

      const wheels: THREE.Mesh[] = [];
      const wheelGeo = new THREE.CylinderGeometry(0.82, 0.82, 0.5, 20);
      for (const z of [-7.3, -2.6, 1.0, 7.6, 10.8]) {
        for (const x of [-2.18, 2.18]) {
          const wheel = new THREE.Mesh(wheelGeo, tire);
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(x, 1.02, z);
          truck.add(wheel);
          wheels.push(wheel);
          const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.53, 16), chrome);
          hub.rotation.z = Math.PI / 2;
          hub.position.set(x, 1.02, z);
          truck.add(hub);
        }
      }
      const headMat = new THREE.MeshBasicMaterial({ color: "#fff4c8", toneMapped: false });
      for (const x of [-1.45, 1.45]) {
        const light = new THREE.Mesh(new THREE.CircleGeometry(0.26, 14), headMat);
        light.position.set(x, 1.65, -10.9);
        light.rotation.y = Math.PI;
        truck.add(light);
        if (!narrow) {
          // Neutral-warm and aimed closer, so the pool lands in front of the cab where the opening camera looks.
          const beam = new THREE.SpotLight("#fff0d2", 85, 55, 0.3, 0.65, 1.2);
          beam.position.set(x, 1.7, -10.75);
          beam.target.position.set(x, 0, -20);
          truck.add(beam, beam.target);
        }
      }
      const tailMat = new THREE.MeshBasicMaterial({ color: "#d3432d", toneMapped: false });
      for (const x of [-1.7, 1.7]) {
        const tailLight = new THREE.Mesh(new THREE.CircleGeometry(0.2, 12), tailMat);
        tailLight.position.set(x, 1.7, 13.3);
        truck.add(tailLight);
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
      const rimNight = new THREE.Color('#ffcf9f');
      const rimDawn = new THREE.Color('#ffb365');
      const sun = new THREE.Mesh(new THREE.SphereGeometry(3.1, 24, 18), new THREE.MeshBasicMaterial({ color: "#ffd392" }));
      sun.position.set(28, -5, -135);
      scene.add(sun);

      const starsGeo = new THREE.BufferGeometry();
      const starCount = narrow ? 170 : 360;
      const starData = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i += 1) {
        starData[i * 3] = (Math.random() - 0.5) * 240;
        starData[i * 3 + 1] = 12 + Math.random() * 70;
        starData[i * 3 + 2] = 30 - Math.random() * 330;
      }
      starsGeo.setAttribute("position", new THREE.BufferAttribute(starData, 3));
      const starMat = new THREE.PointsMaterial({ color: "#dbe0ce", size: 0.15, transparent: true });
      const starField = new THREE.Points(starsGeo, starMat);
      scene.add(starField);

      const placeCamera = createCameraRig();

    const dawnColor = new THREE.Color('#8e6044');
    const fogDawn = new THREE.Color('#6c513b');
    const lookAt = new THREE.Vector3();
    const resize = () => {
      const width = host.clientWidth, height = host.clientHeight;
      renderer.setSize(width,height,false);
      camera.aspect = width/Math.max(1,height);
      camera.updateProjectionMatrix();
    };
    const render = (p: number, cameraAt = p) => {
      if(disposed) return;
      const drive=smoothstep(.04,.96,p);
      truck.position.z=truckZ(p);
      moon.position.set(moonOffset.x,moonOffset.y,truck.position.z+moonOffset.z);
      moon.target.position.set(0,0,truck.position.z);
      wheels.forEach(wheel=>{wheel.rotation.x=drive*-48});
      const lens=placeCamera(p,cameraAt,camera.position,lookAt);
      camera.fov=lens.fov;
      // Shift is a share of the screen width, so the truck lands right of the text at any aspect ratio.
      camera.filmOffset=-lens.shift*camera.getFilmWidth()*camera.aspect*2*Math.tan(THREE.MathUtils.degToRad(lens.fov)/2);
      camera.updateProjectionMatrix();
      camera.lookAt(lookAt);
      const daylight=smoothstep(.42,.98,p);
      background.copy(night).lerp(dawnColor,daylight*.78);
      fog.color.copy(nightFog).lerp(fogDawn,daylight*.78);
      // Dawn end values match the previous curve; only the starting frame changed.
      ambient.intensity=1.28+daylight*.74;
      moon.intensity=1.9*(1-daylight*.8);
      sunrise.intensity=1.2+daylight*2.2;
      sunrise.color.copy(rimNight).lerp(rimDawn,daylight);
      renderer.toneMappingExposure=.98+daylight*.14;
      sun.position.y=-5+daylight*18;
      starMat.opacity=1-daylight*.95;
      renderer.render(scene,camera);
    };
    resize();
    return { render, resize, dispose, drawCalls: () => renderer.info.render.calls };
  } catch(error) { dispose(); throw error; }
}
