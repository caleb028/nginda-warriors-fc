'use client';

import React, { useState } from 'react';
import { ClubCrest } from '@nginda-warriors/shared';
import { KeyRound, Lock, ShieldCheck, UserCheck } from 'lucide-react';
import { adminApiUrl } from '../utils/api';

export function AuthAndBootstrapGate({
  bootstrapped,
  crestUrl,
  onAuthenticated,
}: {
  bootstrapped: boolean;
  crestUrl?: string;
  onAuthenticated: () => void;
}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(adminApiUrl('/api/admin/auth'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          bootstrapped
            ? { action: 'login', email, password }
            : { action: 'bootstrap_owner', fullName, email, password, setupToken }
        ),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || 'Authentication failed.');
      } else {
        onAuthenticated();
      }
    } catch {
      setErrorMsg('Network error communicating with Control Centre auth server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Top Branded Header */}
        <div className="bg-white text-slate-900 p-8 text-center border-b border-slate-200">
          <div className="flex justify-center mb-4">
            <div className="p-2 rounded-full bg-slate-50 border border-slate-200 shadow-xs">
              <ClubCrest size={80} customCrestUrl={crestUrl} />
            </div>
          </div>
          <span className="inline-block px-3 py-0.5 rounded-full bg-[#08783E]/10 border border-[#08783E]/20 text-[#08783E] font-pedals font-athletic font-black text-xs uppercase tracking-widest mb-2">
            PRIVATE ADMINISTRATIVE SYSTEM • EST. 2024
          </span>
          <h1 className="font-pedals font-athletic text-2xl sm:text-3xl font-black uppercase tracking-wide text-slate-950">
            NGINDA WARRIORS CONTROL CENTRE
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {bootstrapped
              ? 'Sign in with your authorized administrator credentials'
              : 'Initial Super Administrator Ownership Bootstrap'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {!bootstrapped && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="font-extrabold uppercase flex items-center gap-1.5 text-[#08783E]">
                <ShieldCheck className="w-4 h-4" />
                <span>First-Time Owner Setup (No Hardcoded Credentials)</span>
              </div>
              <p>
                Establish primary <strong>SUPER_ADMIN</strong> ownership for Nginda Warriors Control Centre. Once claimed, this setup screen locks permanently.
              </p>
            </div>
          )}

          {!bootstrapped && (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Owner Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Primary Super Administrator Name"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-[#08783E] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Administrator Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ngindawarriorsfc.co.ke"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-[#08783E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Password * {!bootstrapped && '(Minimum 8 Characters)'}
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-[#08783E] focus:outline-none"
            />
          </div>

          {!bootstrapped && (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Optional Setup Token (If Configured in Environment)
              </label>
              <input
                type="password"
                value={setupToken}
                onChange={(e) => setSetupToken(e.target.value)}
                placeholder="Leave blank if not required by .env"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:border-[#08783E] focus:outline-none"
              />
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#08783E] hover:bg-[#063B25] text-white font-pedals font-athletic font-black text-base uppercase tracking-wider shadow-sm transition"
          >
            {bootstrapped ? (
              <>
                <KeyRound className="w-5 h-5 text-[#F5D000]" />
                <span>{loading ? 'Signing In...' : 'Sign In to Control Centre'}</span>
              </>
            ) : (
              <>
                <UserCheck className="w-5 h-5 text-[#F5D000]" />
                <span>
                  {loading
                    ? 'Establishing Ownership...'
                    : 'Establish Super Admin Ownership'}
                </span>
              </>
            )}
          </button>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <Lock className="w-3.5 h-3.5 text-[#08783E]" />
            <span>Protected by Role-Based Access Control & Audit Logging</span>
          </div>
        </form>
      </div>
    </div>
  );
}
