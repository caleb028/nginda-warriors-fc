'use client';

import React, { useEffect, useState } from 'react';
import { Download, Share, X, CheckCircle2, Smartphone } from 'lucide-react';
import { ClubCrest } from '@nginda-warriors/shared';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallPrompt({ crestUrl }: { crestUrl?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already in standalone / installed mode
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      Boolean((navigator as unknown as { standalone?: boolean }).standalone);
    setIsStandalone(isStandaloneMode);
    if (isStandaloneMode) return;

    // Check if dismissed recently
    const dismissedAt = localStorage.getItem('nginda_pwa_dismissed');
    if (dismissedAt && Date.now() - Number(dismissedAt) < 24 * 60 * 60 * 1000) {
      return;
    }

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIos(isIosDevice);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // If on iOS and not standalone, show prompt after 3s
    if (isIosDevice) {
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIosGuide(false);
    localStorage.setItem('nginda_pwa_dismissed', String(Date.now()));
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <>
      <div className="fixed bottom-16 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 z-50 sm:max-w-md bg-[#0D1410] border-2 border-[#08783E] rounded-2xl shadow-2xl p-4 transition-all animate-in fade-in slide-in-from-bottom-5 text-white">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-xl bg-[#0A0F0D] border border-[#1E2B23] shrink-0 shadow-xs flex items-center justify-center">
            <ClubCrest size={44} customCrestUrl={crestUrl} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h4 className="font-athletic text-base font-black uppercase tracking-wider text-white leading-tight">
                Install Nginda Warriors App
              </h4>
              <button
                type="button"
                onClick={handleDismiss}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
                aria-label="Dismiss install banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-normal">
              Instant match updates, squad profiles & fixtures on your phone home screen. Works offline.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#08783E] hover:bg-[#063B25] text-white font-athletic font-black text-xs uppercase tracking-wider shadow-md transition active:scale-95"
              >
                <Download className="w-4 h-4 text-[#F5D000]" />
                <span>{isIos ? 'Install on iPhone' : 'Install Free App'}</span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* iOS Installation Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0D1410] border border-[#1E2B23] rounded-3xl p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#4ADE80]" />
                <h3 className="font-athletic font-black text-lg uppercase tracking-wider text-white">
                  Install on iOS Safari
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-200">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#080D0A] border border-[#1E2B23]">
                <span className="w-6 h-6 rounded-full bg-[#08783E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </span>
                <p>
                  Tap the <strong className="inline-flex items-center gap-1 text-[#F5D000]"><Share className="w-3.5 h-3.5 inline" /> Share</strong> button at the bottom of Safari.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#080D0A] border border-[#1E2B23]">
                <span className="w-6 h-6 rounded-full bg-[#08783E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </span>
                <p>
                  Scroll down the share sheet and tap <strong>"Add to Home Screen"</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#080D0A] border border-[#1E2B23]">
                <span className="w-6 h-6 rounded-full bg-[#08783E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </span>
                <p>
                  Tap <strong>"Add"</strong> in the top right corner. The Nginda Warriors FC app will appear on your Home Screen!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 rounded-xl bg-[#08783E] text-white font-athletic font-bold text-sm uppercase tracking-wider hover:bg-[#063B25] transition shadow-md"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
