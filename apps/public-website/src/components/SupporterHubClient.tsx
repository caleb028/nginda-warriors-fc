'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ClubCrest, Player } from '@nginda-warriors/shared';
import {
  Award,
  Calendar,
  CheckCircle2,
  Flame,
  QrCode,
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
  // Tabs: 'pass' | 'motm' | 'predictor'
  const [activeTab, setActiveTab] = useState<'pass' | 'motm' | 'predictor'>('pass');

  // Digital Pass State
  const [passName, setPassName] = useState('');
  const [passTown, setPassTown] = useState('');
  const [passNumber, setPassNumber] = useState('NW-2024-0001');

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

  const generateNewPassId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setPassNumber(`NW-2024-${randomNum}`);
  };

  return (
    <div className="w-full">
      {/* Navigation Tabs */}
      <div className="flex border-b border-[#1E2B23] mb-8 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('pass')}
          className={`py-4 px-6 font-pedals font-athletic text-base uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'pass'
              ? 'border-[#F5D000] text-[#F5D000] bg-[#08783E]/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 text-[#F5D000]" />
          Digital Supporter Pass
        </button>

        <button
          onClick={() => setActiveTab('motm')}
          className={`py-4 px-6 font-pedals font-athletic text-base uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'motm'
              ? 'border-[#F5D000] text-[#F5D000] bg-[#08783E]/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4 text-[#F5D000]" />
          Player of the Month Poll
        </button>

        <button
          onClick={() => setActiveTab('predictor')}
          className={`py-4 px-6 font-pedals font-athletic text-base uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'predictor'
              ? 'border-[#F5D000] text-[#F5D000] bg-[#08783E]/10'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4 text-[#F5D000]" />
          Match & Score Predictor
        </button>
      </div>

      {/* TAB 1: DIGITAL SUPPORTER PASS */}
      {activeTab === 'pass' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Customizer Controls */}
          <div className="lg:col-span-5 bg-[#0D1410] p-6 rounded-2xl border border-[#1E2B23] shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80]" />
              <span className="font-pedals font-athletic text-xs uppercase tracking-wider text-[#4ADE80] font-bold">
                Instant Fan ID Generator
              </span>
            </div>
            <h3 className="font-pedals font-athletic text-2xl font-black uppercase text-white mb-2">
              YOUR DIGITAL WARRIOR PASS
            </h3>
            <p className="text-xs text-slate-300 mb-6">
              Claim your personalized digital club membership card. Carry your Warrior spirit on your device or save it for matchdays.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Supporter Full Name
                </label>
                <input
                  type="text"
                  value={passName}
                  onChange={(e) => setPassName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 rounded-lg bg-[#080D0A] border border-[#1E2B23] text-white placeholder-slate-500 text-sm focus:border-[#08783E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Home Town / Branch
                </label>
                <input
                  type="text"
                  value={passTown}
                  onChange={(e) => setPassTown(e.target.value)}
                  placeholder="e.g. Nginda, Murang'a, Nairobi"
                  className="w-full px-3 py-2 rounded-lg bg-[#080D0A] border border-[#1E2B23] text-white placeholder-slate-500 text-sm focus:border-[#08783E] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={generateNewPassId}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#141E18] hover:bg-[#1C2B22] border border-[#1E2B23] text-xs font-bold text-slate-200 uppercase tracking-wider transition"
                >
                  Generate New ID
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Pass #${passNumber} ready! Screenshot card or save it to your device.`)}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#08783E] text-white text-xs font-bold font-pedals font-athletic uppercase tracking-wider hover:bg-[#063B25] transition shadow-md"
                >
                  Save Pass
                </button>
              </div>
            </div>
          </div>

          {/* Rendered Digital Pass Card (Photorealistic VIP Pass) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-md aspect-[1.58/1] rounded-2xl overflow-hidden shadow-2xl relative p-6 border-2 border-[#1E2B23] bg-gradient-to-br from-[#0D1410] via-[#09100C] to-[#040806] flex flex-col justify-between text-white select-none">
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #08783E 0, #08783E 1px, transparent 0, transparent 50%)',
                  backgroundSize: '16px 16px',
                }}
              />

              {/* Pass Top Banner */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full p-1 bg-[#0A0F0D] border border-[#1E2B23] flex items-center justify-center">
                    <ClubCrest size={40} />
                  </div>
                  <div>
                    <h4 className="font-pedals font-athletic text-lg font-black uppercase text-white tracking-wider leading-none">
                      NGINDA WARRIORS FC
                    </h4>
                    <span className="text-[10px] text-[#F5D000] font-pedals font-athletic uppercase tracking-widest font-extrabold">
                      OFFICIAL SUPPORTER PASS • EST. 2024
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-[#08783E]/20 text-[#4ADE80] font-pedals font-athletic text-[11px] font-extrabold tracking-wider uppercase border border-[#08783E]/40">
                    ACTIVE 2026/27
                  </span>
                </div>
              </div>

              {/* Pass Middle: Supporter Name & Details */}
              <div className="relative z-10 my-auto py-2">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  Cardholder
                </div>
                <div className="font-pedals font-athletic text-2xl md:text-3xl font-black uppercase text-white tracking-wider">
                  {passName.trim() || 'LOYAL WARRIOR'}
                </div>
                <div className="text-xs text-slate-300 font-semibold flex items-center gap-1.5 mt-0.5">
                  <span>Branch: {passTown.trim() || 'Murang’a'}</span>
                  <span>•</span>
                  <span>Category: Official Fan</span>
                </div>
              </div>

              {/* Pass Bottom Strip */}
              <div className="relative z-10 pt-2 border-t border-[#1E2B23] flex items-end justify-between">
                <div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">
                    Membership ID
                  </div>
                  <div className="font-pedals font-athletic text-base font-bold text-[#F5D000] tracking-widest">
                    {passNumber}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <QrCode className="w-8 h-8 text-slate-300" />
                  <div className="text-[8px] text-slate-400 text-right leading-tight font-mono">
                    VERIFIED<br />KENYA
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PLAYER OF THE MONTH (POTM) */}
      {activeTab === 'motm' && (
        <div className="bg-[#0D1410] p-6 md:p-8 rounded-2xl border border-[#1E2B23] shadow-xl">
          <div className="max-w-2xl mb-8">
            <span className="px-2.5 py-0.5 rounded-full bg-[#08783E]/20 border border-[#08783E]/40 text-[#4ADE80] text-xs font-pedals font-athletic font-extrabold uppercase tracking-wider">
              OFFICIAL FAN POLL
            </span>
            <h3 className="font-pedals font-athletic text-3xl font-black uppercase text-white mt-2">
              VOTE YOUR WARRIOR OF THE MONTH
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Cast your vote for the standout player who showcased unmatched warrior spirit, leadership, and athletic determination.
            </p>
          </div>

          {players.length === 0 ? (
            <div className="rounded-xl bg-[#080D0A] border border-[#1E2B23] p-8 text-center">
              <Users className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h4 className="font-pedals font-athletic text-xl font-bold uppercase text-white">
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
                        ? 'bg-[#121B16] border-[#08783E] ring-2 ring-[#08783E]/40'
                        : 'bg-[#080D0A] border-[#1E2B23] hover:border-[#2A3B31]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="w-10 h-10 rounded-full bg-[#08783E] text-white flex items-center justify-center font-pedals font-athletic text-lg font-black shadow-md">
                          #{player.jerseyNumber}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-[#16221B] text-slate-200 uppercase font-bold border border-[#1E2B23]">
                          {player.specificRole || player.positionGroup}
                        </span>
                      </div>

                      <h4 className="font-pedals font-athletic text-xl font-bold uppercase text-white leading-tight">
                        {player.fullName}
                      </h4>

                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1 font-bold">
                          <span className="text-slate-400">Fan Votes</span>
                          <span className="text-[#F5D000] font-pedals font-athletic text-sm">
                            {count > 0 ? `${percent}% (${count})` : '0 votes'}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#16221B] overflow-hidden">
                          <div
                            className="h-full bg-[#08783E] transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleVote(player.id)}
                      className={`mt-6 w-full py-2.5 rounded-lg text-xs font-bold font-pedals font-athletic uppercase tracking-wider transition ${
                        hasVoted && isSelected
                          ? 'bg-[#08783E] text-white flex items-center justify-center gap-1.5'
                          : 'bg-[#141E18] text-white hover:bg-[#08783E] border border-[#1E2B23]'
                      }`}
                    >
                      {hasVoted && isSelected ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#F5D000]" />
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
        <div className="bg-[#0D1410] p-6 md:p-8 rounded-2xl border border-[#1E2B23] shadow-xl max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="px-2.5 py-0.5 rounded-full bg-[#08783E]/20 border border-[#08783E]/40 text-[#4ADE80] text-xs font-pedals font-athletic font-extrabold uppercase tracking-wider">
              FAN PREDICTOR GAME
            </span>
            <h3 className="font-pedals font-athletic text-3xl font-black uppercase text-white mt-2">
              PREDICT THE SCORELINE
            </h3>
            {nextOpponent ? (
              <p className="text-xs text-slate-300 mt-1">
                Upcoming Match: <span className="text-[#F5D000] font-bold">Nginda Warriors FC vs {nextOpponent}</span> {nextMatchDate ? `(${nextMatchDate})` : ''}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Official fixtures published via the Control Centre will unlock match predictions automatically.
              </p>
            )}
          </div>

          {!nextOpponent ? (
            <div className="rounded-xl bg-[#080D0A] border border-[#1E2B23] p-8 text-center">
              <Calendar className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h4 className="font-pedals font-athletic text-xl font-bold uppercase text-white">
                No Upcoming Match Scheduled
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Scoreline predictions open as soon as the club administration publishes the next verified fixture schedule.
              </p>
              <div className="mt-4">
                <Link
                  href="/fixtures"
                  className="px-4 py-2 rounded-lg bg-[#08783E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#063B25] transition shadow-md"
                >
                  View All Fixtures &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-[#080D0A] p-6 rounded-xl border border-[#1E2B23] mb-6">
                <div className="flex items-center justify-center gap-4 md:gap-8">
                  <div className="text-center">
                    <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-[#0A0F0D] border border-[#1E2B23] flex items-center justify-center shadow-md">
                      <ClubCrest size={40} />
                    </div>
                    <div className="font-pedals font-athletic text-base font-bold uppercase text-white">
                      Warriors
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="12"
                      value={predWarriors}
                      onChange={(e) => setPredWarriors(e.target.value)}
                      className="w-16 h-14 mt-2 text-center font-pedals font-athletic text-3xl font-black rounded-lg bg-[#0D1410] border-2 border-[#1E2B23] text-white focus:border-[#08783E] focus:outline-none"
                    />
                  </div>

                  <div className="font-pedals font-athletic text-3xl font-black text-slate-500">VS</div>

                  <div className="text-center">
                    <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-[#0A0F0D] border border-[#1E2B23] flex items-center justify-center text-slate-300 font-pedals font-athletic font-bold text-lg">
                      OPP
                    </div>
                    <div className="font-pedals font-athletic text-base font-bold uppercase text-white">
                      {nextOpponent.split(' ')[0]}
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="12"
                      value={predOpponent}
                      onChange={(e) => setPredOpponent(e.target.value)}
                      className="w-16 h-14 mt-2 text-center font-pedals font-athletic text-3xl font-black rounded-lg bg-[#0D1410] border-2 border-[#1E2B23] text-white focus:border-[#08783E] focus:outline-none"
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
                      className="w-full px-3 py-2 rounded-lg bg-[#0D1410] border border-[#1E2B23] text-white text-sm focus:border-[#08783E] focus:outline-none"
                    >
                      {players.map((p) => (
                        <option key={p.id} value={p.fullName} className="bg-[#0D1410] text-white">
                          #{p.jerseyNumber} {p.fullName} ({p.specificRole || p.positionGroup})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <button
                onClick={() => setPredSubmitted(true)}
                className="w-full py-3 rounded-xl bg-[#08783E] text-white font-pedals font-athletic text-base font-extrabold uppercase tracking-wider hover:bg-[#063B25] transition shadow-md"
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
