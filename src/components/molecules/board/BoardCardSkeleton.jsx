import { Card } from "flowbite-react";

const customCardTheme = {
  "root": {
    "children": "flex h-full flex-col justify-center gap-2 p-4",
  },
};

export default function BoardCardSkeleton({ error }) {
  return (
    <Card
      theme={customCardTheme}
      className="w-52 h-[15rem] flex flex-col overflow-hidden hover:cursor-pointer"
      renderImage={() => (
        <div className={`min-h-[7rem] bg-gray-200 dark:bg-gray-800 ${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"}`} />
      )}
    >
      <div className="flex flex-col flex-1 overflow-hidden space-y-4">
        <div>
          <div className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-4 bg-gray-200 rounded-full dark:bg-gray-800 w-32`} />
        </div>
        <div className="flex-1 min-h-0 space-y-2">
          <div className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32`} />
          <div className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32`} />
          <div className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32`} />
        </div>
      </div>
    </Card>
  );
}
