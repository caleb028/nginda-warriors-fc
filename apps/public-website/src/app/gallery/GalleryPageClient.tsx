'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ClubCrest,
  ClubSettings,
  GalleryCategory,
  MediaAsset,
} from '@nginda-warriors/shared';
import { Camera, ExternalLink, Video } from 'lucide-react';

const GALLERY_CATEGORIES: GalleryCategory[] = [
  'Matches',
  'Training',
  'Tournaments',
  'Club events',
  'Community outreach',
  'Celebrations',
];

export function GalleryPageClient({
  clubSettings,
  mediaAssets,
}: {
  clubSettings: ClubSettings;
  mediaAssets: MediaAsset[];
}) {
  const [activeCat, setActiveCat] = useState<string>('ALL');

  const filteredMedia =
    activeCat === 'ALL'
      ? mediaAssets
      : mediaAssets.filter((m) => m.category === activeCat);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#0A0A0A] text-white py-12 border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="font-athletic text-4xl sm:text-5xl font-black uppercase text-white mt-2">
              GALLERY & MEDIA LIBRARY
            </h1>
            <p className="text-slate-300 text-base mt-1">
              Authentic moments from matches, training, tournaments, and community outreach.
            </p>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#0A0A0A] border border-[#262626] shadow-md flex items-center justify-center">
            <ClubCrest size={80} customCrestUrl={clubSettings.crestUrl} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Category Filters (Instant 0ms Client Filtering) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCat('ALL')}
            className={`px-3.5 py-2 rounded-lg text-xs font-athletic font-bold uppercase tracking-wider transition ${
              activeCat === 'ALL'
                ? 'bg-[#FDE100] text-black font-black shadow-md'
                : 'bg-[#1A1A1A] text-slate-300 hover:bg-[#222222] border border-[#262626]'
            }`}
          >
            All Media ({mediaAssets.length})
          </button>
          {GALLERY_CATEGORIES.map((cat) => {
            const count = mediaAssets.filter((m) => m.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCat(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-athletic font-bold uppercase tracking-wider transition ${
                  activeCat === cat
                    ? 'bg-[#FDE100] text-black font-black shadow-md'
                    : 'bg-[#1A1A1A] text-slate-300 hover:bg-[#222222] border border-[#262626]'
                }`}
              >
                {cat} {count > 0 ? `(${count})` : ''}
              </button>
            );
          })}
        </div>

        {filteredMedia.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map((asset) => (
              <div
                key={asset.id}
                className="group rounded-2xl overflow-hidden bg-[#141414] border border-[#262626] shadow-xl hover:border-[#FDE100]/60 transition flex flex-col"
              >
                <div className="h-64 bg-[#0A0A0A] relative flex items-center justify-center overflow-hidden">
                  {asset.mediaUrl ? (
                    <img
                      src={asset.mediaUrl}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="text-center p-6 text-slate-500">
                      {asset.type === 'video' ? (
                        <Video className="w-12 h-12 mx-auto mb-2 text-[#FDE100]" />
                      ) : (
                        <Camera className="w-12 h-12 mx-auto mb-2 text-[#08783E]" />
                      )}
                      <p className="font-athletic text-sm uppercase">Nginda Warriors FC</p>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-xs text-[#FDE100] border border-[#FDE100]/30 font-athletic font-black text-xs uppercase tracking-wider">
                    {asset.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h2 className="font-athletic text-xl font-black uppercase text-white group-hover:text-[#FDE100] transition">
                      {asset.title}
                    </h2>
                    {asset.description && (
                      <p className="text-sm text-slate-300 mt-1 line-clamp-2">
                        {asset.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-[#222222] pt-3">
                    <span>
                      {new Date(asset.takenAt || asset.createdAt).toLocaleDateString('en-KE', {
                        dateStyle: 'medium',
                      })}
                    </span>
                    {asset.credit && <span>Photo: {asset.credit}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-[#141414] p-12 text-center border border-[#262626]">
            <Camera className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h2 className="font-athletic text-2xl font-bold uppercase text-white">
              No Media In This Category
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Select &quot;All Media&quot; to browse all published moments.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
