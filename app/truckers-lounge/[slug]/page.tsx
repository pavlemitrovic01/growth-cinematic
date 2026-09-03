import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import { getPostBySlug, allPostSlugs } from '@/lib/posts';
import { pageMeta } from '@/lib/seo';

/**
 * ⚠️ `dynamicParams = false` — staticno generisan skup, proizvoljan slug daje 404 u
 * produkciji umesto da pokusa render. Prenета odluka iz MAIN-a: tiho 404 je gore od
 * jasnog, a ovde je 404 nameravano ponasanje.
 *
 * ⚠️ `params` je Promise u Next 15+ — MAIN je na Next 14 i tamo je sinhron objekat.
 * Ovo je jedna od retkih mesta gde prenos NIJE doslovan, i razlog je verzija runtime-a.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return allPostSlugs().map((slug: string) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return pageMeta({
    path: `/truckers-lounge/${post.slug}`,
    title: `${post.title} | GROWTH.CO`,
    description: post.body[0].text,
  });
}

type Block =
  | { type: 'p'; text: string }
  | { type: 'subhead'; text: string }
  | { type: 'callout'; lead: string; text: string }
  | { type: 'source'; text: string; links: { url: string; label: string }[] }
  | { type: 'cta'; text: string; linkHref: string; linkText: string };

function ArticleBlock({ block }: { block: Block }) {
  switch (block.type) {
    case 'p':
      return <p>{block.text}</p>;
    // h2, ne h3: h1 na ovoj ruti je naslov clanka, pa podnaslov jedan nivo ispod mora
    // biti h2 da se nivo ne preskoci.
    case 'subhead':
      return <h2 className="post-subhead">{block.text}</h2>;
    case 'callout':
      return (
        <aside className="post-callout">
          <strong>{block.lead}</strong> {block.text}
        </aside>
      );
    // ⚠️ Izvor je VIDLJIVO odvojen od tela clanka: citalac mora da razlikuje federalnu
    // cinjenicu (FMCSA) od onoga sto GROWTH tvrdi o sebi.
    case 'source':
      return (
        <p className="post-source">
          {block.text}{' '}
          {block.links.map((link, i) => (
            <span key={link.url}>
              {i > 0 && ' · '}
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            </span>
          ))}
        </p>
      );
    case 'cta':
      return (
        <div className="post-cta">
          <p>{block.text}</p>
          <Link className="btn btn-primary" href={block.linkHref}>
            {block.linkText} ↗
          </Link>
        </div>
      );
    default:
      return null;
  }
}

export default async function TruckersLoungePost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <PageShell eyebrow="TRUCKERS LOUNGE" title={post.title}>
      <p className="post-back">
        <Link href="/truckers-lounge">↖ Back to Truckers Lounge</Link>
      </p>
      <div className="post-meta post-meta--article">
        <span className="post-tag">{post.tag}</span>
        <span>
          {post.dateDisplay} · {post.readTime}
        </span>
      </div>
      <article className="post-body">
        {(post.body as Block[]).map((block, i) => (
          <ArticleBlock key={i} block={block} />
        ))}
      </article>
    </PageShell>
  );
}
