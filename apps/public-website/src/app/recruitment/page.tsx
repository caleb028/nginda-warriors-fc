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
    <div className="bg-black text-white min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#0A0A0A] text-white py-12 border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="font-athletic text-4xl sm:text-5xl font-black uppercase text-white mt-2">
            PLAYER RECRUITMENT & TRIAL APPLICATION
          </h1>
          <p className="text-slate-300 text-base mt-1 max-w-2xl">
            Apply for official trials with Nginda Warriors FC. All applications are transmitted privately to the Technical Bench and are never visible to public visitors.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-[#141414] rounded-2xl p-6 sm:p-8 border border-[#262626] shadow-xl space-y-5 text-white"
        >
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <div className="flex items-center gap-2 text-[#FDE100] font-athletic font-bold uppercase text-sm">
              <UserPlus className="w-5 h-5 text-[#FDE100]" />
              <span>Confidential Trial Application Dossier</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
              <Lock className="w-3.5 h-3.5 text-[#FDE100]" /> Private Submission
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                Applicant Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Player Full Name"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#262626] bg-[#0D0D0D] text-white placeholder-slate-500 text-sm focus:border-[#262626] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                Age (Years) *
              </label>
              <input
                type="number"
                min="10"
                max="45"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#262626] bg-[#0D0D0D] text-white text-sm font-bold focus:border-[#262626] focus:outline-none"
              />
            </div>
          </div>

          {/* Mandatory Guardian Consent Block for Minors (Under 18) */}
          {isMinor && (
            <div className="p-5 rounded-xl bg-[#1A1A1A] border-2 border-amber-500/40 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-athletic font-black uppercase text-base">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>Safeguarding & Parent/Guardian Consent (Applicant Under 18)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Nginda Warriors FC complies with Kenyan youth football safeguarding guidelines. Applicants under 18 years of age must provide verified parent/guardian details and explicit consent to attend trials.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold uppercase text-amber-200 mb-1">
                    Parent / Guardian Full Name *
                  </label>
                  <input
                    type="text"
                    required={isMinor}
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="Parent / Guardian Name"
                    className="w-full px-3.5 py-2 rounded-lg border border-[#262626] bg-[#0D0D0D] text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-amber-200 mb-1">
                    Parent / Guardian Phone Number *
                  </label>
                  <input
                    type="tel"
                    required={isMinor}
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="07XX XXX XXX"
                    className="w-full px-3.5 py-2 rounded-lg border border-[#262626] bg-[#0D0D0D] text-white text-sm"
                  />
                </div>
              </div>
              <label className="flex items-start gap-2 pt-1 text-xs font-bold text-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  required={isMinor}
                  checked={guardianConsentConfirmed}
                  onChange={(e) => setGuardianConsentConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-[#262626] bg-[#0D0D0D]"
                />
                <span>
                  I confirm that my parent or legal guardian is aware of this trial application and grants permission for my participation in Nginda Warriors FC scouting activities.
                </span>
              </label>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                Preferred Position *
              </label>
              <select
                value={preferredPosition}
                onChange={(e) => setPreferredPosition(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#262626] text-sm bg-[#0D0D0D] text-white focus:border-[#262626] focus:outline-none"
              >
                <option value="Goalkeeper" className="bg-[#0D0D0D] text-white">Goalkeeper</option>
                <option value="Centre-Back" className="bg-[#0D0D0D] text-white">Centre-Back</option>
                <option value="Right-Back" className="bg-[#0D0D0D] text-white">Right-Back</option>
                <option value="Left-Back" className="bg-[#0D0D0D] text-white">Left-Back</option>
                <option value="Defensive Midfielder" className="bg-[#0D0D0D] text-white">Defensive Midfielder</option>
                <option value="Central Midfielder" className="bg-[#0D0D0D] text-white">Central Midfielder</option>
                <option value="Attacking Midfielder" className="bg-[#0D0D0D] text-white">Attacking Midfielder</option>
                <option value="Right Winger" className="bg-[#0D0D0D] text-white">Right Winger</option>
                <option value="Left Winger" className="bg-[#0D0D0D] text-white">Left Winger</option>
                <option value="Centre-Forward" className="bg-[#0D0D0D] text-white">Centre-Forward</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                Preferred Foot *
              </label>
              <select
                value={preferredFoot}
                onChange={(e) => setPreferredFoot(e.target.value as 'Right' | 'Left' | 'Both')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#262626] text-sm bg-[#0D0D0D] text-white focus:border-[#262626] focus:outline-none"
              >
                <option value="Right" className="bg-[#0D0D0D] text-white">Right</option>
                <option value="Left" className="bg-[#0D0D0D] text-white">Left</option>
                <option value="Both" className="bg-[#0D0D0D] text-white">Both (Ambidextrous)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                County of Residence *
              </label>
              <input
                type="text"
                required
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                placeholder="e.g. Murang'a"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#262626] bg-[#0D0D0D] text-white placeholder-slate-500 text-sm focus:border-[#262626] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                Applicant Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="07XX XXX XXX"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#262626] bg-[#0D0D0D] text-white placeholder-slate-500 text-sm focus:border-[#262626] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#262626] bg-[#0D0D0D] text-white placeholder-slate-500 text-sm focus:border-[#262626] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
              Previous Clubs & Playing Experience *
            </label>
            <textarea
              rows={3}
              required
              value={playingExperience}
              onChange={(e) => setPlayingExperience(e.target.value)}
              placeholder="Describe your school, academy, or league football experience..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#262626] bg-[#0D0D0D] text-white placeholder-slate-500 text-sm focus:border-[#262626] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                Notable Football Achievements (Optional)
              </label>
              <input
                type="text"
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                placeholder="e.g. Best Midfielder, Sub-County Cup"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#262626] bg-[#0D0D0D] text-white placeholder-slate-500 text-sm focus:border-[#262626] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                Highlight Video Link (YouTube / Drive - Optional)
              </label>
              <input
                type="url"
                value={highlightVideoUrl}
                onChange={(e) => setHighlightVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#262626] bg-[#0D0D0D] text-white placeholder-slate-500 text-sm focus:border-[#262626] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-[#FDE100] hover:bg-[#FFE600] text-black font-athletic font-black text-lg uppercase tracking-wider shadow-md transition active:scale-95"
          >
            {submitting ? 'Submitting Application...' : 'Submit Confidential Trial Application'}
          </button>

          {successMsg && (
            <div className="p-4 rounded-xl bg-[#082012] border border-[#262626] text-[#FDE100] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#FDE100] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs font-semibold">
              {errorMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
