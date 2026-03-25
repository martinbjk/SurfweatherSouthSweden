// src/hooks/useForecast.ts
import useSWR from 'swr';
import { SpotForecast } from '@/types';

const fetcher = (url: string) => fetch(url).then(r => {
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
});

export function useForecast(spotId: string) {
  const { data, error, isLoading, mutate } = useSWR<SpotForecast>(
    spotId ? `/api/forecast?spot=${spotId}` : null,
    fetcher,
    {
      refreshInterval: 30 * 60 * 1000, // 30 min
      revalidateOnFocus: false,
      dedupingInterval: 5 * 60 * 1000,
    }
  );

  return {
    forecast: data,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}
