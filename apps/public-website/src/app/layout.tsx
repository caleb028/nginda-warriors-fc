import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { PublicShell } from '../components/PublicShell';
import { LiveSnapshotProvider } from '../components/LiveSnapshotProvider';

export const revalidate = 15;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#FDE100',
};

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
          url: clubSettings.crestUrl || '/brand/nginda-warriors-crest.png',
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
  const snapshot = getPublicWebsiteSnapshot();
  const { clubSettings } = snapshot;

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
    <html lang="en" className="dark bg-black">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FDE100" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Nginda Warriors FC" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Al-HilalFont-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/29LTBukraWide-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@700;800;900&family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;600;700&display=swap"
          media="print"
          // @ts-ignore
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Kanit:wght@700;800;900&family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;600;700&display=swap"
          />
        </noscript>
      </head>
      <body className="bg-black text-white selection:bg-[#FDE100] selection:text-black">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                // 1. Force unregister any legacy or hanging Service Worker versions
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(regs) {
                    for (var i = 0; i < regs.length; i++) {
                      var r = regs[i];
                      if (r.active && !r.active.scriptURL.includes('v=20261104_04')) {
                        r.unregister().catch(function() {});
                      }
                    }
                  }).catch(function() {});

                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js?v=20261104_04').then(function(reg) {
                      reg.update().catch(function() {});
                    }).catch(function() {});
                  });
                }

                // 2. Wipe bloated caches to instantly free mobile memory
                if ('caches' in window) {
                  caches.keys().then(function(keys) {
                    for (var i = 0; i < keys.length; i++) {
                      if (keys[i] !== 'nginda-warriors-v11-clean') {
                        caches.delete(keys[i]);
                      }
                    }
                  }).catch(function() {});
                }
              }
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LiveSnapshotProvider initialSnapshot={snapshot}>
          <PublicShell settings={clubSettings}>{children}</PublicShell>
        </LiveSnapshotProvider>
      </body>
    </html>
  );
}
