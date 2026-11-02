'use client';

import React from 'react';
import Link from 'next/link';
import {
  ClubCrest,
  PublicWebsiteSnapshot,
} from '@nginda-warriors/shared';
import { useLiveSnapshot } from '../components/LiveSnapshotProvider';
import {
  HomepageHeroSlideshow,
  MatchKickoffCountdown,
  RbMatchRail,
} from '../components/HomepageHeroAndCountdown';
import { WarriorsTVHub } from '../components/WarriorsTVHub';
import { TacticalPitchBoard } from '../components/TacticalPitchBoard';
import { MotionReveal, StaggerContainer, StaggerItem } from '../components/MotionReveal';
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

export function PublicHomePageClient({
  initialSnapshot,
}: {
  initialSnapshot: PublicWebsiteSnapshot;
}) {
  const snapshot = useLiveSnapshot(initialSnapshot);

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
    'FEARLESS FIRST TEAM',
    'ONE CLUB. ONE WARRIOR SPIRIT.'
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
    <div className="bg-black text-white">
      {/* 1. HOMEPAGE HERO (Al-Hilal Deep Black Gradient & RB Leipzig Card) */}
      <HomepageHeroSlideshow settings={clubSettings} slides={visibleHeroSlides} />

      {/* 2. RB LEIPZIG SIGNATURE HORIZONTAL MATCH TICKER RAIL (Center Highlight Next Match Card) */}
      <RbMatchRail
        settings={clubSettings}
        latestResult={latestResult}
        nextMatch={nextMatch}
        upcomingFixtures={(snapshot.upcomingFixtures || []).filter(
          (f) => f.id !== nextMatch?.id && f.matchStatus === 'scheduled'
        )}
      />

      {/* 2. MATCH CENTRE + LATEST RESULT + LEAGUE POSITION - Sleek Pitch Surface */}
      {isSectionVisible('match_centre') && (
        <section className="py-16 bg-[#0A0A0A] text-white border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MotionReveal y={24} once={false}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <h2 className="font-athletic text-4xl sm:text-5xl font-black uppercase tracking-wide text-white">
                    {matchMeta.title}
                  </h2>
                </div>
                <Link
                  href="/fixtures"
                  className="inline-flex items-center gap-2 text-sm font-athletic font-bold uppercase tracking-wider text-[#FDE100] hover:text-[#FDE100] transition"
                >
                  <span>View Full Fixtures & Results</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </MotionReveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card A: Next Fixture / Live Match */}
              <div className="rounded-2xl bg-[#141414] border border-[#262626] shadow-xl p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#FDE100] text-black font-athletic font-black text-xs uppercase tracking-wider shadow-sm">
                      {nextMatch &&
                      ['live_first_half', 'halftime', 'live_second_half'].includes(
                        nextMatch.matchStatus
                      )
                        ? `🔴 LIVE • ${nextMatch.matchStatus.replace(/_/g, ' ').toUpperCase()}`
                        : 'NEXT FIXTURE'}
                    </span>
                    {nextMatch && (
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {nextMatch.isHome ? 'HOME MATCH' : 'AWAY MATCH'}
                      </span>
                    )}
                  </div>

                  {nextMatch ? (
                    <div className="space-y-5">
                      <div className="text-xs text-slate-400 font-semibold">
                        {nextMatch.competitionName} • {nextMatch.seasonName}
                      </div>

                      <div className="grid grid-cols-3 items-center gap-2 py-4 bg-[#0D0D0D] rounded-xl px-4 border border-[#262626]">
                        {/* HOME TEAM */}
                        <div className="text-center flex flex-col items-center">
                          <div className="h-12 flex items-center justify-center mb-1.5">
                            {nextMatch.isHome ? (
                              <ClubCrest size={48} customCrestUrl={clubSettings.crestUrl} />
                            ) : nextMatch.opponentCrestUrl ? (
                              <img
                                src={nextMatch.opponentCrestUrl}
                                alt={nextMatch.opponentName}
                                className="w-12 h-12 object-contain"
                              />
                            ) : null}
                          </div>
                          <p className="font-athletic font-bold text-sm uppercase leading-tight text-white">
                            {nextMatch.isHome ? clubSettings.shortName : nextMatch.opponentName}
                          </p>
                          <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                            {nextMatch.isHome ? 'Home' : 'Away'}
                          </span>
                        </div>

                        {/* VS OR SCORE */}
                        <div className="text-center">
                          {typeof nextMatch.homeScore === 'number' &&
                          typeof nextMatch.awayScore === 'number' ? (
                            <div className="font-athletic text-4xl font-black text-white">
                              {nextMatch.homeScore} - {nextMatch.awayScore}
                            </div>
                          ) : (
                            <div className="font-athletic text-xl font-black text-[#FDE100] px-3 py-1 rounded bg-[#141414] border border-[#262626] inline-block shadow-sm">
                              VS
                            </div>
                          )}
                        </div>

                        {/* AWAY TEAM */}
                        <div className="text-center flex flex-col items-center">
                          <div className="h-12 flex items-center justify-center mb-1.5">
                            {!nextMatch.isHome ? (
                              <ClubCrest size={48} customCrestUrl={clubSettings.crestUrl} />
                            ) : nextMatch.opponentCrestUrl ? (
                              <img
                                src={nextMatch.opponentCrestUrl}
                                alt={nextMatch.opponentName}
                                className="w-12 h-12 object-contain"
                              />
                            ) : null}
                          </div>
                          <p className="font-athletic font-bold text-sm uppercase leading-tight text-white">
                            {nextMatch.isHome ? nextMatch.opponentName : clubSettings.shortName}
                          </p>
                          <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                            {nextMatch.isHome ? 'Away' : 'Home'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#FDE100]" />
                          <span>{formatNairobiDateTime(nextMatch.kickoffAt)} (EAT)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#FDE100]" />
                          <span>{nextMatch.venue}</span>
                        </div>
                      </div>

                      {nextMatch.matchStatus === 'scheduled' && (
                        <MatchKickoffCountdown kickoffIso={nextMatch.kickoffAt} />
                      )}
                    </div>
                  ) : (
                    <div className="py-10 text-center space-y-2">
                      <Calendar className="w-10 h-10 text-slate-500 mx-auto opacity-80" />
                      <p className="font-athletic text-xl font-bold uppercase text-white">
                        Next Fixture Announcement Pending
                      </p>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        Official upcoming fixtures appear here automatically as soon as they are published by Match Officials.
                      </p>
                    </div>
                  )}
                </div>

                {nextMatch && (
                  <div className="mt-5 pt-4 border-t border-[#262626]">
                    <Link
                      href={`/fixtures/${nextMatch.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#FDE100] hover:bg-[#FFE600] text-black font-athletic font-black text-sm uppercase tracking-wider transition shadow-sm"
                    >
                      <span>Open Match Centre</span>
                      <ArrowRight className="w-4 h-4 text-[#FDE100]" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Card B: Latest Verified Result */}
              <div className="rounded-2xl bg-[#141414] border border-[#262626] shadow-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#262626] text-slate-300 font-athletic font-bold text-xs uppercase tracking-wider">
                      LATEST VERIFIED RESULT
                    </span>
                    {latestResult && (
                      <span className="text-xs text-slate-400 font-semibold">
                        FULL TIME (FT)
                      </span>
                    )}
                  </div>

                  {latestResult ? (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-400 font-semibold">
                        {latestResult.competitionName} •{' '}
                        {formatNairobiDateTime(latestResult.kickoffAt)}
                      </p>

                      <div className="bg-[#0D0D0D] rounded-xl p-4 border border-[#262626] space-y-2">
                        {/* HOME */}
                        <div className="flex items-center justify-between py-1.5">
                          <div className="flex items-center gap-2.5">
                            {latestResult.isHome ? (
                              <ClubCrest size={28} customCrestUrl={clubSettings.crestUrl} />
                            ) : latestResult.opponentCrestUrl ? (
                              <img
                                src={latestResult.opponentCrestUrl}
                                alt={latestResult.opponentName}
                                className="w-7 h-7 object-contain"
                              />
                            ) : null}
                            <span className="font-athletic text-lg font-bold uppercase text-white">
                              {latestResult.isHome
                                ? clubSettings.clubName
                                : latestResult.opponentName}
                            </span>
                          </div>
                          <span className="font-athletic text-3xl font-black text-[#FDE100]">
                            {latestResult.homeScore ?? 0}
                          </span>
                        </div>
                        {/* AWAY */}
                        <div className="flex items-center justify-between py-1.5 border-t border-[#262626]">
                          <div className="flex items-center gap-2.5">
                            {!latestResult.isHome ? (
                              <ClubCrest size={28} customCrestUrl={clubSettings.crestUrl} />
                            ) : latestResult.opponentCrestUrl ? (
                              <img
                                src={latestResult.opponentCrestUrl}
                                alt={latestResult.opponentName}
                                className="w-7 h-7 object-contain"
                              />
                            ) : null}
                            <span className="font-athletic text-lg font-bold uppercase text-white">
                              {latestResult.isHome
                                ? latestResult.opponentName
                                : clubSettings.clubName}
                            </span>
                          </div>
                          <span className="font-athletic text-3xl font-black text-[#FDE100]">
                            {latestResult.awayScore ?? 0}
                          </span>
                        </div>
                      </div>

                      {latestResult.events.filter((e) =>
                        ['goal', 'penalty_goal'].includes(e.eventType)
                      ).length > 0 && (
                        <div className="text-xs text-slate-300 space-y-1">
                          <p className="font-bold uppercase text-[#FDE100]">Goal Scorers:</p>
                          <p>
                            {latestResult.events
                              .filter((e) => ['goal', 'penalty_goal'].includes(e.eventType))
                              .map((e) => `${e.playerName} (${e.minute}')`)
                              .join(', ')}
                          </p>
                        </div>
                      )}

                      {latestResult.report && (
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {latestResult.report.summary}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="py-10 text-center space-y-2">
                      <Trophy className="w-10 h-10 text-slate-500 mx-auto opacity-80" />
                      <p className="font-athletic text-xl font-bold uppercase text-white">
                        No Verified Results Published Yet
                      </p>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        Completed match scores, goal scorers, and official match reports appear here once verified.
                      </p>
                    </div>
                  )}
                </div>

                {latestResult && (
                  <div className="mt-5 pt-4 border-t border-[#262626]">
                    <Link
                      href={`/fixtures/${latestResult.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1A1A1A] hover:bg-[#222222] text-white border border-[#262626] hover:border-[#262626] font-athletic font-bold text-sm uppercase tracking-wider transition"
                    >
                      <span>Read Full Match Report</span>
                      <ArrowRight className="w-4 h-4 text-[#FDE100]" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Card C: League Position Snapshot */}
              <div className="rounded-2xl bg-[#141414] border border-[#262626] shadow-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#262626] text-slate-300 font-athletic font-bold text-xs uppercase tracking-wider">
                      LEAGUE POSITION
                    </span>
                    <Link
                      href="/standings"
                      className="text-xs font-bold text-[#FDE100] hover:underline"
                    >
                      Full Table →
                    </Link>
                  </div>

                  {ngindaStanding ? (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-400 font-semibold">
                        {ngindaStanding.competitionName} • {ngindaStanding.seasonName}
                      </p>
                      <div className="grid grid-cols-4 gap-2 bg-[#0D0D0D] p-4 rounded-xl border border-[#262626] text-center">
                        <div>
                          <span className="block text-[10px] uppercase text-slate-400 font-bold">
                            POS
                          </span>
                          <span className="font-athletic text-3xl font-black text-[#FDE100]">
                            #{ngindaStanding.position}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase text-slate-400 font-bold">
                            PLAYED
                          </span>
                          <span className="font-athletic text-3xl font-black text-white">
                            {ngindaStanding.played}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase text-slate-400 font-bold">
                            GD
                          </span>
                          <span className="font-athletic text-3xl font-black text-white">
                            {ngindaStanding.goalDifference > 0
                              ? `+${ngindaStanding.goalDifference}`
                              : ngindaStanding.goalDifference}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase text-slate-400 font-bold">
                            POINTS
                          </span>
                          <span className="font-athletic text-3xl font-black text-[#FDE100]">
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
                                ? 'bg-[#FDE100]/15 text-[#FDE100] font-extrabold border border-[#262626]'
                                : 'bg-[#0D0D0D] text-slate-300'
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
                      <Award className="w-10 h-10 text-slate-500 mx-auto opacity-80" />
                      <p className="font-athletic text-xl font-bold uppercase text-white">
                        Verified Standings Pending
                      </p>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        Official league table standings are displayed here once competition records are verified and published.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-[#262626]">
                  <Link
                    href="/standings"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1A1A1A] hover:bg-[#222222] text-slate-200 border border-[#262626] font-athletic font-bold text-sm uppercase tracking-wider transition"
                  >
                    <span>View Competition Standings</span>
                    <ArrowRight className="w-4 h-4 text-[#FDE100]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2.5 WARRIORS+ TV - Deep Black Surface */}
      <section id="warriors-tv" className="py-16 sm:py-20 bg-black text-white border-b border-[#262626] relative z-10 clear-both">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WarriorsTVHub videos={publishedVideos} />
        </div>
      </section>

      {/* 3. FEATURED SQUAD / WARRIORS IN ACTION - Sleek Pitch Surface */}
      {isSectionVisible('featured_squad') && (
        <section className="py-16 bg-[#0A0A0A] text-white border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MotionReveal y={24} once={false}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <h2 className="font-athletic text-4xl sm:text-5xl font-black uppercase text-white">
                    WARRIORS IN ACTION
                  </h2>
                </div>
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FDE100] hover:bg-[#FFE600] text-black font-athletic font-bold text-sm uppercase tracking-wider transition shadow-md"
                >
                  <span>Explore Full Gallery</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </Link>
              </div>
            </MotionReveal>

            {/* Authentic Club Photography Showcase */}
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" once={false} stagger={0.12}>
              {/* Photo 1: Matchday Squad Lineup */}
              <StaggerItem className="h-full">
                <Link
                  href="/gallery"
                  className="group rounded-2xl overflow-hidden bg-[#141414] border border-[#262626] hover:border-[#FDE100] shadow-xl transition-all duration-300 flex flex-col h-full hover:scale-[1.02]"
                >
                  <div className="relative h-72 sm:h-80 bg-[#0D0D0D] overflow-hidden">
                    <img
                      src="/uploads/hero-matchday-warriors.jpg"
                      alt="Nginda Warriors FC Matchday Squad"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </StaggerItem>

              {/* Photo 2: Warriors Pre-Match Unity Circle (Red Kits) */}
              <StaggerItem className="h-full">
                <Link
                  href="/gallery"
                  className="group rounded-2xl overflow-hidden bg-[#141414] border border-[#262626] hover:border-[#FDE100] shadow-xl transition-all duration-300 flex flex-col h-full hover:scale-[1.02]"
                >
                  <div className="relative h-72 sm:h-80 bg-[#0D0D0D] overflow-hidden">
                    <img
                      src="/uploads/team-huddle-red-warriors.jpg"
                      alt="Nginda Warriors FC Red Kits Unity Circle"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </StaggerItem>

              {/* Photo 3: Warriors Team Huddle */}
              <StaggerItem className="h-full">
                <Link
                  href="/gallery"
                  className="group rounded-2xl overflow-hidden bg-[#141414] border border-[#262626] hover:border-[#FDE100] shadow-xl transition-all duration-300 flex flex-col h-full hover:scale-[1.02]"
                >
                  <div className="relative h-72 sm:h-80 bg-[#0D0D0D] overflow-hidden">
                    <img
                      src="/uploads/team-huddle-warriors.jpg"
                      alt="Nginda Warriors FC Pre-Match Huddle"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </StaggerItem>

              {/* Photo 4: Official Presentation */}
              <StaggerItem className="h-full">
                <Link
                  href="/gallery"
                  className="group rounded-2xl overflow-hidden bg-[#141414] border border-[#262626] hover:border-[#FDE100] shadow-xl transition-all duration-300 flex flex-col h-full hover:scale-[1.02]"
                >
                  <div className="relative h-72 sm:h-80 bg-[#0D0D0D] overflow-hidden">
                    <img
                      src="/uploads/club-official-patron.jpg"
                      alt="Nginda Warriors FC Club Presentation"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </StaggerItem>
            </StaggerContainer>

            {/* Official Squad Profiles Registered in Control Centre */}
            {((featuredPlayers && featuredPlayers.length > 0) || (players && players.length > 0)) && (
              <div className="mt-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-athletic text-2xl font-black uppercase text-white">
                    Official Squad Profiles
                  </h3>
                  <Link
                    href="/team"
                    className="text-xs font-athletic font-bold uppercase text-[#FDE100] hover:underline"
                  >
                    View All →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(featuredPlayers.length > 0 ? featuredPlayers : players).slice(0, 4).map((player) => (
                    <Link
                      key={player.id}
                      href={`/team/${player.slug}`}
                      className="group rounded-2xl overflow-hidden bg-[#141414] border border-[#262626] hover:border-[#FDE100] shadow-xl transition-all flex flex-col"
                    >
                      <div className="relative h-64 bg-[#0D0D0D] flex items-center justify-center overflow-hidden">
                        {player.photoUrl ? (
                          <img
                            src={player.photoUrl}
                            alt={player.fullName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <ClubCrest size={96} customCrestUrl={clubSettings.crestUrl} />
                        )}
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"
                          aria-hidden="true"
                        />
                        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-[#FDE100] text-black font-athletic font-black text-xs uppercase tracking-wider">
                          #{player.jerseyNumber} • {player.positionGroup.slice(0, -1)}
                        </div>
                      </div>
                      <div className="p-4 flex-1">
                        <h4 className="font-athletic text-xl font-black uppercase text-white group-hover:text-[#FDE100] transition-colors">
                          {player.fullName}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {player.specificRole}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Team Gaffer Spotlight Banner */}
            {(() => {
              const gafferStaff = (snapshot.staff || []).find(
                (s) =>
                  s.fullName.toLowerCase().includes('peter gitau') ||
                  s.roleTitle.toLowerCase().includes('gaffer') ||
                  s.roleTitle.toLowerCase().includes('head coach')
              );
              const gafferPhoto = gafferStaff?.photoUrl || '/uploads/peter-gitau-portrait.png';
              const gafferName = gafferStaff?.fullName || 'Peter Gitau';
              const gafferRole = gafferStaff?.roleTitle
                ? gafferStaff.roleTitle.toUpperCase()
                : 'HEAD COACH & TEAM GAFFER';
              const gafferBio =
                gafferStaff?.biography ||
                '“Our warrior spirit begins on the training pitch. We demand discipline, rapid transitions, and relentless passion for the jersey. We play fearless football for the pride of Nginda.”';

              return (
                <div className="mt-12 rounded-2xl bg-[#141414] border-2 border-[#262626] hover:border-[#FDE100] transition-all p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-black shrink-0 border-2 border-[#FDE100] shadow-lg">
                    <img
                      src={gafferPhoto}
                      alt={`Team Gaffer ${gafferName}`}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDE100]/10 border border-[#FDE100]/30 text-[#FDE100] font-athletic font-black text-xs uppercase tracking-wider mb-2">
                      <span>{gafferRole}</span>
                    </div>
                    <h3 className="font-athletic text-3xl sm:text-4xl font-black uppercase text-white">
                      {gafferName}
                    </h3>
                    <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                      {gafferBio}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4">
                      <Link
                        href="/team"
                        className="inline-flex items-center gap-2 text-xs font-athletic font-black uppercase tracking-wider text-[#FDE100] hover:text-[#FFE600] transition"
                      >
                        <span>View Technical Bench & Squad</span>
                        <ArrowRight className="w-4 h-4 text-black bg-[#FDE100] rounded-full p-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })()}

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

      {/* 4. LATEST NEWS - Deep Black Surface */}
      {isSectionVisible('latest_news') && (
        <section className="py-16 bg-black text-white border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MotionReveal y={24} once={false}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <h2 className="font-athletic text-4xl sm:text-5xl font-black uppercase text-white">
                    {newsMeta.title}
                  </h2>
                </div>
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 text-sm font-athletic font-bold uppercase tracking-wider text-[#FDE100] hover:text-[#FDE100] transition"
                >
                  <span>All Club News & Notices</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </MotionReveal>

            {articles.length > 0 ? (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" once={false} stagger={0.15}>
                {articles.slice(0, 3).map((article) => (
                  <StaggerItem key={article.id} className="h-full">
                    <Link
                      href={`/news/${article.slug}`}
                      className="group rounded-2xl overflow-hidden bg-[#141414] border border-[#262626] shadow-xl hover:border-[#FDE100]/60 transition-all duration-300 flex flex-col h-full hover:scale-[1.02]"
                    >
                      <div className="h-48 bg-[#0D0D0D] relative flex items-center justify-center overflow-hidden">
                        {article.featuredImageUrl ? (
                          <img
                            src={article.featuredImageUrl}
                            alt={article.headline}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <ClubCrest size={76} customCrestUrl={clubSettings.crestUrl} />
                        )}
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"
                          aria-hidden="true"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#FDE100] hover:bg-[#FFE600] text-black font-athletic font-bold text-xs uppercase tracking-wider shadow-sm z-10">
                          {article.categoryName}
                        </span>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-slate-400 font-semibold mb-2">
                            {formatNairobiDateTime(article.publishedAt || article.createdAt)} • By{' '}
                            {article.authorName}
                          </p>
                          <h3 className="font-athletic text-2xl font-bold uppercase text-white group-hover:text-[#FDE100] transition-colors line-clamp-2">
                            {article.headline}
                          </h3>
                          <p className="text-sm text-slate-300 mt-2 line-clamp-3">
                            {article.excerpt}
                          </p>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-athletic font-extrabold uppercase tracking-wider text-[#FDE100]">
                          Read Full Story <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <div className="rounded-2xl bg-[#141414] border border-[#262626] p-10 text-center">
                <Newspaper className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="font-athletic text-2xl font-bold uppercase text-white">
                  No Published News Articles Yet
                </h3>
                <p className="text-sm text-slate-400 max-w-lg mx-auto mt-1">
                  Club announcements, match reports, training updates, and community stories published in the Control Centre appear here automatically.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. COMMUNITY IMPACT - Pitch Surface */}
      {isSectionVisible('community_impact') && (
        <section className="py-16 bg-[#0A0A0A] text-white border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <MotionReveal y={24} once={false} className="lg:col-span-6 space-y-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDE100]/10 border border-[#FDE100]/30 text-[#FDE100] text-xs font-athletic font-extrabold uppercase tracking-wider">
                  <HeartHandshake className="w-3.5 h-3.5 text-[#FDE100]" />
                  <span>MORE THAN A FOOTBALL CLUB</span>
                </span>
                <h2 className="font-athletic text-4xl sm:text-5xl font-black uppercase text-white">
                  {communityMeta.title}
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  {clubSettings.clubInfo.communityImpactSummary}
                </p>
                <div className="space-y-3 pt-2">
                  {clubSettings.clubInfo.developmentObjectives.map((objective, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-[#141414] border border-[#262626] shadow-sm"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#FDE100] shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-slate-200">{objective}</span>
                    </div>
                  ))}
                </div>
              </MotionReveal>

              <StaggerContainer className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5" once={false} stagger={0.12}>
                <StaggerItem>
                  <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] border-t-4 border-t-[#FDE100] shadow-xl">
                    <Trophy className="w-8 h-8 text-[#FDE100] mb-3" />
                    <h3 className="font-athletic text-2xl font-bold uppercase text-white">
                      Youth Talent Pathway
                    </h3>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                      Structured trials, disciplined coaching, and competitive match experience for local youth players.
                    </p>
                    <Link
                      href="/recruitment"
                      className="inline-flex items-center gap-1.5 text-xs font-athletic font-bold uppercase tracking-wider text-[#FDE100] mt-4 hover:underline"
                    >
                      Apply for Player Trials <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] border-t-4 border-t-[#FDE100] shadow-xl">
                    <Shield className="w-8 h-8 text-[#FDE100] mb-3" />
                    <h3 className="font-athletic text-2xl font-bold uppercase text-white">
                      Financial Transparency
                    </h3>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                      Every confirmed community contribution and campaign expenditure is tracked with public accountability.
                    </p>
                    <Link
                      href="/transparency"
                      className="inline-flex items-center gap-1.5 text-xs font-athletic font-bold uppercase tracking-wider text-[#FDE100] mt-4 hover:underline"
                    >
                      View Transparency Ledger <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </section>
      )}

      {/* 6. APPROVED SPONSORS STRIP - Deep Black Surface */}
      {isSectionVisible('sponsors_strip') && (
        <section className="py-14 bg-black text-white border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MotionReveal y={20} once={false}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="font-athletic text-3xl font-black uppercase text-white">
                    {sponsorsMeta.title}
                  </h2>
                </div>
                <Link
                  href="/sponsors"
                  className="inline-flex items-center gap-2 text-xs font-athletic font-extrabold uppercase tracking-wider text-[#FDE100] hover:text-[#FDE100]"
                >
                  <span>View Sponsorship Packages</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </MotionReveal>

            {approvedSponsors.length > 0 ? (
              <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4" once={false} stagger={0.08}>
                {approvedSponsors.map((sponsor) => (
                  <StaggerItem key={sponsor.id}>
                    <div className="p-5 rounded-xl bg-[#141414] border border-[#262626] flex flex-col items-center justify-center text-center shadow-md h-full">
                      {sponsor.logoUrl ? (
                        <img
                          src={sponsor.logoUrl}
                          alt={sponsor.businessName}
                          className="h-14 object-contain mb-2"
                        />
                      ) : null}
                      <p className="font-athletic font-bold text-base uppercase text-white">
                        {sponsor.businessName}
                      </p>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FDE100]/10 text-[#FDE100] border border-[#FDE100]/30 mt-1">
                        {sponsor.tierCode.replace('_', ' ')}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <div className="rounded-xl bg-[#141414] border border-[#262626] p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                <div>
                  <h3 className="font-athletic text-2xl font-bold uppercase text-white">
                    Official Partnership Opportunities Open for 2026/2027
                  </h3>
                  <p className="text-sm text-slate-300 mt-1">
                    Position your brand alongside Nginda Warriors FC across match kits, pitchside banners, and digital media.
                  </p>
                </div>
                <Link
                  href="/sponsors"
                  className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FDE100] hover:bg-[#FFE600] text-black font-athletic font-bold text-sm uppercase tracking-wider transition shadow-sm"
                >
                  <span>Become an Official Sponsor</span>
                  <ArrowRight className="w-4 h-4 text-[#FDE100]" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 7. FINAL CALL TO ACTION ("STAND WITH THE WARRIORS.") - Deep Black Pitch */}
      {isSectionVisible('final_cta') && (
        <section className="py-20 bg-black text-white border-b border-[#262626] relative overflow-hidden">
          <MotionReveal y={28} scale={0.98} once={false} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-2.5 rounded-2xl bg-[#0A0A0A] border border-[#262626] shadow-md flex items-center justify-center">
                <ClubCrest size={80} customCrestUrl={clubSettings.crestUrl} />
              </div>
            </div>
            <h2 className="font-athletic text-5xl sm:text-6xl font-black uppercase tracking-tight text-white">
              {finalCtaMeta.title || 'STAND WITH THE WARRIORS.'}
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {finalCtaMeta.description ||
                'Support local football, empower talent, and help build the future of Nginda Warriors FC.'}
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/support"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-[#FDE100] hover:bg-[#FFE600] text-black font-athletic font-black text-lg uppercase tracking-wider shadow-md transition"
              >
                <HeartHandshake className="w-5 h-5 text-[#FDE100]" />
                <span>Support the Club</span>
              </Link>
              <Link
                href="/sponsors"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] text-white border-2 border-[#262626] hover:border-[#262626] font-athletic font-bold text-lg uppercase tracking-wider transition shadow-sm"
              >
                <Shield className="w-5 h-5 text-[#FDE100]" />
                <span>Become a Sponsor</span>
              </Link>
              <Link
                href="/membership"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-slate-200 border border-[#262626] font-athletic font-bold text-lg uppercase tracking-wider transition"
              >
                <Users className="w-5 h-5 text-slate-400" />
                <span>Join Our Community</span>
              </Link>
            </div>
          </MotionReveal>
        </section>
      )}
    </div>
  );
}
