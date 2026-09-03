import * as THREE from 'three';

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (a: number, b: number, value: number) => {
  const x = clamp((value-a)/(b-a)); return x*x*(3-2*x);
};
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
    renderer.toneMappingExposure = .88;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const night = new THREE.Color('#07110d');
    const background = night.clone();
    scene.background = background;
    const fog = new THREE.FogExp2(night.clone(),.0105);
    scene.fog = fog;
    const camera = new THREE.PerspectiveCamera(46,1,.1,700);
    camera.filmOffset = -5;
    const world = new THREE.Group(); scene.add(world);
      const road = new THREE.Mesh(
        new THREE.PlaneGeometry(18, 700),
        new THREE.MeshStandardMaterial({ color: "#101713", roughness: 0.92, metalness: 0.02 }),
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
      const lineMat = new THREE.MeshBasicMaterial({ color: "#d7cda9" });

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
      const edgeMat = new THREE.MeshBasicMaterial({ color: "#8d8f79" });
      for (const x of [-8.2, 8.2]) {
        const edge = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 700), edgeMat);
        edge.rotation.x = -Math.PI / 2;
        edge.position.set(x, 0.014, -230);
        world.add(edge);
      }

      const poleMat = new THREE.MeshStandardMaterial({ color: "#33382d", roughness: 0.82 });
      const lampMat = new THREE.MeshBasicMaterial({ color: "#f5c47b" });

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
      const olive = new THREE.MeshStandardMaterial({ color: "#263420", metalness: 0.62, roughness: 0.24 });
      const dark = new THREE.MeshStandardMaterial({ color: "#101511", metalness: 0.62, roughness: 0.27 });
      const chrome = new THREE.MeshStandardMaterial({ color: "#b9b9ad", metalness: 0.95, roughness: 0.15 });
      const glass = new THREE.MeshStandardMaterial({ color: "#172921", roughness: 0.08, metalness: 0.35 });
      const tire = new THREE.MeshStandardMaterial({ color: "#080a09", roughness: 0.9 });
      const trailer = new THREE.MeshStandardMaterial({ color: "#d8d3c5", metalness: 0.35, roughness: 0.34 });
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
      const headMat = new THREE.MeshBasicMaterial({ color: "#fff4c8" });
      for (const x of [-1.45, 1.45]) {
        const light = new THREE.Mesh(new THREE.CircleGeometry(0.26, 14), headMat);
        light.position.set(x, 1.65, -10.9);
        light.rotation.y = Math.PI;
        truck.add(light);
        if (!narrow) {
          const beam = new THREE.SpotLight("#ffe6a6", 45, 55, 0.3, 0.65, 1.2);
          beam.position.set(x, 1.7, -10.75);
          beam.target.position.set(x, 0, -45);
          truck.add(beam, beam.target);
        }
      }
      const tailMat = new THREE.MeshBasicMaterial({ color: "#d3432d" });
      for (const x of [-1.7, 1.7]) {
        const tailLight = new THREE.Mesh(new THREE.CircleGeometry(0.2, 12), tailMat);
        tailLight.position.set(x, 1.7, 13.3);
        truck.add(tailLight);
      }

      const ambient = new THREE.HemisphereLight("#8f9f95", "#10150f", 0.92);
      scene.add(ambient);
      const moon = new THREE.DirectionalLight("#a9c6d7", 2.1);
      moon.position.set(-16, 24, 18);
      moon.castShadow = !narrow;
      moon.shadow.mapSize.set(1024, 1024);
      scene.add(moon);
      const sunrise = new THREE.DirectionalLight("#ffb365", 0);
      sunrise.position.set(22, 9, -90);
      scene.add(sunrise);
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

      const cameraPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(narrow ? -9 : -13, 3.2, -19),
        new THREE.Vector3(narrow ? -8 : -11, 2.9, -4),
        new THREE.Vector3(narrow ? -8 : -12, 3.6, 6),
        new THREE.Vector3(narrow ? 7.5 : 11, 4.2, 13),
        new THREE.Vector3(narrow ? 3.5 : 5, 7.5, 8),
        new THREE.Vector3(0, narrow ? 11 : 14, 0),
      ]);

    const dawnColor = new THREE.Color('#8e6044');
    const fogDawn = new THREE.Color('#6c513b');
    const lookAt = new THREE.Vector3();
    const relative = new THREE.Vector3();
    const resize = () => {
      const width = host.clientWidth, height = host.clientHeight;
      renderer.setSize(width,height,false);
      camera.aspect = width/Math.max(1,height);
      camera.updateProjectionMatrix();
    };
    const render = (p: number) => {
      if(disposed) return;
      const drive=smoothstep(.04,.96,p);
      truck.position.z=7-drive*235;
      wheels.forEach(wheel=>{wheel.rotation.x=drive*-48});
      cameraPath.getPointAt(clamp(p*.98),relative);
      camera.position.set(relative.x,relative.y,truck.position.z+relative.z);
      // Blend into the overhead view; switching the target at .82 caused a snap.
      lookAt.set(0,3.1,truck.position.z-3-9*smoothstep(.74,.9,p));
      camera.lookAt(lookAt);
      const daylight=smoothstep(.42,.98,p);
      background.copy(night).lerp(dawnColor,daylight*.78);
      fog.color.copy(night).lerp(fogDawn,daylight*.78);
      ambient.intensity=.92+daylight*1.1;
      moon.intensity=2.1*(1-daylight*.82);
      sunrise.intensity=daylight*3.4;
      renderer.toneMappingExposure=.88+daylight*.24;
      sun.position.y=-5+daylight*18;
      starMat.opacity=1-daylight*.95;
      renderer.render(scene,camera);
    };
    resize();
    return { render, resize, dispose, drawCalls: () => renderer.info.render.calls };
  } catch(error) { dispose(); throw error; }
}
