export default function KanbanColumnSkeleton({ error }) {
  return (
    <div
      className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} flex h-full min-h-[30rem] w-[20rem] rounded-md bg-gray-100 dark:bg-gray-800`}
    />
  );
}
