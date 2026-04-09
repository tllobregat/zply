import { TransformerState } from '@/app/[locale]/data-transformer/transformer.types';

export const DEFAULT_STATE: TransformerState = {
  i: JSON.stringify({
    name: 'Zply',
    version: '1.0.0',
    features: ['Speed', 'Privacy', 'URI Persistence'],
    active: true,
    stats: {
      latency: '1ms',
      source: 'client-side'
    }
  }, null, 2),
  f: 'json',
  t: 'yaml'
};
