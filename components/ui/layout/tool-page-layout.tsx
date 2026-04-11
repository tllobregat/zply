'use client';

import { BreadcrumbItem } from '@/components/ui/layout';
import { PageLayout } from '@/components/ui/layout';
import { CATEGORY_COLORS, getCategoryClasses } from '@/lib/config/categories';
import { ToolConfig, TOOLS } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ToolPageAbout } from './tool-page-about';
import { ToolPageFooter } from './tool-page-footer';
import { ToolPageHeader } from './tool-page-header';
import { ToolPageJsonLd } from './tool-page-json-ld';

interface ToolPageLayoutProps {
  toolId: string;
  breadcrumbItems: BreadcrumbItem[];
  title: string;
  icon: React.ReactNode;
  headerActions?: React.ReactNode;
  footerIndicator?: React.ReactNode;
  children: React.ReactNode;
  workspaceClassName?: string;
}

export function ToolPageLayout(
  {
    toolId,
    breadcrumbItems,
    title,
    icon,
    headerActions,
    footerIndicator,
    children,
    workspaceClassName,
  }: ToolPageLayoutProps,
): React.ReactNode {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const aboutRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkMobile = (): void => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return (): void => window.removeEventListener('resize', checkMobile);
  }, []);

  const toolConfig: ToolConfig | undefined = TOOLS.find((t: ToolConfig) => t.id === toolId);
  const theme = toolConfig ? getCategoryClasses(CATEGORY_COLORS[toolConfig.category]) : undefined;
  const iconColorClassName: string = theme ? cn(theme.bg, theme.border, 'text-white') : 'bg-blue-500 border-blue-500/20 text-white';

  const scrollToAbout = (): void => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <PageLayout
      scrollInIsland={false}
      header={
        <ToolPageHeader
          toolId={toolId}
          breadcrumbItems={breadcrumbItems}
          title={title}
          icon={icon}
          iconColorClassName={iconColorClassName}
          isMobile={isMobile}
          headerActions={headerActions}
          scrollToAbout={scrollToAbout}
        />
      }
      footer={
        <ToolPageFooter
          toolConfig={toolConfig}
          footerIndicator={footerIndicator}
          isMobile={isMobile}
        />
      }
      contentClassName={workspaceClassName}
      afterIsland={
        toolConfig && (
          <ToolPageAbout
            ref={aboutRef}
            toolConfig={toolConfig}
            title={title}
          />
        )
      }
    >
      <ToolPageJsonLd
        toolId={toolId}
        title={title}
        toolConfig={toolConfig}
      />
      {children}
    </PageLayout>
  );
}
