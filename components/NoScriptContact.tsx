import { PHONE_DISPLAY, PHONE_TEL_HREF } from '@/lib/contact';
export default function NoScriptContact() {
  return <noscript>
    <style>{'.qa,.af{display:none!important}'}</style>
    <p className="form-nojs">The online form needs JavaScript. Call <a href={PHONE_TEL_HREF}>{PHONE_DISPLAY}</a> and we’ll help you directly.</p>
  </noscript>;
}
