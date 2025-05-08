import { Image as ImageIcon } from "lucide-react";

interface BoardCardSkeletonProps {
  error?: string;
}

export function BoardCardSkeleton({ error }: BoardCardSkeletonProps) {
  return (
    <div className="flex h-fit w-[14rem] max-w-sm flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:cursor-pointer dark:border-gray-700 dark:bg-gray-800">
      <div
        className={`flex aspect-video h-auto w-full shrink-0 items-center justify-center ${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse bg-slate-300 dark:bg-slate-700"}`}
      >
        <ImageIcon
          className={`aspect-square h-1/2 w-auto ${error ? "text-red-300 dark:text-red-500" : "text-slate-200 dark:text-slate-800"}`}
        />
      </div>
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
