// src/app/api/radar/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Fetch SMHI radar composite PNG server-side (bypasses CORS + hotlink protection)
    const res = await fetch(
      'https://opendata-download-radar.smhi.se/api/version/latest/area/sweden/product/comp/latest.png',
      {
        headers: {
          'User-Agent': 'KustVag/1.0 (surf forecast app)',
          'Accept': 'image/png,image/*',
        },
        next: { revalidate: 300 }, // cache 5 min on Vercel
      }
    );

    if (!res.ok) {
      // Try fallback URL format
      const fallback = await fetch(
        'https://opendata-download-radar.smhi.se/api/version/latest/area/sweden/product/comp/latest.png',
        { headers: { 'User-Agent': 'Mozilla/5.0' } }
      );
      if (!fallback.ok) {
        return NextResponse.json({ error: 'Radar unavailable' }, { status: 502 });
      }
      const buf = await fallback.arrayBuffer();
      return new NextResponse(buf, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=300',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const buf = await res.arrayBuffer();
    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=300',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('[radar proxy]', err);
    return NextResponse.json({ error: 'Radar fetch failed' }, { status: 500 });
  }
}
