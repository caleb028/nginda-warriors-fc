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
      <section className="bg-[#070C09] text-white py-12 border-b border-[#1E2B23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#08783E]/20 border border-[#08783E]/40 text-[#4ADE80] font-pedals font-athletic font-extrabold text-xs uppercase tracking-widest">
              OFFICIAL SQUAD DIRECTORY • EST. {clubSettings.establishedYear}
            </span>
            <h1 className="font-pedals font-athletic text-4xl sm:text-5xl font-black uppercase text-white mt-2">
              THE WARRIORS SQUAD
            </h1>
            <p className="text-slate-300 text-base mt-1">
              First-team players, technical bench, and official club leadership.
            </p>
          </div>
          <Link
            href="/recruitment"
            className="px-6 py-3 rounded-xl bg-[#08783E] hover:bg-[#063B25] text-white font-pedals font-athletic font-black text-base uppercase tracking-wider shadow-md transition active:scale-95"
          >
            Apply for Player Trials →
          </Link>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {players.length > 0 ? (
          POSITION_GROUPS.map((group) => {
            const groupPlayers = players.filter((p) => p.positionGroup === group);
            if (groupPlayers.length === 0) return null;
            return (
              <section key={group}>
                <div className="flex items-center justify-between border-b border-[#1E2B23] pb-3 mb-6">
                  <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-white">
                    {group}
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-[#141E18] text-slate-300 border border-[#1E2B23] font-bold text-xs">
                    {groupPlayers.length} {groupPlayers.length === 1 ? 'Player' : 'Players'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {groupPlayers.map((player) => (
                    <Link
                      key={player.id}
                      href={`/team/${player.slug}`}
                      className="group rounded-2xl overflow-hidden bg-[#0D1410] border border-[#1E2B23] hover:border-[#08783E] shadow-xl transition flex flex-col"
                    >
                      <div className="relative h-64 bg-[#080D0A] flex items-center justify-center overflow-hidden">
                        <span className="absolute top-2 right-4 font-pedals font-athletic text-6xl font-black text-[#15201A] select-none">
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
                        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-[#08783E] text-white font-pedals font-athletic font-black text-xs uppercase tracking-wider shadow-sm">
                          #{player.jerseyNumber} • {player.specificRole}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-pedals font-athletic text-2xl font-black uppercase text-white group-hover:text-[#F5D000] transition-colors">
                            {player.fullName}
                          </h3>
                          <p className="text-xs text-slate-400 font-semibold mt-0.5">
                            Preferred Foot: {player.preferredFoot}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#18231C] grid grid-cols-4 text-center text-xs">
                          <div>
                            <span className="block font-pedals font-athletic text-lg font-black text-[#4ADE80]">
                              {player.appearances}
                            </span>
                            <span className="text-[10px] uppercase text-slate-400 font-bold">
                              Apps
                            </span>
                          </div>
                          <div>
                            <span className="block font-pedals font-athletic text-lg font-black text-[#F5D000]">
                              {player.goals}
                            </span>
                            <span className="text-[10px] uppercase text-slate-400 font-bold">
                              Goals
                            </span>
                          </div>
                          <div>
                            <span className="block font-pedals font-athletic text-lg font-black text-[#4ADE80]">
                              {player.assists}
                            </span>
                            <span className="text-[10px] uppercase text-slate-400 font-bold">
                              Ast
                            </span>
                          </div>
                          <div>
                            <span className="block font-pedals font-athletic text-lg font-black text-[#F5D000]">
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
          <div className="rounded-2xl bg-[#0D1410] border-2 border-dashed border-[#1E2B23] p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-500 mx-auto" />
            <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-white">
              Squad Directory Awaiting Official Publication
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Goalkeepers, Defenders, Midfielders, and Forwards added and published by the Super Admin in the Control Centre appear here automatically.
            </p>
          </div>
        )}

        {/* Technical Bench */}
        <section className="pt-6 border-t border-[#1E2B23]">
          <div className="flex items-center gap-2 mb-6">
            <UserCheck className="w-6 h-6 text-[#4ADE80]" />
            <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-white">
              Technical Bench & Coaching Staff
            </h2>
          </div>
          {technicalBench.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {technicalBench.map((coach) => (
                <div
                  key={coach.id}
                  className="bg-[#0D1410] rounded-2xl p-6 border border-[#1E2B23] shadow-xl"
                >
                  <span className="px-2.5 py-0.5 rounded-full bg-[#08783E]/20 text-[#4ADE80] border border-[#08783E]/40 font-pedals font-athletic font-bold text-xs uppercase tracking-wider">
                    {coach.roleTitle}
                  </span>
                  <h3 className="font-pedals font-athletic text-2xl font-black uppercase text-white mt-3">
                    {coach.fullName}
                  </h3>
                  <p className="text-sm text-slate-300 mt-2">{coach.biography}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 bg-[#0D1410] p-6 rounded-xl border border-[#1E2B23]">
              Technical Bench profiles (Head Coach, Assistant Coach, Goalkeeper Coach, Team Manager) will appear here once published.
            </p>
          )}
        </section>

        {/* Club Leadership */}
        <section className="pt-6 border-t border-[#1E2B23]">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-[#F5D000]" />
            <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-white">
              Executive Club Leadership
            </h2>
          </div>
          {clubLeadership.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {clubLeadership.map((official) => (
                <div
                  key={official.id}
                  className="bg-[#0D1410] rounded-2xl p-6 border border-[#1E2B23] shadow-xl"
                >
                  <span className="px-2.5 py-0.5 rounded-full bg-[#141E18] text-slate-300 border border-[#1E2B23] font-pedals font-athletic font-bold text-xs uppercase tracking-wider">
                    {official.roleTitle}
                  </span>
                  <h3 className="font-pedals font-athletic text-2xl font-black uppercase text-white mt-3">
                    {official.fullName}
                  </h3>
                  <p className="text-sm text-slate-300 mt-2">{official.biography}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 bg-[#0D1410] p-6 rounded-xl border border-[#1E2B23]">
              Club Executive profiles (Chairman, Secretary, Treasurer, and Club Officials) will appear here once published.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
