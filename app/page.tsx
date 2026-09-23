import type { Metadata } from 'next';
import Home from '@/components/Home';
import { pageMeta } from '@/lib/seo';
export const metadata: Metadata = pageMeta({ path: '/' });
export default function HomePage() { return <Home />; }
