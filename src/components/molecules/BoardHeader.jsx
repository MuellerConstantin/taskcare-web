import { UserIcon, ClockIcon } from "@heroicons/react/solid";
import Avatar from "../atoms/Avatar";

export default function BoardHeader({ board }) {
  return (
    <div className="flex flex-col space-y-2 text-gray-800 dark:text-white">
      <div className="flex space-x-2">
        <div className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white p-1 rounded-md">
          <div className="h-28 aspect-square">
            <Avatar value={board.name} />
          </div>
        </div>
        <div className="space-y-2 w-full">
          <h1 className="text-lg line-clamp-2">{board.name}</h1>
          <div className="space-y-1">
            <div className="font-light text-xs flex space-x-1">
              <UserIcon className="h-4" />
              <p>Created by: {board.createdBy}</p>
            </div>
            <div className="font-light text-xs flex space-x-1">
              <ClockIcon className="h-4" />
              <p>Created at: {new Date(board.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
      {board.description && <p className="line-clamp-6">{board.description}</p>}
    </div>
  );
}
