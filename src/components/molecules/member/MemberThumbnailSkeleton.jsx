export default function MemberThumbnailSkeleton({ error }) {
  return (
    <div className={`w-full ${!error && "animate-pulse"}`}>
      <div className="w-full rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white p-4 flex items-center space-x-4">
        <div
          className={`h-12 aspect-square rounded-lg ${
            error
              ? "bg-red-200 dark:bg-red-400"
              : "bg-gray-200 dark:bg-gray-800"
          }`}
        />
        <div className="space-y-2 w-full">
          <div
            className={`w-2/3 h-6 rounded-lg ${
              error
                ? "bg-red-200 dark:bg-red-400"
                : "bg-gray-200 dark:bg-gray-800"
            }`}
          />
          <div
            className={`w-1/3 h-6 rounded-lg ${
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
