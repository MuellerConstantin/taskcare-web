import { ExclamationIcon } from "@heroicons/react/solid";
import BoardThumbnail from "./BoardThumbnail";
import BoardThumbnailSkeleton from "./BoardThumbnailSkeleton";
import Pagination from "./Pagination";

export default function BoardList({
  boards,
  pageable,
  error,
  loading,
  onPageChange,
}) {
  return (
    <div className="flex flex-col space-y-4">
      {(loading || error) && (
        <div className="w-full relative">
          {error && (
            <button
              type="button"
              className="group absolute top-2 left-2 flex items-start space-x-2 text-red-500"
            >
              <div className="rounded-full p-1 bg-gray-100 dark:bg-gray-700 opacity-80">
                <ExclamationIcon className="h-6" />
              </div>
              <div className="invisible group-hover:visible group-focus:visible bg-gray-100 dark:bg-gray-700 rounded-md shadow-md text-xs p-2 opacity-80 max-w-xs line-clamp-4">
                {error}
              </div>
            </button>
          )}
          <div className="flex flex-wrap gap-4">
            {[...Array(4).keys()].map((key) => (
              <BoardThumbnailSkeleton key={key} error={error} />
            ))}
          </div>
        </div>
      )}
      {!loading && !error && boards.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {boards.map((board) => (
            <BoardThumbnail key={board.id} board={board} />
          ))}
        </div>
      )}
      {!loading && !error && boards.length <= 0 && (
        <p className="text-center text-gray-800 dark:text-white">
          No boards available.
        </p>
      )}
      {!loading && !error && boards.length > 0 && (
        <Pagination
          currentPage={pageable.page}
          perPage={pageable.perPage}
          totalElements={pageable.totalElements}
          onChange={(newPage) => onPageChange(newPage)}
        />
      )}
    </div>
  );
}
