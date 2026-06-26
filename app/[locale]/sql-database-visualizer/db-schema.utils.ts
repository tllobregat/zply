import { Logger } from '@/lib/logger';
import { Edge, Node } from '@xyflow/react';
import dagre from 'dagre';
import {
  Alter,
  AST,
  ColumnRef,
  Create,
  CreateColumnDefinition,
  CreateConstraintDefinition,
  CreateDefinition,
  type From,
  Parser,
} from 'node-sql-parser';
import { Relationship, SchemaData, TableColumn, TableData } from './db-schema.types';

/**
 * Helper to safely extract name from various SQL AST nodes
 */
function extractName(node: unknown): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  
  const n: Record<string, unknown> = node as Record<string, unknown>;
  if (typeof n.column === 'string') return n.column;
  if (typeof n.table === 'string') return n.table;
  
  if (n.expr && typeof (n.expr as Record<string, unknown>).value !== 'undefined') {
    return String((n.expr as Record<string, unknown>).value);
  }
  
  if (typeof n.value !== 'undefined') return String(n.value);
  return String(node);
}

/**
 * Helper to safely extract column name from ColumnRef
 */
function getColName(colRef: ColumnRef | CreateColumnDefinition): string {
  if (!colRef) return '';
  
  // Handle expression types
  if ('type' in colRef && colRef.type === 'expr' && colRef.expr) {
    return getColName(colRef.expr as unknown as ColumnRef);
  }

  // Handle direct column property
  if ('column' in colRef) {
    return extractName(colRef.column);
  }

  return extractName(colRef);
}

export function parseSqlToSchema(sql: string): SchemaData {
  const parser: Parser = new Parser();
  const tables: Record<string, TableData> = {};
  const relationships: Relationship[] = [];

  try {
    // Specify PostgreSQL to support SERIAL and other pg-specific types/syntax
    const astList: AST[] | AST = parser.astify(sql, { database: 'PostgresQL' });
    const asts: AST[] = Array.isArray(astList) ? astList : [astList];

    asts.forEach((ast: AST) => {
      if (ast.type === 'create' && ast.keyword === 'table') {
        processCreateTable(ast as Create, tables, relationships);
      } else if (ast.type === 'alter') {
        processAlterTable(ast as Alter, relationships);
      }
    });
  } catch (err: unknown) {
    Logger.error('SQL Parsing Error:', err);
    throw new Error('Failed to parse SQL. Please check your syntax.');
  }

  return { tables, relationships };
}

type CreateTableAST = { db: string; table: string }[] | { db: string | null, table: string } | undefined;

function processCreateTable(ast: Create, tables: Record<string, TableData>, relationships: Relationship[]): void {
  const tableData: CreateTableAST | undefined = ast.table;
  if (!tableData) return;
  
  const tableName: string = extractName(Array.isArray(tableData) ? tableData[0] : tableData);
    
  if (!tableName) return;

  const columns: TableColumn[] = [];
  const primaryKeys: string[] = [];

  if (ast.create_definitions) {
    ast.create_definitions.forEach((def: CreateDefinition) => {
      // Column Definition
      if (def.resource === 'column') {
        const colDef: CreateColumnDefinition = def;
        const colName: string = getColName(colDef.column);
        const dataType: string = extractName(colDef.definition.dataType);
        
        let isPK: boolean = false;
        let isUnique: boolean = false;
        let isNullable: boolean = true;
        let defaultValue: string | undefined;

        if (colDef.primary) isPK = true;
        if (colDef.unique) isUnique = true;
        if (colDef.nullable?.type === 'not null') isNullable = false;
        if (colDef.default_val) {
          defaultValue = typeof colDef.default_val.value === 'object' 
            ? JSON.stringify(colDef.default_val.value) 
            : String(colDef.default_val.value);
        }

        // Inline REFERENCES
        if (colDef.reference_definition) {
          const ref: { table: Array<{ table: string }>; definition: Array<{ column: string }> } = 
            colDef.reference_definition as unknown as { table: Array<{ table: string }>; definition: Array<{ column: string }> };
          relationships.push({
            fromTable: tableName,
            fromColumn: colName,
            toTable: extractName(ref.table[0]),
            toColumn: extractName(ref.definition[0])
          });
        }

        if (isPK) primaryKeys.push(colName);

        columns.push({
          name: colName,
          type: dataType,
          isPK,
          isFK: !!colDef.reference_definition,
          isUnique,
          isNullable,
          defaultValue
        });
      } 
      // Table Constraints (Composite keys, Named FKs)
      else if (def.resource === 'constraint') {
        const constDef: CreateConstraintDefinition = def;
        
        const constType: string | undefined = constDef.constraint_type;
        const normalizedType: string = constType?.toLowerCase() ?? '';

        if (normalizedType === 'primary key' && constDef.definition) {
          constDef.definition.forEach((colRef: ColumnRef) => {
            const pkName: string = getColName(colRef);
            primaryKeys.push(pkName);
            const existingCol: TableColumn | undefined = columns.find((c: TableColumn) => c.name === pkName);
            if (existingCol) existingCol.isPK = true;
          });
        } else if (normalizedType === 'foreign key' && constDef.definition && 'reference_definition' in constDef) {
          const fromCols: ColumnRef[] = constDef.definition;
          const ref: { table: Array<{ table: string }>; definition: Array<{ column: string }> } = 
            constDef.reference_definition as unknown as { table: Array<{ table: string }>; definition: Array<{ column: string }> };
          const toTable: string = extractName(ref.table[0]);
          const toCols: unknown[] = ref.definition as unknown[];

          fromCols.forEach((colRef: ColumnRef, idx: number) => {
            const fromColName: string = getColName(colRef);
            const targetCol: unknown = toCols[idx] || toCols[0];
            const toColName: string = extractName(targetCol);

            relationships.push({
              fromTable: tableName,
              fromColumn: fromColName,
              toTable: toTable,
              toColumn: toColName
            });

            const existingCol: TableColumn | undefined = columns.find((c: TableColumn) => c.name === fromColName);
            if (existingCol) existingCol.isFK = true;
          });
        }
      }
    });
  }

  tables[tableName] = { name: tableName, columns, primaryKeys };
}

function processAlterTable(ast: Alter, relationships: Relationship[]): void {
  const tableData: From[] = ast.table;
  if (!tableData) return;
  const tableName: string = extractName(tableData[0]);
    
  if (!tableName || !ast.expr) return;

  const expressions: ReturnType<typeof ast.expr>[] = Array.isArray(ast.expr) ? ast.expr : [ast.expr];
  
  expressions.forEach((expr: ReturnType<typeof ast.expr>) => {
    if (expr.action === 'add' && expr.create_definitions) {
      expr.create_definitions.forEach((def: CreateDefinition) => {
        const constType: string | undefined = 'constraint_type' in def ? def.constraint_type : undefined;
        const normalizedType: string = constType?.toLowerCase() ?? '';

        if (def.resource === 'constraint' && normalizedType === 'foreign key' && 'reference_definition' in def) {
          const fromCols: ColumnRef[] = def.definition;
          const ref: { table: Array<{ table: string }>; definition: Array<{ column: string }> } = 
            def.reference_definition as unknown as { table: Array<{ table: string }>; definition: Array<{ column: string }> };
          const toTable: string = extractName(ref.table[0]);
          const toCols: unknown[] = ref.definition as unknown[];

          fromCols.forEach((colRef: ColumnRef, idx: number) => {
            const fromColName: string = getColName(colRef);
            const targetCol: unknown = toCols[idx] || toCols[0];
            const toColName: string = extractName(targetCol);
            
            relationships.push({
              fromTable: tableName,
              fromColumn: fromColName,
              toTable: toTable,
              toColumn: toColName
            });
          });
        }
      });
    }
  });
}

export const getLayoutedElements = (nodes: Node[], edges: Edge[]): { nodes: Node[]; edges: Edge[] } => {
  const dagreGraph: dagre.graphlib.Graph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel((): object => ({}));
  dagreGraph.setGraph({ rankdir: 'LR', nodesep: 100, ranksep: 200 });

  nodes.forEach((node: Node): void => {
    const data: TableData = node.data as TableData;
    dagreGraph.setNode(node.id, { width: 250, height: 100 + data.columns.length * 30 });
  });

  edges.forEach((edge: Edge): void => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node: Node): void => {
    const nodeWithPosition: dagre.Node = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - 125,
      y: nodeWithPosition.y - 50,
    };
  });

  return { nodes, edges };
};
