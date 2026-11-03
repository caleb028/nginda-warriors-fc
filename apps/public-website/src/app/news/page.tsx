import React from 'react';
import { getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { NewsPageClient } from './NewsPageClient';

export const revalidate = 15;

export default function NewsListingPage() {
  const { clubSettings, articles } = getPublicWebsiteSnapshot();

  return (
    <NewsPageClient
      clubSettings={clubSettings}
      articles={articles}
    />
  );
}
