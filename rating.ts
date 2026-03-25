// src/types/index.ts

export interface Spot {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  bestWind: string;
  bestSwell: string;
  bestTide: string;
  imageKey: string;
}

export interface HourlyForecast {
  time: string; // ISO string
  waveHeight: number; // meters
  waveDirection: number; // degrees
  wavePeriod: number; // seconds
  swellHeight: number;
  swellDirection: number;
  swellPeriod: number;
  windSpeed: number; // m/s
  windDirection: number; // degrees
  windGusts: number;
  airTemp: number; // °C
  waterTemp: number; // °C
  cloudCover: number; // %
  precipitation: number; // mm
  visibility: number; // km
  rating: SurfRating;
}

export interface DailyForecast {
  date: string; // ISO date
  waveHeightMin: number;
  waveHeightMax: number;
  windSpeedAvg: number;
  windDirectionAvg: number;
  airTempMax: number;
  airTempMin: number;
  precipSum: number;
  weatherCode: number;
  ratingAvg: SurfRating;
  hours: HourlyForecast[];
}

export interface TidePoint {
  time: string;
  height: number; // meters
  type?: 'high' | 'low';
}

export interface SpotForecast {
  spot: Spot;
  current: HourlyForecast;
  daily: DailyForecast[];
  tides: TidePoint[];
  fetchedAt: string;
}

export type SurfRating = 0 | 1 | 2 | 3 | 4 | 5;

export interface RatingInfo {
  label: string;
  color: string;
  bgColor: string;
  description: string;
}

export const RATING_INFO: Record<SurfRating, RatingInfo> = {
  0: { label: 'FLAT',     color: '#6b7280', bgColor: 'rgba(107,114,128,0.15)', description: 'Inga vågor' },
  1: { label: 'DÅLIG',   color: '#ef4444', bgColor: 'rgba(239,68,68,0.15)',   description: 'Dåliga förhållanden' },
  2: { label: 'OKEJ',    color: '#f97316', bgColor: 'rgba(249,115,22,0.15)',   description: 'Surfbart för nybörjare' },
  3: { label: 'BRA',     color: '#eab308', bgColor: 'rgba(234,179,8,0.15)',    description: 'Bra förhållanden' },
  4: { label: 'TOPPEN',  color: '#22c55e', bgColor: 'rgba(34,197,94,0.15)',    description: 'Utmärkta förhållanden' },
  5: { label: 'EPISK',   color: '#00c7ad', bgColor: 'rgba(0,199,173,0.15)',    description: 'Episka förhållanden!' },
};
