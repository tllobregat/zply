import { TzConvState } from '@/app/[locale]/timezone-converter/tz-conv.types';

export const DEFAULT_STATE: TzConvState = {
  referenceTimestamp: Date.now(),
  selectedTimezoneNames: ['UTC', 'Europe/Paris', 'America/New_York', 'Asia/Tokyo'],
  liveMode: true
};
