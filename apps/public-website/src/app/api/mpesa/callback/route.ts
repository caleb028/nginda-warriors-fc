import { NextRequest, NextResponse } from 'next/server';
import { reconcileMpesaTransaction } from '@nginda-warriors/shared/server';

export async function POST(req: NextRequest) {
  try {
    const configuredSecret = process.env.DARAJA_WEBHOOK_SECRET;
    if (configuredSecret) {
      const urlSecret = req.nextUrl.searchParams.get('secret');
      const headerSecret = req.headers.get('x-daraja-webhook-secret');
      if (urlSecret !== configuredSecret && headerSecret !== configuredSecret) {
        return NextResponse.json(
          { ResultCode: 1, ResultDesc: 'Unauthorized: Invalid Daraja webhook secret' },
          { status: 401 }
        );
      }
    }

    const payload = await req.json();
    const stkCallback = payload?.Body?.stkCallback;

    if (!stkCallback || !stkCallback.CheckoutRequestID) {
      return NextResponse.json(
        { ResultCode: 1, ResultDesc: 'Invalid Daraja callback payload' },
        { status: 400 }
      );
    }

    const checkoutRequestId: string = stkCallback.CheckoutRequestID;
    const resultCode: number = Number(stkCallback.ResultCode);

    let receipt = '';
    const items: Array<{ Name: string; Value?: string | number }> =
      stkCallback?.CallbackMetadata?.Item || [];
    for (const item of items) {
      if (item.Name === 'MpesaReceiptNumber' && item.Value) {
        receipt = String(item.Value);
      }
    }

    const newStatus =
      resultCode === 0 ? 'confirmed' : resultCode === 1032 ? 'cancelled' : 'failed';

    reconcileMpesaTransaction({
      checkoutRequestId,
      newStatus,
      mpesaReceiptNumber: receipt || undefined,
      actorUserId: 'daraja_webhook',
      actorName: 'Safaricom Daraja Callback',
      actorRole: 'SYSTEM',
    });

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Callback processed successfully',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Callback processing error';
    return NextResponse.json({ ResultCode: 1, ResultDesc: message }, { status: 500 });
  }
}
