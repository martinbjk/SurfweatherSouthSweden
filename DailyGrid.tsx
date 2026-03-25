// src/components/charts/WaveChart.tsx
'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
// import { HourlyForecast } from "@/types";
import { format, parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';

interface WaveChartProps {
 hours: any[];
  showWind?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-strong px-3 py-2 text-xs">
      <p className="text-white/50 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-mono">
          {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</strong>
          {p.name === 'Vind' ? ' m/s' : ' m'}
        </p>
      ))}
    </div>
  );
};

export default function WaveChart({ hours, showWind = false }: WaveChartProps) {
  const data = hours.slice(0, 48).map(h => ({
    time: format(parseISO(h.time), 'EEE HH:mm', { locale: sv }),
    Våg: parseFloat(h.waveHeight.toFixed(2)),
    Svall: parseFloat(h.swellHeight.toFixed(2)),
    ...(showWind ? { Vind: parseFloat(h.windSpeed.toFixed(1)) } : {}),
  }));

  // Show every 6 hours on x axis
  const xTicks = data.filter((_, i) => i % 6 === 0).map(d => d.time);

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00a9d7" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#00a9d7" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="swellGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00c7ad" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00c7ad" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="time"
          ticks={xTicks}
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `${v}m`}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0.5} stroke="rgba(0,199,173,0.2)" strokeDasharray="3 3" />
        <Area
          type="monotone" dataKey="Svall"
          stroke="#00c7ad" strokeWidth={1.5}
          fill="url(#swellGrad)"
          dot={false} activeDot={{ r: 3, fill: '#00c7ad' }}
        />
        <Area
          type="monotone" dataKey="Våg"
          stroke="#00a9d7" strokeWidth={2}
          fill="url(#waveGrad)"
          dot={false} activeDot={{ r: 4, fill: '#00a9d7' }}
        />
        {showWind && (
          <Area
            type="monotone" dataKey="Vind"
            stroke="#fbbf24" strokeWidth={1.5}
            fill="url(#windGrad)"
            dot={false} activeDot={{ r: 3, fill: '#fbbf24' }}
            yAxisId={1}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
