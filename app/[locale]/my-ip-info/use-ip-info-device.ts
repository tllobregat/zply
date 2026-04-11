import { useMemo, useState } from 'react';

export type UseIpInfoDevice = {
  userAgent: string;
  screenRes: string;
  userOS: string;
}

export function useIpInfoDevice(): UseIpInfoDevice {
  // Use a function inside useState to safely initialize on the client
  const [userAgent] = useState<string>(() =>
    typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
  );

  const [screenRes] = useState<string>(() =>
    typeof window !== 'undefined'
      ? `${window.screen.width}x${window.screen.height}`
      : '0x0'
  );

  const userOS: string = useMemo((): string => {
    if (typeof window === 'undefined') return 'Unknown';
    const ua: string = navigator.userAgent;
    if (ua.includes('Win')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    return 'Unknown OS';
  }, []);

  return {
    userAgent,
    screenRes,
    userOS,
  };
}
