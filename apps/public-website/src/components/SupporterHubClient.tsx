'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ClubCrest, Player } from '@nginda-warriors/shared';
import {
  Calendar,
  CheckCircle2,
  Flame,
  Trophy,
  Users,
} from 'lucide-react';

interface SupporterHubClientProps {
  players: Player[];
  nextOpponent?: string | null;
  nextMatchDate?: string | null;
}

export function SupporterHubClient({
  players,
  nextOpponent = null,
  nextMatchDate = null,
}: SupporterHubClientProps) {
  // Tabs: 'motm' | 'predictor'
  const [activeTab, setActiveTab] = useState<'motm' | 'predictor'>('motm');

  // Predictor State
  const [predWarriors, setPredWarriors] = useState('0');
  const [predOpponent, setPredOpponent] = useState('0');
  const [predScorer, setPredScorer] = useState(players[0]?.fullName || '');
  const [predSubmitted, setPredSubmitted] = useState(false);

  // POTM State
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(
    players[0]?.id || ''
  );
  const [hasVoted, setHasVoted] = useState(false);
  const [voteTally, setVoteTally] = useState<Record<string, number>>({});

  const handleVote = (id: string) => {
    setSelectedPlayerId(id);
    setVoteTally((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    setHasVoted(true);
  };

  return (
    <div className="w-full">
      {/* Navigation Tabs */}
      <div className="flex border-b border-[#262626] mb-8 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('motm')}
          className={`py-4 px-6 font-athletic text-base uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'motm'
              ? 'border-[#FDE100] text-[#FDE100] bg-[#FDE100]/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4 text-[#FDE100]" />
          Player of the Month Poll
        </button>

        <button
          onClick={() => setActiveTab('predictor')}
          className={`py-4 px-6 font-athletic text-base uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'predictor'
              ? 'border-[#FDE100] text-[#FDE100] bg-[#FDE100]/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4 text-[#FDE100]" />
          Match & Score Predictor
        </button>
      </div>

      {/* TAB 2: PLAYER OF THE MONTH (POTM) */}
      {activeTab === 'motm' && (
        <div className="bg-[#141414] p-6 md:p-8 rounded-2xl border border-[#262626] shadow-xl">
          <div className="max-w-2xl mb-8">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FDE100]/10 border border-[#FDE100]/30 text-[#FDE100] text-xs font-athletic font-extrabold uppercase tracking-wider">
              OFFICIAL FAN POLL
            </span>
            <h3 className="font-athletic text-3xl font-black uppercase text-white mt-2">
              VOTE YOUR WARRIOR OF THE MONTH
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Cast your vote for the standout player who showcased unmatched warrior spirit, leadership, and athletic determination.
            </p>
          </div>

          {players.length === 0 ? (
            <div className="rounded-xl bg-[#0D0D0D] border border-[#262626] p-8 text-center">
              <Users className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h4 className="font-athletic text-xl font-bold uppercase text-white">
                Official Squad Profiles Being Prepared
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Player of the Month voting opens as soon as official first-team player profiles are reviewed and published via the Control Centre.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {players.slice(0, 3).map((player) => {
                const count = voteTally[player.id] || 0;
                const totalVotes = Object.values(voteTally).reduce((a, b) => a + b, 0) || 1;
                const percent = totalVotes > 0 && count > 0 ? Math.round((count / totalVotes) * 100) : 0;
                const isSelected = selectedPlayerId === player.id;

                return (
                  <div
                    key={player.id}
                    className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#1A1A1A] border-[#262626] ring-2 ring-[#FDE100]/40'
                        : 'bg-[#0D0D0D] border-[#262626] hover:border-[#FDE100]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="w-10 h-10 rounded-full bg-[#FDE100] text-black font-black flex items-center justify-center font-athletic text-lg font-black shadow-md">
                          #{player.jerseyNumber}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-[#1A1A1A] text-slate-200 uppercase font-bold border border-[#262626]">
                          {player.specificRole || player.positionGroup}
                        </span>
                      </div>

                      <h4 className="font-athletic text-xl font-bold uppercase text-white leading-tight">
                        {player.fullName}
                      </h4>

                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1 font-bold">
                          <span className="text-slate-400">Fan Votes</span>
                          <span className="text-[#FDE100] font-athletic text-sm">
                            {count > 0 ? `${percent}% (${count})` : '0 votes'}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#1A1A1A] overflow-hidden">
                          <div
                            className="h-full bg-[#FDE100] transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleVote(player.id)}
                      className={`mt-6 w-full py-2.5 rounded-lg text-xs font-bold font-athletic uppercase tracking-wider transition ${
                        hasVoted && isSelected
                          ? 'bg-[#FDE100] text-black font-black flex items-center justify-center gap-1.5'
                          : 'bg-[#1A1A1A] text-white hover:bg-[#FDE100] hover:text-black border border-[#262626]'
                      }`}
                    >
                      {hasVoted && isSelected ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#FDE100]" />
                          Vote Confirmed
                        </>
                      ) : (
                        'Vote for this Player'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MATCH & SCORE PREDICTOR */}
      {activeTab === 'predictor' && (
        <div className="bg-[#141414] p-6 md:p-8 rounded-2xl border border-[#262626] shadow-xl max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FDE100]/10 border border-[#FDE100]/30 text-[#FDE100] text-xs font-athletic font-extrabold uppercase tracking-wider">
              FAN PREDICTOR GAME
            </span>
            <h3 className="font-athletic text-3xl font-black uppercase text-white mt-2">
              PREDICT THE SCORELINE
            </h3>
            {nextOpponent ? (
              <p className="text-xs text-slate-300 mt-1">
                Upcoming Match: <span className="text-[#FDE100] font-bold">Nginda Warriors FC vs {nextOpponent}</span> {nextMatchDate ? `(${nextMatchDate})` : ''}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Official fixtures published via the Control Centre will unlock match predictions automatically.
              </p>
            )}
          </div>

          {!nextOpponent ? (
            <div className="rounded-xl bg-[#0D0D0D] border border-[#262626] p-8 text-center">
              <Calendar className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h4 className="font-athletic text-xl font-bold uppercase text-white">
                No Upcoming Match Scheduled
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Scoreline predictions open as soon as the club administration publishes the next verified fixture schedule.
              </p>
              <div className="mt-4">
                <Link
                  href="/fixtures"
                  className="px-4 py-2 rounded-lg bg-[#FDE100] text-black text-xs font-black uppercase tracking-wider hover:bg-[#FFE600] transition shadow-md"
                >
                  View All Fixtures &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-[#0D0D0D] p-6 rounded-xl border border-[#262626] mb-6">
                <div className="flex items-center justify-center gap-4 md:gap-8">
                  <div className="text-center">
                    <div className="w-14 h-14 mx-auto mb-2 rounded-xl bg-[#0A0A0A] border border-[#262626] flex items-center justify-center shadow-md">
                      <ClubCrest size={40} />
                    </div>
                    <div className="font-athletic text-base font-bold uppercase text-white">
                      Warriors
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="12"
                      value={predWarriors}
                      onChange={(e) => setPredWarriors(e.target.value)}
                      className="w-16 h-14 mt-2 text-center font-athletic text-3xl font-black rounded-lg bg-[#141414] border-2 border-[#262626] text-white focus:border-[#262626] focus:outline-none"
                    />
                  </div>

                  <div className="font-athletic text-3xl font-black text-slate-500">VS</div>

                  <div className="text-center">
                    <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-[#0A0A0A] border border-[#262626] flex items-center justify-center text-slate-300 font-athletic font-bold text-lg">
                      OPP
                    </div>
                    <div className="font-athletic text-base font-bold uppercase text-white">
                      {nextOpponent.split(' ')[0]}
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="12"
                      value={predOpponent}
                      onChange={(e) => setPredOpponent(e.target.value)}
                      className="w-16 h-14 mt-2 text-center font-athletic text-3xl font-black rounded-lg bg-[#141414] border-2 border-[#262626] text-white focus:border-[#262626] focus:outline-none"
                    />
                  </div>
                </div>

                {players.length > 0 && (
                  <div className="mt-6 max-w-sm mx-auto">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 text-center">
                      Predicted First Goalscorer
                    </label>
                    <select
                      value={predScorer}
                      onChange={(e) => setPredScorer(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-[#262626] text-white text-sm focus:border-[#262626] focus:outline-none"
                    >
                      {players.map((p) => (
                        <option key={p.id} value={p.fullName} className="bg-[#141414] text-white">
                          #{p.jerseyNumber} {p.fullName} ({p.specificRole || p.positionGroup})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <button
                onClick={() => setPredSubmitted(true)}
                className="w-full py-3 rounded-xl bg-[#FDE100] text-black font-black font-athletic text-base font-extrabold uppercase tracking-wider hover:bg-[#FFE600] transition shadow-md"
              >
                {predSubmitted ? 'Prediction Saved! Good Luck Warrior' : 'Lock In Match Prediction'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
