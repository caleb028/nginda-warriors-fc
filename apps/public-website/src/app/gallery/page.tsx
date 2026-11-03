import React from 'react';
import { getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { GalleryPageClient } from './GalleryPageClient';

export const revalidate = 15;

export default function GalleryAndMediaPage() {
  const { clubSettings, mediaAssets } = getPublicWebsiteSnapshot();

  return (
    <GalleryPageClient
      clubSettings={clubSettings}
      mediaAssets={mediaAssets}
    />
  );
}
