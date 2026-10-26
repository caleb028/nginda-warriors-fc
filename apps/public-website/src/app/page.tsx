import React from 'react';
import Link from 'next/link';
import { ClubCrest, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import {
  HomepageHeroSlideshow,
  MatchKickoffCountdown,
} from '@/components/HomepageHeroAndCountdown';
import { WarriorsTVHub } from '@/components/WarriorsTVHub';
import { SupporterHubClient } from '@/components/SupporterHubClient';
import { TacticalPitchBoard } from '@/components/TacticalPitchBoard';
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  Newspaper,
  Shield,
  Trophy,
  Users,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

function formatNairobiDateTime(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-KE', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Africa/Nairobi',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function PublicHomePage() {
  const snapshot = getPublicWebsiteSnapshot();
  const {
    clubSettings,
    visibleHeroSlides,
    websiteSections,
    nextMatch,
    latestResult,
    ngindaStanding,
    standings,
    featuredPlayers,
    players,
    articles,
    approvedSponsors,
    mediaAssets,
  } = snapshot;

  const publishedVideos = (mediaAssets || [])
    .filter((m) => m.mediaType === 'video')
    .map((m) => ({
      id: m.id,
      title: m.title,
      category: m.category || 'Highlights',
      thumbnailUrl: m.url,
      publishedAt: m.createdAt ? formatNairobiDateTime(m.createdAt).split(',')[0] : '',
      description: m.caption,
    }));

  const isSectionVisible = (key: string) => {
    const found = websiteSections.find((s) => s.sectionKey === key);
    return found ? found.isVisible : true;
  };

  const getSectionMeta = (key: string, fallbackTitle: string, fallbackSub: string) => {
    const found = websiteSections.find((s) => s.sectionKey === key);
    return {
      title: found?.title || fallbackTitle,
      subtitle: found?.subtitle || fallbackSub,
      description: found?.description || '',
      primaryCtaLabel: found?.primaryCtaLabel,
      primaryCtaHref: found?.primaryCtaHref,
      secondaryCtaLabel: found?.secondaryCtaLabel,
      secondaryCtaHref: found?.secondaryCtaHref,
    };
  };

  const matchMeta = getSectionMeta(
    'match_centre',
    'MATCH CENTRE',
    'Official Fixtures, Live Scores & League Position'
  );
  const squadMeta = getSectionMeta(
    'featured_squad',
    'FEATURED WARRIORS SQUAD',
    'Approved First Team Profiles'
  );
  const newsMeta = getSectionMeta(
    'latest_news',
    'LATEST CLUB NEWS',
    'Official Announcements, Match Reports & Community Stories'
  );
  const communityMeta = getSectionMeta(
    'community_impact',
    'COMMUNITY IMPACT & DEVELOPMENT',
    'Empowering Talent & Uniting Nginda Since 2024'
  );
  const sponsorsMeta = getSectionMeta(
    'sponsors_strip',
    'OFFICIAL PARTNERS & SPONSORS',
    'Businesses Standing With Nginda Warriors FC'
  );
  const finalCtaMeta = getSectionMeta(
    'final_cta',
    'STAND WITH THE WARRIORS.',
    'Support local football, empower talent, and help build the future of Nginda Warriors FC.'
  );

  return (
    <div>
      {/* 1. HOMEPAGE HERO */}
      <HomepageHeroSlideshow settings={clubSettings} slides={visibleHeroSlides} />

      {/* 2. MATCH CENTRE + LATEST RESULT + LEAGUE POSITION - Pure White Canvas */}
      {isSectionVisible('match_centre') && (
        <section className="py-16 bg-slate-50 text-slate-900 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-pedals font-athletic font-extrabold uppercase tracking-widest text-[#08783E]">
                  AFRICA/NAIROBI TIME (EAT) • OFFICIAL MATCH HUB
                </span>
                <h2 className="font-pedals font-athletic text-4xl sm:text-5xl font-black uppercase tracking-wide text-slate-950 mt-1">
                  {matchMeta.title}
                </h2>
              </div>
              <Link
                href="/fixtures"
                className="inline-flex items-center gap-2 text-sm font-pedals font-athletic font-bold uppercase tracking-wider text-[#08783E] hover:text-[#063B25]"
              >
                <span>View Full Fixtures & Results</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card A: Next Fixture / Live Match */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#08783E] text-white font-pedals font-athletic font-black text-xs uppercase tracking-wider shadow-xs">
                      {nextMatch &&
                      ['live_first_half', 'halftime', 'live_second_half'].includes(
                        nextMatch.matchStatus
                      )
                        ? `🔴 LIVE • ${nextMatch.matchStatus.replace(/_/g, ' ').toUpperCase()}`
                        : 'NEXT FIXTURE'}
                    </span>
                    {nextMatch && (
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {nextMatch.isHome ? 'HOME MATCH' : 'AWAY MATCH'}
                      </span>
                    )}
                  </div>

                  {nextMatch ? (
                    <div className="space-y-5">
                      <div className="text-xs text-slate-500 font-semibold">
                        {nextMatch.competitionName} • {nextMatch.seasonName}
                      </div>

                      <div className="grid grid-cols-3 items-center gap-2 py-3 bg-slate-50 rounded-xl px-4 border border-slate-200">
                        <div className="text-center">
                          <div className="flex justify-center mb-1.5">
                            <ClubCrest size={48} customCrestUrl={clubSettings.crestUrl} />
                          </div>
                          <p className="font-pedals font-athletic font-bold text-sm uppercase leading-tight text-slate-900">
                            { nextMatch.isHome ? clubSettings.shortName : nextMatch.opponentName }
                          </p>
                        </div>

                        <div className="text-center">
                          {typeof nextMatch.homeScore === 'number' &&
                          typeof nextMatch.awayScore === 'number' ? (
                            <div className="font-pedals font-athletic text-4xl font-black text-slate-900">
                              {nextMatch.homeScore} - {nextMatch.awayScore}
                            </div>
                          ) : (
                            <div className="font-pedals font-athletic text-xl font-black text-[#08783E] px-3 py-1 rounded bg-white border border-slate-200 inline-block shadow-xs">
                              VS
                            </div>
                          )}
                        </div>

                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-1.5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-pedals font-athletic font-black text-lg text-slate-700">
                            {(nextMatch.isHome
                              ? nextMatch.opponentName
                              : clubSettings.shortName
                            )
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <p className="font-pedals font-athletic font-bold text-sm uppercase leading-tight text-slate-900">
                            {nextMatch.isHome ? nextMatch.opponentName : clubSettings.shortName}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#08783E]" />
                          <span>{formatNairobiDateTime(nextMatch.kickoffAt)} (EAT)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#08783E]" />
                          <span>{nextMatch.venue}</span>
                        </div>
                      </div>

                      {nextMatch.matchStatus === 'scheduled' && (
                        <MatchKickoffCountdown kickoffIso={nextMatch.kickoffAt} />
                      )}
                    </div>
                  ) : (
                    <div className="py-10 text-center space-y-2">
                      <Calendar className="w-10 h-10 text-slate-400 mx-auto opacity-80" />
                      <p className="font-pedals font-athletic text-xl font-bold uppercase text-slate-900">
                        Next Fixture Announcement Pending
                      </p>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        Official upcoming fixtures appear here automatically as soon as they are published by Match Officials.
                      </p>
                    </div>
                  )}
                </div>

                {nextMatch && (
                  <div className="mt-5 pt-4 border-t border-slate-200">
                    <Link
                      href={`/fixtures/${nextMatch.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#08783E] hover:bg-[#063B25] text-white font-pedals font-athletic font-black text-sm uppercase tracking-wider transition shadow-sm"
                    >
                      <span>Open Match Centre</span>
                      <ArrowRight className="w-4 h-4 text-[#F5D000]" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Card B: Latest Verified Result */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-pedals font-athletic font-bold text-xs uppercase tracking-wider">
                      LATEST VERIFIED RESULT
                    </span>
                    {latestResult && (
                      <span className="text-xs text-slate-500 font-semibold">
                        FULL TIME (FT)
                      </span>
                    )}
                  </div>

                  {latestResult ? (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-500 font-semibold">
                        {latestResult.competitionName} •{' '}
                        {formatNairobiDateTime(latestResult.kickoffAt)}
                      </p>

                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="flex items-center justify-between py-1.5">
                          <span className="font-pedals font-athletic text-lg font-bold uppercase text-slate-900">
                            {latestResult.isHome
                              ? clubSettings.clubName
                              : latestResult.opponentName}
                          </span>
                          <span className="font-pedals font-athletic text-3xl font-black text-[#08783E]">
                            {latestResult.homeScore ?? 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1.5 border-t border-slate-200">
                          <span className="font-pedals font-athletic text-lg font-bold uppercase text-slate-900">
                            {latestResult.isHome
                              ? latestResult.opponentName
                              : clubSettings.clubName}
                          </span>
                          <span className="font-pedals font-athletic text-3xl font-black text-[#08783E]">
                            {latestResult.awayScore ?? 0}
                          </span>
                        </div>
                      </div>

                      {latestResult.events.filter((e) =>
                        ['goal', 'penalty_goal'].includes(e.eventType)
                      ).length > 0 && (
                        <div className="text-xs text-slate-600 space-y-1">
                          <p className="font-bold uppercase text-[#08783E]">Goal Scorers:</p>
                          <p>
                            {latestResult.events
                              .filter((e) => ['goal', 'penalty_goal'].includes(e.eventType))
                              .map((e) => `${e.playerName} (${e.minute}')`)
                              .join(', ')}
                          </p>
                        </div>
                      )}

                      {latestResult.report && (
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {latestResult.report.summary}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="py-10 text-center space-y-2">
                      <Trophy className="w-10 h-10 text-slate-400 mx-auto opacity-80" />
                      <p className="font-pedals font-athletic text-xl font-bold uppercase text-slate-900">
                        No Verified Results Published Yet
                      </p>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        Completed match scores, goal scorers, and official match reports appear here once verified.
                      </p>
                    </div>
                  )}
                </div>

                {latestResult && (
                  <div className="mt-5 pt-4 border-t border-slate-200">
                    <Link
                      href={`/fixtures/${latestResult.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-[#08783E] font-pedals font-athletic font-bold text-sm uppercase tracking-wider transition"
                    >
                      <span>Read Full Match Report</span>
                      <ArrowRight className="w-4 h-4 text-[#08783E]" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Card C: League Position Snapshot */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-pedals font-athletic font-bold text-xs uppercase tracking-wider">
                      LEAGUE POSITION
                    </span>
                    <Link
                      href="/standings"
                      className="text-xs font-bold text-[#08783E] hover:underline"
                    >
                      Full Table →
                    </Link>
                  </div>

                  {ngindaStanding ? (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-500 font-semibold">
                        {ngindaStanding.competitionName} • {ngindaStanding.seasonName}
                      </p>
                      <div className="grid grid-cols-4 gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                        <div>
                          <span className="block text-[10px] uppercase text-slate-500 font-bold">
                            POS
                          </span>
                          <span className="font-pedals font-athletic text-3xl font-black text-[#08783E]">
                            #{ngindaStanding.position}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase text-slate-500 font-bold">
                            PLAYED
                          </span>
                          <span className="font-pedals font-athletic text-3xl font-black text-slate-900">
                            {ngindaStanding.played}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase text-slate-500 font-bold">
                            GD
                          </span>
                          <span className="font-pedals font-athletic text-3xl font-black text-slate-900">
                            {ngindaStanding.goalDifference > 0
                              ? `+${ngindaStanding.goalDifference}`
                              : ngindaStanding.goalDifference}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase text-slate-500 font-bold">
                            POINTS
                          </span>
                          <span className="font-pedals font-athletic text-3xl font-black text-[#08783E]">
                            {ngindaStanding.points}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {standings.slice(0, 4).map((row) => (
                          <div
                            key={row.id}
                            className={`flex items-center justify-between px-3 py-1.5 rounded ${
                              row.isNgindaWarriors
                                ? 'bg-[#08783E]/10 text-[#08783E] font-extrabold border border-[#08783E]/20'
                                : 'bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span>
                              {row.position}. {row.clubName}
                            </span>
                            <span>
                              {row.played}P • {row.points} PTS
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-10 text-center space-y-2">
                      <Award className="w-10 h-10 text-slate-400 mx-auto opacity-80" />
                      <p className="font-pedals font-athletic text-xl font-bold uppercase text-slate-900">
                        Verified Standings Pending
                      </p>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">
                        Official league table standings are displayed here once competition records are verified and published.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200">
                  <Link
                    href="/standings"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-pedals font-athletic font-bold text-sm uppercase tracking-wider transition"
                  >
                    <span>View Competition Standings</span>
                    <ArrowRight className="w-4 h-4 text-[#08783E]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2.5 WARRIORS+ TV - Clean White Surface */}
      <section id="warriors-tv" className="py-20 bg-white text-slate-900 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WarriorsTVHub videos={publishedVideos} />
        </div>
      </section>

      {/* 3. FEATURED SQUAD - White/Slate Canvas */}
      {isSectionVisible('featured_squad') && (
        <section className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-pedals font-athletic font-extrabold uppercase tracking-widest text-[#08783E]">
                  FIRST TEAM DIRECTORY • EST. {clubSettings.establishedYear}
                </span>
                <h2 className="font-pedals font-athletic text-4xl sm:text-5xl font-black uppercase text-slate-950 mt-1">
                  {squadMeta.title}
                </h2>
              </div>
              <Link
                href="/team"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#08783E] hover:bg-[#063B25] text-white font-pedals font-athletic font-bold text-sm uppercase tracking-wider transition shadow-sm"
              >
                <span>Explore Full Squad</span>
                <ArrowRight className="w-4 h-4 text-[#F5D000]" />
              </Link>
            </div>

            {featuredPlayers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredPlayers.slice(0, 4).map((player) => (
                  <Link
                    key={player.id}
                    href={`/team/${player.slug}`}
                    className="group rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-[#08783E]/40 shadow-sm hover:shadow-lg transition flex flex-col"
                  >
                    <div className="relative h-64 bg-slate-100 flex items-center justify-center overflow-hidden">
                      <span className="absolute top-3 right-4 font-pedals font-athletic text-6xl font-black text-slate-200 select-none">
                        #{player.jerseyNumber}
                      </span>
                      {player.photoUrl ? (
                        <img
                          src={player.photoUrl}
                          alt={player.fullName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <ClubCrest size={96} customCrestUrl={clubSettings.crestUrl} />
                      )}
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-[#08783E] text-white font-pedals font-athletic font-black text-xs uppercase tracking-wider shadow-sm">
                        #{player.jerseyNumber} • {player.positionGroup.slice(0, -1)}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-pedals font-athletic text-2xl font-black uppercase text-slate-900 group-hover:text-[#08783E] transition-colors">
                          {player.fullName}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">
                          {player.specificRole} • Preferred Foot: {player.preferredFoot}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 text-center text-xs">
                        <div>
                          <span className="block font-pedals font-athletic text-lg font-black text-[#08783E]">
                            {player.appearances}
                          </span>
                          <span className="text-[10px] uppercase text-slate-400 font-bold">
                            Apps
                          </span>
                        </div>
                        <div>
                          <span className="block font-pedals font-athletic text-lg font-black text-[#08783E]">
                            {player.goals}
                          </span>
                          <span className="text-[10px] uppercase text-slate-400 font-bold">
                            Goals
                          </span>
                        </div>
                        <div>
                          <span className="block font-pedals font-athletic text-lg font-black text-[#08783E]">
                            {player.assists}
                          </span>
                          <span className="text-[10px] uppercase text-slate-400 font-bold">
                            Assists
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white border-2 border-dashed border-slate-300 p-10 text-center shadow-xs">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="font-pedals font-athletic text-2xl font-bold uppercase text-slate-800">
                  Official Squad Profiles Being Prepared
                </h3>
                <p className="text-sm text-slate-500 max-w-xl mx-auto mt-1">
                  Nginda Warriors FC never displays fabricated player profiles. Official squad members appear here automatically as soon as they are approved and published in the Control Centre.
                </p>
              </div>
            )}

            {/* Tactical Pitch Board */}
            {players.length > 0 && (
              <div className="mt-14">
                <TacticalPitchBoard
                  startingPlayers={players.slice(0, 11)}
                  benchPlayers={players.slice(11, 18)}
                  defaultFormation="4-3-3"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. LATEST NEWS - White Surface */}
      {isSectionVisible('latest_news') && (
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-pedals font-athletic font-extrabold uppercase tracking-widest text-[#08783E]">
                  OFFICIAL CLUB MEDIA DESK
                </span>
                <h2 className="font-pedals font-athletic text-4xl sm:text-5xl font-black uppercase text-slate-950 mt-1">
                  {newsMeta.title}
                </h2>
              </div>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-sm font-pedals font-athletic font-bold uppercase tracking-wider text-[#08783E] hover:text-[#063B25]"
              >
                <span>All Club News & Notices</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.slice(0, 3).map((article) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-lg transition flex flex-col"
                  >
                    <div className="h-48 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                      {article.featuredImageUrl ? (
                        <img
                          src={article.featuredImageUrl}
                          alt={article.headline}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <ClubCrest size={76} customCrestUrl={clubSettings.crestUrl} />
                      )}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#08783E] text-white font-pedals font-athletic font-bold text-xs uppercase tracking-wider shadow-sm">
                        {article.categoryName}
                      </span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-slate-400 font-semibold mb-2">
                          {formatNairobiDateTime(article.publishedAt || article.createdAt)} • By{' '}
                          {article.authorName}
                        </p>
                        <h3 className="font-pedals font-athletic text-2xl font-bold uppercase text-slate-900 group-hover:text-[#08783E] transition-colors line-clamp-2">
                          {article.headline}
                        </h3>
                        <p className="text-sm text-slate-600 mt-2 line-clamp-3">
                          {article.excerpt}
                        </p>
                      </div>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-pedals font-athletic font-extrabold uppercase tracking-wider text-[#08783E]">
                        Read Full Story <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-10 text-center">
                <Newspaper className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="font-pedals font-athletic text-2xl font-bold uppercase text-slate-800">
                  No Published News Articles Yet
                </h3>
                <p className="text-sm text-slate-500 max-w-lg mx-auto mt-1">
                  Club announcements, match reports, training updates, and community stories published in the Control Centre appear here automatically.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. COMMUNITY IMPACT - Crisp Light Slate Background */}
      {isSectionVisible('community_impact') && (
        <section className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#08783E]/10 border border-[#08783E]/20 text-[#08783E] text-xs font-pedals font-athletic font-extrabold uppercase tracking-wider">
                  <HeartHandshake className="w-3.5 h-3.5 text-[#D5AA00]" />
                  <span>MORE THAN A FOOTBALL CLUB</span>
                </span>
                <h2 className="font-pedals font-athletic text-4xl sm:text-5xl font-black uppercase text-slate-950">
                  {communityMeta.title}
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  {clubSettings.clubInfo.communityImpactSummary}
                </p>
                <div className="space-y-3 pt-2">
                  {clubSettings.clubInfo.developmentObjectives.map((objective, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#08783E] shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-slate-800">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 border-t-4 border-t-[#08783E] shadow-sm">
                  <Trophy className="w-8 h-8 text-[#08783E] mb-3" />
                  <h3 className="font-pedals font-athletic text-2xl font-bold uppercase text-slate-900">
                    Youth Talent Pathway
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    Structured trials, disciplined coaching, and competitive match experience for local youth players.
                  </p>
                  <Link
                    href="/recruitment"
                    className="inline-flex items-center gap-1.5 text-xs font-pedals font-athletic font-bold uppercase tracking-wider text-[#08783E] mt-4 hover:underline"
                  >
                    Apply for Player Trials <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200 border-t-4 border-t-[#F5D000] shadow-sm">
                  <Shield className="w-8 h-8 text-[#08783E] mb-3" />
                  <h3 className="font-pedals font-athletic text-2xl font-bold uppercase text-slate-900">
                    Financial Transparency
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    Every confirmed community contribution and campaign expenditure is tracked with public accountability.
                  </p>
                  <Link
                    href="/transparency"
                    className="inline-flex items-center gap-1.5 text-xs font-pedals font-athletic font-bold uppercase tracking-wider text-[#08783E] mt-4 hover:underline"
                  >
                    View Transparency Ledger <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. APPROVED SPONSORS STRIP - White Surface */}
      {isSectionVisible('sponsors_strip') && (
        <section className="py-14 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-pedals font-athletic font-extrabold uppercase tracking-widest text-[#08783E]">
                  COMMERCIAL PARTNERSHIPS
                </span>
                <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-slate-950">
                  {sponsorsMeta.title}
                </h2>
              </div>
              <Link
                href="/sponsors"
                className="inline-flex items-center gap-2 text-xs font-pedals font-athletic font-extrabold uppercase tracking-wider text-[#08783E] hover:text-[#063B25]"
              >
                <span>View Sponsorship Packages</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {approvedSponsors.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {approvedSponsors.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center shadow-xs"
                  >
                    {sponsor.logoUrl ? (
                      <img
                        src={sponsor.logoUrl}
                        alt={sponsor.businessName}
                        className="h-14 object-contain mb-2"
                      />
                    ) : null}
                    <p className="font-pedals font-athletic font-bold text-base uppercase text-slate-900">
                      {sponsor.businessName}
                    </p>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#08783E]/10 text-[#08783E] mt-1">
                      {sponsor.tierCode.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
                <div>
                  <h3 className="font-pedals font-athletic text-2xl font-bold uppercase text-slate-900">
                    Official Partnership Opportunities Open for 2026/2027
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Position your brand alongside Nginda Warriors FC across match kits, pitchside banners, and digital media.
                  </p>
                </div>
                <Link
                  href="/sponsors"
                  className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#08783E] hover:bg-[#063B25] text-white font-pedals font-athletic font-bold text-sm uppercase tracking-wider transition shadow-sm"
                >
                  <span>Become an Official Sponsor</span>
                  <ArrowRight className="w-4 h-4 text-[#F5D000]" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 6.5 SUPPORTER HUB - Crisp Slate Surface */}
      <section id="supporters-hub" className="py-20 bg-slate-50 text-slate-900 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="px-3 py-1 rounded-full bg-[#08783E]/10 border border-[#08783E]/20 text-[#08783E] font-pedals font-athletic font-black text-xs uppercase tracking-wider">
              WARRIORS SUPPORTERS HUB
            </span>
            <h2 className="font-pedals font-athletic text-4xl sm:text-5xl font-black uppercase text-slate-950 mt-3">
              EMPOWERED BY OUR FANS
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Generate your official digital club membership pass, predict upcoming match scorelines, and crown the Warrior of the Month.
            </p>
          </div>
          <SupporterHubClient
            players={players}
            nextOpponent={nextMatch?.opponentName || null}
            nextMatchDate={nextMatch ? formatNairobiDateTime(nextMatch.kickoffAt) : null}
          />
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION ("STAND WITH THE WARRIORS.") - White Dominant */}
      {isSectionVisible('final_cta') && (
        <section className="py-20 bg-white text-slate-900 border-b border-slate-200 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-2 rounded-full bg-slate-50 border border-slate-200 shadow-sm">
                <ClubCrest size={80} customCrestUrl={clubSettings.crestUrl} />
              </div>
            </div>
            <h2 className="font-pedals font-athletic text-5xl sm:text-6xl font-black uppercase tracking-tight text-slate-950">
              {finalCtaMeta.title || 'STAND WITH THE WARRIORS.'}
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {finalCtaMeta.description ||
                'Support local football, empower talent, and help build the future of Nginda Warriors FC.'}
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/support"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-[#08783E] hover:bg-[#063B25] text-white font-pedals font-athletic font-black text-lg uppercase tracking-wider shadow-md transition"
              >
                <HeartHandshake className="w-5 h-5 text-[#F5D000]" />
                <span>Support the Club</span>
              </Link>
              <Link
                href="/sponsors"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 hover:border-[#08783E] font-pedals font-athletic font-bold text-lg uppercase tracking-wider transition shadow-xs"
              >
                <Shield className="w-5 h-5 text-[#08783E]" />
                <span>Become a Sponsor</span>
              </Link>
              <Link
                href="/membership"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-pedals font-athletic font-bold text-lg uppercase tracking-wider transition"
              >
                <Users className="w-5 h-5 text-slate-600" />
                <span>Join Our Community</span>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
