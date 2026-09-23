import type { Metadata } from 'next';
import { JsonLd } from '@/components/StructuredData';
import { SITE_URL } from '@/lib/seo';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import { getPostBySlug, allPostSlugs } from '@/lib/posts';
import { pageMeta } from '@/lib/seo';

/**
 * Unknown articles use the site's accessible 404 page.
 *
 * ⚠️ `false`, I TO JE POPRAVKA IZ PRELASKA NA VERCEL, ne stilska promena. Sa `true` je
 * nepoznat slug isao u render, tamo pogadjao `notFound()` — i vracao ISPRAVNO TELO sa
 * POGRESNIM STATUSOM: izmereno 200 umesto 404, jer se `notFound()` okida posto je odgovor
 * vec poceo da se strimuje, pa se status koji je otisao ne moze vise promeniti. To je isti
 * mehanizam koji `docs/STATUS.md` opisuje za uhvacene serverske greske.
 *
 * Na Cloudflare/vinext stacku se to nije videlo. Posledica na Vercelu je stvarna: svaki
 * izmisljen `/truckers-lounge/<bilo sta>` bi pretrazivacu izgledao kao validna stranica.
 *
 * `false` odbija nepoznat parametar na nivou rutiranja, pre renderovanja, pa 404 bude pravi.
 * Sme jer `generateStaticParams` cita `lib/posts.js` — statican spisak, bez izvora novih
 * clanaka u runtime-u. Ako clanci ikad krenu iz baze ili CMS-a, ovo se vraca na `true` i
 * status se mora resiti drugacije.
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
    title: `${post.title} | TTIrecruiting`,
    description: post.description,
    article: true,
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
    // cinjenicu (FMCSA) od onoga sto TTIrecruiting tvrdi o sebi.
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
    <PageShell variant="article" eyebrow="TRUCKERS LOUNGE" title={post.title}>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Article', headline: post.title, datePublished: post.date, ...(post.modified ? { dateModified: post.modified } : {}), mainEntityOfPage: SITE_URL + '/truckers-lounge/' + post.slug, publisher: { '@id': SITE_URL + '/#organization' } }} />
      <p className="post-back">
        <Link href="/truckers-lounge">↖ Back to Truckers Lounge</Link>
      </p>
      <div className="post-meta post-meta--article">
        <span className="post-tag">{post.tag}</span>
        <span>
          <time dateTime={post.date}>{post.dateDisplay}</time> · {post.readTime}{post.modified ? <> · Updated <time dateTime={post.modified}>{new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(post.modified))}</time></> : null}
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
