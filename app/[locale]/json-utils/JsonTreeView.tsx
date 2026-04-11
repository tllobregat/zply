import { Button } from '@/components/ui/button';
import { JsonTreeNode } from '@/app/[locale]/json-utils/JsonTreeNode';
import { JsonValue } from '@/app/[locale]/json-utils/types';
import { AlertCircle } from 'lucide-react';
import React, { ReactNode } from 'react';
import { JsonViewMode } from './use-json-state';

interface JsonTreeViewProps {
  parsedContent: JsonValue | null;
  error: string | null;
  setViewMode: (v: JsonViewMode) => void;
}

export function JsonTreeView(
  {
    parsedContent,
    error,
    setViewMode,
  }: JsonTreeViewProps,
): ReactNode {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
        <AlertCircle className="w-12 h-12 text-red-500/50" />
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">Unable to render Tree View</p>
          <p className="text-sm">The JSON is currently invalid. Please fix it in the Editor.</p>
        </div>
        <Button variant="secondary" onClick={() => setViewMode('editor')}>
          Back to Editor
        </Button>
      </div>
    );
  }

  if (parsedContent !== null) {
    return (
      <div className="max-w-4xl mx-auto">
        <JsonTreeNode label="root" value={parsedContent} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full text-muted-foreground italic">
      JSON is empty...
    </div>
  );
}
