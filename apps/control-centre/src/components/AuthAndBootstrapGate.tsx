'use client';

import React, { useState } from 'react';
import { ClubCrest } from '@nginda-warriors/shared';
import { ArrowLeft, KeyRound, Lock, ShieldCheck, UserCheck } from 'lucide-react';
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
  const [mode, setMode] = useState<'login' | 'setup'>('login');
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
        credentials: 'include',
        body: JSON.stringify(
          mode === 'login'
            ? { action: 'login', email, password }
            : { action: 'bootstrap_owner', fullName, email, password, setupToken }
        ),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || 'Authentication failed. Please verify credentials.');
      } else {
        if (data.token && typeof window !== 'undefined') {
          localStorage.setItem('nginda_control_session_token', data.token);
        }
        onAuthenticated();
      }
    } catch {
      setErrorMsg('Network error communicating with Control Centre auth server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
        {/* Top Branded Header */}
        <div className="bg-black text-white p-8 text-center border-b border-[#262626]">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-[#0D0D0D] border border-[#FDE100]/40 shadow-xl flex items-center justify-center">
              <ClubCrest size={76} customCrestUrl={crestUrl} />
            </div>
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#FDE100]/15 border border-[#FDE100]/30 text-[#FDE100] font-pedals font-athletic font-black text-xs uppercase tracking-widest mb-2">
            CONTROL CENTRE • CLUB ADMINISTRATION
          </span>
          <h1 className="font-pedals font-athletic text-2xl sm:text-3xl font-black uppercase tracking-wide text-white">
            NGINDA WARRIORS FC
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Private Match & Club Management System (Est. 2024)
          </p>

          {/* Clean Mode Switcher Tabs */}
          <div className="mt-6 grid grid-cols-2 p-1 rounded-xl bg-[#141414] border border-[#262626]">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-athletic font-black uppercase tracking-wider transition ${
                mode === 'login'
                  ? 'bg-[#FDE100] text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('setup');
                setErrorMsg('');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-athletic font-black uppercase tracking-wider transition ${
                mode === 'setup'
                  ? 'bg-[#FDE100] text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              First-Time Setup
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {mode === 'setup' && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="font-extrabold uppercase flex items-center gap-1.5 text-[#08783E]">
                <ShieldCheck className="w-4 h-4" />
                <span>Super Administrator Setup</span>
              </div>
              <p>
                Claim primary <strong>SUPER_ADMIN</strong> ownership for Nginda Warriors Control Centre.
              </p>
            </div>
          )}

          {mode === 'setup' && (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Owner Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John Kamau"
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
              Password * {mode === 'setup' && '(Minimum 8 Characters)'}
            </label>
            <input
              type="password"
              required
              minLength={mode === 'setup' ? 8 : 4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-[#08783E] focus:outline-none"
            />
          </div>

          {mode === 'setup' && (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Setup Token (Optional)
              </label>
              <input
                type="password"
                value={setupToken}
                onChange={(e) => setSetupToken(e.target.value)}
                placeholder="Leave blank if not configured in .env"
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
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#08783E] hover:bg-[#063B25] text-white font-pedals font-athletic font-black text-base uppercase tracking-wider shadow-md transition"
          >
            {mode === 'login' ? (
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

        <div className="p-4 bg-slate-100 border-t border-slate-200 text-center">
          <a
            href={
              typeof window !== 'undefined' && window.location.origin
                ? `${window.location.origin}/`
                : 'https://nginda-warriors-fc-c549.vercel.app/'
            }
            className="inline-flex items-center gap-2 text-xs font-athletic font-bold uppercase tracking-wider text-slate-600 hover:text-[#08783E] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Club Website</span>
          </a>
        </div>
      </div>
    </div>
  );
}
