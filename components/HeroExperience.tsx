'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export default function HeroExperience({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = root.current;
    const host = mount.current;
    if (!hero || !host) return;
    const desktop = matchMedia('(min-width: 1024px) and (min-height: 650px)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const beats = Array.from(hero.querySelectorAll<HTMLElement>('[data-beat]'));
    let disposed = false;
    let generation = 0;
    let loading = false;
    let failed = false;
    let visible = hero.getBoundingClientRect().bottom > 0 && hero.getBoundingClientRect().top < innerHeight;
    let cleanup: (() => void) | undefined;
    let refresh: (() => void) | undefined;
    let pause: (() => void) | undefined;
    const eligible = () => desktop.matches && !reduced.matches && !connection?.saveData;

    function resetContent() {
      hero!.classList.remove('is-enhanced');
      hero!.style.removeProperty('--journey-progress');
      beats.forEach(beat => {
        beat.style.removeProperty('--beat-opacity');
        beat.style.removeProperty('--beat-shift');
        beat.removeAttribute('aria-hidden');
        beat.inert = false;
      });
    }
    function stop() {
      generation++;
      loading = false;
      cleanup?.();
      cleanup = refresh = pause = undefined;
      resetContent();
      host!.dataset.sceneState = 'static';
    }

    async function start() {
      if (disposed || failed || loading || cleanup || !eligible() || !visible || document.hidden) return;
      loading = true;
      const token = ++generation;
      try {
        // This is the only import of the renderer. Phones and reduced-motion users
        // never request its chunk; the server-rendered content works independently.
        const { createHeroScene } = await import('@/lib/hero-scene');
        if (disposed || token !== generation || !eligible() || !visible || document.hidden) {
          if (token === generation) loading = false;
          return;
        }
        const scene = createHeroScene(host!);
        let frame = 0;
        let current = 0;
        let target = 0;
        let lastTime = 0;
        let frames = 0;
        const cancel = () => {
          cancelAnimationFrame(frame);
          frame = 0;
          lastTime = 0;
        };
        const restore = () => {
          cancel();
          scene.dispose();
          resetContent();
        };
        cleanup = restore;
        const paint = (time: number) => {
          frame = 0;
          if (!visible || document.hidden || !eligible()) return;
          const dt = lastTime ? Math.min(64, time - lastTime) : 16;
          lastTime = time;
          current += (target - current) * (1 - Math.exp(-dt / 100));
          if (Math.abs(target - current) < 0.0005) current = target;
          const position = current * (beats.length - 1);
          const active = Math.round(position);
          beats.forEach((beat, index) => {
            const distance = position - index;
            const opacity = Math.max(0, 1 - Math.abs(distance) * 1.65);
            beat.style.setProperty('--beat-opacity', String(opacity));
            beat.style.setProperty('--beat-shift', `${distance * -35}px`);
            // Hidden CTAs cannot trap keyboard focus between story chapters.
            const focused = beat.contains(document.activeElement);
            beat.inert = index !== active && !focused;
            if (index !== active && !focused) beat.setAttribute('aria-hidden', 'true');
            else beat.removeAttribute('aria-hidden');
            if (focused) beat.style.setProperty('--beat-opacity', '1');
          });
          hero!.style.setProperty('--journey-progress', String(current));
          try {
            scene.render(current);
            host!.dataset.drawCalls = String(scene.drawCalls());
            host!.dataset.frameCount = String(++frames);
          } catch {
            failed = true;
            stop();
            host!.dataset.sceneState = 'fallback';
            return;
          }
          // No perpetual idle animation. Scroll interpolation ends when settled.
          if (current !== target) frame = requestAnimationFrame(paint);
        };
        const request = () => {
          const rect = hero!.getBoundingClientRect();
          target = Math.min(1, Math.max(0, -rect.top / Math.max(1, hero!.offsetHeight - innerHeight)));
          if (visible && !document.hidden && !frame) frame = requestAnimationFrame(paint);
        };
        const resize = () => { scene.resize(); request(); };
        const contextLost = () => {
          failed = true;
          stop();
          host!.dataset.sceneState = 'fallback';
        };
        host!.addEventListener('webglcontextlost', contextLost, true);
        window.addEventListener('scroll', request, { passive: true });
        window.addEventListener('resize', resize);
        cleanup = () => {
          window.removeEventListener('scroll', request);
          window.removeEventListener('resize', resize);
          host!.removeEventListener('webglcontextlost', contextLost, true);
          restore();
        };
        pause = cancel;
        refresh = request;
        hero!.classList.add('is-enhanced');
        scene.resize();
        scene.render(0); // Hide the photographic fallback only after a real frame.
        host!.dataset.sceneState = 'ready';
        loading = false;
        request();
      } catch {
        if (disposed || token !== generation) return;
        failed = true;
        stop();
        host!.dataset.sceneState = 'fallback';
      }
    }
    function sync() {
      if (!eligible()) stop();
      else if (!visible || document.hidden) pause?.();
      else if (cleanup) refresh?.();
      else void start();
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(hero);
    desktop.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();

    return () => {
      disposed = true;
      observer.disconnect();
      desktop.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      stop();
    };
  }, []);

  return (
    <section className="journey" ref={root} aria-label="Your road forward">
      <div className="journey-stage">
        <div className="journey-photo" aria-hidden="true">
          <picture>
            <source media="(max-width: 767px)" srcSet="/images/hero-01-night-mobile.jpg" />
            {/* Native picture selects the correct existing asset without fetching both. */}
            <img src="/images/hero-01-night.jpg" alt="" width="1672" height="941" fetchPriority="high" />
          </picture>
        </div>
        <div className="journey-canvas" ref={mount} aria-hidden="true" data-scene-state="static" />
        <div className="journey-shade" aria-hidden="true" />
        <div className="journey-story">{children}</div>
        <div className="journey-tools">
          <span className="journey-scroll" aria-hidden="true">SCROLL TO DRIVE <i><b /></i></span>
          <a href="#get-started">Skip to your next step ↗</a>
        </div>
        <div className="journey-dawn" aria-hidden="true" />
      </div>
    </section>
  );
}
