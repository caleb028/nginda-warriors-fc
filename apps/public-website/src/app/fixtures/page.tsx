import React from 'react';
import Link from 'next/link';
import { ClubCrest, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { ArrowRight, Calendar, Clock, MapPin, Trophy } from 'lucide-react';

export const dynamic = 'force-dynamic';

function formatEatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-KE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Nairobi',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function FixturesAndResultsPage() {
  const { clubSettings, liveFixtures, upcomingFixtures, completedFixtures } =
    getPublicWebsiteSnapshot();

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header Banner - White Dominant */}
      <section className="bg-slate-50 text-slate-900 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#08783E]/10 border border-[#08783E]/20 text-[#08783E] font-pedals font-athletic font-extrabold text-xs uppercase tracking-widest">
              AFRICA/NAIROBI TIMEZONE (EAT) • OFFICIAL SCHEDULE
            </span>
            <h1 className="font-pedals font-athletic text-4xl sm:text-5xl font-black uppercase text-slate-950 mt-2">
              FIXTURES, RESULTS & MATCH CENTRE
            </h1>
            <p className="text-slate-600 text-base mt-1">
              Upcoming matches, live matchday score updates, lineups, and verified match reports.
            </p>
          </div>
          <div className="p-2 rounded-full bg-white border border-slate-200 shadow-sm">
            <ClubCrest size={80} customCrestUrl={clubSettings.crestUrl} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Live Matches (If Any Active) */}
        {liveFixtures.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-slate-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping inline-block" />
              <span>Live Match Centre In Progress</span>
            </h2>
            {liveFixtures.map((match) => (
              <Link
                key={match.id}
                href={`/fixtures/${match.id}`}
                className="block rounded-2xl bg-white text-slate-900 p-6 border-2 border-red-500 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#08783E] font-bold uppercase mb-4">
                  <span>
                    {match.competitionName} • {match.seasonName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-pedals font-bold">
                    LIVE • {match.matchStatus.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center text-center">
                  <div>
                    <p className="font-pedals font-athletic text-2xl sm:text-3xl font-black uppercase text-slate-900">
                      {match.isHome ? clubSettings.clubName : match.opponentName}
                    </p>
                  </div>
                  <div className="font-pedals font-athletic text-4xl sm:text-5xl font-black text-slate-900">
                    {match.homeScore ?? 0} - {match.awayScore ?? 0}
                  </div>
                  <div>
                    <p className="font-pedals font-athletic text-2xl sm:text-3xl font-black uppercase text-slate-900">
                      {match.isHome ? match.opponentName : clubSettings.clubName}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}

        {/* Upcoming Matches */}
        <section>
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
            <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-slate-950">
              Upcoming Fixtures
            </h2>
            <span className="text-xs font-bold uppercase text-[#08783E] bg-[#08783E]/10 px-2.5 py-0.5 rounded-full">
              {upcomingFixtures.length} Scheduled
            </span>
          </div>

          {upcomingFixtures.length > 0 ? (
            <div className="space-y-4">
              {upcomingFixtures.map((fixture) => (
                <div
                  key={fixture.id}
                  className="rounded-2xl bg-white border border-slate-200 hover:border-[#08783E]/40 p-6 shadow-sm transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded text-xs font-pedals font-athletic font-black uppercase tracking-wider ${
                          fixture.isHome
                            ? 'bg-[#08783E] text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {fixture.isHome ? 'HOME' : 'AWAY'}
                      </span>
                      <span className="text-xs font-bold text-[#08783E] uppercase">
                        {fixture.competitionName} • {fixture.seasonName}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <span className="font-pedals font-athletic text-2xl sm:text-3xl font-black uppercase text-slate-900">
                        {fixture.isHome ? clubSettings.clubName : fixture.opponentName}
                      </span>
                      <span className="px-3 py-0.5 rounded bg-slate-100 text-slate-700 font-pedals font-athletic font-black text-base border border-slate-200">
                        VS
                      </span>
                      <span className="font-pedals font-athletic text-2xl sm:text-3xl font-black uppercase text-slate-900">
                        {fixture.isHome ? fixture.opponentName : clubSettings.clubName}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#08783E]" />
                        {formatEatDate(fixture.kickoffAt)} (EAT)
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#08783E]" />
                        {fixture.venue}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/fixtures/${fixture.id}`}
                    className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#08783E] hover:bg-[#063B25] text-white font-pedals font-athletic font-bold text-sm uppercase tracking-wider transition shadow-sm"
                  >
                    <span>Match Centre</span>
                    <ArrowRight className="w-4 h-4 text-[#F5D000]" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-10 text-center border border-slate-200">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="font-pedals font-athletic text-2xl font-bold uppercase text-slate-800">
                No Upcoming Fixtures Published Yet
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Fixtures created and published in the Control Centre appear here automatically.
              </p>
            </div>
          )}
        </section>

        {/* Completed Results */}
        <section>
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
            <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-slate-950">
              Verified Match Results
            </h2>
            <span className="text-xs font-bold uppercase text-[#08783E] bg-[#08783E]/10 px-2.5 py-0.5 rounded-full">
              {completedFixtures.length} Completed
            </span>
          </div>

          {completedFixtures.length > 0 ? (
            <div className="space-y-4">
              {completedFixtures.map((result) => (
                <div
                  key={result.id}
                  className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-slate-300 transition"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-pedals font-athletic font-bold uppercase border border-slate-200">
                        FULL TIME (FT)
                      </span>
                      <span className="font-bold text-slate-500">
                        {result.competitionName} • {formatEatDate(result.kickoffAt)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <span className="font-pedals font-athletic text-2xl sm:text-3xl font-black uppercase text-slate-900">
                        {result.isHome ? clubSettings.clubName : result.opponentName}
                      </span>
                      <span className="px-4 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[#08783E] font-pedals font-athletic font-black text-2xl">
                        {result.homeScore ?? 0} - {result.awayScore ?? 0}
                      </span>
                      <span className="font-pedals font-athletic text-2xl sm:text-3xl font-black uppercase text-slate-900">
                        {result.isHome ? result.opponentName : clubSettings.clubName}
                      </span>
                    </div>

                    {result.events.filter((e) => ['goal', 'penalty_goal'].includes(e.eventType))
                      .length > 0 && (
                      <p className="text-xs text-slate-600">
                        <strong className="text-[#08783E]">Goals:</strong>{' '}
                        {result.events
                          .filter((e) => ['goal', 'penalty_goal'].includes(e.eventType))
                          .map((e) => `${e.playerName} (${e.minute}')`)
                          .join(', ')}
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/fixtures/${result.id}`}
                    className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-[#08783E] text-white font-pedals font-athletic font-black text-sm uppercase tracking-wider transition shadow-sm"
                  >
                    <span>Report & Timeline</span>
                    <ArrowRight className="w-4 h-4 text-[#F5D000]" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-10 text-center border border-slate-200">
              <Trophy className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="font-pedals font-athletic text-2xl font-bold uppercase text-slate-800">
                No Completed Match Results Yet
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Final scores and match reports appear here once matches are marked Fulltime in the Control Centre.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
