'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, type ReactNode } from 'react';

export interface InfinitePage<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results?: number;
}

export interface InfiniteScrollProps<T> {
  queryKey: readonly unknown[];
  fetchFn: (page: number) => Promise<InfinitePage<T>>;
  renderItem: (item: T, index: number) => ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
  renderSkeleton?: () => ReactNode;
  renderNextPageSkeleton?: () => ReactNode;
  emptyState?: ReactNode;
  errorState?: ReactNode;
  className?: string;
  disabled?: boolean;
  manualLoadMore?: boolean;
  rootMargin?: string;
  onItemsChange?: (items: T[]) => void;
}

export function InfiniteScroll<T>({
  queryKey,
  fetchFn,
  renderItem,
  getItemKey,
  renderSkeleton,
  renderNextPageSkeleton,
  emptyState,
  errorState,
  className,
  disabled = false,
  manualLoadMore = false,
  rootMargin = '400px',
  onItemsChange,
}: InfiniteScrollProps<T>) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────
  // 1. ALL HOOKS — no early returns before this point
  // ─────────────────────────────────────────

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchFn(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.total_pages) return undefined;
      return lastPage.page + 1;
    },
    enabled: !disabled,
  });

  // Auto-load on scroll
  useEffect(() => {
    if (disabled || manualLoadMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [
    disabled,
    manualLoadMore,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    rootMargin,
  ]);

  // ─────────────────────────────────────────
  // 2. Compute items (safe to do before returns — just data)
  // ─────────────────────────────────────────

  const allItems = data?.pages.flatMap((page) => page.results) ?? [];

  const seen = new Set<string | number>();
  const items = allItems.filter((item, index) => {
    const key = getItemKey ? getItemKey(item, index) : `item-${index}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // ─────────────────────────────────────────
  // 3. onItemsChange effect — MUST be above returns
  // ─────────────────────────────────────────

  useEffect(() => {
    onItemsChange?.(items);
  }, [items, onItemsChange]);

  // ─────────────────────────────────────────
  // 4. NOW safe to do conditional returns
  // ─────────────────────────────────────────

  if (isLoading) {
    return (
      <div className={className}>
        {renderSkeleton?.() ?? <DefaultSkeleton />}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-16 text-center">
        {errorState ?? (
          <div className="text-red-400 text-sm">
            {error instanceof Error ? error.message : 'Something went wrong'}
          </div>
        )}
      </div>
    );
  }

  if (items.length === 0) {
    return <>{emptyState ?? <DefaultEmpty />}</>;
  }

  // ─────────────────────────────────────────
  // 5. Render
  // ─────────────────────────────────────────

  return (
    <div>
      <div className={className}>
        {items.map((item, index) => (
          <div key={getItemKey ? getItemKey(item, index) : `item-${index}`}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      <div ref={sentinelRef} className="h-10" aria-hidden />

      {isFetchingNextPage && (
        <div className="mt-4">
          {renderNextPageSkeleton?.() ?? <DefaultNextPageSkeleton />}
        </div>
      )}

      {manualLoadMore && hasNextPage && !isFetchingNextPage && (
        <div className="flex justify-center py-8">
          <button
            onClick={() => fetchNextPage()}
            className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {!hasNextPage && items.length > 0 && (
        <p className="text-center text-gray-500 text-sm py-8">
          You&apos;ve reached the end
        </p>
      )}
    </div>
  );
}

function DefaultSkeleton() {
  return (
    <div className="m-grid gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i}>
          <div className="aspect-2/3 bg-neutral-800 rounded-lg mb-2 animate-pulse" />
          <div className="h-4 bg-neutral-800 rounded w-3/4 mb-1 animate-pulse" />
          <div className="h-3 bg-neutral-800 rounded w-1/2 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function DefaultNextPageSkeleton() {
  return (
    <div className="m-grid gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i}>
          <div className="aspect-2/3 bg-neutral-800 rounded-lg mb-2 animate-pulse" />
          <div className="h-4 bg-neutral-800 rounded w-3/4 mb-1 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function DefaultEmpty() {
  return (
    <div className="py-16 text-center">
      <p className="text-gray-400">No results found</p>
    </div>
  );
}