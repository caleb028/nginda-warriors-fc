'use client';

import React, { useState } from 'react';
import { CheckCircle2, Lock, Smartphone } from 'lucide-react';

export function MpesaSupportForm({
  campaigns,
  mpesaConfig,
}: {
  campaigns: Array<{ id: string; title: string; accountReference: string }>;
  mpesaConfig: {
    isEnabled: boolean;
    paybillNumber: string;
    tillNumber: string;
    accountPrefix: string;
  };
}) {
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id || '');
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [amountKes, setAmountKes] = useState('500');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa_stk' | 'mpesa_paybill' | 'mpesa_till'>(
    'mpesa_stk'
  );
  const [manualReceiptReference, setManualReceiptReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resultMsg, setResultMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResultMsg('');
    setErrorMsg('');

    const chosenCampaign = campaigns.find((c) => c.id === selectedCampaignId);

    try {
      const res = await fetch('/api/public/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'mpesa_contribution',
          payload: {
            campaignId: chosenCampaign?.id,
            campaignTitle: chosenCampaign?.title || 'General Club Development Fund',
            donorName,
            donorPhone,
            isAnonymous,
            amountKes: Number(amountKes),
            paymentMethod,
            manualReceiptReference: manualReceiptReference || undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || 'Could not initiate M-Pesa contribution.');
      } else {
        setResultMsg(
          `${data.message} (Reference: ${data.checkoutRequestId} • Status: ${String(
            data.status
          ).toUpperCase()})`
        );
      }
    } catch {
      setErrorMsg('Network error submitting M-Pesa contribution request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleContribute}
      className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-[#08783E] shadow-lg space-y-5"
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#08783E]">
            SAFARICOM M-PESA CONTRIBUTION DESK
          </span>
          <h3 className="font-athletic text-3xl font-black uppercase text-[#063B25]">
            Support Nginda Warriors FC
          </h3>
        </div>
        <Smartphone className="w-8 h-8 text-[#08783E]" />
      </div>

      {/* Preset Amounts */}
      <div>
        <label className="block text-xs font-bold uppercase text-[#063B25] mb-2">
          Select or Enter Amount (KES) *
        </label>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {['200', '500', '1000', '5000'].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setAmountKes(amt)}
              className={`py-2 rounded-lg font-athletic font-black text-base transition ${
                amountKes === amt
                  ? 'bg-[#08783E] text-white'
                  : 'bg-[#EEF7EF] text-[#063B25] hover:bg-[#08783E]/20'
              }`}
            >
              KES {Number(amt).toLocaleString()}
            </button>
          ))}
        </div>
        <input
          type="number"
          min="10"
          required
          value={amountKes}
          onChange={(e) => setAmountKes(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm font-bold"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
          Select Target Campaign
        </label>
        <select
          value={selectedCampaignId}
          onChange={(e) => setSelectedCampaignId(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm bg-white"
        >
          {campaigns.length > 0 ? (
            campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} (Ref: {c.accountReference})
              </option>
            ))
          ) : (
            <option value="">General Club Support & Player Welfare</option>
          )}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
            M-Pesa Phone Number *
          </label>
          <input
            type="tel"
            required
            value={donorPhone}
            onChange={(e) => setDonorPhone(e.target.value)}
            placeholder="07XX XXX XXX"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-[#063B25] mb-1">
            Your Name (Optional)
          </label>
          <input
            type="text"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            placeholder="Supporter Name"
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <input
          id="anon-check"
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor="anon-check" className="text-gray-700 font-medium">
          Keep my contribution anonymous on public supporter lists
        </label>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="block text-xs font-bold uppercase text-[#063B25]">
          Payment Method
        </label>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { id: 'mpesa_stk', label: 'M-Pesa STK Push' },
            { id: 'mpesa_paybill', label: 'Paybill Reference' },
            { id: 'mpesa_till', label: 'Buy Goods Till' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() =>
                setPaymentMethod(m.id as 'mpesa_stk' | 'mpesa_paybill' | 'mpesa_till')
              }
              className={`py-2 px-2 rounded-lg font-bold border ${
                paymentMethod === m.id
                  ? 'bg-[#063B25] text-[#F5D000] border-[#063B25]'
                  : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {paymentMethod !== 'mpesa_stk' && (
          <div className="p-3.5 rounded-xl bg-[#EEF7EF] text-xs space-y-2 mt-2">
            <p className="font-bold text-[#063B25]">
              {mpesaConfig.paybillNumber
                ? `Official Paybill: ${mpesaConfig.paybillNumber} • Account: ${mpesaConfig.accountPrefix}`
                : mpesaConfig.tillNumber
                ? `Official Buy Goods Till: ${mpesaConfig.tillNumber}`
                : 'Enter your M-Pesa transaction code below for Finance Manager verification:'}
            </p>
            <input
              type="text"
              value={manualReceiptReference}
              onChange={(e) => setManualReceiptReference(e.target.value)}
              placeholder="Optional M-Pesa Receipt Code (e.g. SKN4X92L1P)"
              className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-xs uppercase"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 rounded-xl bg-[#F5D000] hover:bg-[#ffe033] text-[#063B25] font-athletic font-black text-lg uppercase tracking-wider shadow-md"
      >
        {submitting ? 'Processing Request...' : 'Initiate Verified M-Pesa Contribution'}
      </button>

      <div className="flex items-start gap-2 text-[11px] text-gray-500">
        <Lock className="w-4 h-4 text-[#08783E] shrink-0 mt-0.5" />
        <span>
          <strong>Security Guarantee:</strong> This website never asks for your M-Pesa PIN. Contributions are recorded as Pending and only added to verified campaign totals after confirmation from the payment provider.
        </span>
      </div>

      {resultMsg && (
        <div className="p-4 rounded-xl bg-[#EEF7EF] border border-[#08783E] text-[#063B25] text-xs font-bold flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#08783E] shrink-0 mt-0.5" />
          <span>{resultMsg}</span>
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
