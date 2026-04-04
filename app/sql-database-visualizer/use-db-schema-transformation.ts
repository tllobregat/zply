import { Logger } from '@/lib/logger';
import { ConnectionLineType, Edge, MarkerType, Node, OnEdgesChange, OnNodesChange, useEdgesState, useNodesState } from '@xyflow/react';
import { useCallback, useEffect, useState } from 'react';
import { Relationship, SchemaData, TableData } from './db-schema.types';
import { getLayoutedElements, parseSqlToSchema } from './db-schema.utils';

export type UseDbSchemaTransformation = {
  nodes: Node[];
  edges: Edge[];
  error: string | null;
  updateSchema: (sql: string) => void;
  onEdgesChange: OnEdgesChange;
  onNodesChange: OnNodesChange;
}

export function useDbSchemaTransformation(content: string, isMounted: boolean): UseDbSchemaTransformation {
  const [nodes, setNodes, onNodesChange]: [Node[], (nodes: Node[]) => void, OnNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange]: [Edge[], (edges: Edge[]) => void, OnEdgesChange] = useEdgesState<Edge>([]);
  const [error, setError] = useState<string | null>(null);

  const updateSchema: (sql: string) => void = useCallback((sql: string): void => {
    const trimmed: string = sql.trim();
    if (!trimmed) {
      setNodes([]);
      setEdges([]);
      setError(null);
      return;
    }

    try {
      const { tables, relationships }: SchemaData = parseSqlToSchema(trimmed);

      const tableKeys: string[] = Object.keys(tables);
      if (tableKeys.length === 0) {
        setError('No valid table definitions found.');
        return;
      }

      setError(null);

      const newNodes: Node[] = Object.values(tables).map((table: TableData): Node => ({
        id: table.name,
        type: 'table',
        data: table,
        position: { x: 0, y: 0 },
      }));

      const newEdges: Edge[] = relationships.map((rel: Relationship, idx: number): Edge => ({
        id: `e-${rel.fromTable}-${rel.toTable}-${idx}`,
        source: rel.fromTable,
        target: rel.toTable,
        type: ConnectionLineType.SmoothStep,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
        style: { stroke: '#3b82f6', strokeWidth: 2, opacity: 0.6 },
      }));

      const { nodes: layoutedNodes, edges: layoutedEdges }: { nodes: Node[]; edges: Edge[] } = getLayoutedElements(newNodes, newEdges);
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    } catch (err: unknown) {
      Logger.error('Parsing failed', err);
      setError('Invalid SQL or parsing error.');
    }
  }, [setNodes, setEdges]);

  useEffect((): () => void => {
    if (!isMounted) {
      return (): void => {
      };
    }
    const timer: NodeJS.Timeout = setTimeout((): void => updateSchema(content), 800);
    return (): void => clearTimeout(timer);
  }, [content, isMounted, updateSchema]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    error,
    updateSchema
  };
}
