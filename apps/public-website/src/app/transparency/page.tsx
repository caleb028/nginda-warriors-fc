import React from 'react';
import { ClubCrest, getPublicWebsiteSnapshot } from '@nginda-warriors/shared/server';
import { CheckCircle2, FileSpreadsheet, ShieldCheck, Wallet } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function FinancialTransparencyPage() {
  const {
    clubSettings,
    fundraisingCampaigns,
    confirmedDonationsSummary,
    publishedExpenditures,
    transparencyReports,
  } = getPublicWebsiteSnapshot();

  const totalConfirmedFunds = confirmedDonationsSummary.totalConfirmedKes;
  const totalExpenditure = publishedExpenditures.reduce(
    (sum, e) => sum + Number(e.amountKes || 0),
    0
  );
  const remainingBalance = Math.max(0, totalConfirmedFunds - totalExpenditure);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#0A0A0A] text-white py-12 border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            
            <h1 className="font-athletic text-4xl sm:text-5xl font-black uppercase text-white mt-2">
              FINANCIAL TRANSPARENCY
            </h1>
            <p className="text-slate-300 text-base mt-1 max-w-2xl">
              Verified supporter contributions, campaign targets, approved expenditure categories, and remaining balances. Donor personal details are strictly protected.
            </p>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#0A0A0A] border border-[#262626] shadow-md flex items-center justify-center">
            <ClubCrest size={80} customCrestUrl={clubSettings.crestUrl} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Top Verified Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#141414] rounded-2xl p-6 border border-[#262626] shadow-xl border-t-4 border-t-[#FDE100]">
            <div className="flex items-center gap-2 text-xs font-athletic font-extrabold uppercase text-[#FDE100]">
              <CheckCircle2 className="w-4 h-4 text-[#FDE100]" />
              <span>Confirmed Funds Received</span>
            </div>
            <p className="font-athletic text-4xl font-black text-white mt-2">
              KES {totalConfirmedFunds.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Across {confirmedDonationsSummary.confirmedCount} verified contributions
            </p>
          </div>

          <div className="bg-[#141414] rounded-2xl p-6 border border-[#262626] shadow-xl border-t-4 border-t-slate-500">
            <div className="flex items-center gap-2 text-xs font-athletic font-extrabold uppercase text-slate-300">
              <FileSpreadsheet className="w-4 h-4 text-[#FDE100]" />
              <span>Approved Club Expenditure</span>
            </div>
            <p className="font-athletic text-4xl font-black text-white mt-2">
              KES {totalExpenditure.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {publishedExpenditures.length} published expenditure records
            </p>
          </div>

          <div className="bg-[#141414] rounded-2xl p-6 border-2 border-[#262626] shadow-xl">
            <div className="flex items-center gap-2 text-xs font-athletic font-extrabold uppercase text-[#FDE100]">
              <Wallet className="w-4 h-4 text-[#FDE100]" />
              <span>Remaining Campaign Balance</span>
            </div>
            <p className="font-athletic text-4xl font-black text-[#FDE100] mt-2">
              KES {remainingBalance.toLocaleString()}
            </p>
            <p className="text-xs text-slate-300 mt-1">
              Held in official club account for designated campaigns
            </p>
          </div>
        </div>

        {/* Verified Campaign Progress */}
        <section className="bg-[#141414] rounded-2xl p-8 border border-[#262626] shadow-xl">
          <h2 className="font-athletic text-3xl font-black uppercase text-white mb-6">
            Campaign Targets & Verified Progress
          </h2>
          {fundraisingCampaigns.length > 0 ? (
            <div className="space-y-4">
              {fundraisingCampaigns.map((c) => {
                const remaining = Math.max(0, c.targetAmountKes - c.verifiedRaisedKes);
                return (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-[#0D0D0D] border border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#FDE100]">
                        {c.category}
                      </span>
                      <h3 className="font-athletic text-xl font-bold uppercase text-white">
                        {c.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-6 text-xs">
                      <div>
                        <span className="block text-slate-400 uppercase">Target</span>
                        <strong className="text-sm text-white">
                          KES {c.targetAmountKes.toLocaleString()}
                        </strong>
                      </div>
                      <div>
                        <span className="block text-slate-400 uppercase">Verified Raised</span>
                        <strong className="text-sm text-[#FDE100]">
                          KES {c.verifiedRaisedKes.toLocaleString()}
                        </strong>
                      </div>
                      <div>
                        <span className="block text-slate-400 uppercase">Remaining Target</span>
                        <strong className="text-sm text-slate-300">
                          KES {remaining.toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              No active campaign targets published yet.
            </p>
          )}
        </section>

        {/* Recorded Expenditure Categories & Approved Spending Reports */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#141414] rounded-2xl p-8 border border-[#262626] shadow-xl">
            <h2 className="font-athletic text-2xl font-black uppercase text-white mb-4">
              Recorded Expenditure Categories
            </h2>
            {publishedExpenditures.length > 0 ? (
              <div className="space-y-3">
                {publishedExpenditures.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3.5 rounded-xl bg-[#0D0D0D] border border-[#262626] flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-[#FDE100]/10 text-[#FDE100] border border-[#FDE100]/30 text-[10px] font-extrabold uppercase">
                        {exp.category}
                      </span>
                      <p className="font-bold text-sm text-white mt-1">{exp.description}</p>
                      <p className="text-xs text-slate-400">
                        Date: {exp.spentDate} • Approved by {exp.approvedByName}
                      </p>
                    </div>
                    <span className="font-athletic text-xl font-black text-white">
                      KES {exp.amountKes.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                Approved expenditure records will appear here once published by Finance Administration.
              </p>
            )}
          </div>

          <div className="bg-[#141414] rounded-2xl p-8 border border-[#262626] shadow-xl">
            <h2 className="font-athletic text-2xl font-black uppercase text-white mb-4">
              Published Financial Summaries
            </h2>
            {transparencyReports.length > 0 ? (
              <div className="space-y-4">
                {transparencyReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-4 rounded-xl bg-[#0D0D0D] border border-[#262626] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-athletic text-xl font-bold uppercase text-white">
                        {rep.title}
                      </h3>
                      <span className="text-xs font-bold text-[#FDE100]">
                        {rep.reportingPeriod}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{rep.summary}</p>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#262626] text-xs">
                      <div>
                        <span className="text-slate-400 block">Received</span>
                        <strong className="text-white">KES {rep.totalConfirmedFundsKes.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Spent</span>
                        <strong className="text-white">KES {rep.totalExpenditureKes.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Balance</span>
                        <strong className="text-[#FDE100]">
                          KES {rep.remainingBalanceKes.toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 space-y-2">
                <ShieldCheck className="w-10 h-10 text-slate-500 mx-auto" />
                <p className="text-sm text-slate-400">
                  Periodic financial transparency reports approved by the Super Admin and Finance Manager are published here.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
