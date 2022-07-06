import { useNavigate } from "react-router-dom";
import Avatar from "../atoms/Avatar";

export default function BoardThumbnail({ board }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="w-full md:w-72 aspect-square"
      onClick={() => navigate(`/boards/${board.id}`)}
    >
      <div className="w-full h-full shadow rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:brightness-110 text-left">
        <div className="h-3/5 w-full rounded-t-lg bg-gray-200 dark:bg-gray-800">
          <Avatar value={board.name} />
        </div>
        <div className="h-2/5 p-4 overflow-hidden">
          <h2 className="text-lg font-bold truncate">{board.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-4 md:line-clamp-3">
            {board.description}
          </p>
        </div>
      </div>
    </button>
  );
}
