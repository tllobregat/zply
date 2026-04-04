import { formatDate } from '@/app/epoch-converter/epoch.utils';
import { useMemo } from 'react';

export type UseEpochTransformation = {
  localDate: string;
  utcDate: string;
}

export function useEpochTransformation(timestamp: string, mounted: boolean): UseEpochTransformation {
  const localDate: string = useMemo(() => mounted ? formatDate(timestamp, false) : '--', [timestamp, mounted]);
  const utcDate: string = useMemo(() => mounted ? formatDate(timestamp, true) : '--', [timestamp, mounted]);

  return {
    localDate,
    utcDate,
  };
}
