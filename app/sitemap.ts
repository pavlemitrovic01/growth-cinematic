import type { MetadataRoute } from 'next';
import { IS_LIVE, SITE_URL } from '@/lib/seo';
import { POSTS } from '@/lib/posts';
export const PAGE_PATHS = ['/', '/apply', '/for-carriers', '/how-it-works', '/about', '/faq', '/contact', '/privacy', '/terms', '/truckers-lounge'];
export default function sitemap(): MetadataRoute.Sitemap {
  if (!IS_LIVE) return [];
  return [
    ...PAGE_PATHS.map(path => ({ url: SITE_URL + (path === '/' ? '/' : path) })),
    ...POSTS.map(post => ({ url: `${SITE_URL}/truckers-lounge/${post.slug}`, lastModified: post.date })),
  ];
}
