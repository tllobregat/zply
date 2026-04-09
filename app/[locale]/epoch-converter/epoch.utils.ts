import dayjs, { Dayjs } from '@/lib/dayjs';

export const formatDate = (ts: string, useUtc: boolean): string => {
  try {
    const val: number = parseInt(ts);
    if (isNaN(val)) {
      return 'Invalid Timestamp';
    }

    // Handle both seconds and milliseconds
    const date: Dayjs = ts.length > 11 ? dayjs(val) : dayjs.unix(val);

    if (useUtc) {
      return date.utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]');
    }
    return date.toString();
  } catch {
    return 'Invalid Timestamp';
  }
};
