import React from 'react';
import Link from 'next/link';
import { ClubCrest, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { MpesaSupportForm } from '../../components/MpesaSupportForm';
import { ArrowRight, HeartHandshake, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function SupportTheClubPage() {
  const { clubSettings, fundraisingCampaigns, mpesaPublicConfig } =
    getPublicWebsiteSnapshot();

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner - White Dominant */}
      <section className="bg-slate-50 text-slate-900 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#08783E]/10 border border-[#08783E]/20 text-[#08783E] font-pedals font-athletic font-extrabold text-xs uppercase tracking-widest">
              COMMUNITY FUNDRAISING & M-PESA SUPPORT
            </span>
            <h1 className="font-pedals font-athletic text-4xl sm:text-5xl font-black uppercase text-slate-950 mt-2">
              SUPPORT THE WARRIORS
            </h1>
            <p className="text-slate-600 text-base mt-1 max-w-2xl">
              Back playing kits, football equipment, match transport, ground maintenance, referee fees, player welfare, and tournament participation.
            </p>
          </div>
          <Link
            href="/transparency"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-300 hover:border-[#08783E] text-slate-800 font-pedals font-athletic font-bold text-sm uppercase tracking-wider shadow-xs transition"
          >
            <ShieldCheck className="w-4 h-4 text-[#08783E]" />
            <span>View Financial Transparency</span>
          </Link>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Active Fundraising Campaigns */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-pedals font-athletic text-3xl sm:text-4xl font-black uppercase text-slate-950">
            Official Club Fundraising Campaigns
          </h2>

          {fundraisingCampaigns.length > 0 ? (
            <div className="space-y-6">
              {fundraisingCampaigns.map((campaign) => {
                const pct =
                  campaign.targetAmountKes > 0
                    ? Math.min(
                        100,
                        Math.round(
                          (campaign.verifiedRaisedKes / campaign.targetAmountKes) * 100
                        )
                      )
                    : 0;
                return (
                  <div
                    key={campaign.id}
                    className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#08783E]/10 text-[#08783E] font-pedals font-athletic font-bold text-xs uppercase tracking-wider">
                        {campaign.category}
                      </span>
                      {campaign.deadline && (
                        <span className="text-xs text-slate-500 font-semibold">
                          Target Date: {campaign.deadline}
                        </span>
                      )}
                    </div>

                    <h3 className="font-pedals font-athletic text-2xl font-black uppercase text-slate-900">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-slate-600">{campaign.description}</p>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#08783E]">
                          Verified Raised: KES {campaign.verifiedRaisedKes.toLocaleString()}
                        </span>
                        <span className="text-slate-800">
                          Target: KES {campaign.targetAmountKes.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-[#08783E] transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-10 text-center border border-slate-200 space-y-3">
              <HeartHandshake className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="font-pedals font-athletic text-2xl font-bold uppercase text-slate-800">
                No Active Fundraising Campaigns Published Yet
              </h3>
              <p className="text-sm text-slate-500 max-w-lg mx-auto">
                Campaigns for Playing Kits, Football Equipment, Transport, Ground Maintenance, Referee Fees, and Player Welfare appear here when published by club management.
              </p>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <ClubCrest size={52} customCrestUrl={clubSettings.crestUrl} />
              <div>
                <h4 className="font-pedals font-athletic text-xl font-bold uppercase text-slate-900">
                  100% Accountable Community Stewardship
                </h4>
                <p className="text-xs text-slate-600">
                  View verified campaign progress, expenditure categories, and remaining balances.
                </p>
              </div>
            </div>
            <Link
              href="/transparency"
              className="shrink-0 inline-flex items-center gap-1.5 text-xs font-pedals font-athletic font-bold uppercase text-[#08783E] hover:underline"
            >
              <span>Transparency Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right: M-Pesa Contribution Widget */}
        <div className="lg:col-span-5">
          <MpesaSupportForm
            campaigns={fundraisingCampaigns.map((c) => ({
              id: c.id,
              title: c.title,
              accountReference: c.accountReference,
            }))}
            mpesaConfig={mpesaPublicConfig}
          />
        </div>
      </div>
    </div>
  );
}
