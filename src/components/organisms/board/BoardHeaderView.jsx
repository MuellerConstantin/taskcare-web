import { useSelector, shallowEqual } from "react-redux";
import { ExclamationIcon } from "@heroicons/react/solid";
import BoardHeader from "../../molecules/board/BoardHeader";
import BoardHeaderSkeleton from "../../molecules/board/BoardHeaderSkeleton";

export default function BoardHeaderView() {
  const { board, loading, error } = useSelector(
    (state) => state.board,
    shallowEqual
  );

  return loading || error || !board ? (
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
            Loading the board information failed.
          </div>
        </button>
      )}
      <BoardHeaderSkeleton error={error} />
    </div>
  ) : (
    <BoardHeader board={board} />
  );
}
