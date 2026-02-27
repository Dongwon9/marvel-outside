import { renderHook, act, waitFor } from "@testing-library/react";

import { useInfiniteScroll } from "./useInfiniteScroll";

describe("useInfiniteScroll", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load initial data on mount", async () => {
    const initialData = [
      { id: 1, title: "Item 1" },
      { id: 2, title: "Item 2" },
      { id: 3, title: "Item 3" },
    ];
    const fetchInitial = jest.fn().mockResolvedValue(initialData);
    const fetchMore = jest.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchInitial,
        fetchMore,
        pageSize: 10,
        initialSize: 3,
      }),
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchInitial).toHaveBeenCalled();
    expect(result.current.data).toEqual(initialData);
    expect(result.current.hasMore).toBe(true);
  });

  it("should handle initial data load error", async () => {
    const error = new Error("Failed to fetch");
    const fetchInitial = jest.fn().mockRejectedValue(error);
    const fetchMore = jest.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchInitial,
        fetchMore,
        pageSize: 10,
        initialSize: 3,
      }),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toBe("Failed to fetch");
  });

  it("should load more data when loadMore is called", async () => {
    const initialData = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const moreData = [{ id: 4 }, { id: 5 }];
    const fetchInitial = jest.fn().mockResolvedValue(initialData);
    const fetchMore = jest.fn().mockResolvedValue(moreData);

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchInitial,
        fetchMore,
        pageSize: 2,
        initialSize: 3,
      }),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(initialData);

    await act(async () => {
      await result.current.loadMore();
    });

    expect(fetchMore).toHaveBeenCalledWith(3);
    expect(result.current.data).toEqual([...initialData, ...moreData]);
  });

  it("should set hasMore to false when fetched data is less than pageSize", async () => {
    const initialData = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const lessData = [{ id: 4 }]; // Less than pageSize (2)
    const fetchInitial = jest.fn().mockResolvedValue(initialData);
    const fetchMore = jest.fn().mockResolvedValue(lessData);

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchInitial,
        fetchMore,
        pageSize: 2,
        initialSize: 3,
      }),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.hasMore).toBe(false);
  });

  it("should handle loadMore error", async () => {
    const initialData = [{ id: 1 }, { id: 2 }];
    const error = new Error("Load more failed");
    const fetchInitial = jest.fn().mockResolvedValue(initialData);
    const fetchMore = jest.fn().mockRejectedValue(error);

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchInitial,
        fetchMore,
        pageSize: 2,
        initialSize: 2,
      }),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.loadMore();
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toBe("Load more failed");
  });

  it("should reset data", async () => {
    const initialData = [{ id: 1 }, { id: 2 }];
    const fetchInitial = jest.fn().mockResolvedValue(initialData);
    const fetchMore = jest.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchInitial,
        fetchMore,
        pageSize: 2,
        initialSize: 2,
      }),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(initialData);

    // Reset the data
    await act(async () => {
      await result.current.reset();
    });

    expect(result.current.data).toEqual(initialData);
    expect(fetchInitial).toHaveBeenCalledTimes(2);
  });

  it("should not load more when hasMore is false", async () => {
    const initialData = [{ id: 1 }];
    const fetchInitial = jest.fn().mockResolvedValue(initialData);
    const fetchMore = jest.fn().mockResolvedValue([]);

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchInitial,
        fetchMore,
        pageSize: 1,
        initialSize: 1,
      }),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Load more once to set hasMore to false
    await act(async () => {
      await result.current.loadMore();
    });

    expect(fetchMore).toHaveBeenCalledTimes(1);
    expect(result.current.hasMore).toBe(false);

    // Try to load more again when hasMore is false
    await act(async () => {
      await result.current.loadMore();
    });

    // fetchMore should still only be called once because hasMore is false
    expect(fetchMore).toHaveBeenCalledTimes(1);
  });

  it("should allow setting data directly", async () => {
    const initialData = [{ id: 1 }];
    const fetchInitial = jest.fn().mockResolvedValue(initialData);
    const fetchMore = jest.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchInitial,
        fetchMore,
        pageSize: 2,
        initialSize: 1,
      }),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const newData = [{ id: 10 }, { id: 11 }];
    act(() => {
      result.current.setData(newData);
    });

    expect(result.current.data).toEqual(newData);
  });

  it("should allow updating data with callback", async () => {
    const initialData = [{ id: 1 }];
    const fetchInitial = jest.fn().mockResolvedValue(initialData);
    const fetchMore = jest.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchInitial,
        fetchMore,
        pageSize: 2,
        initialSize: 1,
      }),
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setData((prev) => [...prev, { id: 2 }]);
    });

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[1]).toEqual({ id: 2 });
  });

  it("should provide sentinel ref for intersection observer", () => {
    const fetchInitial = jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const fetchMore = jest.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll({
        fetchInitial,
        fetchMore,
        pageSize: 2,
        initialSize: 2,
      }),
    );

    expect(result.current.sentinelRef).toBeDefined();
    expect(result.current.sentinelRef.current).toBeNull();
  });
});
