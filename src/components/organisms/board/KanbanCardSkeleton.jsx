"use client";

export default function KanbanCardSkeleton({error}) {
  return (
    <div className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} w-full h-[12rem] flex flex-col space-y-2 p-2 bg-white shadow dark:bg-gray-900 rounded-md justify-between`}>
      <div className="space-y-4">
        <div>
          <div className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-4 bg-gray-200 rounded-full dark:bg-gray-800 w-1/2`} />
        </div>
        <div className="space-y-2">
          <div className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-full`} />
          <div className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-full`} />
          <div className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-full`} />
        </div>
      </div>
      <div>
        <div className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-1/4`} />
      </div>
    </div>
  );
}
