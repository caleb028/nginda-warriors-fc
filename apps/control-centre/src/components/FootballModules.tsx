'use client';

import React, { useState } from 'react';
import {
  NgindaDatabaseSchema,
  Player,
  PositionGroup,
  PublicationStatus,
} from '@nginda-warriors/shared';
import {
  Award,
  Calendar,
  CheckCircle2,
  Edit3,
  Plus,
  RefreshCw,
  Trash2,
  Trophy,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';

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
  const [jerseyNumber, setJerseyNumber] = useState('9');
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

  // --- STAFF STATE ---
  const [staffName, setStaffName] = useState('');
  const [staffRoleTitle, setStaffRoleTitle] = useState('Head Coach');
  const [staffCategory, setStaffCategory] = useState<'Technical Bench' | 'Club Leadership'>(
    'Technical Bench'
  );
  const [staffBio, setStaffBio] = useState('');
  const [staffPubStatus, setStaffPubStatus] = useState<PublicationStatus>('published');

  // --- FIXTURE STATE ---
  const [opponentName, setOpponentName] = useState('');
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
  };

  // 1. PLAYERS MODULE
  if (activeModule === 'players') {
    return (
      <div className="space-y-8">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onMutate('save_player', {
              id: editingPlayerId || undefined,
              fullName: playerName,
              jerseyNumber: Number(jerseyNumber),
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
            });
            setEditingPlayerId(null);
            setPlayerName('');
            setBiography('');
          }}
          className="bg-white rounded-2xl p-6 border-2 border-[#08783E] shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
              {editingPlayerId ? 'Edit Squad Player Profile' : 'Add New Squad Player'}
            </h3>
            {editingPlayerId && (
              <button
                type="button"
                onClick={() => setEditingPlayerId(null)}
                className="text-xs font-bold text-red-600"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="e.g. Samuel Kamau"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Player Photograph URL (Optional)
              </label>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://... or /uploads/player.jpg"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
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
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F5D000] hover:bg-[#ffe033] text-[#063B25] font-athletic font-black text-base uppercase tracking-wider shadow"
            >
              <Plus className="w-4 h-4" />
              <span>{editingPlayerId ? 'Update Player' : 'Save & Synchronize Player'}</span>
            </button>
          </div>
        </form>

        {/* Players Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-[#063B25] text-white flex items-center justify-between">
            <h3 className="font-athletic text-xl font-bold uppercase text-[#F5D000]">
              Squad Directory ({db.players.length} Total)
            </h3>
          </div>
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
                  {db.players.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-athletic text-lg font-black text-[#08783E]">
                        #{p.jerseyNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#063B25]">
                        {p.fullName}
                        {p.isFeatured && (
                          <span className="ml-2 px-2 py-0.5 rounded bg-[#F5D000] text-[#063B25] text-[10px] font-black uppercase">
                            Featured
                          </span>
                        )}
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
                      <td className="py-3 px-4 text-right space-x-2">
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
                          onClick={() => onMutate('delete_player', { id: p.id })}
                          className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                          title="Delete Player"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
              publicationStatus: staffPubStatus,
            });
            setStaffName('');
            setStaffBio('');
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
                  className="p-4 rounded-xl bg-[#EEF7EF]/50 border border-gray-200 flex items-start justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#08783E]">
                      {s.category} • {s.publicationStatus}
                    </span>
                    <p className="font-athletic text-xl font-bold uppercase text-[#063B25]">
                      {s.fullName}
                    </p>
                    <p className="text-xs font-bold text-[#08783E]">{s.roleTitle}</p>
                    <p className="text-xs text-gray-600 mt-1">{s.biography}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onMutate('delete_staff', { id: s.id })}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
            await onMutate('save_fixture', {
              opponentName,
              competitionName,
              seasonName,
              venue,
              isHome,
              kickoffAt: new Date(kickoffAt).toISOString(),
              publicationStatus: fixturePubStatus,
            });
            setOpponentName('');
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
                    <p className="font-athletic text-2xl font-black uppercase text-[#063B25]">
                      {f.isHome
                        ? `Nginda Warriors FC vs ${f.opponentName}`
                        : `${f.opponentName} vs Nginda Warriors FC`}
                    </p>
                    <p className="text-xs text-gray-500">
                      Venue: {f.venue} • Kickoff: {new Date(f.kickoffAt).toLocaleString('en-KE')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 rounded-lg bg-[#063B25] text-[#F5D000] font-athletic font-black text-2xl">
                      {f.homeScore ?? '-'} : {f.awayScore ?? '-'}
                    </span>
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
                    <p className="font-athletic text-xl font-bold uppercase">
                      {activeFix.isHome ? 'Nginda Warriors FC' : activeFix.opponentName} (Home)
                    </p>
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
                    <p className="font-athletic text-xl font-bold uppercase">
                      {activeFix.isHome ? activeFix.opponentName : 'Nginda Warriors FC'} (Away)
                    </p>
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
