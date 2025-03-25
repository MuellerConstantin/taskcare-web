interface BoardCardSkeletonProps {
  error?: any;
}

export function BoardCardSkeleton({ error }: BoardCardSkeletonProps) {
  return (
    <div className="flex h-fit w-[14rem] max-w-sm flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:cursor-pointer dark:border-gray-700 dark:bg-gray-800">
      <div
        className={`aspect-video h-auto w-full shrink-0 ${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse bg-gray-200 dark:bg-gray-700"}`}
      />
      <div className="h-[5rem] shrink-0 space-y-1 p-3">
        <div
          className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-3 w-32 rounded-full bg-gray-200 dark:bg-gray-700`}
        />
        <div
          className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-3 w-32 rounded-full bg-gray-200 dark:bg-gray-700`}
        />
      </div>
    </div>
  );
}
