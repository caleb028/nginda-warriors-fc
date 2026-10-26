import React from 'react';
import { ClubCrest, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { Award, Info } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function LeagueStandingsPage() {
  const { clubSettings, standings, competitions } = getPublicWebsiteSnapshot();

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header Banner - Crisp White Canvas */}
      <section className="bg-slate-50 text-slate-900 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#08783E]/10 border border-[#08783E]/20 text-[#08783E] font-pedals font-athletic font-extrabold text-xs uppercase tracking-widest">
              OFFICIAL COMPETITION TABLE
            </span>
            <h1 className="font-pedals font-athletic text-4xl sm:text-5xl font-black uppercase text-slate-950 mt-2">
              LEAGUE STANDINGS
            </h1>
            <p className="text-slate-600 text-base mt-1">
              Competition standings with Nginda Warriors FC highlighted in official club colours.
            </p>
          </div>
          <div className="p-2 rounded-full bg-white border border-slate-200 shadow-sm">
            <ClubCrest size={80} customCrestUrl={clubSettings.crestUrl} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {standings.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-pedals font-athletic text-2xl font-black uppercase text-slate-900">
                  {standings[0].competitionName} — {standings[0].seasonName}
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                Tiebreaker: Points &gt; Goal Difference (GD) &gt; Goals For (GF)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-pedals font-athletic text-sm font-black uppercase border-b border-slate-200">
                    <th className="py-3.5 px-4">Pos</th>
                    <th className="py-3.5 px-4">Club</th>
                    <th className="py-3.5 px-3 text-center">P</th>
                    <th className="py-3.5 px-3 text-center">W</th>
                    <th className="py-3.5 px-3 text-center">D</th>
                    <th className="py-3.5 px-3 text-center">L</th>
                    <th className="py-3.5 px-3 text-center">GF</th>
                    <th className="py-3.5 px-3 text-center">GA</th>
                    <th className="py-3.5 px-3 text-center">GD</th>
                    <th className="py-3.5 px-4 text-center">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {standings.map((row) => {
                    const isWarriors =
                      row.isNgindaWarriors ||
                      row.clubName.toLowerCase().includes('nginda warriors');
                    return (
                      <tr
                        key={row.id}
                        className={
                          isWarriors
                            ? 'bg-[#08783E]/10 text-slate-900 font-bold border-l-4 border-l-[#08783E]'
                            : 'hover:bg-slate-50 text-slate-700'
                        }
                      >
                        <td className="py-3.5 px-4 font-pedals font-athletic text-lg font-black">
                          <span
                            className={
                              isWarriors
                                ? 'px-2.5 py-0.5 rounded-full bg-[#08783E] text-white shadow-xs'
                                : ''
                            }
                          >
                            {row.position}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 flex items-center gap-2.5">
                          {isWarriors && (
                            <ClubCrest size={26} customCrestUrl={clubSettings.crestUrl} />
                          )}
                          <span className="font-pedals font-athletic text-lg uppercase tracking-wide text-slate-900">
                            {row.clubName}
                          </span>
                          {isWarriors && (
                            <span className="px-2 py-0.5 rounded-full bg-[#08783E] text-white text-[10px] font-black uppercase">
                              THE WARRIORS
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-center">{row.played}</td>
                        <td className="py-3.5 px-3 text-center">{row.won}</td>
                        <td className="py-3.5 px-3 text-center">{row.drawn}</td>
                        <td className="py-3.5 px-3 text-center">{row.lost}</td>
                        <td className="py-3.5 px-3 text-center">{row.goalsFor}</td>
                        <td className="py-3.5 px-3 text-center">{row.goalsAgainst}</td>
                        <td className="py-3.5 px-3 text-center">
                          {row.goalDifference > 0
                            ? `+${row.goalDifference}`
                            : row.goalDifference}
                        </td>
                        <td className="py-3.5 px-4 text-center font-pedals font-athletic text-xl font-black">
                          <span className={isWarriors ? 'text-[#08783E]' : 'text-slate-900'}>
                            {row.points}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-50 p-12 text-center border-2 border-dashed border-slate-300 space-y-3">
            <Award className="w-12 h-12 text-slate-400 mx-auto" />
            <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-slate-800">
              No League Standings Published Yet
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              Nginda Warriors FC never displays invented league tables. Authorized administrators can enter verified standings or calculate them from verified match results in the Control Centre.
            </p>
          </div>
        )}

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
          <Info className="w-4 h-4 text-[#08783E] shrink-0 mt-0.5" />
          <p>
            <strong>Transparency Notice:</strong> Standings displayed on this page are maintained by Nginda Warriors FC club administration from verified competition records ({competitions.length > 0 ? competitions.map((c) => c.name).join(', ') : 'Regional / FKF League Competitions'}).
          </p>
        </div>
      </div>
    </div>
  );
}
