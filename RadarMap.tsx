// src/app/api/forecast/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import { something } from "@/lib/api"
// import { something } from "@/lib/spots"

export const runtime = 'nodejs';
export const revalidate = 1800; // 30 min

export async function GET(req: NextRequest) {
  const spotId = req.nextUrl.searchParams.get('spot');
  if (!spotId) {
    return NextResponse.json({ error: 'Missing spot parameter' }, { status: 400 });
  }

  const spot = getSpotById(spotId);
  if (!spot) {
    return NextResponse.json({ error: `Unknown spot: ${spotId}` }, { status: 404 });
  }

  try {
    const forecast = await fetchSpotForecast(spot);
    return NextResponse.json(forecast, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=300',
      },
    });
  } catch (err) {
    console.error('[forecast]', err);
    return NextResponse.json({ error: 'Failed to fetch forecast' }, { status: 500 });
  }
}
export default function RadarMap() {
