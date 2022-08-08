export default function KanbanViewSkeleton({ error }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex flex-col space-y-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2 h-96 md:h-screen">
        <div className="mb-4 flex items-center space-x-2">
          <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-1 text-gray-800 dark:text-white text-xs">
            ?
          </div>
          <h2 className="text-amber-500 text-lg font-semibold">Opened</h2>
        </div>
        <div
          className={`h-full space-y-2 overflow-y-scroll px-1 ${
            !error && "animate-pulse"
          }`}
        >
          <div
            className={`h-24 w-full rounded-md ${
              error
                ? "bg-red-200 dark:bg-red-400"
                : "bg-gray-200 dark:bg-gray-800"
            }`}
          />
        </div>
      </div>
      <div className="flex flex-col space-y-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2 h-96 md:h-screen">
        <div className="mb-4 flex items-center space-x-2">
          <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-1 text-gray-800 dark:text-white">
            ?
          </div>
          <h2 className="text-amber-500 text-lg font-semibold">In Progress</h2>
        </div>
        <div
          className={`h-full space-y-2 overflow-y-scroll px-1 ${
            !error && "animate-pulse"
          }`}
        >
          <div
            className={`h-24 w-full rounded-md ${
              error
                ? "bg-red-200 dark:bg-red-400"
                : "bg-gray-200 dark:bg-gray-800"
            }`}
          />
          <div
            className={`h-24 w-full rounded-md ${
              error
                ? "bg-red-200 dark:bg-red-400"
                : "bg-gray-200 dark:bg-gray-800"
            }`}
          />
        </div>
      </div>
      <div className="flex flex-col space-y-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2 h-96 md:h-screen">
        <div className="mb-4 flex items-center space-x-2">
          <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-1 text-gray-800 dark:text-white">
            ?
          </div>
          <h2 className="text-amber-500 text-lg font-semibold">Finished</h2>
        </div>
        <div
          className={`h-full space-y-2 overflow-y-scroll px-1 ${
            !error && "animate-pulse"
          }`}
        >
          <div
            className={`h-24 w-full rounded-md ${
              error
                ? "bg-red-200 dark:bg-red-400"
                : "bg-gray-200 dark:bg-gray-800"
            }`}
          />
          <div
            className={`h-24 w-full rounded-md ${
              error
                ? "bg-red-200 dark:bg-red-400"
                : "bg-gray-200 dark:bg-gray-800"
            }`}
          />
          <div
            className={`h-24 w-full rounded-md ${
              error
                ? "bg-red-200 dark:bg-red-400"
                : "bg-gray-200 dark:bg-gray-800"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
