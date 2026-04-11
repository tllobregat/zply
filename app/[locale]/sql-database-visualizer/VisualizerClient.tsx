'use client';

import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ReactNode } from 'react';

import { DbSchemaVisualizer } from './DbSchemaVisualizer';

export default function VisualizerClient(): ReactNode {
  return (
    <ReactFlowProvider>
      <DbSchemaVisualizer />
    </ReactFlowProvider>
  );
}
