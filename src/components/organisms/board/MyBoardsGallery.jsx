import { useState, useMemo } from "react";
import { Pagination, Spinner } from "flowbite-react";
import useSWR from "swr";
import BoardCard from "@/components/molecules/board/BoardCard";
import BoardCardSkeleton from "@/components/molecules/board/BoardCardSkeleton";
import useApi from "@/hooks/useApi";

const customPaginationTheme = {
  layout: {
    table: {
      base: "text-xs text-gray-700 dark:text-gray-400 text-center",
      span: "font-semibold text-gray-900 dark:text-white",
    },
  },
  pages: {
    selector: {
      base: "w-12 border border-gray-300 bg-white py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
      active:
        "bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white",
    },
    previous: {
      base: "ml-0 rounded-l-lg border border-gray-300 bg-white px-2 py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
    },
    next: {
      base: "rounded-r-lg border border-gray-300 bg-white px-2 py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
    },
  },
};

export default function MyBoardsGallery({ searchQuery }) {
  const api = useApi();

  const [page, setPage] = useState(1);
  const [perPage] = useState(25);

  const { data, error, isLoading } = useSWR(
    `/user/me/boards?page=${page - 1}&perPage=${perPage}${searchQuery ? `&search=${searchQuery}` : ""}`,
    (url) => api.get(url).then((res) => res.data),
    { keepPreviousData: true },
  );

  const isInitialLoading = useMemo(
    () => isLoading && (!data || data.info.totalElements === 0),
    [isLoading, data],
  );
  const isRefreshLoading = useMemo(
    () => isLoading && data && data.info.totalElements > 0,
    [isLoading, data],
  );
  const hasErrored = useMemo(() => !isLoading && error, [isLoading, error]);
  const hasSucceeded = useMemo(
    () => !isLoading && !error && data,
    [isLoading, error, data],
  );
  const hasData = useMemo(
    () => hasSucceeded && data.info.totalElements > 0,
    [hasSucceeded, data],
  );
  const isFiltered = useMemo(
    () => hasSucceeded && searchQuery,
    [hasSucceeded, searchQuery],
  );

  return (
    <div className="flex h-full w-full flex-col space-y-4">
      <div className="relative flex flex-col flex-wrap gap-4 md:flex-row">
        {isInitialLoading &&
          Array.from(Array(6).keys()).map((key) => (
            <BoardCardSkeleton key={key} />
          ))}

        {isRefreshLoading && (
          <>
            {data.content.map((board) => (
              <div key={board.id} className="relative">
                <BoardCard board={board} />
                <div className="absolute inset-0 z-50 h-full w-full animate-pulse rounded-md bg-gray-200 bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50" />
              </div>
            ))}
          </>
        )}

        {hasErrored &&
          Array.from(Array(6).keys()).map((key) => (
            <BoardCardSkeleton key={key} error={error} />
          ))}

        {hasSucceeded && (
          <>
            {hasData &&
              data.content.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}

            {!hasData && !isFiltered && (
              <div className="w-full text-center">
                It seems like you are not a member of a board yet.
              </div>
            )}

            {!hasData && isFiltered && (
              <div className="w-full text-center">
                It seems like no results were found.
              </div>
            )}
          </>
        )}
      </div>

      {hasSucceeded && hasData && (
        <div className="flex justify-center">
          <Pagination
            theme={customPaginationTheme}
            layout="pagination"
            showIcons
            currentPage={page}
            totalPages={data.info.totalPages}
            onPageChange={setPage}
            className="hidden md:block"
          />
          <Pagination
            theme={customPaginationTheme}
            layout="table"
            showIcons
            currentPage={page}
            totalPages={data.info.totalPages}
            onPageChange={setPage}
            className="block md:hidden"
          />
        </div>
      )}
    </div>
  );
}
