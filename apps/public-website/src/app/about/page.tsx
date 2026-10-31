import React from 'react';
import { ClubCrest, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { Award, CheckCircle2, Compass, Flag, MapPin, Shield, Target, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AboutClubPage() {
  const { clubSettings, staff } = getPublicWebsiteSnapshot();
  const { clubInfo } = clubSettings;

  const leadership = staff.filter((s) => s.category === 'Club Leadership');
  const technicalBench = staff.filter((s) => s.category === 'Technical Bench');

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Page Header - Pitch Black Banner */}
      <section className="bg-[#070C09] text-white py-12 sm:py-16 border-b border-[#1E2B23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-[#08783E]/20 border border-[#08783E]/40 text-[#4ADE80] font-pedals font-athletic font-black text-xs uppercase tracking-widest">
              ESTABLISHED {clubSettings.establishedYear} • OFFICIAL CLUB IDENTITY
            </span>
            <h1 className="font-pedals font-athletic text-5xl sm:text-6xl font-black uppercase tracking-tight text-white">
              ABOUT {clubSettings.clubName}
            </h1>
            <p className="text-lg text-[#F5D000] font-athletic font-bold max-w-2xl">
              “{clubSettings.tagline}”
            </p>
          </div>
          <div className="p-3 rounded-full bg-[#0A0F0D] border border-[#1E2B23] shadow-md">
            <ClubCrest size={120} customCrestUrl={clubSettings.crestUrl} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* 1. About the Club & Club History */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#0D1410] rounded-2xl p-8 border border-[#1E2B23] shadow-xl border-t-4 border-t-[#08783E]">
            <div className="flex items-center gap-2.5 text-[#4ADE80] font-pedals font-athletic font-bold uppercase text-sm tracking-wider mb-2">
              <Shield className="w-5 h-5 text-[#4ADE80]" />
              <span>Club Identity</span>
            </div>
            <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-white mb-4">
              About the Club
            </h2>
            <p className="text-slate-300 leading-relaxed">{clubInfo.aboutSummary}</p>
          </div>

          <div className="bg-[#0D1410] rounded-2xl p-8 border border-[#1E2B23] shadow-xl border-t-4 border-t-[#D5AA00]">
            <div className="flex items-center gap-2.5 text-[#F5D000] font-pedals font-athletic font-bold uppercase text-sm tracking-wider mb-2">
              <Flag className="w-5 h-5 text-[#F5D000]" />
              <span>Est. {clubSettings.establishedYear}</span>
            </div>
            <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-white mb-4">
              Club History
            </h2>
            <p className="text-slate-300 leading-relaxed">{clubInfo.historyNarrative}</p>
          </div>
        </section>

        {/* 2. Vision and Mission */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0D1410] text-white rounded-2xl p-8 border border-[#1E2B23] border-t-4 border-t-[#08783E] shadow-xl">
            <Compass className="w-9 h-9 text-[#4ADE80] mb-3" />
            <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-white mb-3">
              Our Vision
            </h2>
            <p className="text-slate-300 leading-relaxed text-base">
              {clubInfo.visionStatement}
            </p>
          </div>

          <div className="bg-[#0D1410] text-white rounded-2xl p-8 border border-[#1E2B23] border-t-4 border-t-[#D5AA00] shadow-xl">
            <Target className="w-9 h-9 text-[#F5D000] mb-3" />
            <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-white mb-3">
              Our Mission
            </h2>
            <p className="text-slate-300 leading-relaxed text-base">
              {clubInfo.missionStatement}
            </p>
          </div>
        </section>

        {/* 3. Club Values */}
        <section>
          <h2 className="font-pedals font-athletic text-3xl sm:text-4xl font-black uppercase text-white mb-6">
            Core Club Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clubInfo.coreValues.map((val, idx) => (
              <div
                key={idx}
                className="bg-[#0D1410] rounded-2xl p-6 border border-[#1E2B23] shadow-md"
              >
                <CheckCircle2 className="w-6 h-6 text-[#4ADE80] mb-3" />
                <h3 className="font-pedals font-athletic text-xl font-bold uppercase text-white">
                  {val.title}
                </h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Honours and Milestones */}
        <section className="bg-[#0D1410] rounded-2xl p-8 border border-[#1E2B23] shadow-xl">
          <div className="flex items-center gap-2.5 text-[#F5D000] font-pedals font-athletic font-bold uppercase text-sm tracking-wider mb-2">
            <Award className="w-5 h-5 text-[#F5D000]" />
            <span>Official Club Record</span>
          </div>
          <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-white mb-6">
            Honours & Milestones
          </h2>
          <div className="space-y-4">
            {clubInfo.honoursAndMilestones.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-[#080D0A] border border-[#18231C]"
              >
                <span className="px-4 py-1.5 rounded-lg bg-[#08783E] text-white font-pedals font-athletic font-black text-xl shadow-xs">
                  {item.year}
                </span>
                <div>
                  <h3 className="font-pedals font-athletic text-xl font-bold uppercase text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Club Leadership & Technical Bench */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-pedals font-athletic text-3xl sm:text-4xl font-black uppercase text-white">
                Club Leadership & Technical Bench
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Verified club officials and coaching staff approved for publication.
              </p>
            </div>
          </div>

          {leadership.length > 0 || technicalBench.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...leadership, ...technicalBench].map((member) => (
                <div
                  key={member.id}
                  className="bg-[#0D1410] rounded-2xl p-6 border border-[#1E2B23] shadow-md"
                >
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#08783E]/20 text-[#4ADE80] border border-[#08783E]/40 text-[11px] font-extrabold uppercase tracking-wider mb-3">
                    {member.category}
                  </span>
                  <h3 className="font-pedals font-athletic text-2xl font-bold uppercase text-white">
                    {member.fullName}
                  </h3>
                  <p className="text-xs font-extrabold uppercase text-[#F5D000] mt-0.5">
                    {member.roleTitle}
                  </p>
                  <p className="text-sm text-slate-300 mt-3">{member.biography}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-[#0D1410] p-8 text-center border border-[#1E2B23]">
              <Users className="w-10 h-10 text-slate-500 mx-auto mb-2" />
              <p className="font-pedals font-athletic text-xl font-bold uppercase text-white">
                Leadership & Technical Staff Directory Pending Publication
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Official profiles for the Chairman, Secretary, Treasurer, and Coaching Staff appear here once published by the Super Admin.
              </p>
            </div>
          )}
        </section>

        {/* 6. Home Ground & Training Ground */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0D1410] rounded-2xl p-8 border border-[#1E2B23] shadow-md">
            <div className="flex items-center gap-2 text-[#4ADE80] font-bold text-xs uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4 text-[#F5D000]" />
              <span>Matchday Fortress</span>
            </div>
            <h2 className="font-pedals font-athletic text-2xl font-black uppercase text-white">
              Home Ground: {clubInfo.homeGroundName || 'Nginda Home Ground'}
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              Location: {clubInfo.homeGroundAddress || clubSettings.physicalAddress}
            </p>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              {clubInfo.homeGroundDescription}
            </p>
          </div>

          <div className="bg-[#0D1410] rounded-2xl p-8 border border-[#1E2B23] shadow-md">
            <div className="flex items-center gap-2 text-[#4ADE80] font-bold text-xs uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4 text-[#F5D000]" />
              <span>Preparation & Conditioning</span>
            </div>
            <h2 className="font-pedals font-athletic text-2xl font-black uppercase text-white">
              Training Ground: {clubInfo.trainingGroundName || 'Official Club Training Facility'}
            </h2>
            {clubInfo.trainingGroundSchedule && (
              <p className="text-xs font-semibold text-slate-400 mt-1">
                Schedule: {clubInfo.trainingGroundSchedule}
              </p>
            )}
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              {clubInfo.trainingGroundDescription}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
