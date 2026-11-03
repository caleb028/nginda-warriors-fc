import React from 'react';
import { ClubCrest, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { SponsorInquiryForm } from '../../components/SponsorInquiryForm';
import { CheckCircle2, Download, Shield, Sparkles, Trophy } from 'lucide-react';

export const revalidate = 15;

export default function SponsorsAndPartnershipPage() {
  const { clubSettings, sponsorshipPackages, approvedSponsors } =
    getPublicWebsiteSnapshot();

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Sponsorship Hero Banner */}
      <section className="py-14 sm:py-18 bg-[#0A0A0A] border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-5">
            

            <h1 className="font-athletic text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none text-white">
              PARTNER WITH THE WARRIORS. GROW WITH THE COMMUNITY.
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              Connect your business with a disciplined, ambitious, community-backed football institution in {clubSettings.county || 'Kenya'}.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="/api/sponsors/proposal-pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#FDE100] hover:bg-[#FFE600] text-black font-athletic font-black text-base uppercase tracking-wider shadow-md transition active:scale-95"
              >
                <Download className="w-5 h-5 text-[#FDE100]" />
                <span>Download Official Sponsorship Proposal (PDF)</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-[#262626] shadow-xl flex items-center justify-center">
              <ClubCrest size={180} customCrestUrl={clubSettings.crestUrl} />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        {/* Club Profile & Development Objectives */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-[#141414] border border-[#262626] p-8 space-y-4 shadow-xl border-t-4 border-t-[#FDE100]">
            <h2 className="font-athletic text-2xl font-black uppercase text-white">
              Why Partner With {clubSettings.clubName}?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {clubSettings.clubInfo.aboutSummary}
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              {clubSettings.clubInfo.communityImpactSummary}
            </p>
          </div>

          <div className="rounded-2xl bg-[#141414] border border-[#262626] p-8 space-y-4 shadow-xl border-t-4 border-t-[#D5AA00]">
            <h2 className="font-athletic text-2xl font-black uppercase text-white">
              Strategic Development Objectives
            </h2>
            <ul className="space-y-3">
              {clubSettings.clubInfo.developmentObjectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-[#FDE100] shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Official Sponsorship Packages (Bronze, Silver, Gold, Main Kit Sponsor) */}
        <section>
          <div className="mb-8">
            
            <h2 className="font-athletic text-3xl sm:text-4xl font-black uppercase text-white mt-1">
              Official Sponsorship Packages
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsorshipPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-2xl p-6 flex flex-col justify-between border-2 transition ${
                  pkg.tierCode === 'MAIN_KIT' || pkg.tierCode === 'GOLD'
                    ? 'bg-[#121C16] border-[#262626] shadow-xl'
                    : 'bg-[#141414] border-[#262626] shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FDE100]/10 text-[#FDE100] border border-[#FDE100]/30 font-athletic font-black text-xs uppercase tracking-wider">
                      {pkg.tierCode.replace('_', ' ')}
                    </span>
                    {pkg.isFeatured && (
                      <Trophy className="w-4 h-4 text-[#FDE100]" />
                    )}
                  </div>
                  <h3 className="font-athletic text-2xl font-black uppercase text-white">
                    {pkg.name}
                  </h3>
                  <div className="my-3 py-2 border-y border-[#262626]">
                    {pkg.priceKes !== null && pkg.priceKes > 0 ? (
                      <div>
                        <span className="font-athletic text-3xl font-black text-[#FDE100]">
                          KES {Number(pkg.priceKes).toLocaleString()}
                        </span>
                        <span className="block text-[11px] text-slate-400 uppercase">
                          {pkg.billingPeriod}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold uppercase text-[#FDE100]">
                        Tailored KES Rate Card Upon Inquiry
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mb-4">{pkg.description}</p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {pkg.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#FDE100] shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Current Approved Sponsors */}
        <section className="rounded-2xl bg-[#141414] text-white p-8 border border-[#262626] shadow-xl">
          <div className="flex items-center gap-2 text-[#FDE100] font-athletic font-bold uppercase text-sm mb-2">
            <Shield className="w-5 h-5 text-[#FDE100]" />
            <span>Verified Partners</span>
          </div>
          <h2 className="font-athletic text-3xl font-black uppercase text-white mb-6">
            Official Approved Club Sponsors
          </h2>

          {approvedSponsors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {approvedSponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="p-5 rounded-xl bg-[#0D0D0D] border border-[#262626] text-center space-y-2 shadow-md"
                >
                  {sponsor.logoUrl && (
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.businessName}
                      className="h-16 mx-auto object-contain"
                    />
                  )}
                  <h3 className="font-athletic text-xl font-black uppercase text-white">
                    {sponsor.businessName}
                  </h3>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FDE100]/10 text-[#FDE100] border border-[#FDE100]/30 text-[10px] font-extrabold uppercase">
                    {sponsor.tierCode.replace('_', ' ')}
                  </span>
                  <p className="text-xs text-slate-400">{sponsor.summary}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              Approved sponsor profiles and logos appear here once partnership agreements are verified by the Super Admin.
            </p>
          )}
        </section>

        {/* Sponsor Inquiry Form */}
        <section className="max-w-3xl mx-auto">
          <SponsorInquiryForm packages={sponsorshipPackages.map((p) => p.name)} />
        </section>
      </div>
    </div>
  );
}
