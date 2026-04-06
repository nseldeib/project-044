import { NextRequest, NextResponse } from 'next/server';

// Proxy CartoDB dark matter map tiles server-side.
// Avoids cross-origin ORB blocking in restricted environments (screenshot capture).
// Usage: /api/tiles?s=a&z=3&x=2&y=2
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const s = searchParams.get('s');
  const z = searchParams.get('z');
  const x = searchParams.get('x');
  const y = searchParams.get('y');

  if (!s || !z || !x || !y) {
    return new NextResponse('Missing params: s, z, x, y required', { status: 400 });
  }

  const validSubdomains = ['a', 'b', 'c'];
  if (!validSubdomains.includes(s)) {
    return new NextResponse('Invalid subdomain', { status: 400 });
  }

  const upstreamUrl = `https://${s}.basemaps.cartocdn.com/dark_matter/${z}/${x}/${y}.png`;

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: { 'User-Agent': 'VECTOR/1.0 tile-proxy' },
      next: { revalidate: 86400 },
    });

    if (!upstream.ok) {
      return new NextResponse(null, { status: upstream.status });
    }

    const imageBuffer = await upstream.arrayBuffer();
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
