import { useCallback, useEffect, useRef, useState } from "react";

export interface UseInfiniteScrollOptions<T> {
  fetchInitial: () => Promise<T[]>;
  fetchMore: (offset: number) => Promise<T[]>;
  pageSize: number;
  initialSize: number;
}

export interface UseInfiniteScrollReturn<T> {
  data: T[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  loadMore: () => Promise<void>;
  reset: () => Promise<void>;
  setData: (data: T[] | ((prev: T[]) => T[])) => void;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

export function useInfiniteScroll<T>({
  fetchInitial,
  fetchMore,
  pageSize,
  initialSize,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [skip, setSkip] = useState(initialSize);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Initial data load
  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        setIsLoading(true);
        setError(null);
        const initialData = await fetchInitial();
        if (isMounted) {
          setData(initialData);
          setHasMore(initialData.length >= initialSize);
          setSkip(initialSize);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to load initial data"),
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [fetchInitial, initialSize]);

  // Load more data
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || error) return;

    try {
      setIsLoadingMore(true);
      const newData = await fetchMore(skip);
      setData((prev) => [...prev, ...newData]);
      setSkip((prev) => prev + pageSize);
      setHasMore(newData.length >= pageSize);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load more data"),
      );
    } finally {
      setIsLoadingMore(false);
    }
  }, [skip, pageSize, isLoadingMore, hasMore, error, fetchMore]);

  // Reset function
  const handleReset = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setData([]);
      setSkip(initialSize);
      setHasMore(true);

      const initialData = await fetchInitial();
      setData(initialData);
      setHasMore(initialData.length >= initialSize);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to reset data"));
    } finally {
      setIsLoading(false);
    }
  }, [fetchInitial, initialSize]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoadingMore) {
          void handleLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [handleLoadMore, hasMore, isLoadingMore]);

  return {
    data,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    loadMore: handleLoadMore,
    reset: handleReset,
    setData,
    sentinelRef: observerTarget,
  };
}
