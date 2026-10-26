import React from 'react';
import { ClubCrest, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { SponsorInquiryForm } from '@/components/SponsorInquiryForm';
import { CheckCircle2, Download, Shield, Sparkles, Trophy } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function SponsorsAndPartnershipPage() {
  const { clubSettings, sponsorshipPackages, approvedSponsors } =
    getPublicWebsiteSnapshot();

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* Sponsorship Hero Banner - Crisp White Canvas */}
      <section className="py-14 sm:py-18 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#08783E]/10 border border-[#08783E]/20 text-[#08783E] font-pedals font-athletic font-extrabold text-xs uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#D5AA00]" />
              COMMERCIAL PARTNERSHIP PROGRAMME • EST. {clubSettings.establishedYear}
            </span>

            <h1 className="font-pedals font-athletic text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none text-slate-950">
              PARTNER WITH THE WARRIORS. GROW WITH THE COMMUNITY.
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              Connect your business with a disciplined, ambitious, community-backed football institution in {clubSettings.county || 'Kenya'}.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="/api/sponsors/proposal-pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#08783E] hover:bg-[#063B25] text-white font-pedals font-athletic font-black text-base uppercase tracking-wider shadow-md transition"
              >
                <Download className="w-5 h-5 text-[#F5D000]" />
                <span>Download Official Sponsorship Proposal (PDF)</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="p-3 rounded-full bg-white border border-slate-200 shadow-md">
              <ClubCrest size={180} customCrestUrl={clubSettings.crestUrl} />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        {/* Club Profile & Development Objectives */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-white border border-slate-200 p-8 space-y-4 shadow-sm border-t-4 border-t-[#08783E]">
            <h2 className="font-pedals font-athletic text-2xl font-black uppercase text-slate-950">
              Why Partner With {clubSettings.clubName}?
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {clubSettings.clubInfo.aboutSummary}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              {clubSettings.clubInfo.communityImpactSummary}
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-8 space-y-4 shadow-sm border-t-4 border-t-[#D5AA00]">
            <h2 className="font-pedals font-athletic text-2xl font-black uppercase text-slate-950">
              Strategic Development Objectives
            </h2>
            <ul className="space-y-3">
              {clubSettings.clubInfo.developmentObjectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-[#08783E] shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Official Sponsorship Packages (Bronze, Silver, Gold, Main Kit Sponsor) */}
        <section>
          <div className="mb-8">
            <span className="text-xs font-pedals font-athletic font-extrabold uppercase tracking-widest text-[#08783E]">
              CONFIGURABLE KES PARTNERSHIP TIERS
            </span>
            <h2 className="font-pedals font-athletic text-3xl sm:text-4xl font-black uppercase text-slate-950 mt-1">
              Official Sponsorship Packages
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsorshipPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-2xl p-6 flex flex-col justify-between border-2 transition ${
                  pkg.tierCode === 'MAIN_KIT' || pkg.tierCode === 'GOLD'
                    ? 'bg-slate-50 border-[#08783E] shadow-md'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#08783E]/10 text-[#08783E] font-pedals font-athletic font-black text-xs uppercase tracking-wider">
                      {pkg.tierCode.replace('_', ' ')}
                    </span>
                    {pkg.isFeatured && (
                      <Trophy className="w-4 h-4 text-[#D5AA00]" />
                    )}
                  </div>
                  <h3 className="font-pedals font-athletic text-2xl font-black uppercase text-slate-900">
                    {pkg.name}
                  </h3>
                  <div className="my-3 py-2 border-y border-slate-200">
                    {pkg.priceKes !== null && pkg.priceKes > 0 ? (
                      <div>
                        <span className="font-pedals font-athletic text-3xl font-black text-[#08783E]">
                          KES {Number(pkg.priceKes).toLocaleString()}
                        </span>
                        <span className="block text-[11px] text-slate-500 uppercase">
                          {pkg.billingPeriod}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold uppercase text-[#08783E]">
                        Tailored KES Rate Card Upon Inquiry
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mb-4">{pkg.description}</p>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {pkg.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#08783E] shrink-0 mt-0.5" />
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
        <section className="rounded-2xl bg-slate-50 text-slate-900 p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-[#08783E] font-pedals font-athletic font-bold uppercase text-sm mb-2">
            <Shield className="w-5 h-5 text-[#08783E]" />
            <span>Verified Partners</span>
          </div>
          <h2 className="font-pedals font-athletic text-3xl font-black uppercase text-slate-950 mb-6">
            Official Approved Club Sponsors
          </h2>

          {approvedSponsors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {approvedSponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 text-center space-y-2 shadow-xs"
                >
                  {sponsor.logoUrl && (
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.businessName}
                      className="h-16 mx-auto object-contain"
                    />
                  )}
                  <h3 className="font-pedals font-athletic text-xl font-black uppercase text-slate-900">
                    {sponsor.businessName}
                  </h3>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#08783E]/10 text-[#08783E] text-[10px] font-extrabold uppercase">
                    {sponsor.tierCode.replace('_', ' ')}
                  </span>
                  <p className="text-xs text-slate-500">{sponsor.summary}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
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
