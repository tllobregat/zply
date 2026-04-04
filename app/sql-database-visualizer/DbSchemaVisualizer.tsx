'use client';

import { EditorPreviewWorkspace } from '@/components/editor-preview-workspace';
import ToolPageLayout from '@/components/tool-page-layout';
import { Separator } from '@/components/ui/separator';
import { Category, ToolId } from '@/lib/config/tools';
import { Background, ConnectionLineType, Controls, Panel, ReactFlow, } from '@xyflow/react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Database, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import { ReactNode } from 'react';

import { DbSchemaToolbar } from './DbSchemaToolbar';

import { TableNode } from './TableNode';
import { useDbSchemaState } from './use-db-schema-state';
import { useDbSchemaTransformation } from './use-db-schema-transformation';

const nodeTypes: { table: typeof TableNode } = {
  table: TableNode,
};

export function DbSchemaVisualizer(): ReactNode {
  const { resolvedTheme } = useTheme();
  const { content, setContent, viewMode, setViewMode, isMounted } = useDbSchemaState();
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    error,
    updateSchema
  } = useDbSchemaTransformation(content, isMounted);

  if (!isMounted) return null;

  return (
    <ToolPageLayout
      toolId={ToolId.DB_SCHEMA}
      title="SQL & DB Visualizer"
      icon={<Database className="w-5 h-5" />}
      workspaceClassName="md:flex-row"
      breadcrumbItems={[
        { label: Category.VISUALISATION, href: `/?category=${Category.VISUALISATION}` },
        { label: 'SQL & DB Visualizer' }
      ]}
      headerActions={
        <DbSchemaToolbar
          viewMode={viewMode}
          setViewMode={setViewMode}
          onUpdateSchema={() => updateSchema(content)}
        />
      }
      footerIndicator={
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 text-green-500/60">
              <Zap className="w-3.5 h-3.5 text-yellow-500/50" /> 
              <span className="hidden sm:inline">Interactive Engine</span>
            </span>
          </div>
          <Separator />
          <span className="text-muted-foreground truncate max-w-37.5 sm:max-w-none">
            {nodes.length} tables • {edges.length} relations
          </span>
        </div>
      }
    >
      <EditorPreviewWorkspace
        value={content}
        onChange={setContent}
        language="sql"
        viewMode={viewMode}
        editorProps={{}}
        preview={
          <div className={`h-full w-full ${resolvedTheme === 'dark' ? 'bg-[#050a1a]' : 'bg-slate-50'} relative`}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              colorMode={resolvedTheme === 'dark' ? 'dark' : 'light'}
              fitView
              minZoom={0.1}
              maxZoom={2}
              connectionLineType={ConnectionLineType.SmoothStep}
              panActivationKeyCode={null}
            >
              <Background color={resolvedTheme === 'dark' ? '#1e293b' : '#cbd5e1'} gap={20} />
              <Controls className="glass-island border-island-border fill-white" />
              <Panel position="top-right">
                <AnimatePresence>
                  {
                    error
                    && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 backdrop-blur-md"
                      >
                        <AlertCircle className="w-4 h-4" /> {error}
                      </motion.div>
                    )
                  }
                </AnimatePresence>
              </Panel>
            </ReactFlow>
          </div>
        }
      />
    </ToolPageLayout>
  );
}
