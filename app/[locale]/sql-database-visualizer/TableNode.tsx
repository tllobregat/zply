import { cn } from '@/lib/utils';
import { Handle, Position } from '@xyflow/react';
import { Database, Info, Key, Link as LinkIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { ReactNode } from 'react';
import { TableColumn, TableData } from './db-schema.types';

export function TableNode({ data }: { data: TableData }): ReactNode {
  const { resolvedTheme } = useTheme();
  const isDark: boolean = resolvedTheme === 'dark';

  const pkColor: string = isDark ? 'text-yellow-200/90' : 'text-amber-900';

  return (
    <div className="min-w-64 glass-island bg-island-card/90 border border-island-border rounded-xl shadow-2xl overflow-hidden font-mono text-xs">
      <div className="bg-blue-500/10 border-b border-island-border p-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          <span className="font-black uppercase tracking-wider text-blue-400">{data.name}</span>
        </div>
        {
          data.primaryKeys.length > 1
          && (
            <span className={cn(
              'px-1.5 py-0.5 rounded text-[10px] font-bold border',
              isDark
                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                : 'bg-amber-100 text-amber-900 border-amber-200'
            )}>
              COMPOSITE PK
            </span>
          )
        }
      </div>
      <div className="p-1">
        {
          data.columns.map((col: TableColumn, idx: number): ReactNode => (
            <div key={idx} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg group relative">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {
                    col.isPK
                    && (
                      <Key
                        className={cn(
                          'w-3.5 h-3.5 shrink-0 z-10',
                          isDark ? 'text-yellow-500/80' : 'text-amber-600'
                        )}
                      />
                    )
                  }
                  {
                    col.isFK
                    && (
                      <LinkIcon
                        className={cn(
                          'w-3.5 h-3.5 shrink-0 z-0', isDark ? 'text-emerald-500/80' : 'text-emerald-600'
                        )}
                      />
                    )
                  }
                </div>
                <div className="flex flex-col">
                  <span
                    className={cn(
                      'font-bold transition-colors',
                      col.isPK ? pkColor : 'text-island-foreground/90',
                      !col.isNullable
                      && cn(
                        'after:content-[\'*\'] after:ml-0.5 after:font-black',
                        isDark ? 'after:text-red-400/60' : 'after:text-red-500'
                      )
                    )}
                  >
                    {col.name}
                  </span>
                  <div className="flex items-center gap-1.5 opacity-40 text-[9px] uppercase font-medium">
                    <span>{col.type}</span>
                    {
                      col.isUnique
                      && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-island-border" />
                          <span className={cn(isDark ? 'text-purple-400' : 'text-purple-600')}>
                            Unique
                          </span>
                        </>
                      )
                    }
                  </div>
                </div>
              </div>

              {
                col.defaultValue
                && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <span title={`Default: ${col.defaultValue}`}>
                      <Info className="w-3 h-3 text-muted-foreground/60" />
                    </span>
                  </div>
                )
              }

              <Handle
                type="source"
                position={Position.Right}
                id={`${col.name}-source`}
                className="opacity-0 pointer-events-none"
              />
              <Handle
                type="target"
                position={Position.Left}
                id={`${col.name}-target`}
                className="opacity-0 pointer-events-none"
              />
            </div>
          ))
        }
      </div>
    </div>
  );
}
