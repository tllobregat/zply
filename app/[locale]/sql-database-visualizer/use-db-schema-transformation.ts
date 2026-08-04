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
  onEdgeClick: (event: React.MouseEvent, edge: Edge) => void;
  onPaneClick: () => void;
  selectedEdgeId: string | null;
}

export function useDbSchemaTransformation(content: string, isMounted: boolean): UseDbSchemaTransformation {
  const [nodes, setNodes, onNodesChange]: [Node[], (nodes: Node[] | ((nds: Node[]) => Node[])) => void, OnNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange]: [Edge[], (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void, OnEdgesChange] = useEdgesState<Edge>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdgeId(edge.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedEdgeId(null);
  }, []);

  useEffect(() => {
    const frame: number = requestAnimationFrame(() => {
      if (!selectedEdgeId) {
        setNodes((nds: Node[]): Node[] =>
          nds.map((node: Node): Node => ({
            ...node,
            data: { ...node.data as object, isHighlighted: false, isDimmed: false },
          }))
        );

        setEdges((eds: Edge[]): Edge[] =>
          eds.map((edge: Edge): Edge => ({
            ...edge,
            animated: true,
            style: { ...edge.style, opacity: 0.6, strokeWidth: 2, stroke: '#3b82f6' },
          }))
        );
        return;
      }

      setEdges((eds: Edge[]): Edge[] => {
        const selectedEdge: Edge | undefined = eds.find((e: Edge): boolean => e.id === selectedEdgeId);
        if (!selectedEdge) return eds;

        const newEdges: Edge[] = eds.map((edge: Edge): Edge => {
          const isSelected: boolean = edge.id === selectedEdgeId;
          return {
            ...edge,
            animated: isSelected,
            style: {
              ...edge.style,
              opacity: isSelected ? 1 : 0.1,
              strokeWidth: isSelected ? 4 : 2,
              stroke: isSelected ? '#3b82f6' : '#94a3b8',
            },
          };
        });

        setNodes((nds: Node[]): Node[] =>
          nds.map((node: Node): Node => {
            const isHighlighted: boolean = node.id === selectedEdge.source || node.id === selectedEdge.target;
            return {
              ...node,
              data: {
                ...node.data as object,
                isHighlighted,
                isDimmed: !isHighlighted,
              },
            };
          })
        );

        return newEdges;
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [selectedEdgeId, setNodes, setEdges]);

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
      requestAnimationFrame(() => {
        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
      });
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
    const timer: NodeJS.Timeout = setTimeout((): void => {
      requestAnimationFrame(() => updateSchema(content));
    }, 800);
    return (): void => clearTimeout(timer);
  }, [content, isMounted, updateSchema]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onEdgeClick,
    onPaneClick,
    selectedEdgeId,
    error,
    updateSchema
  };
}
