'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { SPOTS } from '@/lib/spots';
import { useForecast } from '@/hooks/useForecast';
import { SurfRating, RATING_INFO, SpotForecast } from '@/types';
import Navbar from '@/components/ui/Navbar';
import HeroConditions from '@/components/forecast/HeroConditions';
import DailyGrid from '@/components/forecast/DailyGrid';
import HourlyTable from '@/components/forecast/HourlyTable';
import { HeroSkeleton, ForecastGridSkeleton } from '@/components/ui/Skeleton';
import { Waves, BarChart2, Clock, AlertCircle, RefreshCw } from 'lucide-react';

// Dynamically import charts
const WaveChart = dynamic(() => import('@/components/charts/WaveChart'), { ssr: false });

type Tab = 'overview' | 'waves' | 'hourly';

export default function HomePage() {
  const [selectedSpotId, setSelectedSpotId] = useState('apelviken');
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [ratings, setRatings] = useState<Record<string, SurfRating>>({});
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  // Read spot from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spotParam = params.get('spot');
    if (spotParam && SPOTS.find(s => s.id === spotParam)) {
      setSelectedSpotId(spotParam);
    }
  }, []);

  const { forecast, isLoading, isError, refresh } = useForecast(selectedSpotId);

  // Update URL when spot changes
  const handleSpotSelect = useCallback((id: string) => {
    setSelectedSpotId(id);
    setSelectedDayIdx(0);
    const url = new URL(window.location.href);
    url.searchParams.set('spot', id);
    window.history.pushState({}, '', url.toString());
  }, []);

  // Collect all ratings when forecast loads
  useEffect(() => {
    if (forecast) {
      setRatings(prev => ({
        ...prev,
        [forecast.spot.id]: forecast.current.rating,
      }));
    }
  }, [forecast]);

  // Pre-fetch ratings for all spots in background
  useEffect(() => {
    const fetchAllRatings = async () => {
      for (const spot of SPOTS) {
        if (spot.id === selectedSpotId) continue;
        try {
          const res = await fetch(`/api/forecast?spot=${spot.id}`);
          if (res.ok) {
            const data: SpotForecast = await res.json();
            setRatings(prev => ({ ...prev, [spot.id]: data.current.rating }));
          }
        } catch {}
        await new Promise(r => setTimeout(r, 400)); // throttle
      }
    };
    fetchAllRatings();
  }, []); // eslint-disable-line

  const selectedDay = forecast?.daily?.[selectedDayIdx];
  const hoursToShow = selectedDay?.hours ?? forecast?.daily?.[0]?.hours ?? [];

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Översikt', icon: <Waves size={14} /> },
    { id: 'waves',    label: 'Vågkarta',  icon: <BarChart2 size={14} /> },
    { id: 'hourly',   label: 'Timvis',    icon: <Clock size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-depth-950 flex flex-col">
      <Navbar
        spots={SPOTS}
        selectedSpotId={selectedSpotId}
        ratings={ratings}
        onSpotSelect={handleSpotSelect}
        onRefresh={refresh}
        isRefreshing={isLoading}
        fetchedAt={forecast?.fetchedAt}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full">
        {/* Desktop: two-column layout */}
        <div className="max-w-3xl mx-auto">

          {/* Forecast content */}
          <div>

            {/* Hero */}
            {isLoading && <HeroSkeleton />}
            {isError && (
              <div className="p-6 flex flex-col items-center gap-3 text-center">
                <AlertCircle size={32} className="text-red-400/60" />
                <p className="text-white/50 text-sm">Kunde inte hämta prognos för {SPOTS.find(s => s.id === selectedSpotId)?.name}</p>
                <button onClick={() => refresh()} className="btn-primary">
                  <RefreshCw size={14} /> Försök igen
                </button>
              </div>
            )}
            {!isLoading && !isError && forecast && (
              <HeroConditions forecast={forecast} />
            )}

            {/* 7-day daily grid */}
            <div className="px-4 mb-4">
              <h2 className="font-display font-700 uppercase tracking-widest text-white/30 text-[10px] mb-2">
                7-dagarsprognos
              </h2>
              {isLoading
                ? <ForecastGridSkeleton />
                : forecast && (
                  <DailyGrid
                    days={forecast.daily}
                    selectedDate={selectedDay?.date}
                    onDayClick={day => {
                      const idx = forecast.daily.findIndex(d => d.date === day.date);
                      setSelectedDayIdx(idx);
                      // Switch to hourly tab to show the selected day's data
                      setActiveTab('hourly');
                    }}
                  />
                )
              }
            </div>

            {/* Tab navigation */}
            <div className="px-4 mb-3">
              <div className="flex gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/[0.06]">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-display font-600 uppercase tracking-wide transition-all touch-manipulation ${
                      activeTab === tab.id
                        ? 'bg-ocean-500/20 text-ocean-300 border border-ocean-500/30'
                        : 'text-white/35 hover:text-white/60'
                    }`}
                  >
                    <span className="hidden sm:block">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="px-4 pb-6">
              {activeTab === 'overview' && forecast && (
                <div className="space-y-4">
                  <div className="glass-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BarChart2 size={14} className="text-ocean-400" />
                        <h3 className="font-display font-700 text-white/70 uppercase tracking-wider text-xs">
                          Våghöjd & Svall
                        </h3>
                      </div>
                      <span className="text-white/25 text-[9px] font-mono">
                        {selectedDay
                          ? new Date(selectedDay.date).toLocaleDateString('sv-SE', { weekday: 'short', day: 'numeric', month: 'short' })
                          : '48h'}
                      </span>
                    </div>
                    <WaveChart hours={
                      selectedDayIdx === 0
                        ? forecast.daily.flatMap(d => d.hours).slice(0, 48)
                        : hoursToShow
                    } />
                  </div>

                  {/* All spots rating overview */}
                  <div className="glass-card p-4">
                    <h3 className="font-display font-700 text-white/70 uppercase tracking-wider text-xs mb-3">
                      Alla spotar nu
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {SPOTS.map(spot => {
                        const rating = ratings[spot.id] ?? 0;
                        const info = RATING_INFO[rating as SurfRating];
                        return (
                          <button
                            key={spot.id}
                            onClick={() => handleSpotSelect(spot.id)}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all touch-manipulation text-left ${
                              spot.id === selectedSpotId
                                ? 'bg-ocean-500/15 border-ocean-500/30'
                                : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]'
                            }`}
                          >
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ background: info.color }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-display font-600 text-white text-xs truncate">{spot.name}</div>
                              <div className="text-white/25" style={{ fontSize: 9 }}>{spot.region}</div>
                            </div>
                            <span
                              className="font-display font-700 uppercase rounded px-1.5 py-0.5 flex-shrink-0"
                              style={{ fontSize: 8, background: info.bgColor, color: info.color }}
                            >
                              {info.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'waves' && forecast && (
                <div className="glass-card p-4 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display font-700 text-white/70 uppercase tracking-wider text-xs">
                        Våghöjd & Svall
                      </h3>
                      <span className="text-white/25 text-[9px] font-mono">
                        {selectedDay
                          ? new Date(selectedDay.date).toLocaleDateString('sv-SE', { weekday: 'short', day: 'numeric', month: 'short' })
                          : '48h'}
                      </span>
                    </div>
                    <WaveChart hours={
                      selectedDayIdx === 0
                        ? forecast.daily.flatMap(d => d.hours).slice(0, 48)
                        : hoursToShow
                    } />
                  </div>
                  <div className="border-t border-white/[0.06] pt-4">
                    <h3 className="font-display font-700 text-white/70 uppercase tracking-wider text-xs mb-3">
                      Vind & Våg kombinerat
                    </h3>
                    <WaveChart
                      hours={
                        selectedDayIdx === 0
                          ? forecast.daily.flatMap(d => d.hours).slice(0, 48)
                          : hoursToShow
                      }
                      showWind
                    />
                  </div>
                </div>
              )}

              {activeTab === 'hourly' && (
                <div className="glass-card overflow-hidden">
                  <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
                    <h3 className="font-display font-700 text-white/70 uppercase tracking-wider text-xs">
                      Timvis – {selectedDay
                        ? new Date(selectedDay.date).toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })
                        : 'Idag'}
                    </h3>
                    <span className="text-white/20 text-[9px]">← Klicka dag ovan för att byta</span>
                  </div>
                  {isLoading
                    ? <div className="p-4 space-y-2">{Array.from({length: 8}).map((_, i) => (
                        <div key={i} className="skeleton h-8 rounded" />
                      ))}</div>
                    : <HourlyTable hours={hoursToShow} />
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
                          </span>
                        </button>
      {/* Footer */}
      <footer className="border-t border-white/[0.04] px-4 py-3 safe-bottom">
        <p className="text-white/15 text-center" style={{ fontSize: 10 }}>
          KustVåg · Data: Open-Meteo Marine API & Stormglass · Uppdateras var 30:e minut
        </p>
      </footer>
    </div>
  );
}
