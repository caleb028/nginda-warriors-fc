import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json().catch(() => ({}));
    return NextResponse.json({ ok: true, received: payload });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Notification failed';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
