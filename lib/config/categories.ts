import { Category, CategoryWithoutAll } from '@/lib/config/tools';
import { Binary, Clock, Code2, FileJson, Globe, Lock, LucideIcon } from 'lucide-react';

export type CategoryColor = 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'cyan' | 'gray';

export type CategoryMeta = {
  icon: LucideIcon;
  color: CategoryColor;
};

export const CATEGORY_COLORS: Record<CategoryWithoutAll, CategoryColor> = {
  [Category.DIAGRAMS]: 'blue',
  [Category.DATA]: 'green',
  [Category.SECURITY]: 'red',
  [Category.ENCODING]: 'purple',
  [Category.TIME]: 'orange',
  [Category.NETWORK]: 'cyan',
};

export const CATEGORY_META: Record<CategoryWithoutAll, CategoryMeta> = {
  [Category.DIAGRAMS]: {
    icon: Code2,
    color: 'blue'
  },
  [Category.DATA]: {
    icon: FileJson,
    color: 'green'
  },
  [Category.SECURITY]: {
    icon: Lock,
    color: 'red',
  },
  [Category.ENCODING]: {
    icon: Binary,
    color: 'purple'
  },
  [Category.TIME]: {
    icon: Clock,
    color: 'orange'
  },
  [Category.NETWORK]: {
    icon: Globe,
    color: 'cyan'
  },
};

export type CategoryTheme = {
  text: string,
  bg: string,
  border: string,
  icon: string,
  selection: string,
  hoverText: string,
  hoverBorder: string,
  shadow: string,
}

/**
 * Returns Tailwind classes for a given category color and usage type.
 */
export function getCategoryClasses(color: CategoryColor): CategoryTheme {
  switch (color) {
    case 'blue':
      return {
        text: 'text-blue-400',
        bg: 'bg-blue-500',
        border: 'border-blue-500/20',
        icon: 'bg-blue-500/10 text-blue-400',
        selection: 'selection:bg-blue-500/30',
        hoverText: 'group-hover:text-blue-400',
        hoverBorder: 'hover:border-blue-500/30',
        shadow: 'shadow-blue-500/20'
      };
    case 'green':
      return {
        text: 'text-green-400',
        bg: 'bg-green-500',
        border: 'border-green-500/20',
        icon: 'bg-green-500/10 text-green-400',
        selection: 'selection:bg-green-500/30',
        hoverText: 'group-hover:text-green-400',
        hoverBorder: 'hover:border-green-500/30',
        shadow: 'shadow-green-500/20'
      };
    case 'red':
      return {
        text: 'text-red-400',
        bg: 'bg-red-500',
        border: 'border-red-500/20',
        icon: 'bg-red-500/10 text-red-400',
        selection: 'selection:bg-red-500/30',
        hoverText: 'group-hover:text-red-400',
        hoverBorder: 'hover:border-red-500/30',
        shadow: 'shadow-red-500/20'
      };
    case 'purple':
      return {
        text: 'text-purple-400',
        bg: 'bg-purple-500',
        border: 'border-purple-500/20',
        icon: 'bg-purple-500/10 text-purple-400',
        selection: 'selection:bg-purple-500/30',
        hoverText: 'group-hover:text-purple-400',
        hoverBorder: 'hover:border-purple-500/30',
        shadow: 'shadow-purple-500/20'
      };
    case 'orange':
      return {
        text: 'text-orange-400',
        bg: 'bg-orange-500',
        border: 'border-orange-500/20',
        icon: 'bg-orange-500/10 text-orange-400',
        selection: 'selection:bg-orange-500/30',
        hoverText: 'group-hover:text-orange-400',
        hoverBorder: 'hover:border-orange-500/30',
        shadow: 'shadow-orange-500/20'
      };
    case 'cyan':
      return {
        text: 'text-cyan-400',
        bg: 'bg-cyan-500',
        border: 'border-cyan-500/20',
        icon: 'bg-cyan-500/10 text-cyan-400',
        selection: 'selection:bg-cyan-500/30',
        hoverText: 'group-hover:text-cyan-400',
        hoverBorder: 'hover:border-cyan-500/30',
        shadow: 'shadow-cyan-500/20'
      };
    default:
      return {
        text: 'text-gray-400',
        bg: 'bg-gray-500',
        border: 'border-gray-500/20',
        icon: 'bg-gray-500/10 text-gray-400',
        selection: 'selection:bg-gray-500/30',
        hoverText: 'group-hover:text-gray-400',
        hoverBorder: 'hover:border-gray-500/30',
        shadow: 'shadow-gray-500/20'
      };
  }
}

/**
 * Returns the text color class for a given category name.
 */
export function getCategoryColorClass(category: string): string {
  if (category === Category.ALL) {
    return 'text-gray-500';
  }
  const meta: CategoryMeta | undefined = CATEGORY_META[category as keyof typeof CATEGORY_META];
  if (!meta) return 'text-gray-500';
  return getCategoryClasses(meta.color).text;
}
