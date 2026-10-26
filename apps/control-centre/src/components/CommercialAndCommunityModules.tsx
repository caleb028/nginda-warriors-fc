'use client';

import React, { useState } from 'react';
import {
  AdminRoleCode,
  CampaignCategory,
  NgindaDatabaseSchema,
  PublicationStatus,
  SponsorshipTierCode,
} from '@nginda-warriors/shared';
import {
  Building2,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  HeartHandshake,
  Mail,
  MessageSquare,
  Package,
  Shield,
  ShieldAlert,
  Smartphone,
  Star,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';

export function CommercialAndCommunityModules({
  activeModule,
  db,
  onMutate,
}: {
  activeModule: string;
  db: NgindaDatabaseSchema;
  onMutate: (action: string, payload: Record<string, unknown>) => Promise<void>;
}) {
  // Sponsor State
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorTier, setSponsorTier] = useState<SponsorshipTierCode>('GOLD');
  const [sponsorLogo, setSponsorLogo] = useState('');
  const [sponsorSummary, setSponsorSummary] = useState('');
  const [sponsorApproved, setSponsorApproved] = useState(true);

  // Campaign State
  const [campTitle, setCampTitle] = useState('');
  const [campCategory, setCampCategory] = useState<CampaignCategory>('Playing kits');
  const [campDesc, setCampDesc] = useState('');
  const [campTarget, setCampTarget] = useState('50000');

  // Expenditure State
  const [expCategory, setExpCategory] = useState('Equipment & Balls');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('15000');

  // Merchandise State
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<'Jerseys' | 'Scarves' | 'Caps' | 'Training Shirts' | 'Accessories'>('Jerseys');
  const [prodPrice, setProdPrice] = useState('2500');
  const [prodDesc, setProdDesc] = useState('Official Nginda Warriors FC home jersey.');

  // User Management State
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminRoleCode>('CONTENT_EDITOR');

  // CSV Export Helper
  const downloadCsv = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. SPONSORS & AGREEMENTS
  if (activeModule === 'sponsors') {
    return (
      <div className="space-y-8">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onMutate('save_sponsor', {
              businessName: sponsorName,
              tierCode: sponsorTier,
              logoUrl: sponsorLogo,
              summary: sponsorSummary,
              isApproved: sponsorApproved,
              publicationStatus: 'published',
            });
            setSponsorName('');
            setSponsorLogo('');
            setSponsorSummary('');
          }}
          className="bg-white rounded-2xl p-6 border-2 border-[#08783E] space-y-4"
        >
          <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
            Add Official Club Sponsor
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Business Name *
              </label>
              <input
                type="text"
                required
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                placeholder="Company Name"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Partnership Tier *
              </label>
              <select
                value={sponsorTier}
                onChange={(e) => setSponsorTier(e.target.value as SponsorshipTierCode)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
              >
                <option value="BRONZE">Bronze Partner</option>
                <option value="SILVER">Silver Partner</option>
                <option value="GOLD">Gold Official Partner</option>
                <option value="MAIN_KIT">Main Kit Sponsor</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Logo URL (Optional)
              </label>
              <input
                type="text"
                value={sponsorLogo}
                onChange={(e) => setSponsorLogo(e.target.value)}
                placeholder="https://... or /brand/logo.png"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>
          </div>
          <input
            type="text"
            value={sponsorSummary}
            onChange={(e) => setSponsorSummary(e.target.value)}
            placeholder="Partnership description..."
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
          />
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#063B25] flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={sponsorApproved}
                onChange={(e) => setSponsorApproved(e.target.checked)}
              />
              <span>Approved by Super Admin (Only approved sponsors appear publicly)</span>
            </label>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#F5D000] text-[#063B25] font-athletic font-black text-sm uppercase tracking-wider"
            >
              Save Sponsor Profile
            </button>
          </div>
        </form>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h4 className="font-athletic text-xl font-bold uppercase text-[#063B25] mb-4">
            Current Club Sponsors ({db.sponsors.length})
          </h4>
          {db.sponsors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {db.sponsors.map((sp) => (
                <div key={sp.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase text-[#08783E]">
                        {sp.tierCode} • Approved: {String(sp.isApproved)}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete sponsor "${sp.businessName}"?`)) {
                            onMutate('delete_sponsor', { id: sp.id });
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                        title="Delete Sponsor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-athletic text-xl font-bold uppercase text-[#063B25]">
                      {sp.businessName}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{sp.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No sponsors added yet.</p>
          )}
        </div>
      </div>
    );
  }

  // 2. SPONSOR INQUIRIES CRM
  if (activeModule === 'sponsor-inquiries') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-[#063B25] text-white flex items-center justify-between">
          <h3 className="font-athletic text-xl font-bold uppercase text-[#F5D000]">
            Commercial Partnership Inquiries ({db.sponsorInquiries.length})
          </h3>
        </div>
        {db.sponsorInquiries.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {db.sponsorInquiries.map((inq) => (
              <div key={inq.id} className="p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase text-[#08783E]">
                      {inq.packageOfInterest} • Received{' '}
                      {new Date(inq.createdAt).toLocaleDateString('en-KE')}
                    </span>
                    <h4 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
                      {inq.businessName}
                    </h4>
                    <p className="text-xs text-gray-600">
                      Contact: {inq.contactName} • Phone: {inq.phoneNumber} • Email: {inq.email}
                      {inq.budgetKes ? ` • Budget: KES ${inq.budgetKes.toLocaleString()}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Status:</label>
                    <select
                      value={inq.inquiryStatus}
                      onChange={(e) =>
                        onMutate('update_sponsor_inquiry', {
                          id: inq.id,
                          inquiryStatus: e.target.value,
                        })
                      }
                      className="px-2.5 py-1 rounded bg-[#EEF7EF] text-[#063B25] font-bold text-xs border border-[#08783E]/30"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="in_discussion">In Discussion</option>
                      <option value="approved">Approved</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                </div>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  &ldquo;{inq.message}&rdquo;
                </p>
                <div>
                  <input
                    type="text"
                    defaultValue={inq.privateAdminNotes || ''}
                    onBlur={(e) =>
                      onMutate('update_sponsor_inquiry', {
                        id: inq.id,
                        privateAdminNotes: e.target.value,
                      })
                    }
                    placeholder="Private administrator follow-up notes (auto-saved on blur)..."
                    className="w-full px-3 py-1.5 rounded border border-gray-300 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-sm text-gray-500">
            No sponsor inquiries received yet. Submissions through the public /sponsors form appear here automatically.
          </div>
        )}
      </div>
    );
  }

  // 3. SPONSORSHIP PACKAGES (KES CONFIGURATOR)
  if (activeModule === 'sponsorship-packages') {
    return (
      <div className="space-y-6">
        <div className="bg-[#063B25] text-white p-6 rounded-2xl border-2 border-[#F5D000]">
          <h3 className="font-athletic text-2xl font-black uppercase text-[#F5D000]">
            Sponsorship Tier Pricing & Benefit Configurator
          </h3>
          <p className="text-xs text-emerald-100 mt-1">
            Configure approved KES investment amounts for Bronze, Silver, Gold, and Main Kit Sponsor packages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {db.sponsorshipPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl p-6 border-2 border-[#EEF7EF] shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-[#F5D000] text-[#063B25] font-athletic font-black text-xs uppercase">
                  {pkg.tierCode}
                </span>
                <span className="text-xs font-bold text-[#08783E] uppercase">{pkg.billingPeriod}</span>
              </div>
              <h4 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
                {pkg.name}
              </h4>
              <p className="text-xs text-gray-600">{pkg.description}</p>
              <div>
                <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                  Package Investment (KES)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    defaultValue={pkg.priceKes ?? ''}
                    id={`price-${pkg.id}`}
                    placeholder="Set KES Amount (e.g. 250000)"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById(
                        `price-${pkg.id}`
                      ) as HTMLInputElement;
                      onMutate('save_sponsorship_package', {
                        id: pkg.id,
                        tierCode: pkg.tierCode,
                        priceKes: input?.value ? Number(input.value) : null,
                      });
                    }}
                    className="px-4 py-2 rounded-lg bg-[#08783E] text-white font-athletic font-bold text-xs uppercase"
                  >
                    Save KES
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete sponsorship package "${pkg.tierCode}"?`)) {
                        onMutate('delete_sponsorship_package', { id: pkg.id });
                      }
                    }}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                    title="Delete Package"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. FUNDRAISING & M-PESA RECONCILIATION
  if (activeModule === 'fundraising' || activeModule === 'donations') {
    return (
      <div className="space-y-8">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onMutate('save_campaign', {
              title: campTitle,
              category: campCategory,
              description: campDesc,
              targetAmountKes: Number(campTarget),
            });
            setCampTitle('');
            setCampDesc('');
          }}
          className="bg-white rounded-2xl p-6 border-2 border-[#08783E] space-y-4"
        >
          <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
            Create Fundraising Campaign
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Campaign Title *
              </label>
              <input
                type="text"
                required
                value={campTitle}
                onChange={(e) => setCampTitle(e.target.value)}
                placeholder="e.g. Official Playing Kits 2026/2027"
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Designated Category *
              </label>
              <select
                value={campCategory}
                onChange={(e) => setCampCategory(e.target.value as CampaignCategory)}
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm bg-white"
              >
                <option value="Playing kits">Playing kits</option>
                <option value="Football equipment">Football equipment</option>
                <option value="Transport">Transport</option>
                <option value="Ground maintenance">Ground maintenance</option>
                <option value="Referee fees">Referee fees</option>
                <option value="Player welfare">Player welfare</option>
                <option value="Tournament participation">Tournament participation</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Target Amount (KES) *
              </label>
              <input
                type="number"
                min="1000"
                required
                value={campTarget}
                onChange={(e) => setCampTarget(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm font-bold"
              />
            </div>
          </div>
          <input
            type="text"
            required
            value={campDesc}
            onChange={(e) => setCampDesc(e.target.value)}
            placeholder="Campaign details..."
            className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#F5D000] text-[#063B25] font-athletic font-black text-sm uppercase tracking-wider"
          >
            Launch Campaign
          </button>
        </form>

        {/* Active Campaigns Management */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-[#063B25] text-white flex items-center justify-between">
            <h4 className="font-athletic text-xl font-bold uppercase text-[#F5D000]">
              Active Fundraising Campaigns ({db.fundraisingCampaigns.length})
            </h4>
          </div>
          {db.fundraisingCampaigns.length > 0 ? (
            <div className="divide-y divide-gray-100 p-4">
              {db.fundraisingCampaigns.map((c) => (
                <div key={c.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#08783E]">
                      {c.category} • Ref: {c.accountReference} • Status: {c.publicationStatus}
                    </span>
                    <h5 className="font-athletic text-lg font-bold uppercase text-[#063B25]">
                      {c.title}
                    </h5>
                    <p className="text-xs text-gray-600">
                      Target: KES {c.targetAmountKes.toLocaleString()} | Verified Raised: KES {c.verifiedRaisedKes.toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete fundraising campaign "${c.title}"?`)) {
                        onMutate('delete_campaign', { id: c.id });
                      }
                    }}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition shrink-0"
                    title="Delete Campaign"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-6 text-sm text-gray-500 text-center">No fundraising campaigns launched yet.</p>
          )}
        </div>

        {/* M-Pesa Transaction Reconciliation Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-[#063B25] text-white flex items-center justify-between">
            <h4 className="font-athletic text-xl font-bold uppercase text-[#F5D000]">
              M-Pesa Transaction Reconciliation Ledger ({db.donations.length})
            </h4>
          </div>
          {db.donations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#EEF7EF] text-[#063B25] font-athletic uppercase text-xs">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Campaign</th>
                    <th className="py-3 px-4">Donor (Masked)</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">M-Pesa Receipt</th>
                    <th className="py-3 px-4 text-right">Reconciliation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {db.donations.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-xs text-gray-500">
                        {new Date(d.createdAt).toLocaleDateString('en-KE')}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#063B25]">{d.campaignTitle}</td>
                      <td className="py-3 px-4 text-xs">
                        {d.donorName} ({d.donorPhoneMasked})
                      </td>
                      <td className="py-3 px-4 font-athletic text-lg font-black text-[#08783E]">
                        KES {d.amountKes.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                            d.status === 'confirmed'
                              ? 'bg-[#EEF7EF] text-[#08783E]'
                              : d.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        {d.mpesaReceiptNumber || '—'}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {d.status !== 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => {
                              const receipt = prompt(
                                'Enter verified Safaricom M-Pesa receipt code (e.g. SKN4X92L1P):'
                              );
                              if (receipt) {
                                onMutate('reconcile_donation', {
                                  donationId: d.id,
                                  newStatus: 'confirmed',
                                  mpesaReceiptNumber: receipt,
                                });
                              }
                            }}
                            className="px-2.5 py-1 rounded bg-[#08783E] text-white text-xs font-bold"
                          >
                            Mark Confirmed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-8 text-center text-sm text-gray-500">
              No contribution transactions initiated yet.
            </p>
          )}
        </div>
      </div>
    );
  }

  // 5. FINANCIAL TRANSPARENCY & EXPENDITURE
  if (activeModule === 'transparency') {
    return (
      <div className="space-y-8">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onMutate('save_expenditure', {
              category: expCategory,
              description: expDesc,
              amountKes: Number(expAmount),
            });
            setExpDesc('');
          }}
          className="bg-white rounded-2xl p-6 border-2 border-[#08783E] space-y-4"
        >
          <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
            Record Verified Club Expenditure
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Category *
              </label>
              <input
                type="text"
                required
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Amount (KES) *
              </label>
              <input
                type="number"
                min="100"
                required
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm font-bold"
              />
            </div>
            <div className="sm:col-span-1 flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#F5D000] text-[#063B25] font-athletic font-black text-sm uppercase tracking-wider"
              >
                + Record Expenditure
              </button>
            </div>
          </div>
          <input
            type="text"
            required
            value={expDesc}
            onChange={(e) => setExpDesc(e.target.value)}
            placeholder="Expenditure description and voucher/receipt details..."
            className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
          />
        </form>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h4 className="font-athletic text-xl font-bold uppercase text-[#063B25] mb-4">
            Published Expenditure Records ({db.expenditureRecords.length})
          </h4>
          {db.expenditureRecords.map((exp) => (
            <div
              key={exp.id}
              className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 mb-2 flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase text-[#08783E]">
                  {exp.category} • Spent {exp.spentDate}
                </span>
                <p className="font-bold text-[#063B25] text-sm">{exp.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-athletic text-xl font-black text-[#063B25]">
                  KES {exp.amountKes.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete expenditure record "${exp.description}"?`)) {
                      onMutate('delete_expenditure', { id: exp.id });
                    }
                  }}
                  className="p-1.5 rounded text-red-600 hover:bg-red-600 hover:text-white transition"
                  title="Delete Expenditure"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. MERCHANDISE MODULE
  if (activeModule === 'merchandise') {
    return (
      <div className="space-y-8">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onMutate('save_product', {
              name: prodName,
              category: prodCategory,
              priceKes: Number(prodPrice),
              description: prodDesc,
            });
            setProdName('');
          }}
          className="bg-white rounded-2xl p-6 border-2 border-[#08783E] space-y-4"
        >
          <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
            Add Merchandise Product
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                placeholder="e.g. Official Home Jersey 2026/2027"
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Category
              </label>
              <select
                value={prodCategory}
                onChange={(e) =>
                  setProdCategory(
                    e.target.value as
                      | 'Jerseys'
                      | 'Scarves'
                      | 'Caps'
                      | 'Training Shirts'
                      | 'Accessories'
                  )
                }
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm bg-white"
              >
                <option value="Jerseys">Jerseys</option>
                <option value="Scarves">Scarves</option>
                <option value="Caps">Caps</option>
                <option value="Training Shirts">Training Shirts</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Price (KES) *
              </label>
              <input
                type="number"
                min="100"
                required
                value={prodPrice}
                onChange={(e) => setProdPrice(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm font-bold"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#F5D000] text-[#063B25] font-athletic font-black text-sm uppercase tracking-wider"
          >
            Save Merchandise Product
          </button>
        </form>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h4 className="font-athletic text-xl font-bold uppercase text-[#063B25] mb-4">
            Club Merchandise Catalog ({db.products.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {db.products.map((p) => (
              <div key={p.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase text-[#08783E]">
                      {p.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete merchandise product "${p.name}"?`)) {
                          onMutate('delete_product', { id: p.id });
                        }
                      }}
                      className="p-1 rounded text-red-500 hover:text-white hover:bg-red-600 transition"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="font-athletic text-xl font-bold uppercase text-[#063B25]">
                    {p.name}
                  </p>
                  <p className="font-athletic text-lg font-black text-[#08783E] mt-1">
                    KES {p.priceKes.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 7. FAN MEMBERSHIP MODULE
  if (activeModule === 'membership') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-[#063B25] text-white flex items-center justify-between">
          <h3 className="font-athletic text-xl font-bold uppercase text-[#F5D000]">
            Supporter Membership Registry ({db.fanMemberships.length})
          </h3>
        </div>
        {db.fanMemberships.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {db.fanMemberships.map((m) => (
              <div key={m.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-athletic text-xl font-bold uppercase text-[#063B25]">
                    {m.fullName}
                  </p>
                  <p className="text-xs text-gray-600">
                    Phone: {m.phoneNumber} • {m.wardOrLocation || 'Nginda'} • Tier: {m.membershipTier}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-[#EEF7EF] text-[#08783E] text-xs font-bold uppercase">
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-8 text-center text-sm text-gray-500">
            No supporter memberships registered yet.
          </p>
        )}
      </div>
    );
  }

  // 8. RECRUITMENT APPLICATIONS MODULE (Strictly Private with Minor Protection)
  if (activeModule === 'recruitment') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-[#063B25] text-white flex items-center justify-between">
          <div>
            <h3 className="font-athletic text-xl font-bold uppercase text-[#F5D000]">
              Confidential Player Trial Applications ({db.recruitmentApplications.length})
            </h3>
            <p className="text-xs text-emerald-100">
              Private scouting applications. Never visible to public visitors.
            </p>
          </div>
        </div>
        {db.recruitmentApplications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {db.recruitmentApplications.map((app) => (
              <div key={app.id} className="p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
                        {app.fullName}
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-bold">
                        Age: {app.age}
                      </span>
                      {app.isMinor && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-xs font-bold">
                          <ShieldAlert className="w-3.5 h-3.5" /> Minor Safeguarded
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Position: <strong>{app.preferredPosition}</strong> • Preferred Foot:{' '}
                      {app.preferredFoot} • County: {app.county} • Phone: {app.phoneNumber}
                    </p>
                  </div>
                  <select
                    value={app.applicationStatus}
                    onChange={(e) =>
                      onMutate('update_recruitment_status', {
                        id: app.id,
                        applicationStatus: e.target.value,
                      })
                    }
                    className="px-3 py-1 rounded bg-[#EEF7EF] text-[#063B25] font-bold text-xs border border-[#08783E]"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="invited_to_trial">Invited to Trial</option>
                    <option value="not_selected">Not Selected</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                {app.isMinor && (
                  <div className="p-2.5 rounded bg-amber-50 text-xs text-amber-900 border border-amber-200">
                    Guardian: <strong>{app.guardianName}</strong> • Phone:{' '}
                    <strong>{app.guardianPhone}</strong> • Consent:{' '}
                    {app.guardianConsentConfirmed ? 'VERIFIED' : 'PENDING'}
                  </div>
                )}
                <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded border border-gray-100">
                  <strong>Playing Experience:</strong> {app.playingExperience}
                </p>
                {app.highlightVideoUrl && (
                  <a
                    href={app.highlightVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#08783E] underline"
                  >
                    View Highlight Video Link →
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-sm text-gray-500">
            No trial applications submitted yet.
          </div>
        )}
      </div>
    );
  }

  // 9. FAN VOTING & CONTACT MESSAGES
  if (activeModule === 'voting' || activeModule === 'messages') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25] mb-4">
            Man of the Match Fan Votes ({db.fanVotes.length} Total Cast)
          </h3>
          {db.fanVotes.length > 0 ? (
            <div className="space-y-2">
              {db.fanVotes.slice(0, 15).map((v) => (
                <div
                  key={v.id}
                  className="p-2.5 rounded bg-gray-50 border border-gray-200 flex justify-between text-xs"
                >
                  <span>
                    Voted for <strong>{v.playerName}</strong>
                  </span>
                  <span className="text-gray-500">
                    {new Date(v.createdAt).toLocaleString('en-KE')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No fan votes recorded yet.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25] mb-4">
            Secretariat Contact Inbox ({db.contactMessages.length})
          </h3>
          {db.contactMessages.length > 0 ? (
            <div className="space-y-3">
              {db.contactMessages.map((m) => (
                <div key={m.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-[#063B25]">
                      {m.senderName} ({m.senderEmail})
                    </span>
                    <span className="text-gray-500">{m.status}</span>
                  </div>
                  <p className="font-bold text-sm text-[#063B25]">{m.subject}</p>
                  <p className="text-xs text-gray-700 mt-1">{m.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Inbox empty.</p>
          )}
        </div>
      </div>
    );
  }

  // 10. REPORTS CSV EXPORT MODULE
  if (activeModule === 'reports') {
    return (
      <div className="bg-white rounded-2xl p-6 border-2 border-[#08783E] shadow-sm space-y-6">
        <div>
          <h3 className="font-athletic text-3xl font-black uppercase text-[#063B25]">
            Operational Reports & CSV Data Exports
          </h3>
          <p className="text-xs text-gray-600">
            Export club operational records for executive reviews, sponsor reporting, and financial auditing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#EEF7EF] border border-[#08783E]/20 space-y-3">
            <h4 className="font-athletic text-xl font-bold uppercase text-[#063B25]">
              First Team Squad ({db.players.length})
            </h4>
            <button
              type="button"
              onClick={() => {
                const header = 'Jersey,Full Name,Position,Role,Status,Appearances,Goals,Assists\n';
                const rows = db.players
                  .map(
                    (p) =>
                      `"${p.jerseyNumber}","${p.fullName}","${p.positionGroup}","${p.specificRole}","${p.squadStatus}","${p.appearances}","${p.goals}","${p.assists}"`
                  )
                  .join('\n');
                downloadCsv('nginda_warriors_squad.csv', header + rows);
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#08783E] text-white font-athletic font-bold text-xs uppercase"
            >
              <Download className="w-4 h-4" /> Export Squad CSV
            </button>
          </div>

          <div className="p-5 rounded-xl bg-[#EEF7EF] border border-[#08783E]/20 space-y-3">
            <h4 className="font-athletic text-xl font-bold uppercase text-[#063B25]">
              Sponsor Inquiries ({db.sponsorInquiries.length})
            </h4>
            <button
              type="button"
              onClick={() => {
                const header = 'Business,Contact,Phone,Email,Package,Budget,Status\n';
                const rows = db.sponsorInquiries
                  .map(
                    (i) =>
                      `"${i.businessName}","${i.contactName}","${i.phoneNumber}","${i.email}","${i.packageOfInterest}","${i.budgetKes || ''}","${i.inquiryStatus}"`
                  )
                  .join('\n');
                downloadCsv('nginda_sponsor_inquiries.csv', header + rows);
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#08783E] text-white font-athletic font-bold text-xs uppercase"
            >
              <Download className="w-4 h-4" /> Export Inquiries CSV
            </button>
          </div>

          <div className="p-5 rounded-xl bg-[#EEF7EF] border border-[#08783E]/20 space-y-3">
            <h4 className="font-athletic text-xl font-bold uppercase text-[#063B25]">
              Contributions Ledger ({db.donations.length})
            </h4>
            <button
              type="button"
              onClick={() => {
                const header = 'ID,Campaign,Donor,Amount,Status,Receipt,Date\n';
                const rows = db.donations
                  .map(
                    (d) =>
                      `"${d.id}","${d.campaignTitle}","${d.donorName}","${d.amountKes}","${d.status}","${d.mpesaReceiptNumber || ''}","${d.createdAt}"`
                  )
                  .join('\n');
                downloadCsv('nginda_donations_ledger.csv', header + rows);
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#08783E] text-white font-athletic font-bold text-xs uppercase"
            >
              <Download className="w-4 h-4" /> Export Ledger CSV
            </button>
          </div>

          <div className="p-5 rounded-xl bg-[#EEF7EF] border border-[#08783E]/20 space-y-3">
            <h4 className="font-athletic text-xl font-bold uppercase text-[#063B25]">
              Supporters ({db.fanMemberships.length})
            </h4>
            <button
              type="button"
              onClick={() => {
                const header = 'Full Name,Phone,Email,Ward,Tier,Date\n';
                const rows = db.fanMemberships
                  .map(
                    (m) =>
                      `"${m.fullName}","${m.phoneNumber}","${m.email || ''}","${m.wardOrLocation || ''}","${m.membershipTier}","${m.createdAt}"`
                  )
                  .join('\n');
                downloadCsv('nginda_fan_memberships.csv', header + rows);
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#08783E] text-white font-athletic font-bold text-xs uppercase"
            >
              <Download className="w-4 h-4" /> Export Members CSV
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 11. USERS & ROLES MODULE (With Owner Super Admin Protection)
  if (activeModule === 'users') {
    return (
      <div className="space-y-8">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onMutate('create_admin_user', {
              email: newAdminEmail,
              fullName: newAdminName,
              password: newAdminPassword,
              roleCode: newAdminRole,
            });
            setNewAdminEmail('');
            setNewAdminName('');
            setNewAdminPassword('');
          }}
          className="bg-white rounded-2xl p-6 border-2 border-[#08783E] space-y-4"
        >
          <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
            Create Administrative Account & Assign Role
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                placeholder="Official Full Name"
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Admin Email *
              </label>
              <input
                type="email"
                required
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="staff@ngindawarriorsfc.co.ke"
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Initial Password *
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
                Role Permission *
              </label>
              <select
                value={newAdminRole}
                onChange={(e) => setNewAdminRole(e.target.value as AdminRoleCode)}
                className="w-full px-3 py-2 rounded border border-gray-300 text-sm bg-white font-bold"
              >
                <option value="CLUB_ADMIN">Club Administrator</option>
                <option value="CONTENT_EDITOR">Content Editor</option>
                <option value="MATCH_OFFICIAL">Match Official</option>
                <option value="FINANCE_MANAGER">Finance Manager</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#F5D000] text-[#063B25] font-athletic font-black text-sm uppercase tracking-wider"
          >
            Create Administrator
          </button>
        </form>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-[#063B25] text-white">
            <h4 className="font-athletic text-xl font-bold uppercase text-[#F5D000]">
              Administrative Users ({db.users.length})
            </h4>
          </div>
          <div className="divide-y divide-gray-100">
            {db.users.map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-athletic text-xl font-bold uppercase text-[#063B25]">
                      {u.fullName}
                    </p>
                    {u.isOwnerSuperAdmin && (
                      <span className="px-2 py-0.5 rounded bg-[#F5D000] text-[#063B25] font-athletic font-black text-[10px] uppercase">
                        Owner Super Admin (Protected)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">
                    {u.email} • Role: <strong>{u.roleCode}</strong> • Last Login:{' '}
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('en-KE') : 'Never'}
                  </p>
                </div>
                {!u.isOwnerSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => onMutate('delete_admin_user', { userId: u.id })}
                    className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                    title="Remove User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 12. INTEGRATIONS & SECURITY LOGS
  if (activeModule === 'integrations') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-athletic text-2xl font-black uppercase text-[#063B25]">
          Third-Party Technical Integrations
        </h3>
        <div className="space-y-4">
          {db.integrationSettings.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between"
            >
              <div>
                <p className="font-athletic text-xl font-bold uppercase text-[#063B25]">
                  {item.displayName}
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  Environment: {item.environment}
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs font-bold">
                <input
                  type="checkbox"
                  checked={item.isEnabled}
                  onChange={(e) =>
                    onMutate('save_integration_setting', {
                      providerKey: item.providerKey,
                      isEnabled: e.target.checked,
                    })
                  }
                />
                <span>{item.isEnabled ? 'Enabled' : 'Disabled'}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 13. SECURITY AUDIT LOGS
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 bg-[#063B25] text-white flex items-center justify-between">
        <h3 className="font-athletic text-xl font-bold uppercase text-[#F5D000]">
          Security & Administrative Audit Logs ({db.auditLogs.length})
        </h3>
      </div>
      <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
        {db.auditLogs.map((log) => (
          <div key={log.id} className="p-3.5 flex items-start justify-between gap-4 text-xs">
            <div>
              <span className="font-mono font-bold text-[#08783E] uppercase">{log.action}</span>
              <p className="font-semibold text-[#063B25] mt-0.5">{log.summary}</p>
              <p className="text-gray-500 mt-0.5">
                Actor: {log.actorName} ({log.actorRole}) • Module: {log.module}
              </p>
            </div>
            <span className="text-gray-400 shrink-0">
              {new Date(log.createdAt).toLocaleTimeString('en-KE')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
