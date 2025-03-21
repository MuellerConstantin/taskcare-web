"use client";

export default function KanbanCardSkeleton({ error }) {
  return (
    <div
      className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} flex h-[12rem] w-full flex-col justify-between space-y-2 rounded-md bg-white p-2 shadow dark:bg-gray-900`}
    >
      <div className="space-y-4">
        <div>
          <div
            className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-4 w-1/2 rounded-full bg-gray-200 dark:bg-gray-800`}
          />
        </div>
        <div className="space-y-2">
          <div
            className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-800`}
          />
          <div
            className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-800`}
          />
          <div
            className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-800`}
          />
        </div>
      </div>
      <div>
        <div
          className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-2.5 w-1/4 rounded-full bg-gray-200 dark:bg-gray-800`}
        />
      </div>
    </div>
  );
}
