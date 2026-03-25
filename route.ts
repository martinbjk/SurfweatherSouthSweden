// src/lib/rating.ts
import { HourlyForecast, SurfRating, Spot } from '@/types';

// Spot-specific offshore wind directions (degrees) and tolerance
const SPOT_WIND_CONFIG: Record<string, { offshore: number[]; tolerance: number }> = {
  apelviken: { offshore: [22, 45, 67, 90], tolerance: 45 },
  skrea:     { offshore: [67, 90],          tolerance: 45 },
  ringenas:  { offshore: [67, 90],          tolerance: 45 },
  tylosand:  { offshore: [10, 22, 45],      tolerance: 40 },
  skaret:    { offshore: [90, 112, 135],    tolerance: 40 },
  molle:     { offshore: [292, 315, 337, 360, 0], tolerance: 35 },
  kaseberga: { offshore: [247, 270, 292],   tolerance: 45 },
  baskemolla:{ offshore: [247, 270, 292, 315], tolerance: 45 },
};

// Spot-specific best swell directions
const SPOT_SWELL_CONFIG: Record<string, { best: number[]; tolerance: number }> = {
  apelviken: { best: [202, 225, 247, 270], tolerance: 45 },
  skrea:     { best: [202, 225, 247, 270], tolerance: 45 },
  ringenas:  { best: [247, 270],           tolerance: 40 },
  tylosand:  { best: [202, 225, 247],      tolerance: 45 },
  skaret:    { best: [270, 292, 315],      tolerance: 45 },
  molle:     { best: [292, 315, 337],      tolerance: 40 },
  kaseberga: { best: [67, 90, 112, 135],   tolerance: 50 },
  baskemolla:{ best: [90, 112, 135],       tolerance: 50 },
};

function angleDiff(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function isOffshore(spotId: string, windDir: number): boolean {
  const cfg = SPOT_WIND_CONFIG[spotId];
  if (!cfg) return false;
  return cfg.offshore.some(d => angleDiff(d, windDir) <= cfg.tolerance);
}

function isGoodSwell(spotId: string, swellDir: number): boolean {
  const cfg = SPOT_SWELL_CONFIG[spotId];
  if (!cfg) return false;
  return cfg.best.some(d => angleDiff(d, swellDir) <= cfg.tolerance);
}

export function calculateRating(hour: HourlyForecast, spotId: string): SurfRating {
  const { waveHeight, windSpeed, wavePeriod } = hour;
  const swellDir = hour.swellDirection ?? hour.waveDirection;
  const windDir = hour.windDirection;

  // No waves
  if (waveHeight < 0.2) return 0;

  let score = 0;

  // Wave height score (0-35 pts)
  if (waveHeight >= 0.3)  score += 10;
  if (waveHeight >= 0.5)  score += 10;
  if (waveHeight >= 0.8)  score += 8;
  if (waveHeight >= 1.2)  score += 5;
  if (waveHeight >= 1.8)  score += 2;
  // Too big for most spots in Sweden
  if (waveHeight >= 3.0)  score -= 10;

  // Period score (0-20 pts) – longer = better
  if (wavePeriod >= 6)   score += 5;
  if (wavePeriod >= 8)   score += 7;
  if (wavePeriod >= 10)  score += 5;
  if (wavePeriod >= 14)  score += 3;

  // Wind score (0-25 pts)
  const offshore = isOffshore(spotId, windDir);
  if (offshore) {
    if (windSpeed < 3)  score += 25; // light offshore = glass
    else if (windSpeed < 6)  score += 20;
    else if (windSpeed < 10) score += 12;
    else score += 5; // strong offshore = choppy
  } else {
    // Onshore / crossshore = bad
    if (windSpeed < 3)  score += 10; // very light onshore still ok
    else if (windSpeed < 6)  score += 3;
    else score -= 5;
  }

  // Swell direction score (0-20 pts)
  if (isGoodSwell(spotId, swellDir)) score += 20;
  else score += 5;

  // Clamp and map to 1-5
  score = Math.max(0, Math.min(100, score));
  if (score < 15) return 1;
  if (score < 35) return 2;
  if (score < 55) return 3;
  if (score < 75) return 4;
  return 5;
}

export function mpsToKnots(mps: number): number {
  return Math.round(mps * 1.944);
}

export function degreesToCardinal(deg: number): string {
  const dirs = ['N','NNO','NO','ONO','O','OSO','SO','SSO','S','SSV','SV','VSV','V','VNV','NV','NNV'];
  return dirs[Math.round(deg / 22.5) % 16];
}

export function waveHeightLabel(m: number): string {
  if (m < 0.2) return 'Flat';
  if (m < 0.5) return `${(m * 100).toFixed(0)} cm`;
  return `${m.toFixed(1)} m`;
}

export function getBeaufortDescription(mps: number): string {
  if (mps < 0.3) return 'Stiltje';
  if (mps < 1.6) return 'Nästan stiltje';
  if (mps < 3.4) return 'Lätt bris';
  if (mps < 5.5) return 'Lätt bris';
  if (mps < 8.0) return 'God bris';
  if (mps < 10.8) return 'Frisk bris';
  if (mps < 13.9) return 'Hård vind';
  if (mps < 17.2) return 'Hård vind';
  if (mps < 20.8) return 'Mycket hård vind';
  return 'Storm';
}

export function weatherCodeToIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 2) return '⛅';
  if (code <= 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 57) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '🌨️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '❄️';
  if (code <= 99) return '⛈️';
  return '🌤️';
}

export function weatherCodeToLabel(code: number): string {
  if (code === 0) return 'Klart';
  if (code <= 2) return 'Växlande';
  if (code <= 3) return 'Mulet';
  if (code <= 48) return 'Dimma';
  if (code <= 57) return 'Duggregn';
  if (code <= 67) return 'Regn';
  if (code <= 77) return 'Snö';
  if (code <= 82) return 'Regnskur';
  if (code <= 99) return 'Åska';
  return 'Varierat';
}
