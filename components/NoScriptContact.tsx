import { EMAIL, EMAIL_HREF, HAS_PHONE, PHONE_DISPLAY, PHONE_TEL_HREF } from '@/lib/contact';
export default function NoScriptContact() {
  return <noscript>
    <style>{'.qa,.af{display:none!important}'}</style>
    <p className="form-nojs">The online form needs JavaScript. {HAS_PHONE ? <>Call <a href={PHONE_TEL_HREF}>{PHONE_DISPLAY}</a></> : <>Email <a href={EMAIL_HREF}>{EMAIL}</a></>} and we’ll help you directly.</p>
  </noscript>;
}
