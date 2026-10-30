import type { Metadata } from 'next';
import './globals.css';
import { getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { PublicShell } from '../components/PublicShell';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,600;0,700;1,700;1,800;1,900&family=Kanit:ital,wght@0,700;0,800;0,900;1,700;1,800;1,900&family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,700;1,800;1,900&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
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
