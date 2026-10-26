'use client';

import React, { useState } from 'react';
import { Player } from '@nginda-warriors/shared';
import { CheckCircle2, Star } from 'lucide-react';

export function MotmVoteWidget({
  fixtureId,
  players,
  pollSummary,
}: {
  fixtureId: string;
  players: Player[];
  pollSummary?: { totalVotes: number; byPlayerId: Record<string, number> };
}) {
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerId) return;
    setSubmitting(true);
    setErrorMessage('');
    setStatusMessage('');

    let voterKey = '';
    if (typeof window !== 'undefined') {
      voterKey = localStorage.getItem('nginda_voter_key') || `voter_${Date.now()}_${Math.random()}`;
      localStorage.setItem('nginda_voter_key', voterKey);
    }

    try {
      const res = await fetch('/api/public/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'motm_vote',
          payload: { fixtureId, playerId: selectedPlayerId, voterKey },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMessage(data.error || 'Unable to submit vote.');
      } else {
        setStatusMessage(data.message);
      }
    } catch {
      setErrorMessage('Network error submitting vote.');
    } finally {
      setSubmitting(false);
    }
  };

  if (players.length === 0) return null;

  return (
    <div className="rounded-2xl bg-[#063B25] text-white p-6 border-2 border-[#F5D000]">
      <div className="flex items-center gap-2 text-[#F5D000] font-athletic font-bold uppercase text-sm tracking-wider mb-1">
        <Star className="w-4 h-4 fill-[#F5D000]" />
        <span>Supporter Engagement</span>
      </div>
      <h3 className="font-athletic text-2xl font-black uppercase text-white mb-2">
        Vote: Man of the Match
      </h3>
      <p className="text-xs text-emerald-100 mb-4">
        Select the standout Nginda Warriors FC performer from this fixture.
      </p>

      <form onSubmit={handleVote} className="space-y-3">
        <select
          value={selectedPlayerId}
          onChange={(e) => setSelectedPlayerId(e.target.value)}
          required
          className="w-full px-3.5 py-2.5 rounded-lg bg-[#08783E] text-white border border-[#F5D000]/40 text-sm font-semibold"
        >
          <option value="">-- Choose a Warrior Player --</option>
          {players.map((p) => {
            const votes = pollSummary?.byPlayerId?.[p.id] || 0;
            return (
              <option key={p.id} value={p.id}>
                #{p.jerseyNumber} {p.fullName} ({p.positionGroup}) — {votes} votes
              </option>
            );
          })}
        </select>

        <button
          type="submit"
          disabled={submitting || !selectedPlayerId}
          className="w-full py-2.5 rounded-lg bg-[#F5D000] hover:bg-[#ffe033] text-[#063B25] font-athletic font-black text-base uppercase tracking-wider disabled:opacity-50"
        >
          {submitting ? 'Submitting Vote...' : 'Cast Official Supporter Vote'}
        </button>
      </form>

      {statusMessage && (
        <div className="mt-3 p-3 rounded-lg bg-[#08783E] text-[#F5D000] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}
      {errorMessage && (
        <p className="mt-3 text-xs text-amber-300 font-semibold">{errorMessage}</p>
      )}
    </div>
  );
}
