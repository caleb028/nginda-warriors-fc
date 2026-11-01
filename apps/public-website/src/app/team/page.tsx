import React from 'react';
import Link from 'next/link';
import { ClubCrest, PositionGroup, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { ArrowRight, Shield, UserCheck, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

const POSITION_GROUPS: PositionGroup[] = [
  'Goalkeepers',
  'Defenders',
  'Midfielders',
  'Forwards',
];

export default function TeamSquadPage() {
  const { clubSettings, players, staff } = getPublicWebsiteSnapshot();

  const technicalBench = staff.filter((s) => s.category === 'Technical Bench');
  const clubLeadership = staff.filter((s) => s.category === 'Club Leadership');

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#0A0A0A] text-white py-12 border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#FDE100]/10 border border-[#FDE100]/30 text-[#FDE100] font-athletic font-extrabold text-xs uppercase tracking-widest">
              OFFICIAL SQUAD DIRECTORY • EST. {clubSettings.establishedYear}
            </span>
            <h1 className="font-athletic text-4xl sm:text-5xl font-black uppercase text-white mt-2">
              THE WARRIORS SQUAD
            </h1>
            <p className="text-slate-300 text-base mt-1">
              First-team players, technical bench, and official club leadership.
            </p>
          </div>
          <Link
            href="/recruitment"
            className="px-6 py-3 rounded-xl bg-[#FDE100] hover:bg-[#FFE600] text-black font-athletic font-black text-base uppercase tracking-wider shadow-md transition active:scale-95"
          >
            Apply for Player Trials →
          </Link>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Squad in Action Photography Showcase (Genuine Photos Without Hypothetical Names or Data) */}
        <section>
          <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-6">
            <div>
              <span className="text-xs font-athletic font-extrabold uppercase tracking-widest text-[#FDE100]">
                AUTHENTIC SQUAD MOMENTS • PITCH & MATCHDAY
              </span>
              <h2 className="font-athletic text-3xl font-black uppercase text-white mt-1">
                WARRIORS SQUAD IN ACTION
              </h2>
            </div>
            <Link
              href="/gallery"
              className="text-xs font-athletic font-bold uppercase text-[#FDE100] hover:underline"
            >
              View Full Gallery →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl overflow-hidden bg-[#141414] border border-[#262626] hover:border-[#FDE100] shadow-xl transition flex flex-col group">
              <div className="relative h-72 bg-[#0D0D0D] overflow-hidden">
                <img
                  src="/uploads/hero-matchday-warriors.jpg"
                  alt="Nginda Warriors FC Matchday Squad"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-[#141414] border border-[#262626] hover:border-[#FDE100] shadow-xl transition flex flex-col group">
              <div className="relative h-72 bg-[#0D0D0D] overflow-hidden">
                <img
                  src="/uploads/warriors-match-players.png"
                  alt="Nginda Warriors FC Pitch Squad"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-[#141414] border border-[#262626] hover:border-[#FDE100] shadow-xl transition flex flex-col group">
              <div className="relative h-72 bg-[#0D0D0D] overflow-hidden">
                <img
                  src="/uploads/team-huddle-warriors.jpg"
                  alt="Nginda Warriors FC Squad Huddle"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-[#141414] border border-[#262626] hover:border-[#FDE100] shadow-xl transition flex flex-col group">
              <div className="relative h-72 bg-[#0D0D0D] overflow-hidden">
                <img
                  src="/uploads/club-official-patron.jpg"
                  alt="Nginda Warriors FC Club Leadership"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {players.length > 0 ? (
          POSITION_GROUPS.map((group) => {
            const groupPlayers = players.filter((p) => p.positionGroup === group);
            if (groupPlayers.length === 0) return null;
            return (
              <section key={group}>
                <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-6">
                  <h2 className="font-athletic text-3xl font-black uppercase text-white">
                    {group}
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-[#1A1A1A] text-slate-300 border border-[#262626] font-bold text-xs">
                    {groupPlayers.length} {groupPlayers.length === 1 ? 'Player' : 'Players'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {groupPlayers.map((player) => (
                    <Link
                      key={player.id}
                      href={`/team/${player.slug}`}
                      className="group rounded-2xl overflow-hidden bg-[#141414] border border-[#262626] hover:border-[#262626] shadow-xl transition flex flex-col"
                    >
                      <div className="relative h-64 bg-[#0D0D0D] flex items-center justify-center overflow-hidden">
                        <span className="absolute top-2 right-4 font-athletic text-6xl font-black text-[#15201A] select-none">
                          #{player.jerseyNumber}
                        </span>
                        {player.photoUrl ? (
                          <img
                            src={player.photoUrl}
                            alt={player.fullName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <ClubCrest size={92} customCrestUrl={clubSettings.crestUrl} />
                        )}
                        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-[#FDE100] text-black font-athletic font-black text-xs uppercase tracking-wider shadow-sm">
                          #{player.jerseyNumber} • {player.specificRole}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-athletic text-2xl font-black uppercase text-white group-hover:text-[#FDE100] transition-colors">
                            {player.fullName}
                          </h3>
                          <p className="text-xs text-slate-400 font-semibold mt-0.5">
                            Preferred Foot: {player.preferredFoot}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#262626] grid grid-cols-4 text-center text-xs">
                          <div>
                            <span className="block font-athletic text-lg font-black text-[#FDE100]">
                              {player.appearances}
                            </span>
                            <span className="text-[10px] uppercase text-slate-400 font-bold">
                              Apps
                            </span>
                          </div>
                          <div>
                            <span className="block font-athletic text-lg font-black text-[#FDE100]">
                              {player.goals}
                            </span>
                            <span className="text-[10px] uppercase text-slate-400 font-bold">
                              Goals
                            </span>
                          </div>
                          <div>
                            <span className="block font-athletic text-lg font-black text-[#FDE100]">
                              {player.assists}
                            </span>
                            <span className="text-[10px] uppercase text-slate-400 font-bold">
                              Ast
                            </span>
                          </div>
                          <div>
                            <span className="block font-athletic text-lg font-black text-[#FDE100]">
                              {player.positionGroup === 'Goalkeepers'
                                ? player.cleanSheets
                                : player.starts}
                            </span>
                            <span className="text-[10px] uppercase text-slate-400 font-bold">
                              {player.positionGroup === 'Goalkeepers' ? 'CS' : 'Starts'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div className="rounded-2xl bg-[#141414] border border-[#262626] p-8 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="font-athletic text-2xl font-bold uppercase text-white">
              Official Squad Profiles Being Prepared
            </h3>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Nginda Warriors FC upholds strict integrity and does not publish fabricated player data. Individual player profiles with verified squad numbers and statistics will be displayed here once approved in the Control Centre.
            </p>
          </div>
        )}

        {/* Technical Bench */}
        <section className="pt-6 border-t border-[#262626]">
          <div className="flex items-center gap-2 mb-6">
            <UserCheck className="w-6 h-6 text-[#FDE100]" />
            <h2 className="font-athletic text-3xl font-black uppercase text-white">
              Technical Bench & Coaching Staff
            </h2>
          </div>
          {technicalBench.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {technicalBench.map((coach) => (
                <div
                  key={coach.id}
                  className="bg-[#141414] rounded-2xl overflow-hidden border border-[#262626] shadow-xl flex flex-col justify-between group hover:border-[#FDE100] transition-all"
                >
                  {coach.photoUrl ? (
                    <div className="relative h-72 bg-[#0D0D0D] overflow-hidden">
                      <img
                        src={coach.photoUrl}
                        alt={coach.fullName}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-3 left-3 px-3 py-1 rounded bg-[#FDE100] text-black font-athletic font-black text-xs uppercase tracking-wider shadow-sm">
                        {coach.roleTitle}
                      </div>
                    </div>
                  ) : null}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {!coach.photoUrl && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FDE100]/10 text-[#FDE100] border border-[#FDE100]/30 font-athletic font-bold text-xs uppercase tracking-wider">
                          {coach.roleTitle}
                        </span>
                      )}
                      <h3 className="font-athletic text-2xl font-black uppercase text-white group-hover:text-[#FDE100] transition-colors mt-1">
                        {coach.fullName}
                      </h3>
                      <p className="text-sm text-slate-300 mt-2 leading-relaxed">{coach.biography}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 bg-[#141414] p-6 rounded-xl border border-[#262626]">
              Technical Bench profiles (Head Coach, Assistant Coach, Goalkeeper Coach, Team Manager) will appear here once published.
            </p>
          )}
        </section>

        {/* Club Leadership */}
        <section className="pt-6 border-t border-[#262626]">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-[#FDE100]" />
            <h2 className="font-athletic text-3xl font-black uppercase text-white">
              Executive Club Leadership
            </h2>
          </div>
          {clubLeadership.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {clubLeadership.map((official) => (
                <div
                  key={official.id}
                  className="bg-[#141414] rounded-2xl overflow-hidden border border-[#262626] shadow-xl flex flex-col justify-between group hover:border-[#FDE100] transition-all"
                >
                  {official.photoUrl ? (
                    <div className="relative h-72 bg-[#0D0D0D] overflow-hidden">
                      <img
                        src={official.photoUrl}
                        alt={official.fullName}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-3 left-3 px-3 py-1 rounded bg-[#1A1A1A] text-slate-200 border border-[#262626] font-athletic font-bold text-xs uppercase tracking-wider shadow-sm">
                        {official.roleTitle}
                      </div>
                    </div>
                  ) : null}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {!official.photoUrl && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#1A1A1A] text-slate-300 border border-[#262626] font-athletic font-bold text-xs uppercase tracking-wider">
                          {official.roleTitle}
                        </span>
                      )}
                      <h3 className="font-athletic text-2xl font-black uppercase text-white group-hover:text-[#FDE100] transition-colors mt-1">
                        {official.fullName}
                      </h3>
                      <p className="text-sm text-slate-300 mt-2 leading-relaxed">{official.biography}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 bg-[#141414] p-6 rounded-xl border border-[#262626]">
              Club Executive profiles (Chairman, Secretary, Treasurer, and Club Officials) will appear here once published.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
