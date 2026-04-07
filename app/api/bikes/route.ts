import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { mergeGbfsFeeds, isDataStale, computeBikesSummary } from '@/app/lib/gbfs';

const GBFS_INFO_URL = 'https://gbfs.citibikenyc.com/gbfs/en/station_information.json';
const GBFS_STATUS_URL = 'https://gbfs.citibikenyc.com/gbfs/en/station_status.json';
const SYNC_INTERVAL_MS = 60_000;

async function fetchLiveGbfs() {
  const [infoRes, statusRes] = await Promise.all([
    fetch(GBFS_INFO_URL, { next: { revalidate: 60 } }),
    fetch(GBFS_STATUS_URL, { next: { revalidate: 30 } }),
  ]);

  if (!infoRes.ok || !statusRes.ok) throw new Error('GBFS fetch failed');

  const [infoData, statusData] = await Promise.all([infoRes.json(), statusRes.json()]);

  return mergeGbfsFeeds(infoData.data.stations, statusData.data.stations);
}

async function syncGbfsToDb() {
  const newest = await prisma.bikeStation.findFirst({
    orderBy: { lastUpdated: 'desc' },
    select: { lastUpdated: true },
  });

  if (!isDataStale(newest?.lastUpdated ?? null, SYNC_INTERVAL_MS)) return;

  const live = await fetchLiveGbfs();

  const batchSize = 50;
  for (let i = 0; i < live.length; i += batchSize) {
    await Promise.all(
      live.slice(i, i + batchSize).map((s) =>
        prisma.bikeStation.upsert({
          where: { stationId: s.stationId },
          create: s,
          update: {
            bikesAvailable: s.bikesAvailable,
            docksAvailable: s.docksAvailable,
            isInstalled: s.isInstalled,
            isRenting: s.isRenting,
            isReturning: s.isReturning,
            lastUpdated: s.lastUpdated,
          },
        })
      )
    );
  }
}

export async function GET() {
  try {
    await syncGbfsToDb();
  } catch {
    // Proceed with DB data if GBFS is unavailable
  }

  const stations = await prisma.bikeStation.findMany({ orderBy: { name: 'asc' } });
  const summary = computeBikesSummary(stations);

  return NextResponse.json({ stations, summary });
}
