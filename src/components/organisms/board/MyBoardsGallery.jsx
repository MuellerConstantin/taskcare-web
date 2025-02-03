import { useState } from "react";
import { Pagination } from "flowbite-react";
import useSWR from "swr";
import BoardCard from "@/components/molecules/board/BoardCard";
import BoardCardSkeleton from "@/components/molecules/board/BoardCardSkeleton";
import useApi from "@/hooks/useApi";

const customPaginationTheme = {
  "pages": {
    "selector": {
      "active": "bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white",
    }
  }
};

export default function MyBoardsGallery() {
  const api = useApi();

  const [page, setPage] = useState(1);
  const [perPage,] = useState(25);

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(`/user/me/boards?page=${page - 1}&perPage=${perPage}`,
    (url) => api.get(url).then((res) => res.data));

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
          />
        </div>
      )}
    </div>
  );
}
