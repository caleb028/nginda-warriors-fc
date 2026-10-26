'use client';

import React, { useState } from 'react';
import { CheckCircle2, Users } from 'lucide-react';

export default function FanMembershipPage() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [wardOrLocation, setWardOrLocation] = useState('');
  const [membershipTier, setMembershipTier] = useState('Community Supporter');
  const [commSms, setCommSms] = useState(true);
  const [commWhatsapp, setCommWhatsapp] = useState(true);
  const [commEmail, setCommEmail] = useState(false);
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
          type: 'fan_membership',
          payload: {
            fullName,
            phoneNumber,
            email,
            wardOrLocation,
            membershipTier,
            commSms,
            commWhatsapp,
            commEmail,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || 'Could not complete registration.');
      } else {
        setSuccessMsg(data.message);
        setFullName('');
        setPhoneNumber('');
        setEmail('');
        setWardOrLocation('');
      }
    } catch {
      setErrorMsg('Network error submitting membership registration.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner - White Dominant */}
      <section className="bg-slate-50 text-slate-900 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="px-3 py-1 rounded-full bg-[#08783E]/10 border border-[#08783E]/20 text-[#08783E] font-pedals font-athletic font-extrabold text-xs uppercase tracking-widest">
            OFFICIAL SUPPORTER COMMUNITY
          </span>
          <h1 className="font-pedals font-athletic text-4xl sm:text-5xl font-black uppercase text-slate-950 mt-2">
            JOIN THE WARRIORS FAN MEMBERSHIP
          </h1>
          <p className="text-slate-600 text-base mt-1 max-w-2xl">
            Register as an official Nginda Warriors FC supporter and customize how you receive matchday alerts and club announcements.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5"
        >
          <div className="flex items-center gap-2 text-[#08783E] font-pedals font-athletic font-bold uppercase text-sm">
            <Users className="w-5 h-5 text-[#08783E]" />
            <span>Supporter Registration Form</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your Full Name"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-[#08783E] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="07XX XXX XXX"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-[#08783E] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="supporter@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-[#08783E] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Ward / Location / Branch
              </label>
              <input
                type="text"
                value={wardOrLocation}
                onChange={(e) => setWardOrLocation(e.target.value)}
                placeholder="e.g. Nginda / Maragua"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-[#08783E] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Supporter Category
            </label>
            <select
              value={membershipTier}
              onChange={(e) => setMembershipTier(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:border-[#08783E] focus:outline-none"
            >
              <option value="Community Supporter">Community Supporter</option>
              <option value="Matchday Gold Member">Matchday Gold Member</option>
              <option value="Diaspora Warrior Supporter">Diaspora Warrior Supporter</option>
            </select>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <p className="text-xs font-extrabold uppercase text-slate-700">
              Communication Preferences
            </p>
            <div className="flex flex-wrap gap-6 text-xs font-semibold text-slate-600">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={commSms}
                  onChange={(e) => setCommSms(e.target.checked)}
                />
                <span>Matchday SMS Updates</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={commWhatsapp}
                  onChange={(e) => setCommWhatsapp(e.target.checked)}
                />
                <span>WhatsApp Community Broadcasts</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={commEmail}
                  onChange={(e) => setCommEmail(e.target.checked)}
                />
                <span>Email Newsletter</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-[#08783E] hover:bg-[#063B25] text-white font-pedals font-athletic font-black text-lg uppercase tracking-wider shadow-sm transition"
          >
            {submitting ? 'Registering Membership...' : 'Complete Supporter Registration'}
          </button>

          {successMsg && (
            <div className="p-4 rounded-xl bg-[#08783E]/10 border border-[#08783E]/30 text-[#08783E] text-xs font-bold flex items-center gap-2">
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
      </div>
    </div>
  );
}
