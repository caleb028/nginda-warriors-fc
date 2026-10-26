import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClubCrest, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { articles } = getPublicWebsiteSnapshot();
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: article.seoTitle || article.headline,
    description: article.seoDescription || article.excerpt,
  };
}

export default function SingleArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const { clubSettings, articles } = getPublicWebsiteSnapshot();
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="bg-[#FFFDF2] min-h-screen">
      <header className="bg-[#063B25] text-white py-14 border-b-4 border-[#F5D000]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F5D000] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Club News</span>
          </Link>

          <div>
            <span className="inline-block px-3 py-1 rounded bg-[#F5D000] text-[#063B25] font-athletic font-black text-xs uppercase tracking-wider">
              {article.categoryName}
            </span>
          </div>

          <h1 className="font-athletic text-4xl sm:text-6xl font-black uppercase leading-tight">
            {article.headline}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-xs text-emerald-100 pt-2">
            <span className="inline-flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#F5D000]" />
              By {article.authorName}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#F5D000]" />
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-KE', {
                dateStyle: 'full',
              })}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {article.featuredImageUrl && (
          <div className="rounded-2xl overflow-hidden border-2 border-[#08783E] shadow-lg">
            <img
              src={article.featuredImageUrl}
              alt={article.headline}
              className="w-full max-h-[460px] object-cover"
            />
          </div>
        )}

        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <p className="text-lg font-semibold text-[#063B25] border-l-4 border-[#F5D000] pl-4 mb-6">
            {article.excerpt}
          </p>
          <div className="text-base text-gray-800 leading-relaxed whitespace-pre-line space-y-4">
            {article.body}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#EEF7EF] border border-[#08783E]/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ClubCrest size={48} customCrestUrl={clubSettings.crestUrl} />
            <div>
              <p className="font-athletic text-lg font-black uppercase text-[#063B25]">
                {clubSettings.clubName} Media Desk
              </p>
              <p className="text-xs text-gray-600">{clubSettings.tagline}</p>
            </div>
          </div>
          <Link
            href="/support"
            className="px-4 py-2 rounded-lg bg-[#08783E] text-white font-athletic font-bold text-xs uppercase tracking-wider"
          >
            Support the Club
          </Link>
        </div>
      </div>
    </article>
  );
}
