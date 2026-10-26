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
      <body>{children}</body>
    </html>
  );
}
