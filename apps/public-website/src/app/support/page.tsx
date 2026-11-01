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
    <div className="bg-black text-white min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#0A0A0A] text-white py-12 border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            
            <h1 className="font-athletic text-4xl sm:text-5xl font-black uppercase text-white mt-2">
              SUPPORT THE WARRIORS
            </h1>
            <p className="text-slate-300 text-base mt-1 max-w-2xl">
              Back playing kits, football equipment, match transport, ground maintenance, referee fees, player welfare, and tournament participation.
            </p>
          </div>
          <Link
            href="/transparency"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#141414] border border-[#262626] hover:border-[#262626] text-white font-athletic font-bold text-sm uppercase tracking-wider shadow-md transition"
          >
            <ShieldCheck className="w-4 h-4 text-[#FDE100]" />
            <span>View Financial Transparency</span>
          </Link>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Active Fundraising Campaigns */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-athletic text-3xl sm:text-4xl font-black uppercase text-white">
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
                    className="rounded-2xl bg-[#141414] border border-[#262626] p-6 shadow-xl space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#FDE100]/10 text-[#FDE100] border border-[#FDE100]/30 font-athletic font-bold text-xs uppercase tracking-wider">
                        {campaign.category}
                      </span>
                      {campaign.deadline && (
                        <span className="text-xs text-slate-400 font-semibold">
                          Target Date: {campaign.deadline}
                        </span>
                      )}
                    </div>

                    <h3 className="font-athletic text-2xl font-black uppercase text-white">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-slate-300">{campaign.description}</p>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#FDE100]">
                          Verified Raised: KES {campaign.verifiedRaisedKes.toLocaleString()}
                        </span>
                        <span className="text-slate-300">
                          Target: KES {campaign.targetAmountKes.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-[#0D0D0D] overflow-hidden border border-[#262626]">
                        <div
                          className="h-full bg-[#FDE100] transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-[#141414] p-10 text-center border border-[#262626] space-y-3">
              <HeartHandshake className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="font-athletic text-2xl font-bold uppercase text-white">
                No Active Fundraising Campaigns Published Yet
              </h3>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                Campaigns for Playing Kits, Football Equipment, Transport, Ground Maintenance, Referee Fees, and Player Welfare appear here when published by club management.
              </p>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] text-white flex items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <ClubCrest size={52} customCrestUrl={clubSettings.crestUrl} />
              <div>
                <h4 className="font-athletic text-xl font-bold uppercase text-white">
                  100% Accountable Community Stewardship
                </h4>
                <p className="text-xs text-slate-400">
                  View verified campaign progress, expenditure categories, and remaining balances.
                </p>
              </div>
            </div>
            <Link
              href="/transparency"
              className="shrink-0 inline-flex items-center gap-1.5 text-xs font-athletic font-bold uppercase text-[#FDE100] hover:underline"
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
