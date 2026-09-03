"use client";

import { useEffect, useRef } from "react";

type ThreeWindow = Window & { THREE?: any };
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (a: number, b: number, value: number) => {
  const x = clamp((value - a) / (b - a));
  return x * x * (3 - 2 * x);
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero || initializedRef.current) return;
    initializedRef.current = true;
    let cleanup = () => {};

    const start = () => {
      const THREE = (window as ThreeWindow).THREE;
      if (!THREE || !canvasRef.current || !heroRef.current) return;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const narrow = window.matchMedia("(max-width: 720px)").matches;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: !narrow, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, narrow ? 1.25 : 1.7));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.76;
      renderer.shadowMap.enabled = !narrow;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const scene = new THREE.Scene();
      const night = new THREE.Color("#07110d");
      scene.background = night.clone();
      scene.fog = new THREE.FogExp2(night.clone(), narrow ? 0.014 : 0.0105);
      const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 700);
      const world = new THREE.Group();
      scene.add(world);

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
      for (let z = 85; z > -570; z -= 11) {
        for (const x of [-3, 3]) {
          const marker = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 4.3), lineMat);
          marker.rotation.x = -Math.PI / 2;
          marker.position.set(x, 0.012, z);
          world.add(marker);
        }
      }
      const edgeMat = new THREE.MeshBasicMaterial({ color: "#8d8f79" });
      for (const x of [-8.2, 8.2]) {
        const edge = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 700), edgeMat);
        edge.rotation.x = -Math.PI / 2;
        edge.position.set(x, 0.014, -230);
        world.add(edge);
      }

      const poleMat = new THREE.MeshStandardMaterial({ color: "#33382d", roughness: 0.82 });
      const lampMat = new THREE.MeshBasicMaterial({ color: "#f5c47b" });
      for (let i = 0; i < (narrow ? 18 : 30); i += 1) {
        const side = i % 2 ? 1 : -1;
        const z = 42 - i * 20;
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 5.7, 7), poleMat);
        pole.position.set(side * 10.6, 2.85, z);
        world.add(pole);
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), lampMat);
        lamp.position.set(side * 10.6, 5.7, z);
        world.add(lamp);
      }
      const ridgeMat = new THREE.MeshStandardMaterial({ color: "#101b14", roughness: 1, flatShading: true });
      for (let i = 0; i < (narrow ? 34 : 58); i += 1) {
        const side = i % 2 ? 1 : -1;
        const height = 2.5 + ((i * 37) % 9) * 0.44;
        const mountain = new THREE.Mesh(new THREE.ConeGeometry(2.4 + (i % 4), height, 5), ridgeMat);
        mountain.position.set(side * (17 + (i % 5) * 5), height / 2 - 0.1, 42 - i * 12);
        mountain.rotation.y = i * 0.91;
        world.add(mountain);
      }

      const truck = new THREE.Group();
      truck.position.set(0, 0, 7);
      scene.add(truck);
      const olive = new THREE.MeshPhysicalMaterial({ color: "#263420", metalness: 0.62, roughness: 0.24, clearcoat: 0.8, clearcoatRoughness: 0.16 });
      const dark = new THREE.MeshStandardMaterial({ color: "#101511", metalness: 0.62, roughness: 0.27 });
      const chrome = new THREE.MeshStandardMaterial({ color: "#b9b9ad", metalness: 0.95, roughness: 0.15 });
      const glass = new THREE.MeshPhysicalMaterial({ color: "#172921", roughness: 0.08, transmission: 0.15 });
      const tire = new THREE.MeshStandardMaterial({ color: "#080a09", roughness: 0.9 });
      const trailer = new THREE.MeshStandardMaterial({ color: "#d8d3c5", metalness: 0.35, roughness: 0.34 });
      const addBox = (w: number, h: number, d: number, material: any, x: number, y: number, z: number) => {
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

      const wheels: any[] = [];
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
      const beats = Array.from(document.querySelectorAll<HTMLElement>("[data-beat]"));
      const progressBar = document.querySelector<HTMLElement>("[data-progress-bar]");
      const dawnWash = document.querySelector<HTMLElement>("[data-dawn-wash]");
      const reducedNote = document.querySelector<HTMLElement>("[data-reduced-note]");
      if (reducedNote && reducedMotion) reducedNote.style.opacity = "1";

      let targetProgress = reducedMotion ? 0.64 : 0;
      let currentProgress = targetProgress;
      let frame = 0;
      const updateScroll = () => {
        if (reducedMotion) return;
        const scrollRange = hero.offsetHeight - window.innerHeight;
        targetProgress = clamp(-hero.getBoundingClientRect().top / Math.max(1, scrollRange));
      };
      const resize = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(height, 1);
        camera.fov = narrow ? 54 : 46;
        camera.updateProjectionMatrix();
      };
      const dawnColor = new THREE.Color("#8e6044");
      const fogDawn = new THREE.Color("#6c513b");
      const lookAt = new THREE.Vector3();
      const relative = new THREE.Vector3();
      const render = (time: number) => {
        currentProgress += (targetProgress - currentProgress) * (reducedMotion ? 1 : 0.055);
        const p = currentProgress;
        const drive = smoothstep(0.09, 0.92, p);
        truck.position.z = 7 - drive * 235;
        truck.position.y = 0.02 + Math.sin(time * 0.0035) * 0.018 * drive;
        wheels.forEach((wheel) => { wheel.rotation.x = drive * -48; });
        cameraPath.getPointAt(clamp(p * 0.98), relative);
        camera.position.set(relative.x, relative.y, truck.position.z + relative.z);
        lookAt.set(0, narrow ? 2.9 : 3.1, truck.position.z + (p > 0.82 ? -12 : -3));
        camera.lookAt(lookAt);
        const daylight = smoothstep(0.54, 0.94, p);
        scene.background.copy(night).lerp(dawnColor, daylight * 0.78);
        scene.fog.color.copy(night).lerp(fogDawn, daylight * 0.78);
        ambient.intensity = 0.92 + daylight * 1.1;
        moon.intensity = 2.1 * (1 - daylight * 0.82);
        sunrise.intensity = daylight * 3.4;
        renderer.toneMappingExposure = 0.76 + daylight * 0.34;
        sun.position.y = -5 + daylight * 18;
        starMat.opacity = 1 - daylight * 0.95;
        const anchors = [0.04, 0.27, 0.49, 0.71, 0.9];
        beats.forEach((beat, index) => {
          const distance = Math.abs(p - anchors[index]);
          const opacity = 1 - smoothstep(index === 0 ? 0.12 : 0.095, 0.18, distance);
          beat.style.opacity = `${opacity}`;
          beat.style.transform = `translate3d(0, ${(p - anchors[index]) * -95}px, 0)`;
          beat.style.pointerEvents = opacity > 0.65 ? "auto" : "none";
        });
        if (progressBar) progressBar.style.transform = `scaleY(${Math.max(0.02, p)})`;
        if (dawnWash) dawnWash.style.opacity = `${smoothstep(0.88, 1, p)}`;
        renderer.render(scene, camera);
        frame = requestAnimationFrame(render);
      };
      window.addEventListener("scroll", updateScroll, { passive: true });
      window.addEventListener("resize", resize);
      resize();
      updateScroll();
      frame = requestAnimationFrame(render);
      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", updateScroll);
        window.removeEventListener("resize", resize);
        renderer.dispose();
        logoTexture.dispose();
      };
    };

    if ((window as ThreeWindow).THREE) start();
    else {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js";
      script.async = true;
      script.onload = start;
      script.onerror = () => document.body.classList.add("webgl-fallback");
      document.head.appendChild(script);
    }
    return () => cleanup();
  }, []);

  return (
    <main>
      <section className="cinematic-hero" ref={heroRef} aria-label="GROWTH cinematic story">
        <div className="stage">
          <canvas ref={canvasRef} className="scene-canvas" aria-hidden="true" />
          <div className="noise" aria-hidden="true" /><div className="vignette" aria-hidden="true" />
          <div className="fallback-art" aria-hidden="true"><span className="fallback-road" /><span className="fallback-sun" /></div>
          <header className="site-header">
            <a className="brand" href="#top" aria-label="GROWTH home"><span className="brand-mark">G↗</span><span>GROWTH</span></a>
            <div className="header-actions"><span className="availability"><i /> CDL-A JOBS OPEN</span><a href="#apply" className="header-cta">APPLY NOW</a></div>
          </header>
          <div className="story" id="top">
            <article className="beat beat-hero" data-beat>
              <p className="eyebrow">YOUR ROAD FORWARD</p><h1>REAL TRUCKING JOBS.<br /><em>STRAIGHT ANSWERS.</em></h1>
              <p className="lede">We match CDL-A drivers with verified carriers — at zero cost to you.</p>
              <a className="primary-cta" href="#apply"><span>FIND MY NEXT JOB</span><b>↗</b></a>
            </article>
            <article className="beat beat-left" data-beat><p className="chapter">01 / THE NETWORK</p><strong className="metric">20<span>+</span></strong><h2>Verified carriers.<br />One honest conversation.</h2></article>
            <article className="beat beat-right" data-beat><p className="chapter">02 / YOUR MATCH</p><strong className="metric">$0</strong><h2>Driver cost.<br />No hidden fees. Ever.</h2></article>
            <article className="beat beat-left" data-beat><p className="chapter">03 / MOMENTUM</p><strong className="metric">3–5</strong><h2>Days to get<br />back on the road.</h2></article>
            <article className="beat beat-final" data-beat><p className="eyebrow">THE NEXT MILE IS YOURS</p><h2>A better route<br /><em>starts here.</em></h2><a className="primary-cta light" href="#apply"><span>APPLY IN 2 MINUTES</span><b>↗</b></a></article>
          </div>
          <div className="scroll-rail" aria-hidden="true"><span>SCROLL TO DRIVE</span><i><b data-progress-bar /></i></div>
          <p className="reduced-note" data-reduced-note>Motion reduced by your device preference.</p><div className="dawn-wash" data-dawn-wash aria-hidden="true" />
        </div>
      </section>
      <section className="proof-section" id="apply">
        <div className="proof-kicker"><span>THE GROWTH DIFFERENCE</span><span>EST. BY EXPERIENCE</span></div>
        <div className="proof-grid">
          <div><p className="section-index">[ 01 — HOW IT WORKS ]</p><h2>THE RIGHT JOB<br />SHOULDN&apos;T BE<br /><em>HARD TO FIND.</em></h2></div>
          <div className="proof-copy"><p>Tell us what matters: home time, pay, route and equipment. We do the searching, verify the carrier and give you straight answers.</p>
            <div className="steps"><article><b>01</b><span>Talk for 15–20 minutes</span></article><article><b>02</b><span>Review matched carriers</span></article><article><b>03</b><span>Choose your next route</span></article></div>
            <a className="ink-cta" href="tel:+10000000000">START WITH A CALL <span>↗</span></a>
          </div>
        </div>
      </section>
    </main>
  );
}
