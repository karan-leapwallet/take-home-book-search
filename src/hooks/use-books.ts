import { useCallback, useEffect, useState } from "react";

const BASE_URL = "https://openlibrary.org/search.json";

export type Book = {
  key: string;
  title: string;
  author_name: string[];
};

export const useBooks = (query: string) => {
  const [page, setPage] = useState<Record<string, number>>({});
  const [books, setBooks] = useState<Record<string, Record<number, Book[]>>>(
    {}
  );
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [hasMore, setHasMore] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string | null>>({});

  const fetchBooks = useCallback(async () => {
    try {
      const pageToFetch = page[query] || 1;
      if (pageToFetch === 1) {
        setIsLoading((prev) => ({ ...prev, [query]: true }));
      }
      setError((prev) => ({ ...prev, [query]: null }));
      let shouldRetry = true;
      let res: Response | null = null;
      let retryCount = 0;
      while (shouldRetry) {
        try {
          res = await fetch(`${BASE_URL}?q=${query}&page=${pageToFetch}`);
          shouldRetry = false;
        } catch (error) {
          retryCount++;
          if (retryCount > 3) {
            throw error;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
      if (!res) {
        throw new Error("Error fetching books");
      }
      const data = await res.json();
      setHasMore((prev) => ({
        ...prev,
        [query]: data?.docs?.length > 0 && data?.num_found - data?.start > 0,
      }));
      setBooks((prev) => ({
        ...prev,
        [query]: { ...(prev[query] || {}), [pageToFetch]: data?.docs ?? [] },
      }));
      setPage((prev) => ({ ...prev, [query]: pageToFetch + 1 }));
    } catch (error) {
      setError((prev) => ({
        ...prev,
        [query]:
          error instanceof Error ? error.message : "Error fetching books...",
      }));
      // TODO: can add a retry mechanism here
      // otherwise will have to think how do we want to handle error when paging latest page
    } finally {
      setIsLoading((prev) => ({ ...prev, [query]: false }));
    }
  }, [query, page]);

  useEffect(() => {
    if (!query || !!books[query]) return;

    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const fetchNextPage = useCallback(() => {
    if (hasMore) {
      fetchBooks();
    }
  }, [fetchBooks, hasMore]);

  return { books, isLoading, error, hasMore, fetchNextPage };
};
