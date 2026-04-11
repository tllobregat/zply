'use client';

import { RESET_DASHBOARD_EVENT } from '@/lib/config/events';
import { Category } from '@/lib/config/tools';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';

export type UseCategory = {
  activeCategory: Category;
  setActiveCategory: (newCategory: Category, useReplace?: boolean) => void;
};

export function useCategory(onReset?: () => void): UseCategory {
  const searchParams: URLSearchParams = useSearchParams();
  const router: AppRouterInstance = useRouter();

  // Derive activeCategory from URL
  const activeCategory: Category = useMemo(() => {
    const categoryFromUrl: string | null = searchParams.get('category');
    if (categoryFromUrl && Object.values(Category).includes(categoryFromUrl as Category)) {
      return categoryFromUrl as Category;
    }
    return Category.ALL;
  }, [searchParams]);

  // Update activeCategory via URL
  const setActiveCategory = useCallback((newCategory: Category, useReplace: boolean = false): void => {
    const params: URLSearchParams = new URLSearchParams(searchParams.toString());
    if (newCategory === Category.ALL) {
      params.delete('category');
    } else {
      params.set('category', newCategory);
    }

    const queryString: string = params.toString();
    const targetUrl: string = queryString ? `/?${queryString}` : '/';

    if (useReplace) {
      router.replace(targetUrl, { scroll: false });
    } else {
      router.push(targetUrl, { scroll: false });
    }
  }, [router, searchParams]);

  // Handle reset-dashboard event
  useEffect(() => {
    const handleReset = (): void => {
      setActiveCategory(Category.ALL, true);
      onReset?.();
    };

    window.addEventListener(RESET_DASHBOARD_EVENT, handleReset);
    return (): void => window.removeEventListener(RESET_DASHBOARD_EVENT, handleReset);
  }, [setActiveCategory, onReset]);

  return { activeCategory, setActiveCategory };
}
