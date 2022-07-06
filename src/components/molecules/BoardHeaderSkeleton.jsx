import { UserIcon, ClockIcon } from "@heroicons/react/solid";

export default function BoardHeaderSkeleton({ error }) {
  return (
    <div
      className={`flex flex-col space-y-2 text-gray-800 dark:text-white ${
        !error && "animate-pulse"
      }`}
    >
      <div className="flex space-x-2">
        <div
          className={`p-1 rounded-md ${
            error
              ? "bg-red-200 dark:bg-red-400"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <div className="h-28 aspect-square" />
        </div>
        <div className="space-y-2 w-full">
          <div
            className={`w-2/3 max-w-xs h-6 rounded-lg ${
              error
                ? "bg-red-200 dark:bg-red-400"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
          <div className="space-y-1">
            <div className="font-light text-xs flex space-x-1 flex items-center">
              <UserIcon className="h-4" />
              <p>Created by: </p>
              <div
                className={`w-1/4 max-w-[10rem] h-2 rounded-lg ${
                  error
                    ? "bg-red-200 dark:bg-red-400"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            </div>
            <div className="font-light text-xs flex space-x-1 flex items-center">
              <ClockIcon className="h-4" />
              <p>Created at: </p>
              <div
                className={`w-1/4 max-w-[10rem] h-2 rounded-lg ${
                  error
                    ? "bg-red-200 dark:bg-red-400"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <div
          className={`w-2/3 h-3 rounded-lg ${
            error
              ? "bg-red-200 dark:bg-red-400"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        />
        <div
          className={`w-2/3 h-3 rounded-lg ${
            error
              ? "bg-red-200 dark:bg-red-400"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        />
        <div
          className={`w-2/3 h-3 rounded-lg ${
            error
              ? "bg-red-200 dark:bg-red-400"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        />
        <div
          className={`w-2/3 h-3 rounded-lg md:hidden ${
            error
              ? "bg-red-200 dark:bg-red-400"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        />
      </div>
    </div>
  );
}
