'use client';

import React, { useState } from 'react';
import { CheckCircle2, Lock, ShieldAlert, UserPlus } from 'lucide-react';

export default function PlayerRecruitmentPage() {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('19');
  const [preferredPosition, setPreferredPosition] = useState('Central Midfielder');
  const [preferredFoot, setPreferredFoot] = useState<'Right' | 'Left' | 'Both'>('Right');
  const [playingExperience, setPlayingExperience] = useState('');
  const [county, setCounty] = useState("Murang'a County");
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [achievements, setAchievements] = useState('');
  const [highlightVideoUrl, setHighlightVideoUrl] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianConsentConfirmed, setGuardianConsentConfirmed] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const numericAge = Number(age || 0);
  const isMinor = numericAge > 0 && numericAge < 18;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/public/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'recruitment_application',
          payload: {
            fullName,
            age: numericAge,
            preferredPosition,
            preferredFoot,
            playingExperience,
            county,
            phoneNumber,
            email,
            achievements,
            highlightVideoUrl,
            guardianName: isMinor ? guardianName : undefined,
            guardianPhone: isMinor ? guardianPhone : undefined,
            guardianConsentConfirmed: isMinor ? guardianConsentConfirmed : true,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || 'Could not submit trial application.');
      } else {
        setSuccessMsg(data.message);
        setFullName('');
        setPlayingExperience('');
        setPhoneNumber('');
        setAchievements('');
        setHighlightVideoUrl('');
      }
    } catch {
      setErrorMsg('Network error submitting trial application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner - White Dominant */}
      <section className="bg-slate-50 text-slate-900 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="px-3 py-1 rounded-full bg-[#08783E]/10 border border-[#08783E]/20 text-[#08783E] font-pedals font-athletic font-extrabold text-xs uppercase tracking-widest">
            TECHNICAL BENCH SCOUTING & TRIALS
          </span>
          <h1 className="font-pedals font-athletic text-4xl sm:text-5xl font-black uppercase text-slate-950 mt-2">
            PLAYER RECRUITMENT & TRIAL APPLICATION
          </h1>
          <p className="text-slate-600 text-base mt-1 max-w-2xl">
            Apply for official trials with Nginda Warriors FC. All applications are transmitted privately to the Technical Bench and are never visible to public visitors.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-[#08783E] font-pedals font-athletic font-bold uppercase text-sm">
              <UserPlus className="w-5 h-5 text-[#08783E]" />
              <span>Confidential Trial Application Dossier</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500">
              <Lock className="w-3.5 h-3.5 text-[#08783E]" /> Private Submission
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Applicant Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Player Full Name"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-[#08783E] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Age (Years) *
              </label>
              <input
                type="number"
                min="10"
                max="45"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-bold focus:border-[#08783E] focus:outline-none"
              />
            </div>
          </div>

          {/* Mandatory Guardian Consent Block for Minors (Under 18) */}
          {isMinor && (
            <div className="p-5 rounded-xl bg-amber-50 border-2 border-amber-300 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-pedals font-athletic font-black uppercase text-base">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <span>Safeguarding & Parent/Guardian Consent (Applicant Under 18)</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Nginda Warriors FC complies with Kenyan youth football safeguarding guidelines. Applicants under 18 years of age must provide verified parent/guardian details and explicit consent to attend trials.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                    Parent / Guardian Full Name *
                  </label>
                  <input
                    type="text"
                    required={isMinor}
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="Parent / Guardian Name"
                    className="w-full px-3.5 py-2 rounded-lg border border-amber-300 bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                    Parent / Guardian Phone Number *
                  </label>
                  <input
                    type="tel"
                    required={isMinor}
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="07XX XXX XXX"
                    className="w-full px-3.5 py-2 rounded-lg border border-amber-300 bg-white text-sm"
                  />
                </div>
              </div>
              <label className="flex items-start gap-2 pt-1 text-xs font-bold text-amber-950 cursor-pointer">
                <input
                  type="checkbox"
                  required={isMinor}
                  checked={guardianConsentConfirmed}
                  onChange={(e) => setGuardianConsentConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-amber-400"
                />
                <span>
                  I confirm that my parent or legal guardian is aware of this trial application and grants permission for my participation in Nginda Warriors FC scouting activities.
                </span>
              </label>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Preferred Position *
              </label>
              <select
                value={preferredPosition}
                onChange={(e) => setPreferredPosition(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:border-[#08783E] focus:outline-none"
              >
                <option value="Goalkeeper">Goalkeeper</option>
                <option value="Centre-Back">Centre-Back</option>
                <option value="Right-Back">Right-Back</option>
                <option value="Left-Back">Left-Back</option>
                <option value="Defensive Midfielder">Defensive Midfielder</option>
                <option value="Central Midfielder">Central Midfielder</option>
                <option value="Attacking Midfielder">Attacking Midfielder</option>
                <option value="Right Winger">Right Winger</option>
                <option value="Left Winger">Left Winger</option>
                <option value="Centre-Forward">Centre-Forward</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Preferred Foot *
              </label>
              <select
                value={preferredFoot}
                onChange={(e) => setPreferredFoot(e.target.value as 'Right' | 'Left' | 'Both')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:border-[#08783E] focus:outline-none"
              >
                <option value="Right">Right</option>
                <option value="Left">Left</option>
                <option value="Both">Both (Ambidextrous)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                County of Residence *
              </label>
              <input
                type="text"
                required
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                placeholder="e.g. Murang'a"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-[#08783E] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Applicant Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="07XX XXX XXX"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-[#08783E] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-[#08783E] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Previous Clubs & Playing Experience *
            </label>
            <textarea
              rows={3}
              required
              value={playingExperience}
              onChange={(e) => setPlayingExperience(e.target.value)}
              placeholder="Describe your school, academy, or league football experience..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-[#08783E] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Notable Football Achievements (Optional)
              </label>
              <input
                type="text"
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                placeholder="e.g. Best Midfielder, Sub-County Cup"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-[#08783E] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Highlight Video Link (YouTube / Drive - Optional)
              </label>
              <input
                type="url"
                value={highlightVideoUrl}
                onChange={(e) => setHighlightVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-[#08783E] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-[#08783E] hover:bg-[#063B25] text-white font-pedals font-athletic font-black text-lg uppercase tracking-wider shadow-sm transition"
          >
            {submitting ? 'Submitting Application...' : 'Submit Confidential Trial Application'}
          </button>

          {successMsg && (
            <div className="p-4 rounded-xl bg-[#08783E]/10 border border-[#08783E]/30 text-[#08783E] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#08783E] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
