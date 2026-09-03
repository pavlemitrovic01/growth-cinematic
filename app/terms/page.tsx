import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/terms',
  title: 'Terms of Service | GROWTH.CO',
  description: 'The terms that govern use of the GROWTH.CO website and recruiting services.',
});

/**
 * ⚠️ NACRT ZA PRAVNU PROVERU, prenet doslovno iz MAIN-a (`app/terms/page.jsx`).
 *
 * „Our Role" nosi istu tvrdnju kao footer disclaimer — agencija i posrednik, ne
 * prevoznik ni poslodavac, bez garancije zaposlenja, milja, plate ni home time-a.
 * Te dve povrsine moraju da se poklapaju; menjanje jedne bez druge je greska koju
 * je MAIN vec jednom napravio na relaciji privacy/marketing.
 */

const SECTIONS = [
  {
    h: 'Our Role',
    p: 'GROWTH.CO acts strictly as a recruiting agency and intermediary between CDL-A drivers and motor carriers. We are not a motor carrier, broker, or employer. We do not guarantee employment, specific miles, pay, or home time; these terms are ultimately agreed upon directly between the driver and the hiring carrier.',
  },
  {
    h: 'User Information and Accuracy',
    p: 'By submitting an application, you certify that all information provided regarding your CDL status, experience, violations, and SAP program history is accurate and truthful. Falsifying information may result in immediate rejection or termination by a carrier.',
  },
  {
    h: 'Free for Drivers',
    p: 'Our recruiting services are completely free for drivers. We are compensated directly by our carrier partners upon successful placement.',
  },
  {
    h: 'Limitation of Liability',
    p: 'GROWTH.CO shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use of our services, including disputes between drivers and carriers.',
  },
  {
    h: 'Modifications',
    p: 'We reserve the right to modify or replace these Terms at any time. Continued use of the service constitutes acceptance of the new Terms.',
  },
];

export default function Terms() {
  return (
    <PageShell eyebrow="LEGAL" title="Terms of Service">
      <div className="prose prose--legal">
        <p>
          Welcome to GROWTH.CO. By accessing or using our website and services, you agree to be
          bound by these Terms of Service.
        </p>
        {SECTIONS.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            <p>{s.p}</p>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
