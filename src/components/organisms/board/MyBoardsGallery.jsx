import { useState } from "react";
import { Pagination } from "flowbite-react";
import useSWR from "swr";
import BoardCard from "@/components/molecules/board/BoardCard";
import BoardCardSkeleton from "@/components/molecules/board/BoardCardSkeleton";
import useApi from "@/hooks/useApi";

const customPaginationTheme = {
  "layout": {
    "table": {
      "base": "text-xs text-gray-700 dark:text-gray-400 text-center",
      "span": "font-semibold text-gray-900 dark:text-white"
    }
  },
  "pages": {
    "selector": {
      "base": "w-12 border border-gray-300 bg-white py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
      "active": "bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white",
    },
    "previous": {
      "base": "ml-0 rounded-l-lg border border-gray-300 bg-white px-2 py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
    },
    "next": {
      "base": "rounded-r-lg border border-gray-300 bg-white px-2 py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
    },
  }
};

export default function MyBoardsGallery({searchQuery}) {
  const api = useApi();

  const [page, setPage] = useState(1);
  const [perPage,] = useState(25);

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(`/user/me/boards?page=${page - 1}&perPage=${perPage}${searchQuery ? `&search=${searchQuery}` : ""}`,
    (url) => api.get(url).then((res) => res.data), { keepPreviousData: true });

  return (
    <div className="flex flex-col h-full w-full space-y-4">
      <div className="flex flex-col md:flex-row gap-4 flex-wrap">
        {loading ? (
          Array.from(Array(6).keys()).map((key) => (
            <BoardCardSkeleton key={key} />
          ))
        ) : error ? (
          Array.from(Array(6).keys()).map((key) => (
            <BoardCardSkeleton key={key} error />
          ))
        ) : (
          <>
            {data?.info.totalElements > 0 ? (
              data?.content.map((board) => <BoardCard key={board.id} board={board} />)
            ) : (
              <div className="w-full text-center">
                It seems like you are not a member of a board yet.
              </div>
            )}
          </>
        )}
      </div>
      {data?.info.totalElements > 0 && (
        <div className="flex justify-center">
          <Pagination
            theme={customPaginationTheme}
            layout="pagination"
            showIcons
            currentPage={page}
            totalPages={data?.info?.totalPages ? data.info.totalPages : 1}
            onPageChange={setPage}
            className="hidden md:block"
          />
          <Pagination
            theme={customPaginationTheme}
            layout="table"
            showIcons
            currentPage={page}
            totalPages={data?.info?.totalPages ? data.info.totalPages : 1}
            onPageChange={setPage}
            className="block md:hidden"
          />
        </div>
      )}
    </div>
  );
}
