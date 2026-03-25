// src/components/ui/SpotSelector.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Spot } from '@/types';
import { RATING_INFO, SurfRating } from '@/types';
import { ChevronDown, MapPin, Star } from 'lucide-react';

interface SpotSelectorProps {
  spots: Spot[];
  selectedSpotId: string;
  ratings?: Record<string, SurfRating>;
  onSelect: (spotId: string) => void;
}

const REGIONS = ['Alla', 'Halland', 'Skåne'];

export default function SpotSelector({
  spots,
  selectedSpotId,
  ratings = {},
  onSelect,
}: SpotSelectorProps) {
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState('Alla');
  const ref = useRef<HTMLDivElement>(null);

  const selected = spots.find(s => s.id === selectedSpotId);
  const selectedRating = ratings[selectedSpotId] ?? 0;
  const selectedInfo = RATING_INFO[selectedRating as SurfRating];

  const filtered = spots.filter(s => region === 'Alla' || s.region === region);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative z-30">
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/10 transition-all touch-manipulation min-w-[180px] max-w-[240px] w-full"
      >
        <MapPin size={14} className="text-ocean-400 flex-shrink-0" />
        <div className="flex-1 text-left min-w-0">
          <div className="font-display font-600 text-white text-sm leading-tight truncate">
            {selected?.name ?? 'Välj spot'}
          </div>
          <div className="text-white/35" style={{ fontSize: 10 }}>{selected?.region}</div>
        </div>
        <span
          className="flex-shrink-0 font-display font-700 uppercase rounded px-1.5 py-0.5"
          style={{ fontSize: 8, background: selectedInfo.bgColor, color: selectedInfo.color }}
        >
          {selectedInfo.label}
        </span>
        <ChevronDown
          size={14}
          className={`text-white/40 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 glass-card-strong shadow-card overflow-hidden animate-slide-up">
          {/* Region filter */}
          <div className="flex gap-1 p-2 border-b border-white/[0.06]">
            {REGIONS.map(r => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`flex-1 py-1 rounded-lg text-xs font-display font-600 uppercase tracking-wide transition-all touch-manipulation ${
                  region === r
                    ? 'bg-ocean-500/25 text-ocean-300'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Spot list */}
          <div className="max-h-72 overflow-y-auto">
            {filtered.map(spot => {
              const rating = ratings[spot.id] ?? 0;
              const info = RATING_INFO[rating as SurfRating];
              const isActive = spot.id === selectedSpotId;

              return (
                <button
                  key={spot.id}
                  onClick={() => { onSelect(spot.id); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors touch-manipulation text-left hover:bg-white/[0.04] ${
                    isActive ? 'bg-ocean-500/10' : ''
                  }`}
                >
                  {/* Rating dot */}
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: info.color, boxShadow: `0 0 6px ${info.color}80` }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className={`font-display font-600 text-sm ${isActive ? 'text-ocean-300' : 'text-white'}`}>
                      {spot.name}
                    </div>
                    <div className="text-white/30 text-[10px]">{spot.region}</div>
                  </div>

                  <div className="flex flex-col items-end gap-0.5">
                    <span
                      className="font-display font-700 uppercase rounded px-1.5 py-0.5"
                      style={{ fontSize: 8, background: info.bgColor, color: info.color }}
                    >
                      {info.label}
                    </span>
                    <span className="text-white/25" style={{ fontSize: 9 }}>{spot.region}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
