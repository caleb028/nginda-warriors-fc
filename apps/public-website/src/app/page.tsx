import React from 'react';
import { getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { PublicHomePageClient } from './PublicHomePageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function PublicHomePage() {
  const snapshot = getPublicWebsiteSnapshot();
  return <PublicHomePageClient initialSnapshot={snapshot} />;
}
