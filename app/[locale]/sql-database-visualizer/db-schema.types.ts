export interface TableColumn {
  name: string;
  type: string;
  isPK: boolean;
  isFK: boolean;
  isUnique: boolean;
  isNullable: boolean;
  defaultValue?: string;
}

export interface TableData extends Record<string, unknown> {
  name: string;
  columns: TableColumn[];
  primaryKeys: string[];
}

export interface Relationship {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
}

export interface SchemaData {
  tables: Record<string, TableData>;
  relationships: Relationship[];
}
