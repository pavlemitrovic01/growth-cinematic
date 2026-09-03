import { SITE_URL, SITE_DESCRIPTION } from '@/lib/seo';
import { EMAIL, PHONE_TEL_HREF } from '@/lib/contact';
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
export default function StructuredData() {
  return <JsonLd data={{ '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': SITE_URL + '/#organization', name: 'GROWTH.CO', legalName: 'Capljinac LLC', url: SITE_URL, description: SITE_DESCRIPTION, email: EMAIL, telephone: PHONE_TEL_HREF.replace('tel:', '') },
    { '@type': 'WebSite', '@id': SITE_URL + '/#website', name: 'GROWTH.CO', url: SITE_URL, inLanguage: 'en-US', publisher: { '@id': SITE_URL + '/#organization' } },
  ] }} />;
}
