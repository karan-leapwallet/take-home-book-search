import { useCallback, useEffect, useState } from "react";

const BASE_URL = "https://openlibrary.org/search.json";

export type Book = {
  key: string;
  title: string;
  author_name: string[];
};

export const useBooks = (query: string) => {
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState<Record<number, Book[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(
    async (toReset: boolean = false) => {
      try {
        if (page === 1 || toReset) {
          setIsLoading(true);
          setBooks({});
        }
        setError(null);
        const pageToFetch = toReset ? 1 : page;
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
        setHasMore(data?.docs?.length > 0 && data?.num_found - data?.start > 0);
        setBooks((prev) => ({ ...prev, [pageToFetch]: data?.docs ?? [] }));
        setPage(pageToFetch + 1);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Error fetching books..."
        );
        // TODO: can add a retry mechanism here
        // otherwise will have to think how do we want to handle error when paging latest page
      } finally {
        setIsLoading(false);
      }
    },
    [query, page]
  );

  useEffect(() => {
    if (!query) return;

    fetchBooks(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const fetchNextPage = useCallback(() => {
    if (hasMore) {
      fetchBooks();
    }
  }, [fetchBooks, hasMore]);

  return { books, isLoading, error, hasMore, fetchNextPage };
};
