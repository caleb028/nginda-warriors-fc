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
    <div className="bg-[#FFFDF2] min-h-screen">
      {/* Player Hero Banner */}
      <section className="bg-gradient-to-r from-[#063B25] via-[#08783E] to-[#063B25] text-white py-14 border-b-4 border-[#F5D000]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F5D000] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Full Squad Directory</span>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div className="w-64 h-72 rounded-2xl bg-[#063B25] border-2 border-[#F5D000] overflow-hidden flex items-center justify-center relative shadow-2xl">
                {player.photoUrl ? (
                  <img
                    src={player.photoUrl}
                    alt={player.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ClubCrest size={120} customCrestUrl={clubSettings.crestUrl} />
                )}
                <span className="absolute bottom-3 right-3 px-3 py-1 rounded bg-[#F5D000] text-[#063B25] font-athletic font-black text-2xl">
                  #{player.jerseyNumber}
                </span>
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#F5D000] text-[#063B25] font-athletic font-black text-xs uppercase tracking-wider">
                  {player.positionGroup} • {player.specificRole}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-emerald-100 text-xs font-bold uppercase">
                  Preferred Foot: {player.preferredFoot}
                </span>
                {player.isUnderageProtected && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300 text-amber-200 text-xs font-bold">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Youth Safeguarded Profile
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-4">
                <span className="font-athletic text-6xl sm:text-7xl font-black text-[#F5D000]">
                  #{player.jerseyNumber}
                </span>
                <h1 className="font-athletic text-5xl sm:text-6xl font-black uppercase tracking-tight">
                  {player.fullName}
                </h1>
              </div>

              <p className="text-emerald-50 text-base leading-relaxed max-w-2xl">
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
                    className="bg-[#063B25]/80 border border-[#F5D000]/40 rounded-xl p-3 text-center"
                  >
                    <span className="block font-athletic text-3xl font-black text-[#F5D000]">
                      {stat.value}
                    </span>
                    <span className="block text-[10px] uppercase tracking-wider text-emerald-100 font-bold mt-0.5">
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
        <h2 className="font-athletic text-3xl font-black uppercase text-[#063B25] mb-4">
          Verified Season Statistics
        </h2>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#063B25] text-[#F5D000] font-athletic text-sm uppercase tracking-wider">
                <th className="py-3.5 px-4">Season / Competition</th>
                <th className="py-3.5 px-4 text-center">Apps</th>
                <th className="py-3.5 px-4 text-center">Starts</th>
                <th className="py-3.5 px-4 text-center">Goals</th>
                <th className="py-3.5 px-4 text-center">Assists</th>
                <th className="py-3.5 px-4 text-center">Clean Sheets</th>
                <th className="py-3.5 px-4 text-center">YC / RC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              <tr className="font-semibold bg-[#EEF7EF]/50">
                <td className="py-3.5 px-4 text-[#063B25]">Current Club Record</td>
                <td className="py-3.5 px-4 text-center">{player.appearances}</td>
                <td className="py-3.5 px-4 text-center">{player.starts}</td>
                <td className="py-3.5 px-4 text-center font-bold text-[#08783E]">{player.goals}</td>
                <td className="py-3.5 px-4 text-center">{player.assists}</td>
                <td className="py-3.5 px-4 text-center">{player.cleanSheets}</td>
                <td className="py-3.5 px-4 text-center">
                  {player.yellowCards} / {player.redCards}
                </td>
              </tr>
              {player.seasonStats.map((s, i) => (
                <tr key={i}>
                  <td className="py-3 px-4">
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
