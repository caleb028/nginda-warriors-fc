import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NGINDA WARRIORS CONTROL CENTRE | Private Club Management System',
  description:
    'Private administrative control centre for Nginda Warriors FC (Est. 2024). Restricted to authorized club personnel.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function ControlCentreRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <body>{children}</body>
    </html>
  );
}
