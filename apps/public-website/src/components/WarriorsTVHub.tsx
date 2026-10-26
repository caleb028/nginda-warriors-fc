'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Sparkles, Tag, Video, X } from 'lucide-react';

export interface VideoClip {
  id: string;
  title: string;
  category: string;
  duration?: string;
  thumbnailUrl?: string;
  publishedAt?: string;
  description?: string;
  featured?: boolean;
}

export function WarriorsTVHub({
  videos = [],
}: {
  videos?: VideoClip[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeVideo, setActiveVideo] = useState<VideoClip | null>(null);

  const categories = ['All', 'Tunnel Cam', 'Highlights', 'Press Conference', 'Training'];

  const filtered =
    activeCategory === 'All'
      ? videos
      : videos.filter((v) => v.category === activeCategory);

  const featuredVideo = videos.find((v) => v.featured) || videos[0];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#08783E]/10 border border-[#08783E]/20 text-[#08783E] font-pedals font-athletic font-extrabold text-xs uppercase tracking-wider">
              WARRIORS+ TV
            </span>
            <span className="text-xs text-slate-500 font-medium">Official Digital Video Channel</span>
          </div>
          <h2 className="font-pedals font-athletic text-3xl md:text-5xl font-black uppercase text-slate-900 tracking-wide">
            INSIDE NGINDA WARRIORS
          </h2>
        </div>

        {/* Category Pills (only if videos exist) */}
        {videos.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-[#08783E] text-white shadow-sm font-pedals font-athletic uppercase tracking-wider'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* When NO videos are published yet by Admin */}
      {videos.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 p-10 md:p-14 text-center">
          <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Video className="w-8 h-8 text-[#08783E]" />
          </div>
          <h3 className="font-pedals font-athletic text-2xl md:text-3xl font-black uppercase text-slate-900">
            Official Club Broadcasts Being Prepared
          </h3>
          <p className="text-xs md:text-sm text-slate-600 max-w-xl mx-auto mt-2 leading-relaxed">
            Nginda Warriors FC publishes only genuine, verified club footage. Matchday highlights, player interviews, press conferences, and tunnel cam episodes will appear here once approved and published via the Control Centre.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/news"
              className="px-5 py-2.5 rounded-lg bg-[#08783E] text-white font-pedals font-athletic font-bold text-xs uppercase tracking-wider hover:bg-[#063B25] transition shadow-sm"
            >
              Read Latest Club News &rarr;
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Featured Lead Video Banner */}
          {featuredVideo && activeCategory === 'All' && (
            <div
              onClick={() => setActiveVideo(featuredVideo)}
              className="relative rounded-2xl overflow-hidden mb-8 group cursor-pointer border border-slate-200 shadow-lg bg-slate-900 aspect-[16/9] md:aspect-[21/9] flex items-end p-6 md:p-10"
            >
              <div className="absolute inset-0 bg-slate-900/60 group-hover:scale-105 transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white text-[#08783E] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 md:w-10 md:h-10 fill-current ml-1" />
                </div>
              </div>

              <div className="relative z-10 max-w-3xl">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#08783E] text-white text-xs font-bold uppercase tracking-wider">
                    {featuredVideo.category}
                  </span>
                  {featuredVideo.duration && (
                    <span className="text-xs text-white/90 font-pedals font-athletic tracking-wider font-bold">
                      {featuredVideo.duration}
                    </span>
                  )}
                </div>
                <h3 className="font-pedals font-athletic text-2xl md:text-4xl font-black uppercase text-white group-hover:text-[#F5D000] transition-colors leading-tight">
                  {featuredVideo.title}
                </h3>
                {featuredVideo.description && (
                  <p className="text-xs md:text-sm text-slate-200 mt-2 line-clamp-2">
                    {featuredVideo.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((video) => (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="group cursor-pointer rounded-xl overflow-hidden bg-white border border-slate-200 hover:border-[#08783E]/60 transition-all shadow-sm hover:shadow-md flex flex-col"
              >
                <div className="relative aspect-[16/9] bg-slate-100 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                  <Video className="w-12 h-12 text-slate-400 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center z-20 opacity-90 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white text-[#08783E] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 z-20 px-2 py-0.5 rounded bg-black/80 text-white font-pedals font-athletic font-bold text-xs tracking-wider">
                      {video.duration}
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#08783E] uppercase tracking-wider">
                      {video.category}
                    </span>
                    <h4 className="font-pedals font-athletic text-base font-bold uppercase text-slate-900 group-hover:text-[#08783E] transition-colors line-clamp-2 mt-1 leading-snug">
                      {video.title}
                    </h4>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-3 flex items-center justify-between">
                    <span>{video.publishedAt || 'Official Video'}</span>
                    <span className="text-[#08783E] font-semibold">Watch Now &rarr;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#08783E]/10 text-[#08783E] text-xs font-bold font-pedals font-athletic uppercase">
                  {activeVideo.category}
                </span>
                {activeVideo.duration && (
                  <span className="text-xs text-slate-500">{activeVideo.duration}</span>
                )}
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="text-slate-500 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-200"
                aria-label="Close video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-slate-950 flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-white text-[#08783E] flex items-center justify-center shadow-xl mb-4">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
              <h3 className="font-pedals font-athletic text-2xl font-bold uppercase text-white max-w-xl">
                {activeVideo.title}
              </h3>
              {activeVideo.description && (
                <p className="text-xs text-slate-300 max-w-md mt-2">
                  {activeVideo.description}
                </p>
              )}
              <div className="mt-4 px-4 py-1 rounded-full bg-[#08783E] text-white text-xs font-bold tracking-wider uppercase">
                Warriors HD Streaming Feed • Est. 2024
              </div>
            </div>

            <div className="p-4 bg-slate-50 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Official club video broadcast provided by Nginda Warriors FC Media.
              </p>
              <button
                onClick={() => setActiveVideo(null)}
                className="px-4 py-1.5 rounded-lg bg-[#08783E] text-white text-xs font-bold font-pedals font-athletic uppercase hover:bg-[#063B25] transition"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
