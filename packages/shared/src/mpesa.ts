import {
  createNotification,
  createUuid,
  maskPhoneNumber,
  readDatabase,
  recordAuditLog,
  writeDatabase,
} from './db';
import { DonationRecord, PaymentTransactionStatus } from './types';

export function normalizeKenyanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('254') && digits.length === 12) return digits;
  if (digits.startsWith('07') && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.startsWith('01') && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.length === 9 && (digits.startsWith('7') || digits.startsWith('1'))) {
    return `254${digits}`;
  }
  return digits;
}

export async function initiateDarajaStkPush(params: {
  campaignId?: string;
  campaignTitle: string;
  donorName?: string;
  donorPhone: string;
  isAnonymous: boolean;
  amountKes: number;
  paymentMethod?: 'mpesa_stk' | 'mpesa_paybill' | 'mpesa_till';
  manualReceiptReference?: string;
}): Promise<{
  donation: DonationRecord;
  darajaDispatched: boolean;
  checkoutRequestId: string;
  customerMessage: string;
}> {
  const normalizedPhone = normalizeKenyanPhone(params.donorPhone);
  if (normalizedPhone.length < 10) {
    throw new Error('Please enter a valid Kenyan M-Pesa phone number (e.g. 07XX XXX XXX).');
  }
  if (!params.amountKes || params.amountKes < 10) {
    throw new Error('Minimum M-Pesa contribution amount is KES 10.');
  }

  const db = readDatabase();
  const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

  // IMPORTANT SECURITY RULE:
  // A payment is NEVER marked confirmed upon initiation. It starts strictly as 'pending'
  // until confirmed by the Safaricom Daraja callback or verified by Finance Administration.
  const donation: DonationRecord = {
    id: createUuid(),
    campaignId: params.campaignId,
    campaignTitle: params.campaignTitle,
    donorName: params.isAnonymous ? 'Anonymous Supporter' : params.donorName || 'Warrior Supporter',
    donorPhoneMasked: maskPhoneNumber(normalizedPhone),
    isAnonymous: Boolean(params.isAnonymous),
    amountKes: Number(params.amountKes),
    paymentMethod: params.paymentMethod || 'mpesa_stk',
    status: 'pending',
    mpesaReceiptNumber: params.manualReceiptReference || undefined,
    checkoutRequestId,
    createdAt: new Date().toISOString(),
  };

  db.donations.unshift(donation);

  createNotification(db, {
    title: 'New M-Pesa Contribution Initiated (Pending Verification)',
    message: `KES ${donation.amountKes.toLocaleString()} for "${donation.campaignTitle}" (${donation.donorPhoneMasked}) is awaiting payment confirmation.`,
    category: 'finance',
    actionHref: '/donations',
  });

  recordAuditLog(db, {
    actorUserId: 'public',
    actorName: donation.donorName || 'Supporter',
    actorRole: 'PUBLIC_VISITOR',
    action: 'MPESA_CONTRIBUTION_INITIATED',
    module: 'donations',
    targetId: donation.id,
    summary: `Initiated ${donation.paymentMethod} contribution of KES ${donation.amountKes} for ${donation.campaignTitle} (status: pending)`,
  });

  writeDatabase(db);

  // Check if live Safaricom Daraja credentials are configured on the server
  const consumerKey = process.env.DARAJA_CONSUMER_KEY;
  const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;
  const shortcode = process.env.DARAJA_SHORTCODE;
  const passkey = process.env.DARAJA_PASSKEY;
  const callbackUrl = process.env.DARAJA_CALLBACK_URL;

  const hasLiveCredentials =
    consumerKey &&
    consumerSecret &&
    shortcode &&
    passkey &&
    !consumerKey.includes('your-safaricom');

  if (hasLiveCredentials && params.paymentMethod === 'mpesa_stk') {
    try {
      const baseUrl =
        process.env.DARAJA_ENVIRONMENT === 'production'
          ? 'https://api.safaricom.co.ke'
          : 'https://sandbox.safaricom.co.ke';

      const authHeader = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
      const tokenRes = await fetch(
        `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: { Authorization: `Basic ${authHeader}` },
        }
      );

      if (tokenRes.ok) {
        const tokenData = (await tokenRes.json()) as { access_token: string };
        const timestamp = new Date()
          .toISOString()
          .replace(/[-:TZ.]/g, '')
          .slice(0, 14);
        const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

        const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.round(params.amountKes),
            PartyA: normalizedPhone,
            PartyB: shortcode,
            PhoneNumber: normalizedPhone,
            CallBackURL: callbackUrl,
            AccountReference: 'NGINDAWARRIORS',
            TransactionDesc: params.campaignTitle.slice(0, 20),
          }),
        });

        if (stkRes.ok) {
          const stkJson = (await stkRes.json()) as {
            CheckoutRequestID?: string;
            CustomerMessage?: string;
          };
          if (stkJson.CheckoutRequestID) {
            const freshDb = readDatabase();
            const target = freshDb.donations.find((d) => d.id === donation.id);
            if (target) {
              target.checkoutRequestId = stkJson.CheckoutRequestID;
              writeDatabase(freshDb);
            }
          }
          return {
            donation,
            darajaDispatched: true,
            checkoutRequestId: stkJson.CheckoutRequestID || checkoutRequestId,
            customerMessage:
              stkJson.CustomerMessage ||
              'STK Push sent to your phone. Enter your M-Pesa PIN on your handset to complete the transaction.',
          };
        }
      }
    } catch {
      // Fall through to standard pending confirmation notice
    }
  }

  return {
    donation,
    darajaDispatched: false,
    checkoutRequestId,
    customerMessage:
      'Your contribution reference has been recorded as PENDING verification. It will appear on public campaign totals once confirmed by M-Pesa / Club Finance.',
  };
}

export function reconcileMpesaTransaction(params: {
  donationId?: string;
  checkoutRequestId?: string;
  newStatus: PaymentTransactionStatus;
  mpesaReceiptNumber?: string;
  actorUserId: string;
  actorName: string;
  actorRole: 'SUPER_ADMIN' | 'FINANCE_MANAGER' | 'CLUB_ADMIN' | 'SYSTEM';
}): DonationRecord {
  const db = readDatabase();
  const donation = db.donations.find(
    (d) =>
      (params.donationId && d.id === params.donationId) ||
      (params.checkoutRequestId && d.checkoutRequestId === params.checkoutRequestId)
  );

  if (!donation) {
    throw new Error('Payment transaction record not found.');
  }

  const previousStatus = donation.status;
  donation.status = params.newStatus;
  if (params.mpesaReceiptNumber) {
    donation.mpesaReceiptNumber = params.mpesaReceiptNumber.trim().toUpperCase();
  }
  if (params.newStatus === 'confirmed') {
    donation.verifiedAt = new Date().toISOString();
  }

  // Recompute verifiedRaisedKes for the linked campaign strictly from confirmed donations
  if (donation.campaignId) {
    const campaign = db.fundraisingCampaigns.find((c) => c.id === donation.campaignId);
    if (campaign) {
      campaign.verifiedRaisedKes = db.donations
        .filter((d) => d.campaignId === campaign.id && d.status === 'confirmed')
        .reduce((sum, d) => sum + Number(d.amountKes || 0), 0);
      campaign.updatedAt = new Date().toISOString();
    }
  }

  recordAuditLog(db, {
    actorUserId: params.actorUserId,
    actorName: params.actorName,
    actorRole: params.actorRole === 'SYSTEM' ? 'SYSTEM' : params.actorRole,
    action: 'MPESA_TRANSACTION_RECONCILED',
    module: 'donations',
    targetId: donation.id,
    summary: `Updated donation ${donation.id} (${donation.campaignTitle}, KES ${donation.amountKes}) from ${previousStatus} to ${params.newStatus}${
      donation.mpesaReceiptNumber ? ` [Receipt: ${donation.mpesaReceiptNumber}]` : ''
    }`,
  });

  writeDatabase(db);
  return donation;
}
