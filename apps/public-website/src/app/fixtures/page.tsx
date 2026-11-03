import React from 'react';
import { getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { FixturesPageClient } from './FixturesPageClient';

export const revalidate = 15;

export default function FixturesAndResultsPage() {
  const snapshot = getPublicWebsiteSnapshot();
  return <FixturesPageClient initialSnapshot={snapshot} />;
}
