export default function BoardThumbnailSkeleton({ error }) {
  return (
    <div
      className={`w-full md:w-72 aspect-square ${!error && "animate-pulse"}`}
    >
      <div className="w-full h-full shadow rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-left">
        <div
          className={`h-3/5 w-full rounded-t-lg ${
            error
              ? "bg-red-200 dark:bg-red-400"
              : "bg-gray-200 dark:bg-gray-800"
          }`}
        />
        <div className="h-2/5 p-4 space-y-2">
          <div
            className={`w-2/3 h-6 rounded-lg ${
              error
                ? "bg-red-200 dark:bg-red-400"
                : "bg-gray-200 dark:bg-gray-800"
            }`}
          />
          <div className="space-y-1">
            <div
              className={`w-full h-3 rounded-lg ${
                error
                  ? "bg-red-200 dark:bg-red-400"
                  : "bg-gray-200 dark:bg-gray-800"
              }`}
            />
            <div
              className={`w-full h-3 rounded-lg ${
                error
                  ? "bg-red-200 dark:bg-red-400"
                  : "bg-gray-200 dark:bg-gray-800"
              }`}
            />
            <div
              className={`w-full h-3 rounded-lg ${
                error
                  ? "bg-red-200 dark:bg-red-400"
                  : "bg-gray-200 dark:bg-gray-800"
              }`}
            />
            <div
              className={`w-full h-3 rounded-lg md:hidden ${
                error
                  ? "bg-red-200 dark:bg-red-400"
                  : "bg-gray-200 dark:bg-gray-800"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
