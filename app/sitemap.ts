import type { MetadataRoute } from 'next';
import { IS_LIVE, SITE_URL } from '@/lib/seo';
import { POSTS } from '@/lib/posts';
import { PAGE_PATHS } from '@/lib/routes';
export default function sitemap(): MetadataRoute.Sitemap {
  if (!IS_LIVE) return [];
  return [
    ...PAGE_PATHS.map(path => ({ url: SITE_URL + (path === '/' ? '/' : path) })),
    ...POSTS.map(post => ({ url: `${SITE_URL}/truckers-lounge/${post.slug}`, lastModified: post.modified || post.date })),
  ];
}
