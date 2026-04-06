import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.watchlistItem.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        flight: true,
        alerts: { orderBy: { createdAt: 'desc' } },
      },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch watchlist:', error);
    return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, label, refId, notes } = body;

    if (!type || !label || !refId) {
      return NextResponse.json(
        { error: 'type, label, and refId are required' },
        { status: 400 }
      );
    }

    const item = await prisma.watchlistItem.create({
      data: {
        type,
        label,
        refId,
        notes: notes ?? '',
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Failed to create watchlist item:', error);
    return NextResponse.json({ error: 'Failed to create watchlist item' }, { status: 500 });
  }
}
