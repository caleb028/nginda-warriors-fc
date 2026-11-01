'use client';

import React, { useState } from 'react';
import { CheckCircle2, Mail, MapPin, Send } from 'lucide-react';

export default function ContactClubPage() {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [subject, setSubject] = useState('');
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
          type: 'contact_message',
          payload: {
            senderName,
            senderEmail,
            senderPhone,
            subject,
            message,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || 'Failed to send message.');
      } else {
        setSuccessMsg(data.message);
        setSenderName('');
        setSenderEmail('');
        setSenderPhone('');
        setSubject('');
        setMessage('');
      }
    } catch {
      setErrorMsg('Network error sending message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header Banner */}
      <section className="bg-[#0A0A0A] text-white py-12 border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="font-athletic text-4xl sm:text-5xl font-black uppercase text-white mt-2">
            CONTACT NGINDA WARRIORS FC
          </h1>
          <p className="text-slate-300 text-base mt-1">
            Reach out to club management for friendly match invitations, media inquiries, or community partnerships.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#141414] p-5 rounded-xl border border-[#262626] flex items-center gap-3 shadow-md">
            <MapPin className="w-6 h-6 text-[#FDE100]" />
            <div>
              <p className="text-xs font-bold uppercase text-[#FDE100]">Club Headquarters</p>
              <p className="font-semibold text-sm text-white">Nginda, Murang’a County, Kenya</p>
            </div>
          </div>
          <div className="bg-[#141414] p-5 rounded-xl border border-[#262626] flex items-center gap-3 shadow-md">
            <Mail className="w-6 h-6 text-[#FDE100]" />
            <div>
              <p className="text-xs font-bold uppercase text-[#FDE100]">Direct Secretariat Inbox</p>
              <p className="font-semibold text-sm text-white">
                Messages routed directly to the Control Centre
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#141414] rounded-2xl p-6 sm:p-8 border border-[#262626] shadow-xl space-y-4 text-white"
        >
          <h2 className="font-athletic text-3xl font-black uppercase text-white">
            Send an Official Message
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#262626] bg-[#0D0D0D] text-white placeholder-slate-500 text-sm focus:border-[#262626] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#262626] bg-[#0D0D0D] text-white placeholder-slate-500 text-sm focus:border-[#262626] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#262626] bg-[#0D0D0D] text-white placeholder-slate-500 text-sm focus:border-[#262626] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
              Subject *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Friendly Fixture Request / Media Accreditation"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#262626] bg-[#0D0D0D] text-white placeholder-slate-500 text-sm focus:border-[#262626] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
              Message *
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#262626] bg-[#0D0D0D] text-white placeholder-slate-500 text-sm focus:border-[#262626] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#FDE100] hover:bg-[#FFE600] text-black font-athletic font-black text-lg uppercase tracking-wider shadow-md transition active:scale-95"
          >
            <Send className="w-4 h-4 text-[#FDE100]" />
            <span>{submitting ? 'Sending Message...' : 'Send Message to Club Secretariat'}</span>
          </button>

          {successMsg && (
            <div className="p-4 rounded-xl bg-[#082012] border border-[#262626] text-[#FDE100] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#FDE100] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs font-semibold">
              {errorMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
