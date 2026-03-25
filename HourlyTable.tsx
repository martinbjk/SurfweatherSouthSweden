// src/components/charts/TideChart.tsx
'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceDot,
} from 'recharts';
import { TidePoint } from '@/types';
import { format, parseISO, isToday } from 'date-fns';
import { sv } from 'date-fns/locale';

interface TideChartProps {
  tides: TidePoint[];
}

export default function TideChart({ tides }: TideChartProps) {
  // Show today's tides only (or next 24h)
  const now = new Date();
  const cutoff = new Date(now.getTime() + 24 * 3600000);

  const filtered = tides.filter(t => {
    const d = parseISO(t.time);
    return d >= now && d <= cutoff;
  });

  const data = filtered.map(t => ({
    time: format(parseISO(t.time), 'HH:mm'),
    height: parseFloat(t.height.toFixed(2)),
    type: t.type,
  }));

  const extremes = tides.filter(t => t.type && parseISO(t.time) >= now && parseISO(t.time) <= cutoff);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="tideGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00a9d7" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#00a9d7" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
            axisLine={false} tickLine={false}
            tickFormatter={v => `${v.toFixed(1)}m`}
          />
          <Tooltip
            formatter={(v: number) => [`${v.toFixed(2)} m`, 'Tidvatten']}
            contentStyle={{
              background: '#0a1628',
              border: '1px solid rgba(0,169,215,0.3)',
              borderRadius: 8,
              fontSize: 11,
              color: 'white',
            }}
          />
          <Area
            type="natural" dataKey="height"
            stroke="#00a9d7" strokeWidth={2}
            fill="url(#tideGrad)"
            dot={false}
          />
          {extremes.map((t, i) => (
            <ReferenceDot
              key={i}
              x={format(parseISO(t.time), 'HH:mm')}
              y={t.height}
              r={5}
              fill={t.type === 'high' ? '#00c7ad' : '#00a9d7'}
              stroke="#0a1628"
              strokeWidth={2}
              label={{ value: t.type === 'high' ? '▲' : '▼', fill: 'white', fontSize: 10 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      {/* High/Low summary */}
      <div className="flex gap-4 mt-2">
        {extremes.slice(0, 4).map((t, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className={t.type === 'high' ? 'text-wave-400' : 'text-ocean-400'} style={{ fontSize: 10 }}>
              {t.type === 'high' ? '▲ Hög' : '▼ Låg'}
            </span>
            <span className="font-mono text-white/70" style={{ fontSize: 10 }}>
              {format(parseISO(t.time), 'HH:mm')} · {t.height.toFixed(2)}m
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
