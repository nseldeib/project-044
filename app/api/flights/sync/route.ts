import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import {
  extractOpenSkyCallsign,
  isValidAirborneState,
  openSkyStateToFlightUpdate,
  type StateVector,
} from '@/app/lib/opensky';

// OpenSky Network free API — no key required, ~400 req/day unauthenticated
const OPENSKY_URL =
  'https://opensky-network.org/api/states/all?lamin=25&lomin=-130&lamax=55&lomax=40';

async function fetchOpenSkyStates(): Promise<StateVector[]> {
  const res = await fetch(OPENSKY_URL, {
    headers: { 'User-Agent': 'VECTOR/1.0' },
    signal: AbortSignal.timeout(8_000),
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`OpenSky returned ${res.status}`);
  const data = await res.json();
  return data.states ?? [];
}

function extractCallsigns(states: StateVector[]): string[] {
  return states
    .map((s) => extractOpenSkyCallsign(s))
    .filter(Boolean);
}

export async function POST() {
  try {
    const states = await fetchOpenSkyStates();
    const callsigns = extractCallsigns(states);

    if (callsigns.length === 0) {
      return NextResponse.json({ updated: 0, total: 0 });
    }

    const existing = await prisma.flight.findMany({
      where: { callsign: { in: callsigns }, status: 'EN_ROUTE' },
      select: { id: true, callsign: true },
    });

    const idByCallsign = new Map(existing.map((f) => [f.callsign, f.id]));
    const knownCallsigns = new Set(idByCallsign.keys());

    const updates = states
      .filter((s) => isValidAirborneState(s, knownCallsigns))
      .map((s) => openSkyStateToFlightUpdate(s, idByCallsign));

    await Promise.all(
      updates.map((u) =>
        prisma.flight.update({
          where: { id: u.id },
          data: {
            lat: u.lat,
            lon: u.lon,
            altitude: u.altitude,
            groundSpeed: u.groundSpeed,
            heading: u.heading,
            verticalRate: u.verticalRate,
            squawk: u.squawk,
          },
        })
      )
    );

    return NextResponse.json({ updated: updates.length, total: states.length });
  } catch (err) {
    console.error('OpenSky sync error:', err);
    return NextResponse.json({ error: 'Sync failed', updated: 0 }, { status: 200 });
  }
}
