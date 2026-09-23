import type { Metadata } from 'next';
import { APPLY_CTA } from '@/lib/cta';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import { POSTS } from '@/lib/posts';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/truckers-lounge',
  title: 'Truckers Lounge: CDL-A Driver Resources | TTIrecruiting',
  description: 'Practical guides to CDL training, return-to-duty questions and the details to check before accepting a driving job.',
});

/**
 * ⚠️ Ruta ostaje `/truckers-lounge`, ne `/resources` ni `/blog` — prenета odluka
 * (MAIN D11). Ime je na brend-glasu i vec indeksirano; nejasnoca se resava LABELOM u
 * navigaciji („Resources"), ne 301 redirectom koji gubi distinktivnost.
 */
export default function TruckersLounge() {
  return (
    <PageShell
      eyebrow="RESOURCES"
      title={
        <>
          Truckers
          <br />
          <em>Lounge</em>
        </>
      }
      lede="Before the next offer, know what to ask. Practical guides to training, your record and the numbers in a driving job."
    >
      <div className="post-list" data-stagger>
        {POSTS.map((post) => (
          <article className="post-card" key={post.slug}>
            <div className="post-meta">
              <span className="post-tag">{post.tag}</span>
              <span><time dateTime={post.date}>{post.dateDisplay}</time> · {post.readTime}</span>
            </div>
            <h2>
              <Link href={`/truckers-lounge/${post.slug}`}>{post.title}</Link>
            </h2>
            <p>{post.description}</p>
            <Link className="post-read" aria-label={`Read more: ${post.title}`} href={`/truckers-lounge/${post.slug}`}>
              Read more ↗
            </Link>
          </article>
        ))}
      </div>

      {/*
        ⚠️ Zavrsni CTA. Audit je nasao da je ovo bila JEDINA stranica na celom sajtu bez
        ijednog sledeceg koraka: vozac koji dodje sa naslovne („Explore the Truckers Lounge")
        i ne otvori clanak nema kuda dalje. Stari sajt je ovde imao `CallToAction`
        (`C:/dev/growth/app/truckers-lounge/page.jsx:54`).
      */}
      <div className="page-next">
        <p>Read enough? A recruiter can go through the same details with you.</p>
        <Link className="btn btn-primary" href="/apply">
          {APPLY_CTA} ↗
        </Link>
      </div>
    </PageShell>
  );
}
