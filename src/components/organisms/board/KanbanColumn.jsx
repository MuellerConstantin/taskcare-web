"use client";

import useSWR from "swr";
import useApi from "@/hooks/useApi";
import KanbanCard from "./KanbanCard";
import KanbanCardSkeleton from "./KanbanCardSkeleton";

export default function KanbanColumn({boardId, status}) {
  const api = useApi();

  const {
    data,
    error,
    isLoading: loading
  } = useSWR(boardId && status ? `/boards/${boardId}/statuses/${status.id}/tasks` : null,
    (url) => api.get(url).then((res) => res.data));
  
    console.log(data);

  return (
    <div className="w-[20rem] h-full flex bg-gray-100 dark:bg-gray-800 rounded-md min-h-[30rem] flex flex-col">
      <div className="p-2 text-sm font-semibold text-gray-900 dark:text-white truncate">
        {status?.name}
      </div>
      <div className="p-2 flex flex-col gap-2">
        {(loading) ? (
          Array.from(Array(Math.floor(Math.random() * 4) + 1).keys()).map((key) => (
            <div key={key}>
              <KanbanCardSkeleton />
            </div>
          ))
        ) : (error) ? (
          Array.from(Array(Math.floor(Math.random() * 4) + 1).keys()).map((key) => (
            <div key={key}>
              <KanbanCardSkeleton error />
            </div>
          ))
        ) : data?.content?.map((task) => (
          <div key={task.id}>
            <KanbanCard task={task} />
          </div>
        ))}
      </div>
    </div>
  );
}
