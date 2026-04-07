import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// Simulate subway train movement. Called every ~15s from the client.
// Each call nudges trains along their direction of travel.
// NYC subway avg speed ~27 km/h → ~112m per 15s → ~0.001° lat per tick.
const LAT_STEP = 0.0011;  // ~120m northward per tick
const LON_WOBBLE = 0.0003; // slight random east-west drift

export async function POST() {
  try {
    const trains = await prisma.subwayTrain.findMany();
    if (trains.length === 0) return NextResponse.json({ updated: 0 });

    await Promise.all(
      trains.map((train) => {
        const isNorth = train.direction === 'N' || train.direction === 'UPTOWN';
        const deltaLat = isNorth ? LAT_STEP : -LAT_STEP;
        const deltaLon = (Math.random() - 0.5) * LON_WOBBLE;

        // Soft boundary: if a train drifts too far from NYC, nudge it back
        let newLat = train.lat + deltaLat;
        let newLon = train.lon + deltaLon;

        // NYC subway rough bounds: lat 40.55–40.92, lon -74.25 – -73.70
        if (newLat > 40.92) { newLat = 40.92; }
        if (newLat < 40.55) { newLat = 40.55; }
        if (newLon > -73.70) { newLon = -73.70; }
        if (newLon < -74.25) { newLon = -74.25; }

        // Flip direction when hitting boundary
        const hitBoundary =
          (isNorth && newLat >= 40.92) || (!isNorth && newLat <= 40.55);
        const newDirection = hitBoundary
          ? isNorth ? 'S' : 'N'
          : train.direction;

        return prisma.subwayTrain.update({
          where: { id: train.id },
          data: { lat: newLat, lon: newLon, direction: newDirection },
        });
      })
    );

    return NextResponse.json({ updated: trains.length });
  } catch (err) {
    console.error('Transit sync error:', err);
    return NextResponse.json({ error: 'Sync failed', updated: 0 }, { status: 200 });
  }
}
