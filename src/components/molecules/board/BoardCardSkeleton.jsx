import { Card } from "flowbite-react";

const customCardTheme = {
  root: {
    children: "flex h-full flex-col justify-center gap-2 p-4",
  },
};

export default function BoardCardSkeleton({ error }) {
  return (
    <Card
      theme={customCardTheme}
      className="flex h-[15rem] w-52 flex-col overflow-hidden hover:cursor-pointer"
      renderImage={() => (
        <div
          className={`min-h-[7rem] bg-gray-200 dark:bg-gray-800 ${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"}`}
        />
      )}
    >
      <div className="flex flex-1 flex-col space-y-4 overflow-hidden">
        <div>
          <div
            className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-4 w-32 rounded-full bg-gray-200 dark:bg-gray-800`}
          />
        </div>
        <div className="min-h-0 flex-1 space-y-2">
          <div
            className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-800`}
          />
          <div
            className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-800`}
          />
          <div
            className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-800`}
          />
        </div>
      </div>
    </Card>
  );
}
