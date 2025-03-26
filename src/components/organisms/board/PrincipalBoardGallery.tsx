import { useState, useMemo } from "react";
import useSWR from "swr";
import { BoardCard } from "@/components/organisms/board/BoardCard";
import { BoardCardSkeleton } from "@/components/organisms/board/BoardCardSkeleton";
import { Pagination } from "@/components/molecules/Pagination";
import useApi from "@/hooks/useApi";

interface PrincipalBoardGalleryProps {}

export function PrincipalBoardGallery(props: PrincipalBoardGalleryProps) {
  const api = useApi();

  const [page, setPage] = useState(1);
  const [perPage] = useState(25);

  const { data, error, isLoading } = useSWR<{
    info: {
      totalElements: number;
      totalPages: number;
      page: number;
      perPage: number;
    };
    content: {
      id: string;
      name: string;
      description: string;
    }[];
  }>(
    `/user/me/boards?page=${page - 1}&perPage=${perPage}`,
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
    () => hasSucceeded && data && data.info.totalElements > 0,
    [hasSucceeded, data],
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
            {data!.content.map((board) => (
              <div key={board.id} className="relative">
                <BoardCard board={board} />
                <div className="bg-opacity-50 dark:bg-opacity-50 absolute inset-0 z-50 h-full w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-800" />
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
              data!.content.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}

            {!hasData && (
              <div className="w-full text-center">
                It seems like you are not a member of a board yet.
              </div>
            )}
          </>
        )}
      </div>
      {hasSucceeded && hasData && (
        <div className="flex flex-wrap items-center justify-start gap-4">
          <Pagination
            totalPages={data!.info.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Viewing{" "}
            <span className="font-semibold text-slate-800 dark:text-white">
              {data!.info.page * data!.info.perPage + 1}-
              {data!.info.page * data!.info.perPage + data!.info.perPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800 dark:text-white">
              {data!.info.totalElements}
            </span>{" "}
            elements
          </div>
        </div>
      )}
    </div>
  );
}
