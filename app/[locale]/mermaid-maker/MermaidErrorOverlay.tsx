import { AlertCircle } from 'lucide-react';
import React from 'react';
import { MermaidError } from './mermaid.types';

interface MermaidErrorOverlayProps {
  error: MermaidError | null;
}

export function MermaidErrorOverlay({ error }: MermaidErrorOverlayProps): React.ReactNode {
  if (!error) return null;

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
      <AlertCircle className="w-4 h-4" /> {error.line ? `Line ${error.line}: ${error.message}` : error.message}
    </div>
  );
}
