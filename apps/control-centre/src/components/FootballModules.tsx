'use client';

import React, { useState, useRef } from 'react';
import {
  ClubCrest,
  NgindaDatabaseSchema,
  Player,
  PositionGroup,
  PublicationStatus,
  createUuid,
} from '@nginda-warriors/shared';
import {
  Award,
  Calendar,
  Camera,
  CheckCircle2,
  Edit3,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Trash2,
  Trophy,
  Upload,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';
import { processImageFile } from '../utils/imageUpload';

export function FootballModules({
  activeModule,
  db,
  onMutate,
}: {
  activeModule: string;
  db: NgindaDatabaseSchema;
  onMutate: (action: string, payload: Record<string, unknown>) => Promise<void>;
}) {
  // --- PLAYERS STATE ---
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('1');
  const [positionGroup, setPositionGroup] = useState<PositionGroup>('Forwards');
  const [specificRole, setSpecificRole] = useState('Centre Forward');
  const [preferredFoot, setPreferredFoot] = useState<'Right' | 'Left' | 'Both'>('Right');
  const [photoUrl, setPhotoUrl] = useState('');
  const [biography, setBiography] = useState('');
  const [appearances, setAppearances] = useState('0');
  const [starts, setStarts] = useState('0');
  const [goals, setGoals] = useState('0');
  const [assists, setAssists] = useState('0');
  const [yellowCards, setYellowCards] = useState('0');
  const [redCards, setRedCards] = useState('0');
  const [cleanSheets, setCleanSheets] = useState('0');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isUnderageProtected, setIsUnderageProtected] = useState(false);
  const [squadStatus, setSquadStatus] = useState<'active' | 'inactive' | 'archived'>('active');
  const [playerPubStatus, setPlayerPubStatus] = useState<PublicationStatus>('published');
  const [playerFilterPos, setPlayerFilterPos] = useState<string>('All');
  const [isSavingPlayer, setIsSavingPlayer] = useState(false);
  const [playerSavedNotice, setPlayerSavedNotice] = useState<{
    name: string;
    jersey: number;
    nextJersey: number;
  } | null>(null);
  const playerNameInputRef = useRef<HTMLInputElement>(null);
  const playerFormRef = useRef<HTMLFormElement>(null);

  // --- STAFF STATE ---
  const [staffName, setStaffName] = useState('');
  const [staffRoleTitle, setStaffRoleTitle] = useState('Head Coach');
  const [staffCategory, setStaffCategory] = useState<'Technical Bench' | 'Club Leadership'>(
    'Technical Bench'
  );
  const [staffBio, setStaffBio] = useState('');
  const [staffPhotoUrl, setStaffPhotoUrl] = useState('');
  const [staffPubStatus, setStaffPubStatus] = useState<PublicationStatus>('published');

  // --- FIXTURE STATE ---
  const [opponentName, setOpponentName] = useState('');
  const [opponentCrestUrl, setOpponentCrestUrl] = useState('');
  const [competitionName, setCompetitionName] = useState('FKF Regional League');
  const [seasonName, setSeasonName] = useState('2026/2027 Season');
  const [venue, setVenue] = useState('Nginda Home Ground');
  const [isHome, setIsHome] = useState(true);
  const [kickoffAt, setKickoffAt] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16)
  );
  const [fixturePubStatus, setFixturePubStatus] = useState<PublicationStatus>('published');

  // --- LIVE MATCH CENTRE 60-SECOND UPDATER STATE ---
  const [selectedFixtureId, setSelectedFixtureId] = useState(db.fixtures[0]?.id || '');
  const [quickHomeScore, setQuickHomeScore] = useState<number>(
    db.fixtures[0]?.homeScore ?? 0
  );
  const [quickAwayScore, setQuickAwayScore] = useState<number>(
    db.fixtures[0]?.awayScore ?? 0
  );
  const [quickStatus, setQuickStatus] = useState<string>(
    db.fixtures[0]?.matchStatus || 'live_first_half'
  );
  const [scorerName, setScorerName] = useState('');
  const [eventMinute, setEventMinute] = useState('45');
  const [eventType, setEventType] = useState('goal');
  const [reportHeadline, setReportHeadline] = useState('');
  const [reportSummary, setReportSummary] = useState('');
  const [reportBody, setReportBody] = useState('');
  const [lineupPlayerName, setLineupPlayerName] = useState('');
  const [lineupJersey, setLineupJersey] = useState('1');
  const [lineupPos, setLineupPos] = useState('GK');

  // --- STANDINGS STATE ---
  const [standingPos, setStandingPos] = useState('1');
  const [standingClub, setStandingClub] = useState('Nginda Warriors FC');
  const [standingWon, setStandingWon] = useState('0');
  const [standingDrawn, setStandingDrawn] = useState('0');
  const [standingLost, setStandingLost] = useState('0');
  const [standingGf, setStandingGf] = useState('0');
  const [standingGa, setStandingGa] = useState('0');

  // --- COMPETITION STATE ---
  const [newCompName, setNewCompName] = useState('');
  const [newCompSeason, setNewCompSeason] = useState('2026/2027 Season');

  const calculateNextJerseyNumber = (lastSavedJersey?: number): string => {
    const existingJerseys = new Set(
      (db.players || []).map((p) => Number(p.jerseyNumber)).filter((n) => !isNaN(n) && n > 0)
    );
    if (lastSavedJersey && !isNaN(lastSavedJersey)) {
      const candidate = lastSavedJersey + 1;
      if (!existingJerseys.has(candidate) && candidate <= 99) {
        return String(candidate);
      }
    }
    for (let i = 1; i <= 99; i++) {
      if (!existingJerseys.has(i)) {
        return String(i);
      }
    }
    return '1';
  };

  const resetPlayerForm = (suggestedJersey?: number) => {
    setEditingPlayerId(null);
    setPlayerName('');
    const nextJersey = calculateNextJerseyNumber(suggestedJersey);
    setJerseyNumber(nextJersey);
    setPhotoUrl('');
    setBiography('');
    setAppearances('0');
    setStarts('0');
    setGoals('0');
    setAssists('0');
    setYellowCards('0');
    setRedCards('0');
    setCleanSheets('0');
    setIsFeatured(true);
    setIsUnderageProtected(false);
    setSquadStatus('active');
    setPlayerPubStatus('published');
    setTimeout(() => {
      playerNameInputRef.current?.focus();
    }, 60);
  };

  const advanceToNextPlayer = (justSavedJersey: number, justSavedName: string) => {
    const nextJerseyStr = calculateNextJerseyNumber(justSavedJersey);
    setEditingPlayerId(null);
    setPlayerName('');
    setJerseyNumber(nextJerseyStr);
    setPhotoUrl('');
    setBiography('');
    setAppearances('0');
    setStarts('0');
    setGoals('0');
    setAssists('0');
    setYellowCards('0');
    setRedCards('0');
    setCleanSheets('0');
    setIsFeatured(true);
    setIsUnderageProtected(false);
    setSquadStatus('active');
    setPlayerPubStatus('published');

    setPlayerSavedNotice({
      name: justSavedName,
      jersey: justSavedJersey,
      nextJersey: Number(nextJerseyStr),
    });

    setTimeout(() => {
      playerNameInputRef.current?.focus();
      playerFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 60);
  };

  const loadPlayerForEdit = (p: Player) => {
    setEditingPlayerId(p.id);
    setPlayerName(p.fullName);
    setJerseyNumber(String(p.jerseyNumber));
    setPositionGroup(p.positionGroup);
    setSpecificRole(p.specificRole);
    setPreferredFoot(p.preferredFoot);
    setPhotoUrl(p.photoUrl || '');
    setBiography(p.biography);
    setAppearances(String(p.appearances));
    setStarts(String(p.starts));
    setGoals(String(p.goals));
    setAssists(String(p.assists));
    setYellowCards(String(p.yellowCards));
    setRedCards(String(p.redCards));
    setCleanSheets(String(p.cleanSheets));
    setIsFeatured(p.isFeatured);
    setIsUnderageProtected(p.isUnderageProtected);
    setSquadStatus(p.squadStatus);
    setPlayerPubStatus(p.publicationStatus);
    setPlayerSavedNotice(null);
    setTimeout(() => {
      playerNameInputRef.current?.focus();
      playerFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 60);
  };

  const POSITION_ORDER: Record<string, number> = {
    Goalkeepers: 1,
    Defenders: 2,
    Midfielders: 3,
    Forwards: 4,
  };
  const sortedPlayers = [...(db.players || [])].sort((a, b) => {
    const orderA = POSITION_ORDER[a.positionGroup] || 99;
    const orderB = POSITION_ORDER[b.positionGroup] || 99;
    if (orderA !== orderB) return orderA - orderB;
    return (Number(a.jerseyNumber) || 0) - (Number(b.jerseyNumber) || 0);
  });
  const displayPlayers =
    playerFilterPos === 'All'
      ? sortedPlayers
      : sortedPlayers.filter((p) => p.positionGroup === playerFilterPos);

  // 1. PLAYERS MODULE
  if (activeModule === 'players') {
    return (
      <div className="space-y-8">
        <form
          ref={playerFormRef}
          onSubmit={async (e) => {
            e.preventDefault();
            if (isSavingPlayer) return;
            const savedName = playerName.trim();
            const savedJersey = Number(jerseyNumber);
            if (!savedName) {
              alert('Please enter the player full name.');
              return;
            }
            setIsSavingPlayer(true);
            const targetPlayerId = editingPlayerId || createUuid();
            try {
              await onMutate('save_player', {
                id: targetPlayerId,
                fullName: savedName,
                jerseyNumber: savedJersey,
                positionGroup,
                specificRole,
                preferredFoot,
                photoUrl,
                biography,
                appearances: Number(appearances),
                starts: Number(starts),
                goals: Number(goals),
                assists: Number(assists),
                yellowCards: Number(yellowCards),
                redCards: Number(redCards),
                cleanSheets: Number(cleanSheets),
                isFeatured,
                isUnderageProtected,
                squadStatus,
                publicationStatus: playerPubStatus,
                clientPlayers: db.players || [],
                deletedPlayerIds: db.deletedPlayerIds || [],
              });
              // Automated sequential flow: reset form for next player with incremented jersey number & auto-focus
              advanceToNextPlayer(savedJersey, savedName);
            } catch (err: unknown) {
              alert(err instanceof Error ? err.message : 'Failed to save player');
            } finally {
              setIsSavingPlayer(false);
            }
          }}
          className="bg-white rounded-2xl p-6 border-2 border-[#08783E] shadow-sm space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
            <div>
              <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25] flex items-center gap-2">
                <span>{editingPlayerId ? 'Edit Squad Player Profile' : 'Add New Squad Player'}</span>
                {!editingPlayerId && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EEF7EF] text-[#08783E] font-bold border border-[#08783E]/20">
                    ⚡ Automated Sequential Input
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {editingPlayerId
                  ? 'Editing existing player details. Click Save to update profile.'
                  : 'Enter player details below. Pressing "Save & Synchronize Player" publishes live and automatically advances to the next player.'}
              </p>
            </div>
            {editingPlayerId && (
              <button
                type="button"
                onClick={() => resetPlayerForm()}
                className="text-xs font-bold text-red-600 hover:underline px-3 py-1 rounded-lg bg-red-50 border border-red-200 self-start sm:self-auto"
              >
                ✕ Cancel Edit
              </button>
            )}
          </div>

          {/* Automatic Sequential Advancement Notice Banner */}
          {playerSavedNotice && (
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-3.5 flex items-center justify-between text-emerald-950 animate-fadeIn shadow-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-xs sm:text-sm">
                    ✅ Player #{playerSavedNotice.jersey} {playerSavedNotice.name} saved & published live!
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    Ready for next player! Suggested jersey #{playerSavedNotice.nextJersey} assigned. Full Name field is auto-focused.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPlayerSavedNotice(null)}
                className="text-xs text-emerald-700 hover:text-emerald-950 font-bold px-2.5 py-1 rounded-lg hover:bg-emerald-100/70"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Full Name *
              </label>
              <input
                ref={playerNameInputRef}
                type="text"
                required
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="e.g. Samuel Kamau"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-[#08783E] focus:ring-2 focus:ring-[#08783E]/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Jersey Number *
              </label>
              <input
                type="number"
                min="1"
                max="99"
                required
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Position Group *
              </label>
              <select
                value={positionGroup}
                onChange={(e) => setPositionGroup(e.target.value as PositionGroup)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
              >
                <option value="Goalkeepers">Goalkeepers</option>
                <option value="Defenders">Defenders</option>
                <option value="Midfielders">Midfielders</option>
                <option value="Forwards">Forwards</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Tactical Role
              </label>
              <input
                type="text"
                value={specificRole}
                onChange={(e) => setSpecificRole(e.target.value)}
                placeholder="e.g. Box-to-Box Midfielder"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Preferred Foot
              </label>
              <select
                value={preferredFoot}
                onChange={(e) =>
                  setPreferredFoot(e.target.value as 'Right' | 'Left' | 'Both')
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
              >
                <option value="Right">Right</option>
                <option value="Left">Left</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Squad Status
              </label>
              <select
                value={squadStatus}
                onChange={(e) =>
                  setSquadStatus(e.target.value as 'active' | 'inactive' | 'archived')
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
              >
                <option value="active">Active Squad</option>
                <option value="inactive">Inactive / Injured</option>
                <option value="archived">Archived Former Player</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Publication Status
              </label>
              <select
                value={playerPubStatus}
                onChange={(e) =>
                  setPlayerPubStatus(e.target.value as PublicationStatus)
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white font-bold"
              >
                <option value="published">Published (Live on Website)</option>
                <option value="draft">Private Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-7 gap-3 bg-[#EEF7EF] p-3.5 rounded-xl">
            {[
              { label: 'Apps', val: appearances, set: setAppearances },
              { label: 'Starts', val: starts, set: setStarts },
              { label: 'Goals', val: goals, set: setGoals },
              { label: 'Assists', val: assists, set: setAssists },
              { label: 'Clean Sheets', val: cleanSheets, set: setCleanSheets },
              { label: 'Yellow Cards', val: yellowCards, set: setYellowCards },
              { label: 'Red Cards', val: redCards, set: setRedCards },
            ].map((item) => (
              <div key={item.label}>
                <label className="block text-[10px] font-bold uppercase text-[#063B25] mb-1">
                  {item.label}
                </label>
                <input
                  type="number"
                  min="0"
                  value={item.val}
                  onChange={(e) => item.set(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-xs font-bold bg-white"
                />
              </div>
            ))}
          </div>

          {/* Player Portrait Photo Uploader */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold uppercase text-[#063B25]">
                  Player Portrait Photograph
                </label>
                <p className="text-[11px] text-slate-500">
                  Upload directly from your device (phone/laptop) or enter a photo link. Displayed with proper placement on squad directory, player profile, and homepage.
                </p>
              </div>
              {photoUrl && (
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline inline-flex items-center gap-1"
                >
                  ✕ Delete Player Photo
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Paste image link or upload file from device..."
                className="flex-1 w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />

              <label className="shrink-0 cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#08783E] hover:bg-[#063B25] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm">
                <Camera className="w-4 h-4 text-[#F5D000]" />
                <span>Upload from Device</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const dataUrl = await processImageFile(file);
                        setPhotoUrl(dataUrl);
                      } catch (err: unknown) {
                        alert(err instanceof Error ? err.message : 'Failed to process image');
                      }
                    }
                  }}
                />
              </label>

              {photoUrl ? (
                <div className="w-12 h-12 rounded-lg border-2 border-[#08783E] overflow-hidden bg-black shrink-0 shadow-sm flex items-center justify-center">
                  <img src={photoUrl} alt="Player Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-[9px] text-slate-400 font-bold uppercase text-center shrink-0">
                  No Photo
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
              Biography
            </label>
            <input
              type="text"
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              placeholder="Player profile bio..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-5 text-xs font-bold text-[#063B25]">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <span>Feature on Public Homepage</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isUnderageProtected}
                  onChange={(e) => setIsUnderageProtected(e.target.checked)}
                />
                <span>Underage Player Privacy Safeguard (Hide Personal Bio)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSavingPlayer}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-athletic font-black text-base uppercase tracking-wider shadow transition ${
                isSavingPlayer
                  ? 'bg-amber-300 text-[#063B25] opacity-75 cursor-wait'
                  : 'bg-[#F5D000] hover:bg-[#ffe033] text-[#063B25] active:scale-95'
              }`}
            >
              {isSavingPlayer ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#063B25]" />
                  <span>Saving Live...</span>
                </>
              ) : (
                <>
                  {editingPlayerId ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#063B25]" />
                      <span>Update Player Profile</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-[#063B25]" />
                      <span>Save and Synchronize Player</span>
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Players Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-[#063B25] text-white flex items-center justify-between">
            <h3 className="font-athletic text-xl font-bold uppercase text-[#F5D000]">
              Squad Directory ({db.players.length} Total)
            </h3>
            {db.players.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (
                    confirm(
                      'Permanently delete and remove ALL squad players from the website? This cannot be undone.'
                    )
                  ) {
                    onMutate('clear_all_players', {
                      allPlayerIds: db.players.map((p) => p.id),
                    });
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow"
                title="Permanently remove all squad players"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete All Players</span>
              </button>
            )}
          </div>

          {/* Position arrangement filter pills */}
          {db.players.length > 0 && (
            <div className="px-6 py-2.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-[#063B25] uppercase tracking-wider text-[11px] mr-1">
                Filter by Position:
              </span>
              {[
                { label: 'All Positions', value: 'All', count: db.players.length },
                {
                  label: 'Goalkeepers',
                  value: 'Goalkeepers',
                  count: db.players.filter((p) => p.positionGroup === 'Goalkeepers').length,
                },
                {
                  label: 'Defenders',
                  value: 'Defenders',
                  count: db.players.filter((p) => p.positionGroup === 'Defenders').length,
                },
                {
                  label: 'Midfielders',
                  value: 'Midfielders',
                  count: db.players.filter((p) => p.positionGroup === 'Midfielders').length,
                },
                {
                  label: 'Forwards',
                  value: 'Forwards',
                  count: db.players.filter((p) => p.positionGroup === 'Forwards').length,
                },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setPlayerFilterPos(tab.value)}
                  className={`px-3 py-1 rounded-full font-athletic font-bold uppercase transition ${
                    playerFilterPos === tab.value
                      ? 'bg-[#08783E] text-white shadow-xs'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          )}

          {db.players.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#EEF7EF] text-[#063B25] font-athletic uppercase text-xs font-bold">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Player</th>
                    <th className="py-3 px-4">Position</th>
                    <th className="py-3 px-4 text-center">Apps / Goals / Ast</th>
                    <th className="py-3 px-4">Squad Status</th>
                    <th className="py-3 px-4">Publication</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayPlayers.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-athletic text-lg font-black text-[#08783E]">
                        #{p.jerseyNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#063B25]">
                        <div className="flex items-center gap-3">
                          {p.photoUrl ? (
                            <img
                              src={p.photoUrl}
                              alt={p.fullName}
                              className="w-10 h-10 rounded-lg object-cover border border-[#08783E]/30 shrink-0 shadow-xs"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] text-slate-400 font-bold shrink-0">
                              No Pic
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-[#063B25] leading-tight">{p.fullName}</p>
                            {p.isFeatured && (
                              <span className="inline-block mt-0.5 px-2 py-0.2 rounded bg-[#F5D000] text-[#063B25] text-[9px] font-black uppercase">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600">
                        {p.positionGroup} ({p.specificRole})
                      </td>
                      <td className="py-3 px-4 text-center font-semibold">
                        {p.appearances} / {p.goals} / {p.assists}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-bold uppercase">
                          {p.squadStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                            p.publicationStatus === 'published'
                              ? 'bg-[#EEF7EF] text-[#08783E]'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.publicationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <label
                            className="cursor-pointer p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title={p.photoUrl ? 'Change Player Photo' : 'Upload Player Photo from Device'}
                          >
                            <Camera className="w-4 h-4 text-[#08783E]" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const dataUrl = await processImageFile(file);
                                    onMutate('save_player', {
                                      ...p,
                                      photoUrl: dataUrl,
                                      clientPlayers: db.players || [],
                                    });
                                  } catch (err: unknown) {
                                    alert(err instanceof Error ? err.message : 'Upload failed');
                                  }
                                }
                              }}
                            />
                          </label>

                          {p.photoUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove and delete photograph for ${p.fullName}?`)) {
                                  onMutate('save_player', {
                                    ...p,
                                    photoUrl: '',
                                    clientPlayers: db.players || [],
                                  });
                                }
                              }}
                              className="p-1.5 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 transition text-[11px] font-bold"
                              title="Delete Player Photo"
                            >
                              ✕ Pic
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => loadPlayerForEdit(p)}
                            className="p-1.5 rounded bg-[#EEF7EF] text-[#08783E] hover:bg-[#08783E] hover:text-white"
                            title="Edit Player"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Permanently remove player profile ${p.fullName}?`)) {
                                onMutate('delete_player', { id: p.id });
                              }
                            }}
                            className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                            title="Delete Player"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-sm text-gray-500">
              <Users className="w-8 h-8 text-[#08783E] mx-auto mb-2" />
              No players added yet. Use the form above to add and publish your first squad member.
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. TECHNICAL STAFF & CLUB LEADERSHIP MODULE
  if (activeModule === 'staff') {
    return (
      <div className="space-y-8">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onMutate('save_staff', {
              fullName: staffName,
              roleTitle: staffRoleTitle,
              category: staffCategory,
              biography: staffBio,
              photoUrl: staffPhotoUrl,
              publicationStatus: staffPubStatus,
            });
            setStaffName('');
            setStaffBio('');
            setStaffPhotoUrl('');
          }}
          className="bg-white rounded-2xl p-6 border-2 border-[#08783E] space-y-4"
        >
          <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
            Add Technical Bench or Club Leadership Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="Official Name"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Role / Title *
              </label>
              <select
                value={staffRoleTitle}
                onChange={(e) => setStaffRoleTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
              >
                <option value="Head Coach">Head Coach</option>
                <option value="Assistant Coach">Assistant Coach</option>
                <option value="Goalkeeper Coach">Goalkeeper Coach</option>
                <option value="Team Manager">Team Manager</option>
                <option value="Club Chairman">Club Chairman</option>
                <option value="Club Secretary">Club Secretary</option>
                <option value="Treasurer">Treasurer</option>
                <option value="Club Official">Club Official</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Department
              </label>
              <select
                value={staffCategory}
                onChange={(e) =>
                  setStaffCategory(e.target.value as 'Technical Bench' | 'Club Leadership')
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
              >
                <option value="Technical Bench">Technical Bench</option>
                <option value="Club Leadership">Club Leadership</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Status
              </label>
              <select
                value={staffPubStatus}
                onChange={(e) => setStaffPubStatus(e.target.value as PublicationStatus)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white font-bold"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
              Biography & Responsibilities
            </label>
            <input
              type="text"
              value={staffBio}
              onChange={(e) => setStaffBio(e.target.value)}
              placeholder="Short profile summary..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
            />
          </div>

          {/* Staff Photo Uploader */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold uppercase text-[#063B25]">
                  Staff / Coach Portrait Photograph
                </label>
                <p className="text-[11px] text-slate-500">
                  Upload directly from your device. Displays on the About page and Squad Technical Bench directory.
                </p>
              </div>
              {staffPhotoUrl && (
                <button
                  type="button"
                  onClick={() => setStaffPhotoUrl('')}
                  className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline"
                >
                  ✕ Delete Staff Photo
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={staffPhotoUrl}
                onChange={(e) => setStaffPhotoUrl(e.target.value)}
                placeholder="Paste image link or upload from device..."
                className="flex-1 w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />

              <label className="shrink-0 cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#08783E] hover:bg-[#063B25] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm">
                <Camera className="w-4 h-4 text-[#F5D000]" />
                <span>Upload from Device</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const dataUrl = await processImageFile(file);
                        setStaffPhotoUrl(dataUrl);
                      } catch (err: unknown) {
                        alert(err instanceof Error ? err.message : 'Upload failed');
                      }
                    }
                  }}
                />
              </label>

              {staffPhotoUrl ? (
                <div className="w-12 h-12 rounded-lg border-2 border-[#08783E] overflow-hidden bg-black shrink-0 shadow-sm flex items-center justify-center">
                  <img src={staffPhotoUrl} alt="Staff Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-[9px] text-slate-400 font-bold uppercase text-center shrink-0">
                  No Photo
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F5D000] text-[#063B25] font-athletic font-black text-base uppercase tracking-wider"
          >
            <UserCheck className="w-4 h-4" />
            <span>Save Staff / Leadership Profile</span>
          </button>
        </form>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h4 className="font-athletic text-xl font-bold uppercase text-[#063B25] mb-4">
            Registered Officials & Coaching Staff ({db.staff.length})
          </h4>
          {db.staff.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {db.staff.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl bg-[#EEF7EF]/50 border border-gray-200 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    {s.photoUrl ? (
                      <img
                        src={s.photoUrl}
                        alt={s.fullName}
                        className="w-14 h-14 rounded-xl object-cover border border-[#08783E]/40 shrink-0 shadow-xs"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-[10px] text-slate-500 font-bold shrink-0">
                        No Pic
                      </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <span className="text-[10px] font-bold uppercase text-[#08783E]">
                        {s.category} • {s.publicationStatus}
                      </span>
                      <p className="font-athletic text-lg font-bold uppercase text-[#063B25] truncate">
                        {s.fullName}
                      </p>
                      <p className="text-xs font-bold text-[#08783E]">{s.roleTitle}</p>
                      <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{s.biography}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200/60 pt-2 text-xs">
                    <label
                      className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold text-[#08783E] hover:underline"
                      title={s.photoUrl ? 'Change Staff Photo' : 'Upload Staff Photo'}
                    >
                      <Camera className="w-3.5 h-3.5 text-[#08783E]" />
                      <span>{s.photoUrl ? 'Change Pic' : 'Upload Pic'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const dataUrl = await processImageFile(file);
                              onMutate('save_staff', { ...s, photoUrl: dataUrl });
                            } catch (err: unknown) {
                              alert(err instanceof Error ? err.message : 'Upload failed');
                            }
                          }
                        }}
                      />
                    </label>

                    {s.photoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove photograph for ${s.fullName}?`)) {
                            onMutate('save_staff', { ...s, photoUrl: '' });
                          }
                        }}
                        className="text-amber-700 hover:text-amber-900 font-bold text-[11px]"
                        title="Delete Photo"
                      >
                        ✕ Remove Pic
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Permanently remove staff profile for ${s.fullName}?`)) {
                          onMutate('delete_staff', { id: s.id });
                        }
                      }}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete Staff Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No staff profiles added yet.</p>
          )}
        </div>
      </div>
    );
  }

  // 3. FIXTURES & RESULTS MODULES
  if (activeModule === 'fixtures' || activeModule === 'results') {
    return (
      <div className="space-y-8">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            let safeKickoff = new Date().toISOString();
            if (kickoffAt) {
              const d = new Date(kickoffAt);
              if (!isNaN(d.getTime())) {
                safeKickoff = d.toISOString();
              }
            }
            await onMutate('save_fixture', {
              opponentName,
              opponentCrestUrl: opponentCrestUrl.trim(),
              competitionName,
              seasonName,
              venue,
              isHome,
              kickoffAt: safeKickoff,
              publicationStatus: fixturePubStatus,
            });
            setOpponentName('');
            setOpponentCrestUrl('');
          }}
          className="bg-white rounded-2xl p-6 border-2 border-[#08783E] space-y-4"
        >
          <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
            Create New Match Fixture (Africa/Nairobi EAT)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Opponent Club Name *
              </label>
              <input
                type="text"
                required
                value={opponentName}
                onChange={(e) => setOpponentName(e.target.value)}
                placeholder="e.g. Maragua United FC"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Competition *
              </label>
              <input
                type="text"
                required
                value={competitionName}
                onChange={(e) => setCompetitionName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Season *
              </label>
              <input
                type="text"
                required
                value={seasonName}
                onChange={(e) => setSeasonName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Venue *
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Home / Away
              </label>
              <select
                value={isHome ? 'home' : 'away'}
                onChange={(e) => setIsHome(e.target.value === 'home')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
              >
                <option value="home">Home Fixture</option>
                <option value="away">Away Fixture</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Kickoff Date & Time (EAT) *
              </label>
              <input
                type="datetime-local"
                required
                value={kickoffAt}
                onChange={(e) => setKickoffAt(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Publication Status
              </label>
              <select
                value={fixturePubStatus}
                onChange={(e) =>
                  setFixturePubStatus(e.target.value as PublicationStatus)
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white font-bold"
              >
                <option value="published">Published</option>
                <option value="draft">Private Draft</option>
              </select>
            </div>
          </div>

          {/* Opponent Logo (Optional - opponent with NO logo unless uploaded) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold uppercase text-[#063B25]">
                  Opponent Club Logo (Optional)
                </label>
                <p className="text-[11px] text-slate-500">
                  Leave empty if no logo is available. The opponent will display with <strong>no logo</strong> on all website fixtures until you upload one.
                </p>
              </div>
              {opponentCrestUrl && (
                <button
                  type="button"
                  onClick={() => setOpponentCrestUrl('')}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  ✕ Remove Opponent Logo
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={opponentCrestUrl}
                onChange={(e) => setOpponentCrestUrl(e.target.value)}
                placeholder="Paste opponent logo image URL (https://... or /uploads/...)"
                className="flex-1 w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />

              <label className="shrink-0 cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold uppercase transition">
                <Upload className="w-3.5 h-3.5 text-[#08783E]" />
                <span>Upload Logo File</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setOpponentCrestUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>

              {opponentCrestUrl ? (
                <div className="w-10 h-10 rounded-lg border border-slate-300 p-1 bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <img src={opponentCrestUrl} alt="Opponent Crest Preview" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-[9px] text-slate-400 font-bold uppercase text-center shrink-0">
                  No Logo
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F5D000] text-[#063B25] font-athletic font-black text-base uppercase tracking-wider"
          >
            <Calendar className="w-4 h-4" />
            <span>Create & Synchronize Fixture</span>
          </button>
        </form>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-[#063B25] text-white">
            <h4 className="font-athletic text-xl font-bold uppercase text-[#F5D000]">
              All Fixtures & Results ({db.fixtures.length})
            </h4>
          </div>
          {db.fixtures.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {db.fixtures.map((f) => (
                <div
                  key={f.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-xs font-bold uppercase text-[#08783E]">
                      {f.competitionName} • {f.isHome ? 'HOME' : 'AWAY'} • {f.matchStatus} •{' '}
                      {f.publicationStatus}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <div className="flex items-center gap-1.5">
                        {f.isHome ? (
                          <ClubCrest size={22} customCrestUrl={db.clubSettings.crestUrl} />
                        ) : f.opponentCrestUrl ? (
                          <img src={f.opponentCrestUrl} alt={f.opponentName} className="w-5 h-5 object-contain" />
                        ) : (
                          <span className="px-1 py-0.2 rounded bg-slate-100 text-[9px] text-slate-500 font-bold border border-slate-200">No logo</span>
                        )}
                        <span className="font-athletic text-xl sm:text-2xl font-black uppercase text-[#063B25]">
                          {f.isHome ? 'Nginda Warriors FC' : f.opponentName}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-400">vs</span>
                      <div className="flex items-center gap-1.5">
                        {!f.isHome ? (
                          <ClubCrest size={22} customCrestUrl={db.clubSettings.crestUrl} />
                        ) : f.opponentCrestUrl ? (
                          <img src={f.opponentCrestUrl} alt={f.opponentName} className="w-5 h-5 object-contain" />
                        ) : (
                          <span className="px-1 py-0.2 rounded bg-slate-100 text-[9px] text-slate-500 font-bold border border-slate-200">No logo</span>
                        )}
                        <span className="font-athletic text-xl sm:text-2xl font-black uppercase text-[#063B25]">
                          {f.isHome ? f.opponentName : 'Nginda Warriors FC'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Venue: {f.venue} • Kickoff: {new Date(f.kickoffAt).toLocaleString('en-KE')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="px-4 py-1.5 rounded-lg bg-[#063B25] text-[#F5D000] font-athletic font-black text-2xl">
                      {f.homeScore ?? '-'} : {f.awayScore ?? '-'}
                    </span>
                    <label
                      className="cursor-pointer px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1"
                      title={f.opponentCrestUrl ? 'Change Opponent Logo' : 'Upload Opponent Logo'}
                    >
                      <Upload className="w-3.5 h-3.5 text-[#08783E]" />
                      <span className="hidden sm:inline">{f.opponentCrestUrl ? 'Change Logo' : 'Add Logo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              onMutate('save_fixture', {
                                ...f,
                                opponentCrestUrl: reader.result as string,
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {f.opponentCrestUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove logo for ${f.opponentName}? Opponent will have no logo.`)) {
                            onMutate('save_fixture', {
                              ...f,
                              opponentCrestUrl: '',
                            });
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition text-xs font-bold"
                        title="Remove Opponent Logo"
                      >
                        ✕
                      </button>
                    )}
                    {(typeof f.homeScore === 'number' || typeof f.awayScore === 'number') && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Clear score and result for match vs ${f.opponentName}? Match will return to scheduled status.`)) {
                            onMutate('clear_fixture_result', { fixtureId: f.id });
                          }
                        }}
                        className="px-2.5 py-1.5 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 text-xs font-bold transition"
                        title="Clear Result"
                      >
                        Reset Result
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete fixture vs ${f.opponentName}? This cannot be undone.`)) {
                          onMutate('delete_fixture', { id: f.id });
                        }
                      }}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                      title="Delete Fixture"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-8 text-center text-sm text-gray-500">
              No fixtures created yet.
            </p>
          )}
        </div>
      </div>
    );
  }

  // 4. SIMPLIFIED MOBILE-FIRST 60-SECOND MATCH CENTRE UPDATER
  if (activeModule === 'match-centre') {
    const activeFix =
      db.fixtures.find((f) => f.id === selectedFixtureId) || db.fixtures[0];

    return (
      <div className="space-y-8">
        <div className="bg-[#063B25] text-white rounded-2xl p-6 border-2 border-[#F5D000] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[#F5D000] font-athletic font-black text-sm uppercase tracking-wider">
              <Zap className="w-5 h-5" />
              <span>60-Second Mobile Match Official Score Console</span>
            </div>
            <span className="text-xs text-emerald-200">
              Instant Live Public Scoreboard Sync
            </span>
          </div>

          {db.fixtures.length > 0 ? (
            <>
              <div>
                <label className="block text-xs font-bold uppercase text-[#F5D000] mb-1">
                  Select Active Fixture
                </label>
                <select
                  value={activeFix?.id || ''}
                  onChange={(e) => {
                    const found = db.fixtures.find((f) => f.id === e.target.value);
                    setSelectedFixtureId(e.target.value);
                    if (found) {
                      setQuickHomeScore(found.homeScore ?? 0);
                      setQuickAwayScore(found.awayScore ?? 0);
                      setQuickStatus(found.matchStatus);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08783E] text-white border border-[#F5D000]/40 text-sm font-bold"
                >
                  {db.fixtures.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.isHome
                        ? `Nginda Warriors vs ${f.opponentName}`
                        : `${f.opponentName} vs Nginda Warriors`}{' '}
                      ({f.matchStatus})
                    </option>
                  ))}
                </select>
              </div>

              {activeFix && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-[#08783E]/40 p-5 rounded-xl border border-[#F5D000]/30">
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      {activeFix.isHome ? (
                        <ClubCrest size={28} customCrestUrl={db.clubSettings.crestUrl} />
                      ) : activeFix.opponentCrestUrl ? (
                        <img src={activeFix.opponentCrestUrl} alt={activeFix.opponentName} className="w-7 h-7 object-contain" />
                      ) : null}
                      <p className="font-athletic text-xl font-bold uppercase">
                        {activeFix.isHome ? 'Nginda Warriors FC' : activeFix.opponentName} (Home)
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuickHomeScore(Math.max(0, quickHomeScore - 1))}
                        className="w-10 h-10 rounded-lg bg-[#063B25] text-white font-bold text-xl"
                      >
                        -
                      </button>
                      <span className="font-athletic text-5xl font-black text-[#F5D000]">
                        {quickHomeScore}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuickHomeScore(quickHomeScore + 1)}
                        className="w-10 h-10 rounded-lg bg-[#F5D000] text-[#063B25] font-black text-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-center text-[#F5D000]">
                      Match Phase
                    </label>
                    <select
                      value={quickStatus}
                      onChange={(e) => setQuickStatus(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#063B25] text-[#F5D000] border border-[#F5D000] font-athletic font-bold text-base uppercase text-center"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="live_first_half">Live — 1st Half</option>
                      <option value="halftime">Halftime (HT)</option>
                      <option value="live_second_half">Live — 2nd Half</option>
                      <option value="fulltime">Fulltime (FT - Final Result)</option>
                    </select>
                  </div>

                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      {!activeFix.isHome ? (
                        <ClubCrest size={28} customCrestUrl={db.clubSettings.crestUrl} />
                      ) : activeFix.opponentCrestUrl ? (
                        <img src={activeFix.opponentCrestUrl} alt={activeFix.opponentName} className="w-7 h-7 object-contain" />
                      ) : null}
                      <p className="font-athletic text-xl font-bold uppercase">
                        {activeFix.isHome ? activeFix.opponentName : 'Nginda Warriors FC'} (Away)
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuickAwayScore(Math.max(0, quickAwayScore - 1))}
                        className="w-10 h-10 rounded-lg bg-[#063B25] text-white font-bold text-xl"
                      >
                        -
                      </button>
                      <span className="font-athletic text-5xl font-black text-[#F5D000]">
                        {quickAwayScore}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuickAwayScore(quickAwayScore + 1)}
                        className="w-10 h-10 rounded-lg bg-[#F5D000] text-[#063B25] font-black text-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Goal Scorer / Card Event */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={scorerName}
                  onChange={(e) => setScorerName(e.target.value)}
                  placeholder="Optional Goal Scorer / Player Name"
                  className="px-3 py-2 rounded-lg bg-[#063B25] text-white border border-[#08783E] text-sm"
                />
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={eventMinute}
                  onChange={(e) => setEventMinute(e.target.value)}
                  placeholder="Minute (e.g. 64)"
                  className="px-3 py-2 rounded-lg bg-[#063B25] text-white border border-[#08783E] text-sm"
                />
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-[#063B25] text-white border border-[#08783E] text-sm"
                >
                  <option value="goal">Goal</option>
                  <option value="penalty_goal">Penalty Goal</option>
                  <option value="yellow_card">Yellow Card</option>
                  <option value="red_card">Red Card</option>
                  <option value="substitution">Substitution</option>
                </select>
              </div>

              <button
                type="button"
                onClick={async () => {
                  if (!activeFix) return;
                  await onMutate('quick_update_score', {
                    fixtureId: activeFix.id,
                    homeScore: quickHomeScore,
                    awayScore: quickAwayScore,
                    matchStatus: quickStatus,
                    publicationStatus: 'published',
                    scorerName: scorerName || undefined,
                    minute: Number(eventMinute),
                    eventType,
                  });
                  setScorerName('');
                }}
                className="w-full py-3.5 rounded-xl bg-[#F5D000] hover:bg-[#ffe033] text-[#063B25] font-athletic font-black text-xl uppercase tracking-wider shadow-lg"
              >
                Publish Live Score & Match Update Now
              </button>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#08783E]">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Reset and clear all scores/events for vs ${activeFix.opponentName}? Match will return to scheduled status.`)) {
                      onMutate('clear_fixture_result', { fixtureId: activeFix.id });
                    }
                  }}
                  className="px-3.5 py-2 rounded-lg bg-red-950/70 hover:bg-red-900 text-red-200 border border-red-700/60 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear / Reset Match Score Result</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Permanently delete fixture vs ${activeFix.opponentName}? This cannot be undone.`)) {
                      onMutate('delete_fixture', { id: activeFix.id });
                    }
                  }}
                  className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete This Fixture</span>
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-emerald-100">
              Create a fixture in the Fixtures module first to unlock the 60-second mobile score updater.
            </p>
          )}
        </div>

        {/* Lineup & Match Report Forms */}
        {activeFix && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await onMutate('add_lineup_entry', {
                  fixtureId: activeFix.id,
                  playerName: lineupPlayerName,
                  jerseyNumber: Number(lineupJersey),
                  position: lineupPos,
                  isStarting: true,
                });
                setLineupPlayerName('');
              }}
              className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4"
            >
              <h4 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
                Record Matchday Lineup ({activeFix.lineups.length} Added)
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={lineupPlayerName}
                  onChange={(e) => setLineupPlayerName(e.target.value)}
                  placeholder="Player Name"
                  className="px-3 py-2 rounded border border-gray-300 text-sm"
                />
                <input
                  type="number"
                  required
                  value={lineupJersey}
                  onChange={(e) => setLineupJersey(e.target.value)}
                  placeholder="Jersey #"
                  className="px-3 py-2 rounded border border-gray-300 text-sm"
                />
                <input
                  type="text"
                  required
                  value={lineupPos}
                  onChange={(e) => setLineupPos(e.target.value)}
                  placeholder="Pos (GK/DEF/MID/FWD)"
                  className="px-3 py-2 rounded border border-gray-300 text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#08783E] text-white font-athletic font-bold text-sm uppercase tracking-wider"
              >
                + Add Player to Match Lineup
              </button>
            </form>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await onMutate('save_match_report', {
                  fixtureId: activeFix.id,
                  headline: reportHeadline,
                  summary: reportSummary,
                  body: reportBody,
                });
                setReportHeadline('');
                setReportSummary('');
                setReportBody('');
              }}
              className="bg-white rounded-2xl p-6 border border-gray-200 space-y-3"
            >
              <h4 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
                Publish Official Match Report
              </h4>
              <input
                type="text"
                required
                value={reportHeadline}
                onChange={(e) => setReportHeadline(e.target.value)}
                placeholder="Match Report Headline"
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
              />
              <input
                type="text"
                required
                value={reportSummary}
                onChange={(e) => setReportSummary(e.target.value)}
                placeholder="Short Summary"
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
              />
              <textarea
                rows={3}
                required
                value={reportBody}
                onChange={(e) => setReportBody(e.target.value)}
                placeholder="Full match report narrative..."
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#F5D000] text-[#063B25] font-athletic font-black text-sm uppercase tracking-wider"
              >
                Publish Match Report
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  // 5. COMPETITIONS MODULE
  if (activeModule === 'competitions') {
    return (
      <div className="space-y-6">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onMutate('save_competition', {
              name: newCompName,
              seasonName: newCompSeason,
              pointsForWin: 3,
              pointsForDraw: 1,
              pointsForLoss: 0,
            });
            setNewCompName('');
          }}
          className="bg-white rounded-2xl p-6 border-2 border-[#08783E] space-y-4"
        >
          <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
            Register Competition & Points Rules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              value={newCompName}
              onChange={(e) => setNewCompName(e.target.value)}
              placeholder="Competition Name (e.g. FKF County League)"
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
            />
            <input
              type="text"
              required
              value={newCompSeason}
              onChange={(e) => setNewCompSeason(e.target.value)}
              placeholder="Season (e.g. 2026/2027 Season)"
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#F5D000] text-[#063B25] font-athletic font-black text-sm uppercase tracking-wider"
          >
            Save Competition
          </button>
        </form>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h4 className="font-athletic text-xl font-bold uppercase text-[#063B25] mb-3">
            Configured Competitions ({db.competitions.length})
          </h4>
          {db.competitions.map((c) => (
            <div key={c.id} className="p-3 rounded-lg bg-[#EEF7EF] mb-2 text-sm font-bold text-[#063B25] flex items-center justify-between">
              <span>{c.name} ({c.seasonName}) — Win: {c.pointsForWin}pts, Draw: {c.pointsForDraw}pt • {c.tiebreakerRules}</span>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete competition "${c.name}"?`)) {
                    onMutate('delete_competition', { id: c.id });
                  }
                }}
                className="p-1.5 rounded text-red-600 hover:text-white hover:bg-red-600 transition"
                title="Delete Competition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. LEAGUE STANDINGS MODULE
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-6 border-2 border-[#08783E] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
              League Standings Management
            </h3>
            <p className="text-xs text-gray-600">
              Enter verified standings manually or calculate automatically from verified fulltime results.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (confirm('Clear all rows in the league standings table?')) {
                  onMutate('clear_all_standings', {});
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-600 hover:text-white border border-red-200 font-athletic font-bold text-xs uppercase tracking-wider transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Table</span>
            </button>
            <button
              type="button"
              onClick={() =>
                onMutate('auto_calculate_standings', {
                  competitionName: 'FKF Regional League',
                  seasonName: '2026/2027 Season',
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#063B25] text-[#F5D000] font-athletic font-bold text-sm uppercase tracking-wider"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Auto-Calculate From Verified Results</span>
            </button>
          </div>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onMutate('save_standing_row', {
              position: Number(standingPos),
              clubName: standingClub,
              won: Number(standingWon),
              drawn: Number(standingDrawn),
              lost: Number(standingLost),
              goalsFor: Number(standingGf),
              goalsAgainst: Number(standingGa),
              publicationStatus: 'published',
            });
          }}
          className="grid grid-cols-2 sm:grid-cols-8 gap-3 pt-2"
        >
          <input
            type="number"
            min="1"
            value={standingPos}
            onChange={(e) => setStandingPos(e.target.value)}
            placeholder="Pos"
            className="px-3 py-2 rounded border border-gray-300 text-sm"
          />
          <input
            type="text"
            required
            value={standingClub}
            onChange={(e) => setStandingClub(e.target.value)}
            placeholder="Club Name"
            className="sm:col-span-2 px-3 py-2 rounded border border-gray-300 text-sm font-bold"
          />
          <input
            type="number"
            min="0"
            value={standingWon}
            onChange={(e) => setStandingWon(e.target.value)}
            placeholder="Won"
            className="px-3 py-2 rounded border border-gray-300 text-sm"
          />
          <input
            type="number"
            min="0"
            value={standingDrawn}
            onChange={(e) => setStandingDrawn(e.target.value)}
            placeholder="Drawn"
            className="px-3 py-2 rounded border border-gray-300 text-sm"
          />
          <input
            type="number"
            min="0"
            value={standingLost}
            onChange={(e) => setStandingLost(e.target.value)}
            placeholder="Lost"
            className="px-3 py-2 rounded border border-gray-300 text-sm"
          />
          <input
            type="number"
            min="0"
            value={standingGf}
            onChange={(e) => setStandingGf(e.target.value)}
            placeholder="GF"
            className="px-3 py-2 rounded border border-gray-300 text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-[#F5D000] text-[#063B25] font-athletic font-black text-sm uppercase"
          >
            + Save Row
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-[#063B25] text-white">
          <h4 className="font-athletic text-xl font-bold uppercase text-[#F5D000]">
            Current Published Table ({db.standings.length} Teams)
          </h4>
        </div>
        {db.standings.length > 0 ? (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#EEF7EF] text-[#063B25] font-athletic uppercase text-xs font-bold">
                <th className="py-2.5 px-4">Pos</th>
                <th className="py-2.5 px-4">Club</th>
                <th className="py-2.5 px-3 text-center">P</th>
                <th className="py-2.5 px-3 text-center">W/D/L</th>
                <th className="py-2.5 px-3 text-center">GD</th>
                <th className="py-2.5 px-4 text-center">PTS</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {db.standings.map((r) => (
                <tr
                  key={r.id}
                  className={r.isNgindaWarriors ? 'bg-[#08783E] text-white font-bold' : ''}
                >
                  <td className="py-2.5 px-4">{r.position}</td>
                  <td className="py-2.5 px-4">{r.clubName}</td>
                  <td className="py-2.5 px-3 text-center">{r.played}</td>
                  <td className="py-2.5 px-3 text-center">
                    {r.won}/{r.drawn}/{r.lost}
                  </td>
                  <td className="py-2.5 px-3 text-center">{r.goalDifference}</td>
                  <td className="py-2.5 px-4 text-center font-black">{r.points}</td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove ${r.clubName} from standings?`)) {
                          onMutate('delete_standing_row', { id: r.id });
                        }
                      }}
                      className="p-1 rounded text-red-500 hover:text-white hover:bg-red-600 transition"
                      title="Delete Row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-sm text-gray-500">
            <Award className="w-8 h-8 text-[#08783E] mx-auto mb-2" />
            No league standings entered yet.
          </div>
        )}
      </div>
    </div>
  );
}
