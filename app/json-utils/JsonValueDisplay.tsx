'use client';

import { ReactNode } from 'react';
import { JsonValue } from './types';

export function JsonValueDisplay({ value }: { value: JsonValue }): ReactNode {
  if (value === null) {
    return (
      <span className="text-gray-500">null</span>
    );
  }
  if (typeof value === 'string') {
    return (
      <span className="text-emerald-400">&#34;{value}&#34;</span>
    );
  }
  if (typeof value === 'number') {
    return (
      <span className="text-orange-400">{value}</span>
    );
  }
  if (typeof value === 'boolean') {
    return (
      <span className="text-blue-400">{value.toString()}</span>
    );
  }
  return null;
}
