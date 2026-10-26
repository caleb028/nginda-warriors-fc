import { MetadataRoute } from 'next';
import { getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ngindawarriorsfc.co.ke';
  const snapshot = getPublicWebsiteSnapshot();
  const now = new Date();

  const staticRoutes = [
    '',
    '/about',
    '/team',
    '/fixtures',
    '/standings',
    '/news',
    '/gallery',
    '/sponsors',
    '/support',
    '/transparency',
    '/membership',
    '/recruitment',
    '/merchandise',
    '/events',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const playerRoutes = snapshot.players.map((p) => ({
    url: `${baseUrl}/team/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const articleRoutes = snapshot.articles.map((a) => ({
    url: `${baseUrl}/news/${a.slug}`,
    lastModified: new Date(a.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const fixtureRoutes = [...snapshot.upcomingFixtures, ...snapshot.completedFixtures].map((f) => ({
    url: `${baseUrl}/fixtures/${f.id}`,
    lastModified: new Date(f.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...playerRoutes, ...articleRoutes, ...fixtureRoutes];
}
