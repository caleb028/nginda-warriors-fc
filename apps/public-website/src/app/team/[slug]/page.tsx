import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ClubCrest, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function PlayerProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const { clubSettings, players } = getPublicWebsiteSnapshot();
  const player = players.find((p) => p.slug === params.slug);

  if (!player) {
    notFound();
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Player Hero Banner */}
      <section className="bg-gradient-to-r from-black via-[#070C09] to-black text-white py-14 border-b border-[#262626]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FDE100] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Full Squad Directory</span>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div className="w-64 h-72 rounded-2xl bg-[#0D0D0D] border-2 border-[#262626] overflow-hidden flex items-center justify-center relative shadow-2xl">
                {player.photoUrl ? (
                  <img
                    src={player.photoUrl}
                    alt={player.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ClubCrest size={120} customCrestUrl={clubSettings.crestUrl} />
                )}
                <span className="absolute bottom-3 right-3 px-3 py-1 rounded bg-[#FDE100] text-black font-athletic font-black text-2xl shadow-md">
                  #{player.jerseyNumber}
                </span>
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#FDE100]/10 text-[#FDE100] border border-[#FDE100]/30 font-athletic font-black text-xs uppercase tracking-wider">
                  {player.positionGroup} • {player.specificRole}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#1A1A1A] text-slate-300 border border-[#262626] text-xs font-bold uppercase">
                  Preferred Foot: {player.preferredFoot}
                </span>
                {player.isUnderageProtected && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Youth Safeguarded Profile
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-4">
                <span className="font-athletic text-6xl sm:text-7xl font-black text-[#FDE100]">
                  #{player.jerseyNumber}
                </span>
                <h1 className="font-athletic text-5xl sm:text-6xl font-black uppercase tracking-tight text-white">
                  {player.fullName}
                </h1>
              </div>

              <p className="text-slate-300 text-base leading-relaxed max-w-2xl">
                {player.biography}
              </p>

              {/* Career / Current Season Key Figures */}
              <div className="pt-4 grid grid-cols-3 sm:grid-cols-6 gap-3">
                {[
                  { label: 'Appearances', value: player.appearances },
                  { label: 'Starts', value: player.starts },
                  { label: 'Goals', value: player.goals },
                  { label: 'Assists', value: player.assists },
                  { label: 'Clean Sheets', value: player.cleanSheets },
                  { label: 'Yellow / Red', value: `${player.yellowCards} / ${player.redCards}` },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[#141414] border border-[#262626] rounded-xl p-3 text-center shadow-md"
                  >
                    <span className="block font-athletic text-3xl font-black text-[#FDE100]">
                      {stat.value}
                    </span>
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-0.5">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Season-Specific Statistics Table */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-athletic text-3xl font-black uppercase text-white mb-4">
          Verified Season Statistics
        </h2>
        <div className="bg-[#141414] rounded-2xl border border-[#262626] overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0D0D0D] text-[#FDE100] font-athletic text-sm uppercase tracking-wider border-b border-[#262626]">
                <th className="py-3.5 px-4">Season / Competition</th>
                <th className="py-3.5 px-4 text-center">Apps</th>
                <th className="py-3.5 px-4 text-center">Starts</th>
                <th className="py-3.5 px-4 text-center">Goals</th>
                <th className="py-3.5 px-4 text-center">Assists</th>
                <th className="py-3.5 px-4 text-center">Clean Sheets</th>
                <th className="py-3.5 px-4 text-center">YC / RC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18231C] text-sm">
              <tr className="font-semibold bg-[#1A1A1A]">
                <td className="py-3.5 px-4 text-white">Current Club Record</td>
                <td className="py-3.5 px-4 text-center">{player.appearances}</td>
                <td className="py-3.5 px-4 text-center">{player.starts}</td>
                <td className="py-3.5 px-4 text-center font-bold text-[#FDE100]">{player.goals}</td>
                <td className="py-3.5 px-4 text-center">{player.assists}</td>
                <td className="py-3.5 px-4 text-center">{player.cleanSheets}</td>
                <td className="py-3.5 px-4 text-center">
                  {player.yellowCards} / {player.redCards}
                </td>
              </tr>
              {player.seasonStats.map((s, i) => (
                <tr key={i} className="text-slate-300 hover:bg-[#1A1A1A]">
                  <td className="py-3 px-4 text-white">
                    {s.seasonName} — {s.competitionName}
                  </td>
                  <td className="py-3 px-4 text-center">{s.appearances}</td>
                  <td className="py-3 px-4 text-center">{s.starts}</td>
                  <td className="py-3 px-4 text-center">{s.goals}</td>
                  <td className="py-3 px-4 text-center">{s.assists}</td>
                  <td className="py-3 px-4 text-center">{s.cleanSheets}</td>
                  <td className="py-3 px-4 text-center">
                    {s.yellowCards} / {s.redCards}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
