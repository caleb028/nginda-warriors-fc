import type { Metadata } from 'next';
import './globals.css';
import { getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { PublicShell } from '@/components/PublicShell';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { clubSettings } = getPublicWebsiteSnapshot();
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    clubSettings.seoMetadata.canonicalBaseUrl ||
    'https://ngindawarriorsfc.co.ke';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: clubSettings.seoMetadata.defaultTitle,
      template: clubSettings.seoMetadata.titleTemplate,
    },
    description: clubSettings.seoMetadata.defaultDescription,
    keywords: clubSettings.seoMetadata.keywords,
    openGraph: {
      title: clubSettings.seoMetadata.defaultTitle,
      description: clubSettings.seoMetadata.defaultDescription,
      url: baseUrl,
      siteName: clubSettings.clubName,
      locale: 'en_KE',
      type: 'website',
      images: [
        {
          url: clubSettings.crestUrl || '/brand/nginda-warriors-crest.svg',
          width: 480,
          height: 480,
          alt: `${clubSettings.clubName} Official Crest`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { clubSettings } = getPublicWebsiteSnapshot();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: clubSettings.clubName,
    foundingDate: String(clubSettings.establishedYear),
    sport: 'Football',
    slogan: clubSettings.tagline,
    url: clubSettings.seoMetadata.canonicalBaseUrl,
    logo: `${clubSettings.seoMetadata.canonicalBaseUrl}${clubSettings.crestUrl}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: clubSettings.physicalAddress,
      addressCountry: 'KE',
    },
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PublicShell settings={clubSettings}>{children}</PublicShell>
      </body>
    </html>
  );
}
