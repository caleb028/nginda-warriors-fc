import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClubCrest, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export const revalidate = 15;

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
    <article className="bg-black text-white min-h-screen">
      <header className="bg-[#0A0A0A] text-white py-14 border-b border-[#262626]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FDE100] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Club News</span>
          </Link>

          <div>
            <span className="inline-block px-3 py-1 rounded bg-[#FDE100] text-black font-athletic font-black text-xs uppercase tracking-wider shadow-sm">
              {article.categoryName}
            </span>
          </div>

          <h1 className="font-athletic text-4xl sm:text-6xl font-black uppercase leading-tight text-white">
            {article.headline}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-xs text-slate-300 pt-2">
            <span className="inline-flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#FDE100]" />
              By {article.authorName}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#FDE100]" />
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-KE', {
                dateStyle: 'full',
              })}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {article.featuredImageUrl && (
          <div className="rounded-2xl overflow-hidden border-2 border-[#262626] shadow-2xl relative">
            <img
              src={article.featuredImageUrl}
              alt={article.headline}
              className="w-full max-h-[460px] object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"
              aria-hidden="true"
            />
          </div>
        )}

        <div className="bg-[#141414] rounded-2xl p-8 border border-[#262626] shadow-xl text-slate-200">
          <p className="text-lg font-semibold text-white border-l-4 border-[#FDE100] pl-4 mb-6">
            {article.excerpt}
          </p>
          <div className="text-base text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
            {article.body}
          </div>
        </div>

        {article.slug === 'team-gaffer-peter-gitau-outlines-vision' && (
          <div className="rounded-2xl bg-[#141414] border-2 border-[#262626] p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-black shrink-0 border-2 border-[#FDE100] shadow-md">
              <img
                src="/uploads/peter-gitau-portrait.png"
                alt="Head Coach Peter Gitau"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FDE100]/10 text-[#FDE100] border border-[#FDE100]/30 font-athletic font-black text-xs uppercase tracking-wider">
                Head Coach & Team Gaffer
              </span>
              <h3 className="font-athletic text-2xl font-black uppercase text-white">
                Peter Gitau
              </h3>
              <p className="text-xs text-slate-300 italic">
                Leading Nginda Warriors FC preparations with high intensity, unity, and fearless attacking football.
              </p>
            </div>
          </div>
        )}

        <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-[#262626] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ClubCrest size={48} customCrestUrl={clubSettings.crestUrl} />
            <div>
              <p className="font-athletic text-lg font-black uppercase text-white">
                {clubSettings.clubName} Media Desk
              </p>
              <p className="text-xs text-slate-400">{clubSettings.tagline}</p>
            </div>
          </div>
          <Link
            href="/support"
            className="px-4 py-2 rounded-lg bg-[#FDE100] hover:bg-[#FFE600] text-black font-athletic font-bold text-xs uppercase tracking-wider transition shadow-sm"
          >
            Support the Club
          </Link>
        </div>
      </div>
    </article>
  );
}
