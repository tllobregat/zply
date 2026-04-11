import { getLocalizedTzData, TzMetadata } from '@/lib/data/timezones';
import { useLocale } from 'next-intl';
import { useMemo, useState } from 'react';
import { TzConvState } from './tz-conv.types';

export type UseTzConvActions = {
  isAdding: boolean;
  setIsAdding: (isAdding: boolean) => void;
  search: string;
  setSearch: (search: string) => void;
  addTimezone: (id: string) => void;
  removeTimezone: (id: string) => void;
  filteredTz: TzMetadata[];
}

export function useTzConvActions(
  state: TzConvState,
  updateState: (patch: Partial<TzConvState>) => void
): UseTzConvActions {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const locale = useLocale();

  const tzData = useMemo(() => getLocalizedTzData(locale), [locale]);

  const addTimezone = (id: string): void => {
    if (!state.selectedTimezoneNames.includes(id)) {
      updateState({
        selectedTimezoneNames: [...state.selectedTimezoneNames, id]
      });
    }
    setIsAdding(false);
    setSearch('');
  };

  const removeTimezone = (id: string): void => {
    updateState({
      selectedTimezoneNames: state.selectedTimezoneNames.filter((z: string) => z !== id)
    });
  };

  const filteredTz: TzMetadata[] = useMemo(() => {
    if (!search) return tzData.slice(0, 10);
    const lowSearch: string = search.toLowerCase();
    return tzData.filter((tz: TzMetadata) =>
      tz.name.toLowerCase().includes(lowSearch) ||
      tz.countryName.toLowerCase().includes(lowSearch)
    ).slice(0, 10);
  }, [search, tzData]);

  return {
    isAdding,
    setIsAdding,
    search,
    setSearch,
    addTimezone,
    removeTimezone,
    filteredTz,
  };
}
