import { IpData } from '@/app/[locale]/my-ip-info/ip-info.types';
import { Logger } from '@/lib/logger';
import { useCallback, useState } from 'react';

export type UseIpInfoFetch = {
  loading: boolean;
  data: IpData | null;
  error: string | null;
  triggerFetch: () => Promise<void>;
}

export function useIpInfoFetch(): UseIpInfoFetch {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IpData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerFetch: () => Promise<void> = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const res: Response = await fetch('https://ipapi.co/json/');
      if (!res.ok) throw new Error('Failed to fetch IP info');
      const resData: IpData = await res.json();
      setData(resData);
    } catch (err: unknown) {
      Logger.error('IP Info fetch failed', err);
      setError('Impossible de récupérer les informations IP. Vérifiez votre connexion ou désactivez votre bloqueur de pubs.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    data,
    error,
    triggerFetch,
  };
}
