import React from 'react';
import Link from 'next/link';
import { ArticleCategoryName, ClubCrest, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { ArrowRight, Newspaper } from 'lucide-react';

export const dynamic = 'force-dynamic';

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
    <div className="bg-white min-h-screen">
      {/* Header Banner - White Dominant */}
      <section className="bg-slate-50 text-slate-900 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#08783E]/10 border border-[#08783E]/20 text-[#08783E] font-pedals font-athletic font-extrabold text-xs uppercase tracking-widest">
              OFFICIAL CLUB PUBLISHING SYSTEM
            </span>
            <h1 className="font-pedals font-athletic text-4xl sm:text-5xl font-black uppercase text-slate-950 mt-2">
              CLUB NEWS & MEDIA
            </h1>
            <p className="text-slate-600 text-base mt-1">
              Verified announcements, match reports, transfers, interviews, and community stories.
            </p>
          </div>
          <div className="p-2 rounded-full bg-white border border-slate-200 shadow-sm">
            <ClubCrest size={80} customCrestUrl={clubSettings.crestUrl} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/news"
            className={`px-3.5 py-2 rounded-lg text-xs font-pedals font-athletic font-bold uppercase tracking-wider transition ${
              activeCategory === 'ALL'
                ? 'bg-[#08783E] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Categories ({articles.length})
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/news?category=${encodeURIComponent(cat)}`}
              className={`px-3.5 py-2 rounded-lg text-xs font-pedals font-athletic font-bold uppercase tracking-wider transition ${
                activeCategory === cat
                  ? 'bg-[#08783E] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
                className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-lg transition flex flex-col"
              >
                <div className="h-52 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                  {article.featuredImageUrl ? (
                    <img
                      src={article.featuredImageUrl}
                      alt={article.headline}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ClubCrest size={80} customCrestUrl={clubSettings.crestUrl} />
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#08783E] text-white font-pedals font-athletic font-bold text-xs uppercase tracking-wider shadow-sm">
                    {article.categoryName}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold mb-1.5">
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString(
                        'en-KE',
                        { dateStyle: 'medium' }
                      )}{' '}
                      • {article.authorName}
                    </p>
                    <h2 className="font-pedals font-athletic text-2xl font-black uppercase text-slate-900 group-hover:text-[#08783E] transition-colors line-clamp-2">
                      {article.headline}
                    </h2>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-3">{article.excerpt}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-pedals font-athletic font-extrabold uppercase tracking-wider text-[#08783E]">
                    Read Full Article <ArrowRight className="w-3.5 h-3.5 text-[#08783E]" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-50 p-12 text-center border border-slate-200">
            <Newspaper className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h2 className="font-pedals font-athletic text-2xl font-bold uppercase text-slate-800">
              No Published Articles in This Category Yet
            </h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto mt-1">
              Only articles marked as Published in the Nginda Warriors Control Centre are displayed to public visitors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
