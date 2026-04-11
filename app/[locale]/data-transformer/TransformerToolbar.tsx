import FormatSelector from '@/app/[locale]/data-transformer/FormatSelector';
import { DataFormat } from '@/app/[locale]/data-transformer/transformer.types';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import React from 'react';

interface TransformerToolbarProps {
  fromFormat: DataFormat;
  toFormat: DataFormat;
  onFromChange: (val: DataFormat) => void;
  onToChange: (val: DataFormat) => void;
  onSwap: () => void;
  activeColor: string;
}

export function TransformerToolbar(
  {
    fromFormat,
    toFormat,
    onFromChange,
    onToChange,
    onSwap,
    activeColor,
  }: TransformerToolbarProps,
): React.ReactNode {
  const options: DataFormat[] = ['json', 'yaml', 'csv', 'xml', 'typescript'];

  return (
    <div className="flex items-center bg-island-bg border border-island-border rounded-2xl shadow-inner px-2 h-10 gap-1">
      <FormatSelector
        value={fromFormat}
        onChange={onFromChange}
        options={options}
        activeColor={activeColor}
      />

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-lg hover:bg-white/5"
        onClick={onSwap}
      >
        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
      </Button>

      <FormatSelector
        value={toFormat}
        onChange={onToChange}
        options={options}
        activeColor={activeColor}
      />
    </div>
  );
}
