import dayjs from '@/lib/dayjs';
import { useEffect, useState } from 'react';

export type UseEpochNow = {
  mounted: boolean;
  now: number;
  setNowAsTimestamp: () => void;
}

export function useEpochNow(timestamp: string, setTimestamp: (ts: string) => void): UseEpochNow {
  const [mounted, setMounted] = useState<boolean>(false);
  const [now, setNow] = useState<number>(0);

  // Handle clock and hydration
  useEffect(() => {
    const frame: number = requestAnimationFrame(() => {
      setMounted(true);
      setNow(dayjs().unix());
    });

    const timer: ReturnType<typeof setInterval> = setInterval(() => setNow(dayjs().unix()), 1000);
    return (): void => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
    };
  }, []);

  // Handle initial timestamp
  useEffect(() => {
    if (mounted && (timestamp === '0' || !timestamp)) {
      const currentTimestamp: string = dayjs().unix().toString();
      const frame: number = requestAnimationFrame(() => {
        setTimestamp(currentTimestamp);
      });
      return (): void => cancelAnimationFrame(frame);
    }
  }, [mounted, timestamp, setTimestamp]);

  const setNowAsTimestamp = (): void => {
    setTimestamp(dayjs().unix().toString());
  };

  return {
    mounted,
    now,
    setNowAsTimestamp,
  };
}
