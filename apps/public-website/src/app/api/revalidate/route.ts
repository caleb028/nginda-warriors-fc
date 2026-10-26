import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetPath = typeof body.path === 'string' ? body.path : '/';
    revalidatePath(targetPath);
    return NextResponse.json({ ok: true, revalidated: targetPath });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Revalidation failed';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
