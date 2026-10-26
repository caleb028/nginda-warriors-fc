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
    <div className="bg-white min-h-screen">
      {/* Page Header - White Dominant */}
      <section className="bg-slate-50 text-slate-900 py-12 sm:py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-[#08783E]/10 border border-[#08783E]/20 text-[#08783E] font-pedals font-athletic font-black text-xs uppercase tracking-widest">
              ESTABLISHED {clubSettings.establishedYear} • OFFICIAL CLUB IDENTITY
            </span>
            <h1 className="font-pedals font-athletic text-5xl sm:text-6xl font-black uppercase tracking-tight text-slate-950">
              ABOUT {clubSettings.clubName}
            </h1>
            <p className="text-lg text-[#08783E] font-athletic font-bold max-w-2xl">
              “{clubSettings.tagline}”
            </p>
          </div>
          <div className="p-3 rounded-full bg-white border border-slate-200 shadow-sm">
            <ClubCrest size={120} customCrestUrl={clubSettings.crestUrl} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* 1. About the Club & Club History */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm border-t-4 border-t-[#08783E]">
            <div className="flex items-center gap-2.5 text-[#08783E] font-pedals font-athletic font-bold uppercase text-sm tracking-wider mb-2">
              <Shield className="w-5 h-5 text-[#08783E]" />
              <span>Club Identity</span>
            </div>
            <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-slate-950 mb-4">
              About the Club
            </h2>
            <p className="text-slate-600 leading-relaxed">{clubInfo.aboutSummary}</p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm border-t-4 border-t-[#D5AA00]">
            <div className="flex items-center gap-2.5 text-[#08783E] font-pedals font-athletic font-bold uppercase text-sm tracking-wider mb-2">
              <Flag className="w-5 h-5 text-[#08783E]" />
              <span>Est. {clubSettings.establishedYear}</span>
            </div>
            <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-slate-950 mb-4">
              Club History
            </h2>
            <p className="text-slate-600 leading-relaxed">{clubInfo.historyNarrative}</p>
          </div>
        </section>

        {/* 2. Vision and Mission */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-50 text-slate-900 rounded-2xl p-8 border border-slate-200 border-t-4 border-t-[#08783E] shadow-sm">
            <Compass className="w-9 h-9 text-[#08783E] mb-3" />
            <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-slate-950 mb-3">
              Our Vision
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              {clubInfo.visionStatement}
            </p>
          </div>

          <div className="bg-slate-50 text-slate-900 rounded-2xl p-8 border border-slate-200 border-t-4 border-t-[#D5AA00] shadow-sm">
            <Target className="w-9 h-9 text-[#08783E] mb-3" />
            <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-slate-950 mb-3">
              Our Mission
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              {clubInfo.missionStatement}
            </p>
          </div>
        </section>

        {/* 3. Club Values */}
        <section>
          <h2 className="font-pedals font-athletic text-3xl sm:text-4xl font-black uppercase text-slate-950 mb-6">
            Core Club Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clubInfo.coreValues.map((val, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
              >
                <CheckCircle2 className="w-6 h-6 text-[#08783E] mb-3" />
                <h3 className="font-pedals font-athletic text-xl font-bold uppercase text-slate-900">
                  {val.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Honours and Milestones */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 text-[#08783E] font-pedals font-athletic font-bold uppercase text-sm tracking-wider mb-2">
            <Award className="w-5 h-5 text-[#D5AA00]" />
            <span>Official Club Record</span>
          </div>
          <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-slate-950 mb-6">
            Honours & Milestones
          </h2>
          <div className="space-y-4">
            {clubInfo.honoursAndMilestones.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200"
              >
                <span className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-pedals font-athletic font-black text-xl">
                  {item.year}
                </span>
                <div>
                  <h3 className="font-pedals font-athletic text-xl font-bold uppercase text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Club Leadership & Technical Bench */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-pedals font-athletic text-3xl sm:text-4xl font-black uppercase text-slate-950">
                Club Leadership & Technical Bench
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Verified club officials and coaching staff approved for publication.
              </p>
            </div>
          </div>

          {leadership.length > 0 || technicalBench.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...leadership, ...technicalBench].map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                >
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#08783E]/10 text-[#08783E] text-[11px] font-extrabold uppercase tracking-wider mb-3">
                    {member.category}
                  </span>
                  <h3 className="font-pedals font-athletic text-2xl font-bold uppercase text-slate-900">
                    {member.fullName}
                  </h3>
                  <p className="text-xs font-extrabold uppercase text-[#08783E] mt-0.5">
                    {member.roleTitle}
                  </p>
                  <p className="text-sm text-slate-600 mt-3">{member.biography}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-8 text-center border border-slate-200">
              <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="font-pedals font-athletic text-xl font-bold uppercase text-slate-800">
                Leadership & Technical Staff Directory Pending Publication
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Official profiles for the Chairman, Secretary, Treasurer, and Coaching Staff appear here once published by the Super Admin.
              </p>
            </div>
          )}
        </section>

        {/* 6. Home Ground & Training Ground */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-[#08783E] font-bold text-xs uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4 text-[#08783E]" />
              <span>Matchday Fortress</span>
            </div>
            <h2 className="font-pedals font-athletic text-2xl font-black uppercase text-slate-950">
              Home Ground: {clubInfo.homeGroundName || 'Nginda Home Ground'}
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Location: {clubInfo.homeGroundAddress || clubSettings.physicalAddress}
            </p>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              {clubInfo.homeGroundDescription}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-[#08783E] font-bold text-xs uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4 text-[#08783E]" />
              <span>Preparation & Conditioning</span>
            </div>
            <h2 className="font-pedals font-athletic text-2xl font-black uppercase text-slate-950">
              Training Ground: {clubInfo.trainingGroundName || 'Official Club Training Facility'}
            </h2>
            {clubInfo.trainingGroundSchedule && (
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Schedule: {clubInfo.trainingGroundSchedule}
              </p>
            )}
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              {clubInfo.trainingGroundDescription}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
