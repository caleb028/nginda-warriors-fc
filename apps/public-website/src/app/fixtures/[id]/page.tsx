import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ClubCrest, Player, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { MotmVoteWidget } from '../../../components/MotmVoteWidget';
import { TacticalPitchBoard, TacticalPitchPlayer } from '../../../components/TacticalPitchBoard';
import { ArrowLeft, Calendar, Clock, FileText, MapPin, Shield, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function SingleMatchCentrePage({
  params,
}: {
  params: { id: string };
}) {
  const {
    clubSettings,
    upcomingFixtures,
    liveFixtures,
    completedFixtures,
    players,
    motmPollSummary,
  } = getPublicWebsiteSnapshot();

  const allPublished = [...liveFixtures, ...upcomingFixtures, ...completedFixtures];
  const fixture = allPublished.find((f) => f.id === params.id);

  if (!fixture) {
    notFound();
  }

  const starters = fixture.lineups.filter((l) => l.isStarting);
  const substitutes = fixture.lineups.filter((l) => !l.isStarting);
  const sortedEvents = [...fixture.events].sort((a, b) => a.minute - b.minute);

  const squadMap = new Map(players.map((p) => [p.id, p]));
  const startingXI: (Player | TacticalPitchPlayer)[] =
    starters.length > 0
      ? starters.map(
          (l) =>
            (l.playerId ? squadMap.get(l.playerId) : null) || {
              id: l.playerId || l.playerName,
              fullName: l.playerName,
              slug: l.playerName.toLowerCase().replace(/\s+/g, '-'),
              jerseyNumber: l.jerseyNumber,
              position: l.position,
              biography: '',
              appearances: 1,
              goals: 0,
              assists: 0,
            }
        )
      : players.slice(0, 11);

  const benchXI: (Player | TacticalPitchPlayer)[] =
    substitutes.length > 0
      ? substitutes.map(
          (l) =>
            (l.playerId ? squadMap.get(l.playerId) : null) || {
              id: l.playerId || l.playerName,
              fullName: l.playerName,
              slug: l.playerName.toLowerCase().replace(/\s+/g, '-'),
              jerseyNumber: l.jerseyNumber,
              position: l.position,
              biography: '',
              appearances: 0,
              goals: 0,
              assists: 0,
            }
        )
      : players.slice(11, 18);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Match Scoreboard Header */}
      <section className="bg-[#070C09] text-white py-12 border-b border-[#1E2B23]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/fixtures"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F5D000] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Fixtures & Results</span>
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#4ADE80] font-bold uppercase mb-6">
            <span>
              {fixture.competitionName} • {fixture.seasonName}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#08783E] text-white font-athletic font-black shadow-sm">
              {fixture.matchStatus.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-3 items-center gap-4 bg-[#0D1410] border-2 border-[#1E2B23] rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
            <div>
              <div className="flex justify-center mb-3">
                {fixture.isHome ? (
                  <ClubCrest size={76} customCrestUrl={clubSettings.crestUrl} />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#141E18] border-2 border-[#F5D000] flex items-center justify-center font-athletic font-black text-2xl text-[#F5D000]">
                    {fixture.opponentName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <h1 className="font-athletic text-2xl sm:text-4xl font-black uppercase text-white">
                {fixture.isHome ? clubSettings.clubName : fixture.opponentName}
              </h1>
              <span className="text-[11px] text-slate-400 uppercase font-bold">Home</span>
            </div>

            <div>
              {typeof fixture.homeScore === 'number' && typeof fixture.awayScore === 'number' ? (
                <div className="font-athletic text-5xl sm:text-7xl font-black text-[#F5D000]">
                  {fixture.homeScore} : {fixture.awayScore}
                </div>
              ) : (
                <div className="font-athletic text-3xl sm:text-5xl font-black text-[#F5D000]">
                  VS
                </div>
              )}
              <p className="text-xs text-slate-300 mt-2 font-semibold">
                {new Intl.DateTimeFormat('en-KE', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                  timeZone: 'Africa/Nairobi',
                }).format(new Date(fixture.kickoffAt))}{' '}
                (EAT)
              </p>
            </div>

            <div>
              <div className="flex justify-center mb-3">
                {!fixture.isHome ? (
                  <ClubCrest size={76} customCrestUrl={clubSettings.crestUrl} />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#141E18] border-2 border-[#F5D000] flex items-center justify-center font-athletic font-black text-2xl text-[#F5D000]">
                    {fixture.opponentName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <h2 className="font-athletic text-2xl sm:text-4xl font-black uppercase text-white">
                {fixture.isHome ? fixture.opponentName : clubSettings.clubName}
              </h2>
              <span className="text-[11px] text-slate-400 uppercase font-bold">Away</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#F5D000]" />
              Venue: {fixture.venue}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#F5D000]" />
              Timezone: {fixture.timezone}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Tactical Pitch Formation View */}
          <TacticalPitchBoard
            startingPlayers={startingXI}
            benchPlayers={benchXI}
            defaultFormation="4-3-3"
          />

          {/* Match Timeline & Events */}
          <div className="bg-[#0D1410] rounded-2xl p-6 border border-[#1E2B23] shadow-xl text-white">
            <div className="flex items-center gap-2 text-[#4ADE80] font-athletic font-bold uppercase text-sm mb-3">
              <Clock className="w-4 h-4 text-[#F5D000]" />
              <span>Official Match Events</span>
            </div>
            <h3 className="font-athletic text-2xl font-black uppercase text-white mb-4">
              Match Timeline
            </h3>

            {sortedEvents.length > 0 ? (
              <div className="space-y-3">
                {sortedEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#080D0A] border border-[#18231C] text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded bg-[#08783E] text-white font-athletic font-black text-sm shadow-xs">
                        {ev.minute}&apos;{ev.addedTime ? `+${ev.addedTime}` : ''}
                      </span>
                      <div>
                        <span className="font-bold text-white">{ev.playerName}</span>
                        {ev.secondaryPlayerName && (
                          <span className="text-xs text-slate-400">
                            {' '}
                            (Assist / Sub: {ev.secondaryPlayerName})
                          </span>
                        )}
                        {ev.notes && (
                          <p className="text-xs text-slate-400 mt-0.5">{ev.notes}</p>
                        )}
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-[#141E18] text-[#F5D000] border border-[#1E2B23] text-xs font-bold uppercase">
                      {ev.eventType.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                Match events (goals, cards, substitutions, halftime/fulltime markers) appear here as recorded by Match Officials.
              </p>
            )}
          </div>

          {/* Official Match Report */}
          {fixture.report && (
            <div className="bg-[#0D1410] rounded-2xl p-6 border border-[#1E2B23] shadow-xl space-y-3 text-white">
              <div className="flex items-center gap-2 text-[#4ADE80] font-athletic font-bold uppercase text-sm">
                <FileText className="w-4 h-4 text-[#F5D000]" />
                <span>Verified Match Report</span>
              </div>
              <h3 className="font-athletic text-3xl font-black uppercase text-white">
                {fixture.report.headline}
              </h3>
              <p className="text-sm font-semibold text-slate-300">{fixture.report.summary}</p>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line pt-2 border-t border-[#18231C]">
                {fixture.report.body}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Lineups & Man of the Match Voting */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0D1410] rounded-2xl p-6 border border-[#1E2B23] shadow-xl text-white">
            <div className="flex items-center gap-2 text-[#4ADE80] font-athletic font-bold uppercase text-sm mb-2">
              <Users className="w-4 h-4 text-[#F5D000]" />
              <span>Team Sheet</span>
            </div>
            <h3 className="font-athletic text-2xl font-black uppercase text-white mb-4">
              Nginda Warriors Lineup
            </h3>

            {starters.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-extrabold uppercase text-[#F5D000] mb-2">
                    Starting XI
                  </p>
                  <ul className="space-y-1.5 text-sm">
                    {starters.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between py-1 px-2.5 rounded bg-[#080D0A] border border-[#18231C]"
                      >
                        <span className="font-bold text-white">
                          #{p.jerseyNumber} {p.playerName}{' '}
                          {p.isCaptain && (
                            <span className="px-1.5 py-0.2 rounded bg-[#F5D000] text-slate-950 text-[10px] font-black">
                              C
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-slate-400">{p.position}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {substitutes.length > 0 && (
                  <div>
                    <p className="text-xs font-extrabold uppercase text-[#F5D000] mb-2">
                      Substitutes
                    </p>
                    <ul className="space-y-1.5 text-sm">
                      {substitutes.map((p) => (
                        <li
                          key={p.id}
                          className="flex items-center justify-between py-1 px-2.5 rounded bg-[#080D0A] border border-[#18231C]"
                        >
                          <span className="font-medium text-slate-300">
                            #{p.jerseyNumber} {p.playerName}
                          </span>
                          <span className="text-xs text-slate-500">{p.position}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Official matchday starting lineup and substitutes will be published here prior to kickoff.
              </p>
            )}
          </div>

          <MotmVoteWidget
            fixtureId={fixture.id}
            players={players}
            pollSummary={motmPollSummary[fixture.id]}
          />
        </div>
      </div>
    </div>
  );
}
