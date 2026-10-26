import React from 'react';
import Link from 'next/link';
import { ClubCrest, GalleryCategory, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { Camera, ExternalLink, Video } from 'lucide-react';

export const dynamic = 'force-dynamic';

const GALLERY_CATEGORIES: GalleryCategory[] = [
  'Matches',
  'Training',
  'Tournaments',
  'Club events',
  'Community outreach',
  'Celebrations',
];

export default function GalleryAndMediaPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const { clubSettings, mediaAssets } = getPublicWebsiteSnapshot();
  const activeCat = searchParams?.category || 'ALL';

  const filteredMedia =
    activeCat === 'ALL'
      ? mediaAssets
      : mediaAssets.filter((m) => m.category === activeCat);

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner - White Dominant */}
      <section className="bg-slate-50 text-slate-900 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#08783E]/10 border border-[#08783E]/20 text-[#08783E] font-pedals font-athletic font-extrabold text-xs uppercase tracking-widest">
              OFFICIAL PHOTOGRAPHY & VIDEO ARCHIVE
            </span>
            <h1 className="font-pedals font-athletic text-4xl sm:text-5xl font-black uppercase text-slate-950 mt-2">
              GALLERY & MEDIA LIBRARY
            </h1>
            <p className="text-slate-600 text-base mt-1">
              Authentic moments from matches, training, tournaments, and community outreach.
            </p>
          </div>
          <div className="p-2 rounded-full bg-white border border-slate-200 shadow-sm">
            <ClubCrest size={80} customCrestUrl={clubSettings.crestUrl} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/gallery"
            className={`px-3.5 py-2 rounded-lg text-xs font-pedals font-athletic font-bold uppercase tracking-wider transition ${
              activeCat === 'ALL'
                ? 'bg-[#08783E] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Media ({mediaAssets.length})
          </Link>
          {GALLERY_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/gallery?category=${encodeURIComponent(cat)}`}
              className={`px-3.5 py-2 rounded-lg text-xs font-pedals font-athletic font-bold uppercase tracking-wider transition ${
                activeCat === cat
                  ? 'bg-[#08783E] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {filteredMedia.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map((asset) => (
              <div
                key={asset.id}
                className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm flex flex-col hover:border-slate-300 transition"
              >
                <div className="h-60 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                  {asset.url ? (
                    <img
                      src={asset.url}
                      alt={asset.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ClubCrest size={72} customCrestUrl={clubSettings.crestUrl} />
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#08783E] text-white font-pedals font-athletic font-bold text-xs uppercase tracking-wider shadow-sm">
                    {asset.category}
                  </span>
                  {asset.mediaType === 'video' && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900 text-white text-xs font-bold inline-flex items-center gap-1 shadow-sm">
                      <Video className="w-3.5 h-3.5 text-[#F5D000]" /> Video
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-pedals font-athletic text-xl font-bold uppercase text-slate-900">
                      {asset.title}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">{asset.caption}</p>
                  </div>
                  {asset.externalVideoUrl && (
                    <a
                      href={asset.externalVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-pedals font-athletic font-extrabold uppercase text-[#08783E] hover:underline"
                    >
                      <span>Watch Video Highlight</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-50 p-12 text-center border border-slate-200">
            <Camera className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h2 className="font-pedals font-athletic text-2xl font-bold uppercase text-slate-800">
              Gallery Albums Awaiting Media Uploads
            </h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto mt-1">
              Photographs and video highlights uploaded and published through the Control Centre appear here organized by album category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
