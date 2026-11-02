import React from 'react';
import { getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { TeamPageClient } from './TeamPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function TeamSquadPage() {
  const snapshot = getPublicWebsiteSnapshot();
  return <TeamPageClient initialSnapshot={snapshot} />;
}
