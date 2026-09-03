import type { Metadata } from 'next';
import CinematicHome from '@/components/CinematicHome';
import { pageMeta } from '@/lib/seo';
export const metadata: Metadata = pageMeta({ path: '/' });
export default function HomePage() { return <CinematicHome />; }
