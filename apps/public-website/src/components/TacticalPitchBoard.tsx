'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Player } from '@nginda-warriors/shared';
import { Shield, Sparkles, User, X } from 'lucide-react';

export interface TacticalPitchPlayer {
  id?: string;
  fullName: string;
  slug: string;
  jerseyNumber: number;
  position?: string;
  specificRole?: string;
  positionGroup?: string;
  biography?: string;
  appearances?: number;
  goals?: number;
  assists?: number;
}

function getPlayerDisplayPosition(p: Player | TacticalPitchPlayer): string {
  if ('specificRole' in p && p.specificRole) return p.specificRole;
  if ('position' in p && p.position) return p.position;
  if ('positionGroup' in p && p.positionGroup) return p.positionGroup;
  return 'Warrior';
}

interface TacticalPitchBoardProps {
  startingPlayers: (Player | TacticalPitchPlayer)[];
  benchPlayers?: (Player | TacticalPitchPlayer)[];
  defaultFormation?: '4-3-3' | '4-2-3-1' | '3-5-2';
}

interface PitchCoordinate {
  role: string;
  x: number; // percentage from left (0 to 100)
  y: number; // percentage from top (0 to 100)
}

const FORMATIONS: Record<'4-3-3' | '4-2-3-1' | '3-5-2', PitchCoordinate[]> = {
  '4-3-3': [
    { role: 'GK', x: 50, y: 88 },
    { role: 'RB', x: 84, y: 70 },
    { role: 'CB', x: 62, y: 72 },
    { role: 'CB', x: 38, y: 72 },
    { role: 'LB', x: 16, y: 70 },
    { role: 'CM', x: 70, y: 48 },
    { role: 'CDM', x: 50, y: 54 },
    { role: 'CM', x: 30, y: 48 },
    { role: 'RW', x: 82, y: 24 },
    { role: 'ST', x: 50, y: 16 },
    { role: 'LW', x: 18, y: 24 },
  ],
  '4-2-3-1': [
    { role: 'GK', x: 50, y: 88 },
    { role: 'RB', x: 84, y: 70 },
    { role: 'CB', x: 62, y: 72 },
    { role: 'CB', x: 38, y: 72 },
    { role: 'LB', x: 16, y: 70 },
    { role: 'CDM', x: 64, y: 56 },
    { role: 'CDM', x: 36, y: 56 },
    { role: 'RAM', x: 78, y: 38 },
    { role: 'CAM', x: 50, y: 36 },
    { role: 'LAM', x: 22, y: 38 },
    { role: 'ST', x: 50, y: 16 },
  ],
  '3-5-2': [
    { role: 'GK', x: 50, y: 88 },
    { role: 'RCB', x: 72, y: 72 },
    { role: 'CB', x: 50, y: 74 },
    { role: 'LCB', x: 28, y: 72 },
    { role: 'RWB', x: 88, y: 48 },
    { role: 'CM', x: 65, y: 50 },
    { role: 'CDM', x: 50, y: 56 },
    { role: 'CM', x: 35, y: 50 },
    { role: 'LWB', x: 12, y: 48 },
    { role: 'RS', x: 62, y: 18 },
    { role: 'LS', x: 38, y: 18 },
  ],
};

export function TacticalPitchBoard({
  startingPlayers,
  benchPlayers = [],
  defaultFormation = '4-3-3',
}: TacticalPitchBoardProps) {
  const [formation, setFormation] = useState<'4-3-3' | '4-2-3-1' | '3-5-2'>(
    defaultFormation
  );
  const [selectedPlayer, setSelectedPlayer] = useState<
    (Player | TacticalPitchPlayer) | null
  >(null);

  const coordinates = FORMATIONS[formation];

  return (
    <div className="w-full bg-[#063B25] text-white rounded-2xl overflow-hidden shadow-2xl border border-[#08783E]/40">
      {/* Header bar with formation switcher */}
      <div className="bg-[#042819] px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#08783E]/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5D000] animate-pulse" />
            <h3 className="font-athletic text-xl uppercase tracking-wider text-[#F5D000]">
              Tactical Pitch Formation
            </h3>
          </div>
          <p className="text-xs text-white/70">
            Interactive visual team lineup & tactical formation board
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-athletic tracking-wider text-white/60">
            Formation:
          </span>
          {(['4-3-3', '4-2-3-1', '3-5-2'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormation(fmt)}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                formation === fmt
                  ? 'bg-[#F5D000] text-[#063B25] shadow-md font-athletic'
                  : 'bg-white/10 hover:bg-white/20 text-white font-medium'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Pitch Layout */}
      <div className="p-4 md:p-8 flex flex-col lg:flex-row items-center gap-8 justify-center">
        {/* The Pitch */}
        <div
          className="relative w-full max-w-[500px] aspect-[7/10] rounded-xl overflow-hidden shadow-inner border-2 border-white/40"
          style={{
            background:
              'repeating-linear-gradient(0deg, #075a30, #075a30 40px, #086d3b 40px, #086d3b 80px)',
          }}
        >
          {/* Pitch markings SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
            viewBox="0 0 100 140"
            preserveAspectRatio="none"
          >
            {/* Outer border */}
            <rect
              x="3"
              y="3"
              width="94"
              height="134"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            {/* Halfway line */}
            <line
              x1="3"
              y1="70"
              x2="97"
              y2="70"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            {/* Center circle */}
            <circle
              cx="50"
              cy="70"
              r="14"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            <circle cx="50" cy="70" r="1" fill="#ffffff" />

            {/* Top Penalty Box (Opponent's goal) */}
            <rect
              x="22"
              y="3"
              width="56"
              height="22"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            {/* Top 6-yard box */}
            <rect
              x="34"
              y="3"
              width="32"
              height="8"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            {/* Top penalty spot */}
            <circle cx="50" cy="16" r="0.8" fill="#ffffff" />

            {/* Bottom Penalty Box (Warriors' goal) */}
            <rect
              x="22"
              y="115"
              width="56"
              height="22"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            {/* Bottom 6-yard box */}
            <rect
              x="34"
              y="129"
              width="32"
              height="8"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            {/* Bottom penalty spot */}
            <circle cx="50" cy="124" r="0.8" fill="#ffffff" />
          </svg>

          {/* Player Nodes */}
          {coordinates.map((coord, idx) => {
            const player = startingPlayers[idx];
            const isSelected = selectedPlayer?.id === player?.id;

            return (
              <div
                key={idx}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 group focus:outline-none"
                style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                onClick={() => player && setSelectedPlayer(player)}
              >
                <div className="flex flex-col items-center">
                  {/* Jersey Token */}
                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-athletic font-extrabold text-sm sm:text-base border-2 shadow-lg transition-all ${
                      isSelected
                        ? 'bg-[#F5D000] text-[#063B25] border-white ring-4 ring-[#F5D000]/60 scale-110'
                        : 'bg-[#063B25] text-[#F5D000] border-[#F5D000] group-hover:border-white'
                    }`}
                  >
                    {player ? player.jerseyNumber : coord.role}
                  </div>

                  {/* Player Surname Badge */}
                  <div
                    className={`mt-1 px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold tracking-tight whitespace-nowrap shadow uppercase ${
                      isSelected
                        ? 'bg-[#F5D000] text-[#063B25]'
                        : 'bg-[#042819]/90 text-white border border-white/20'
                    }`}
                  >
                    {player ? player.fullName.split(' ').pop() : coord.role}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Player Profile Card & Substitute Bench */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          {/* Active Player Card */}
          <div className="bg-[#042819] p-5 rounded-xl border border-[#08783E]/40 relative shadow-xl">
            {selectedPlayer ? (
              <div>
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="absolute top-4 right-4 text-white/50 hover:text-white"
                  aria-label="Close details"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#F5D000] text-[#063B25] flex items-center justify-center font-athletic text-2xl font-black shadow">
                    #{selectedPlayer.jerseyNumber}
                  </div>
                  <div>
                    <h4 className="font-athletic text-xl font-bold uppercase text-white leading-tight">
                      {selectedPlayer.fullName}
                    </h4>
                    <span className="inline-block px-2 py-0.5 rounded bg-[#08783E] text-[10px] font-bold text-white uppercase tracking-wider">
                      {getPlayerDisplayPosition(selectedPlayer)}
                    </span>
                  </div>
                </div>

                {selectedPlayer.biography && (
                  <p className="text-xs text-white/80 line-clamp-3 mb-4 leading-relaxed">
                    {selectedPlayer.biography}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-2 bg-black/20 p-2.5 rounded-lg text-center mb-4 border border-white/10">
                  <div>
                    <div className="text-[10px] text-white/60 uppercase">Apps</div>
                    <div className="font-athletic text-lg font-bold text-[#F5D000]">
                      {selectedPlayer.appearances}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/60 uppercase">Goals</div>
                    <div className="font-athletic text-lg font-bold text-[#F5D000]">
                      {selectedPlayer.goals}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/60 uppercase">Assists</div>
                    <div className="font-athletic text-lg font-bold text-[#F5D000]">
                      {selectedPlayer.assists}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/team/${selectedPlayer.slug}`}
                  className="block text-center py-2 px-4 rounded bg-[#F5D000] text-[#063B25] font-bold text-xs uppercase tracking-wider hover:bg-yellow-400 transition"
                >
                  View Full Bio & Stats &rarr;
                </Link>
              </div>
            ) : (
              <div className="text-center py-6 text-white/60">
                <User className="w-10 h-10 mx-auto mb-2 text-[#F5D000]/60" />
                <h5 className="font-athletic text-base uppercase text-white font-bold mb-1">
                  Tactical Board Ready
                </h5>
                <p className="text-xs text-white/70 leading-relaxed">
                  {startingPlayers.length > 0
                    ? 'Click any player node on the tactical pitch to reveal tactical profile and seasonal statistics.'
                    : 'Tactical squad tokens will populate this board automatically as soon as first-team players are approved and published in the Control Centre.'}
                </p>
              </div>
            )}
          </div>

          {/* Substitutes Bench */}
          {benchPlayers.length > 0 && (
            <div className="bg-[#042819] p-4 rounded-xl border border-[#08783E]/40">
              <h5 className="font-athletic text-sm uppercase tracking-wider text-[#F5D000] mb-3 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Substitutes Bench
              </h5>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {benchPlayers.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedPlayer(sub)}
                    className="flex items-center justify-between p-2 rounded bg-black/20 hover:bg-white/10 cursor-pointer transition text-xs border border-white/5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-athletic text-sm font-bold text-[#F5D000] w-5">
                        #{sub.jerseyNumber}
                      </span>
                      <span className="font-semibold text-white">
                        {sub.fullName}
                      </span>
                    </div>
                    <span className="text-[10px] text-white/60 uppercase">
                      {getPlayerDisplayPosition(sub)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
