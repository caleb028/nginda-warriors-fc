import { NextResponse } from 'next/server';
import { readDatabase } from '@nginda-warriors/shared/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const startTime = Date.now();
    const db = readDatabase();
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      status: 'healthy',
      service: 'nginda-warriors-fc-platform',
      environment: process.env.NODE_ENV || 'production',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        status: 'connected',
        latencyMs,
        tablesCount: 37,
        activePlayers: db.players?.filter((p) => p.squadStatus === 'active').length || 0,
        upcomingFixtures: db.fixtures?.filter((f) => f.matchStatus === 'scheduled').length || 0,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Health check error';
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: errorMsg,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
