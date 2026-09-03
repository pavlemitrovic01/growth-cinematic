import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import { POSTS } from '@/lib/posts';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  path: '/truckers-lounge',
  title: 'Truckers Lounge: CDL-A Driver Resources | GROWTH.CO',
  description: 'Resources, news, and tips for CDL-A drivers.',
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
      lede="Real talk for CDL-A drivers. We break down the industry BS so you can make informed decisions."
    >
      <div className="post-list">
        {POSTS.map((post) => (
          <article className="post-card" key={post.slug}>
            <div className="post-meta">
              <span className="post-tag">{post.tag}</span>
              <span>
                {post.dateDisplay} · {post.readTime}
              </span>
            </div>
            <h2>
              <Link href={`/truckers-lounge/${post.slug}`}>{post.title}</Link>
            </h2>
            <p>{post.body[0].text}</p>
            <Link className="post-read" href={`/truckers-lounge/${post.slug}`}>
              Read more ↗
            </Link>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
