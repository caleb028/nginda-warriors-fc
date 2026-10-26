'use client';

import React, { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';

export function SponsorInquiryForm({ packages }: { packages: string[] }) {
  const [contactName, setContactName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [packageOfInterest, setPackageOfInterest] = useState(
    packages[0] || 'Main Kit Sponsor (Principal Partner)'
  );
  const [budgetKes, setBudgetKes] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
          type: 'sponsor_inquiry',
          payload: {
            contactName,
            businessName,
            phoneNumber,
            email,
            packageOfInterest,
            budgetKes: budgetKes ? Number(budgetKes) : null,
            message,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || 'Failed to submit sponsorship inquiry.');
      } else {
        setSuccessMsg(data.message);
        setContactName('');
        setBusinessName('');
        setPhoneNumber('');
        setEmail('');
        setBudgetKes('');
        setMessage('');
      }
    } catch {
      setErrorMsg('Network error while submitting sponsorship inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white text-[#17231C] rounded-2xl p-6 sm:p-8 border-2 border-[#F5D000] shadow-xl space-y-4"
    >
      <h3 className="font-athletic text-3xl font-black uppercase text-[#063B25]">
        Official Partnership Inquiry Form
      </h3>
      <p className="text-xs text-gray-600">
        Submit your details below. Inquiries are delivered directly to the Nginda Warriors Control Centre for executive follow-up.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
            Contact Name *
          </label>
          <input
            type="text"
            required
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="e.g. Jane Mwangi"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
            Business / Organization Name *
          </label>
          <input
            type="text"
            required
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Highlands Agro Ltd"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g. 0712 345 678"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="partnerships@company.co.ke"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
            Package of Interest *
          </label>
          <select
            value={packageOfInterest}
            onChange={(e) => setPackageOfInterest(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm bg-white"
          >
            {packages.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
            <option value="Custom Bespoke Partnership">Custom Bespoke Partnership</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
            Optional Estimated Budget (KES)
          </label>
          <input
            type="number"
            min="0"
            value={budgetKes}
            onChange={(e) => setBudgetKes(e.target.value)}
            placeholder="Optional (KES)"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
          Partnership Goals & Message *
        </label>
        <textarea
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us how your business would like to partner with Nginda Warriors FC..."
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#F5D000] hover:bg-[#ffe033] text-[#063B25] font-athletic font-black text-lg uppercase tracking-wider shadow-md disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        <span>{submitting ? 'Submitting Inquiry...' : 'Submit Official Partnership Inquiry'}</span>
      </button>

      {successMsg && (
        <div className="p-4 rounded-xl bg-[#EEF7EF] border border-[#08783E] text-[#063B25] text-xs font-bold flex items-center gap-2">
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
  );
}
