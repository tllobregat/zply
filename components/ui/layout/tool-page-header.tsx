import { Breadcrumb, BreadcrumbItem } from '@/components/ui/layout';
import { getCategoryColorClass } from '@/lib/config/categories';
import { Category } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import React from 'react';
import { ToolPageActions } from './tool-page-actions';

interface ToolPageHeaderProps {
  toolId: string;
  breadcrumbItems: BreadcrumbItem[];
  title: string;
  icon: React.ReactNode;
  iconColorClassName: string;
  isMobile: boolean;
  headerActions?: React.ReactNode;
  scrollToAbout: () => void;
}

export function ToolPageHeader({
  toolId,
  breadcrumbItems,
  title,
  icon,
  iconColorClassName,
  isMobile,
  headerActions,
  scrollToAbout,
}: ToolPageHeaderProps) {
  const tCategories = useTranslations('Categories');

  // Enhance breadcrumb items with category colors
  const enhancedBreadcrumbItems: BreadcrumbItem[] = breadcrumbItems.map((item: BreadcrumbItem) => {
    // Check if the label matches a translated category name
    const categoryKey = Object.keys(Category).find(key => tCategories(Category[key as keyof typeof Category]) === item.label);
    const categoryValue = categoryKey ? Category[categoryKey as keyof typeof Category] : item.label;

    return {
      ...item,
      className: item.className || getCategoryColorClass(categoryValue) || undefined
    };
  });

  return (
    <header className="px-4 sm:px-8 py-4 flex items-center justify-between shrink-0">
      <div className="flex flex-col min-w-0">
        <Breadcrumb items={enhancedBreadcrumbItems} />
        <div className="flex items-center gap-3">
          <div className={cn('p-1.5 sm:p-2 rounded-xl border shrink-0', iconColorClassName)}>
            {icon}
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight truncate">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <ToolPageActions
          toolId={toolId}
          isMobile={isMobile}
          headerActions={headerActions}
          scrollToAbout={scrollToAbout}
        />
      </div>
    </header>
  );
}
