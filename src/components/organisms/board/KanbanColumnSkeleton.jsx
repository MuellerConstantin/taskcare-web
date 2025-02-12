export default function KanbanColumnSkeleton({ error }) {
  return (
    <div className={`${error ? "bg-red-200 dark:bg-red-400" : "animate-pulse"} w-[20rem] h-full flex bg-gray-100 dark:bg-gray-800 rounded-md min-h-[30rem]`} />
  );
}
