import { ToolConfig, TOOLS } from '@/lib/config/tools';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl: string = 'https://zply.dev';

  // Base routes
  const routes: string[] = ['/'];

  // Tool routes
  const toolRoutes: string[] = TOOLS
    .filter((tool: ToolConfig) => tool.status === 'active')
    .map((tool: ToolConfig) => tool.href);

  const allRoutes: string[] = [...new Set([...routes, ...toolRoutes])];

  return allRoutes.map((route: string) => ({
    url: `${baseUrl}${route === '/' ? '' : route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1 : 0.8,
  }));
}
