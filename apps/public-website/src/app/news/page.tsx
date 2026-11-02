import React from 'react';
import Link from 'next/link';
import { ArticleCategoryName, ClubCrest, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { ArrowRight, Newspaper } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CATEGORIES: ArticleCategoryName[] = [
  'Club announcements',
  'Match reports',
  'Transfers',
  'Training updates',
  'Player interviews',
  'Community stories',
  'Sponsorship announcements',
  'Official notices',
];

export default function NewsListingPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const { clubSettings, articles } = getPublicWebsiteSnapshot();
  const activeCategory = searchParams?.category || 'ALL';

  const filtered =
    activeCategory === 'ALL'
      ? articles
      : articles.filter((a) => a.categoryName === activeCategory);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#0A0A0A] text-white py-12 border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-wide text-xs sm:text-sm font-bold uppercase tracking-widest text-[#FDE100]">
              Official Club Media
            </span>
            <h1 className="font-athletic text-4xl sm:text-6xl font-black uppercase text-white mt-1">
              CLUB NEWS & MATCH REPORTS
            </h1>
            <p className="font-body text-slate-300 text-sm sm:text-base mt-2">
              Verified announcements, match reports, transfers, interviews, and community stories.
            </p>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#0A0A0A] border border-[#262626] shadow-md flex items-center justify-center">
            <ClubCrest size={80} customCrestUrl={clubSettings.crestUrl} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/news"
            className={`px-3.5 py-2 rounded-full text-xs font-athletic font-bold uppercase tracking-wider transition ${
              activeCategory === 'ALL'
                ? 'bg-[#FDE100] text-black font-black shadow-md'
                : 'bg-[#1A1A1A] text-slate-300 hover:bg-[#222222] border border-[#262626]'
            }`}
          >
            All Categories ({articles.length})
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/news?category=${encodeURIComponent(cat)}`}
              className={`px-3.5 py-2 rounded-full text-xs font-athletic font-bold uppercase tracking-wider transition ${
                activeCategory === cat
                  ? 'bg-[#FDE100] text-black font-black shadow-md'
                  : 'bg-[#1A1A1A] text-slate-300 hover:bg-[#222222] border border-[#262626]'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group rounded-2xl overflow-hidden bg-[#141414] border border-[#262626] shadow-xl hover:border-[#FDE100]/60 transition-all duration-300 flex flex-col hover:scale-[1.01]"
              >
                <div className="h-56 bg-[#0D0D0D] relative flex items-center justify-center overflow-hidden">
                  {article.featuredImageUrl ? (
                    <img
                      src={article.featuredImageUrl}
                      alt={article.headline}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <ClubCrest size={80} customCrestUrl={clubSettings.crestUrl} />
                  )}
                  {/* Al-Hilal Style Smooth Gradient Fade into Solid Black Card Canvas */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent pointer-events-none"
                    aria-hidden="true"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#FDE100] text-black font-athletic font-black text-xs uppercase tracking-wider shadow-sm z-10">
                    {article.categoryName}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="font-wide text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString(
                        'en-KE',
                        { dateStyle: 'medium' }
                      )}{' '}
                      • {article.authorName}
                    </p>
                    <h2 className="font-athletic text-2xl font-black uppercase text-white group-hover:text-[#FDE100] transition-colors line-clamp-2 leading-tight">
                      {article.headline}
                    </h2>
                    <p className="font-body text-sm text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-athletic font-black uppercase tracking-wider text-[#FDE100] group-hover:translate-x-1 transition-transform">
                    Read article <ArrowRight className="w-3.5 h-3.5 text-[#FDE100]" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-[#141414] p-12 text-center border border-[#262626]">
            <Newspaper className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h2 className="font-athletic text-2xl font-bold uppercase text-white">
              No Published Articles in This Category Yet
            </h2>
            <p className="font-body text-sm text-slate-400 max-w-lg mx-auto mt-1">
              Only articles marked as Published in the Nginda Warriors Control Centre are displayed to public visitors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
