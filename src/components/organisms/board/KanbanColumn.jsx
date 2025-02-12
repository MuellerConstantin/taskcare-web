export default function KanbanColumn({status}) {
  return (
    <div className="w-[20rem] h-full flex bg-gray-100 dark:bg-gray-800 rounded-md min-h-[30rem]">
      <div className="p-2 text-sm font-semibold text-gray-900 dark:text-white truncate">
        {status?.name}
      </div>
    </div>
  );
}
