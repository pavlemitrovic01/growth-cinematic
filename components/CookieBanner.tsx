'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  CONSENT_EVENT,
  CONSENT_OPEN_EVENT,
  CONSENT_STORAGE_KEY,
  detectGpc,
  effectiveConsent,
  isConsentRequired,
  parseStored,
  setConsent,
  shouldPrompt,
} from '@/lib/consent';

/**
 * Consent baner. Sva odluka zivi u `lib/consent.js` — ovde je samo povrsina.
 *
 * ⚠️ VRACA `null` DOK `NEXT_PUBLIC_CONSENT_REQUIRED` NIJE `true`. To nije mrtav kod nego
 * namerna kapija: sajt trenutno ne ucitava nijedan tracker, a baner koji pita za pristanak
 * na nesto sto ne postoji je tvrdnja bez pokrica. Pali se u istom trenutku kad i analitika.
 *
 * ⚠️ NEMA „X" DUGMETA. Zatvaranje bez odluke bi ostavilo posetioca u stanju koje nije ni
 * pristanak ni odbijanje, a baner bi se vracao na svako ucitavanje. Izlaz je uvek eksplicitan:
 * „Accept all", „Reject all", ili izbor po kategoriji. Odbijanje je jednako dostupno kao
 * prihvatanje — jedan klik, isto mesto, ista tezina.
 *
 * ⚠️ ZASTO `useSyncExternalStore` A NE `useEffect`: zapis o pristanku JESTE eksterni store —
 * `localStorage` plus dogadjaj. Prva verzija je citala storage u efektu i odatle zvala
 * `setState`, sto je i lint uhvatio (`react-hooks/set-state-in-effect`): kaskadni render i
 * jedan frejm u kome baner jos ne postoji. Ovako se odluka o prikazu racuna U RENDERU, iz
 * snapshot-a, a server snapshot je `null` pa nema neslaganja pri hidraciji.
 *
 * ⚠️ Snapshot je SIROV STRING iz storage-a, ne objekat. Objekat bi bio nova referenca pri
 * svakom citanju i vrteo bi render u krug.
 */

/** Pretplata na promenu odluke: ista kartica (CONSENT_EVENT) i druge kartice (storage). */
function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

function getSnapshot(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    // Safari private mode baca na sam pristup — tretira se kao „nema zapisa".
    return null;
  }
}

/** Na serveru zapis ne postoji; baner se pojavljuje tek posle hidracije. */
const getServerSnapshot = (): string | null => null;

type View = 'compact' | 'detail';

export default function CookieBanner() {
  const enabled = isConsentRequired();
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const [forcedOpen, setForcedOpen] = useState(false);
  const [view, setView] = useState<View>('compact');
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);
  const [gpc, setGpc] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  // Racuna se u renderu iz snapshot-a: cim odluka bude upisana, `shouldPrompt` vrati
  // `false` i baner nestaje sam — bez ijednog `setOpen(false)`.
  const needsPrompt = enabled && shouldPrompt(parseStored(raw));
  const open = needsPrompt || forcedOpen;

  const loadChoices = useCallback(() => {
    const current = effectiveConsent(parseStored(getSnapshot()), detectGpc());
    setAnalytics(current.analytics === true);
    setAdvertising(current.advertising === true);
    setGpc(detectGpc());
  }, []);

  // Ponovno otvaranje iz footera i sa `/privacy`. setState je ovde u callback-u
  // spoljnog dogadjaja — obrazac koji `useEffect` i jeste namenjen da pokrije.
  useEffect(() => {
    if (!enabled) return;
    const reopen = () => {
      restoreFocus.current = document.activeElement as HTMLElement | null;
      loadChoices();
      setView('detail');
      setForcedOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, [enabled, loadChoices]);

  // Fokus ulazi u panel kad se otvori i vraca se odakle je dosao kad se zatvori.
  useEffect(() => {
    if (open) panel.current?.querySelector<HTMLElement>('button, [href]')?.focus();
    else restoreFocus.current?.focus?.();
  }, [open]);

  const decide = (choices: { analytics: boolean; advertising: boolean }) => {
    setConsent(choices);
    setForcedOpen(false);
  };

  const showDetail = () => {
    loadChoices();
    setView('detail');
  };

  if (!open) return null;

  return (
    <div
      className="consent-bar"
      role="dialog"
      aria-labelledby="consent-title"
      aria-describedby="consent-body"
    >
      <div className="consent-panel" ref={panel}>
        <p className="consent-kicker" id="consent-title">
          YOUR PRIVACY CHOICES
        </p>

        {view === 'compact' ? (
          <>
            <p className="consent-body" id="consent-body">
              We use optional measurement to see which pages drivers actually use. Advertising
              tools let ad platforms recognize your browser away from our site. Both are off
              until you turn them on — the site and your application work either way.{' '}
              <Link href="/privacy#cookies">Read the details</Link>.
            </p>
            <div className="consent-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => decide({ analytics: true, advertising: true })}
              >
                Accept all
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => decide({ analytics: false, advertising: false })}
              >
                Reject all
              </button>
              <button type="button" className="consent-link" onClick={showDetail}>
                Choose what to allow
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="consent-body" id="consent-body">
              Two separate choices, because they are not the same thing.
            </p>
            <div className="consent-options">
              <label className="consent-option">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                />
                <span>
                  <strong>Analytics</strong>
                  Aggregate measurement of which pages drivers use, so we can fix what is
                  confusing. Not sold, and not shared with advertising platforms.
                </span>
              </label>

              <label className={`consent-option${gpc ? ' is-locked' : ''}`}>
                <input
                  type="checkbox"
                  checked={gpc ? false : advertising}
                  disabled={gpc}
                  onChange={(e) => setAdvertising(e.target.checked)}
                />
                <span>
                  <strong>Advertising</strong>
                  Lets ad platforms such as Meta or TikTok recognize your browser away from our
                  site. Under California law this counts as <em>sharing</em> personal information.
                  {/* GPC je obavezujuci opt-out u CA/CO/CT — zato je polje zakljucano, a ne
                      samo unapred odcekirano. Posetilac mora videti da je signal primljen. */}
                  {gpc ? (
                    <em className="consent-note">
                      Your browser is sending a Global Privacy Control signal, so this stays off.
                    </em>
                  ) : null}
                </span>
              </label>
            </div>
            <div className="consent-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => decide({ analytics, advertising: gpc ? false : advertising })}
              >
                Save my choices
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => decide({ analytics: false, advertising: false })}
              >
                Reject all
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
