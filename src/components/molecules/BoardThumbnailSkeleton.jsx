export default function BoardThumbnailSkeleton() {
  return (
    <div className="w-full md:w-72 aspect-square animate-pulse">
      <div className="w-full h-full shadow rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-left">
        <div className="h-3/5 w-full rounded-t-lg bg-gray-200 dark:bg-gray-800" />
        <div className="h-2/5 p-4 space-y-2">
          <div className="w-2/3 h-6 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="space-y-1">
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-lg block md:hidden" />
          </div>
        </div>
      </div>
    </div>
  );
}
