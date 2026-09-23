import { SITE_URL, SITE_DESCRIPTION, SOCIAL_IMAGE } from '@/lib/seo';
import { EMAIL, HAS_PHONE, PHONE_TEL_HREF } from '@/lib/contact';

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

/**
 * Organizacioni graf sajta.
 *
 * ⚠️ TIP JE `EmploymentAgency`, NE `Organization`. To nije kozmetika: schema.org ima
 * tacan tip za posrednika u zaposljavanju, a TTIrecruiting to jeste. Generican `Organization`
 * pretrazivacu ne kaze cime se firma bavi. Prenета odluka iz originalnog sajta.
 *
 * ⚠️ `address` nosi SAMO `addressCountry`. Fizicka postanska adresa firme jos ne
 * postoji kao potvrdjen podatak — original je ovde takodje ostavio samo drzavu.
 * Ne popunjavati ulicom dok adresa ne bude potvrdjena; izmisljanje poslovnih
 * cinjenica je zabranjeno bez izuzetka.
 *
 * ⚠️ `areaServed` je drzava, ne spisak drzava. Registar tvrdnji dozvoljava
 * „all 48 continental states" a zabranjuje „all 50 states" — nabrajanje bi tu granicu
 * moralo da ponovi na jos jednom mestu, pa se ne nabraja.
 *
 * ⚠️ RAZLIKA U ODNOSU NA ORIGINAL, namerna: pravno ime ide kao `legalName`, ne
 * `alternateName`. `legalName` je svojstvo koje schema.org ima bas za registrovano
 * ime; `alternateName` znaci „drugo ime po kome je poznata", sto nije isto.
 */
export default function StructuredData() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'EmploymentAgency',
            '@id': SITE_URL + '/#organization',
            name: 'TTIrecruiting',
            legalName: 'TTIrecruiting',
            url: SITE_URL,
            logo: new URL('/favicon.svg', SITE_URL).href,
            image: SOCIAL_IMAGE.url,
            description: SITE_DESCRIPTION,
            email: EMAIL,
            ...(HAS_PHONE ? { telephone: PHONE_TEL_HREF.replace('tel:', '') } : {}),
            areaServed: { '@type': 'Country', name: 'United States' },
            address: { '@type': 'PostalAddress', addressCountry: 'US' },
          },
          {
            '@type': 'WebSite',
            '@id': SITE_URL + '/#website',
            url: SITE_URL,
            name: 'TTIrecruiting',
            inLanguage: 'en-US',
            publisher: { '@id': SITE_URL + '/#organization' },
          },
        ],
      }}
    />
  );
}
