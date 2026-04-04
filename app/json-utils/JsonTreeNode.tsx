'use client';

import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { JsonValue } from './types';
import { JsonValueDisplay } from './JsonValueDisplay';

export interface JsonTreeNodeProps {
  label: string;
  value: JsonValue;
  isLast?: boolean;
  depth?: number;
}

export function JsonTreeNode({ label, value, isLast = true, depth = 0 }: JsonTreeNodeProps): ReactNode {
  const [isExpanded, setIsExpanded] = useState<boolean>(depth < 2);
  const isObject: boolean = value !== null && typeof value === 'object';
  const isArray: boolean = Array.isArray(value);
  
  const toggle: () => void = () => setIsExpanded(!isExpanded);

  if (!isObject) {
    return (
      <div className="flex items-start py-0.5 font-mono text-sm group">
        <span className="text-purple-400 mr-2 shrink-0">{label}:</span>
        <span className="break-all">
          <JsonValueDisplay value={value} />
        </span>
        {
          !isLast
          && (
            <span className="text-muted-foreground">,</span>
          )
        }
      </div>
    );
  }

  const objValue: { [key: string]: JsonValue } | JsonValue[] = value as { [key: string]: JsonValue } | JsonValue[];
  const keys: string[] = Object.keys(objValue);
  const bracketOpen: string = isArray ? '[' : '{';
  const bracketClose: string = isArray ? ']' : '}';

  return (
    <div className="font-mono text-sm">
      <div 
        className="flex items-center py-0.5 cursor-pointer hover:bg-white/5 transition-colors rounded group px-1 -ml-1"
        onClick={toggle}
      >
        <div className="w-4 h-4 mr-1 flex items-center justify-center text-muted-foreground group-hover:text-foreground">
          {
            isExpanded
              ? (
                <ChevronDown className="w-3 h-3" />
              )
              : (
                <ChevronRight className="w-3 h-3" />
              )
          }
        </div>
        <span className="text-purple-400 mr-2">{label}:</span>
        <span className="text-muted-foreground">
          {bracketOpen}
          {
            !isExpanded
            && (
              <span className="px-1 bg-white/5 rounded text-[10px] mx-1">
                {isArray ? `${(value as JsonValue[]).length} items` : `${keys.length} keys`}
              </span>
            )
          }
          {
            !isExpanded
            && bracketClose
          }
          {
            !isExpanded
            && !isLast 
            && ","
          }
        </span>
      </div>
      
      {
        isExpanded
        && (
          <div className="pl-5 border-l border-white/5 ml-2 mt-0.5">
            {
              keys.map((key: string, index: number) => {
                const itemValue: JsonValue = isArray 
                  ? (value as JsonValue[])[index] 
                  : (value as { [key: string]: JsonValue })[key];
                
                return (
                  <JsonTreeNode 
                    key={key} 
                    label={isArray ? index.toString() : key} 
                    value={itemValue} 
                    isLast={index === keys.length - 1}
                    depth={depth + 1}
                  />
                );
              })
            }
          </div>
        )
      }
      
      {
        isExpanded
        && (
          <div className="py-0.5 text-muted-foreground">
            {bracketClose}
            {
              !isLast
              && (
                <span>,</span>
              )
            }
          </div>
        )
      }
    </div>
  );
}
