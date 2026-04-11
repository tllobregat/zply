import { FlagIcon } from '@/app/[locale]/my-ip-info/FlagIcon';
import { InfoRow } from '@/app/[locale]/my-ip-info/InfoRow';
import { IpData } from '@/app/[locale]/my-ip-info/ip-info.types';
import { CategoryTheme } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import { Clock, Globe, MapPin, Maximize2, Server } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ToolId } from '@/lib/config/tools';
import React, { ReactNode } from 'react';

interface IpInfoGeolocationProps {
  data: IpData | null;
  theme: CategoryTheme;
}

export function IpInfoGeolocation({ data, theme }: IpInfoGeolocationProps): ReactNode {
  const t = useTranslations('Tools');

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex items-center gap-3">
        <div className={cn('p-2 rounded-xl bg-island-card border border-island-border', theme.text)}>
          <MapPin className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest">{t(`${ToolId.MY_IP}.geolocation`)}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoRow label={t(`${ToolId.MY_IP}.location`)} value={`${data?.city}, ${data?.region}`} icon={<Globe className="w-4 h-4" />} theme={theme} />
        <InfoRow label={t(`${ToolId.MY_IP}.country`)} value={data?.country_name} icon={<FlagIcon />} theme={theme} />
        <InfoRow label={t(`${ToolId.MY_IP}.providerAsn`)} value={data?.org} icon={<Server className="w-4 h-4" />} copyable theme={theme} />
        <InfoRow label={t(`${ToolId.MY_IP}.timezone`)} value={data?.timezone} icon={<Clock className="w-4 h-4" />} theme={theme} />
        <InfoRow label={t(`${ToolId.MY_IP}.postalCode`)} value={data?.postal} icon={<Maximize2 className="w-4 h-4" />} theme={theme} />
        <InfoRow label={t(`${ToolId.MY_IP}.coordinates`)} value={`${data?.latitude}, ${data?.longitude}`} icon={<MapPin className="w-4 h-4" />} theme={theme} />
      </div>
    </div>
  );
}
