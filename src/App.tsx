import { useCallback, useMemo, useRef, useState } from "react";
import { useBooks } from "./hooks/use-books";
import { useDebouncedValue } from "./hooks/use-debounced-value";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);
  const { books, isLoading, isFetching, error, hasMore, total, fetchNextPage } =
    useBooks(debouncedSearchQuery);

  const allBooks = useMemo(() => {
    const _books = Object.values(books).flat();
    const loaders = hasMore ? ["loader"] : [];
    return [..._books, ...loaders];
  }, [books, hasMore]);

  const ref = useRef<HTMLDivElement>(null);
  console.log({
    searchQuery,
    books,
    debouncedSearchQuery,
    isLoading,
    isFetching,
    error,
    hasMore,
    total,
    ref: ref.current?.scrollHeight,
  });

  // alternative approach can be to use last element and if it is visible start fetching
  // I just used this approach as it came to mind first
  const handleScroll = useCallback(
    (data: React.UIEvent<HTMLDivElement>) => {
      console.log(
        "scroll",
        data.currentTarget.scrollTop + data.currentTarget.clientHeight,
        data.currentTarget.scrollHeight - 100
      );
      if (
        data.currentTarget.scrollTop + data.currentTarget.clientHeight >=
        data.currentTarget.scrollHeight - 100
      ) {
        console.log("fetching next page");
        fetchNextPage();
      }
    },
    [fetchNextPage]
  );

  return (
    <div className="bg-gray-100 h-screen w-screen flex flex-col gap-4">
      <input
        type="text"
        placeholder="Search for a book"
        className="w-full p-2 rounded-md border border-gray-300"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div
        className="flex-1 flex flex-col gap-4 overflow-y-auto"
        ref={ref}
        onScrollEndCapture={handleScroll}
      >
        <div className="bg-white p-4 rounded-md">
          <h3 className="text-lg font-bold">Book Title</h3>
          <p className="text-gray-500">Author</p>
        </div>
        {/* 
        can add virtualization if library is allowed
        Also can improve the loading state and error state
        */}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          allBooks.map((book) => {
            if (typeof book === "string") {
              return (
                <div
                  key={book}
                  className="flex justify-center items-center p-5 h-10"
                >
                  Loading...
                </div>
              );
            }
            return (
              <div key={book.key}>
                <h3 className="text-lg font-bold">{book.title}</h3>
                <p className="text-gray-500">{book.author_name?.join(", ")}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default App;
