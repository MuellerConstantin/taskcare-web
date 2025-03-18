"use client";

import { useCallback } from "react";
import useSWR, { useSWRConfig } from "swr";
import { useDrop } from "react-dnd";
import useApi from "@/hooks/useApi";
import KanbanCard from "./KanbanCard";
import KanbanCardSkeleton from "./KanbanCardSkeleton";

export default function KanbanColumn({boardId, status, selectedTaskId, onTaskSelect}) {
  const api = useApi();
  const { mutate } = useSWRConfig();

  const {
    data,
    error,
    isLoading: loading
  } = useSWR(boardId && status ? `/boards/${boardId}/statuses/${status.id}/tasks` : null,
    (url) => api.get(url).then((res) => res.data),
    { keepPreviousData: true });

  const updateStatus = useCallback((taskId, statusId) => {
    api.patch(`/tasks/${taskId}`, {
      statusId: statusId
    })
    .then(() => mutate((key) => new RegExp(`^.*\/boards\/${boardId}\/statuses\/[^/]+\/tasks.*$`).test(key), null))
    .then(() => mutate((key) =>new RegExp(`^.*\/tasks\/${taskId}`).test(key), null));
  }, [boardId]);

  const [{ isOver, canDrop }, dropRef] = useDrop(() => ({
    accept: ["KanbanCard"],
    drop: async (task, monitor) => {
      if(task.statusId === status.id) return;

      updateStatus(task.id, status.id);

      return task;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [status.id]);

  return (
    <div
      ref={dropRef}
      className="w-[20rem] h-full flex bg-gray-100 dark:bg-gray-800 rounded-md min-h-[30rem] flex flex-col"
    >
      <div className="p-2 text-sm font-semibold text-gray-900 dark:text-white truncate">
        {status?.name}
      </div>
      <div className="p-2 flex flex-col gap-2 h-full relative">
        {(loading && false) ? (
          Array.from(Array(Math.floor(Math.random() * 4) + 1).keys()).map((key) => (
            <div key={key}>
              <KanbanCardSkeleton />
            </div>
          ))
        ) : (error && false) ? (
          Array.from(Array(Math.floor(Math.random() * 4) + 1).keys()).map((key) => (
            <div key={key}>
              <KanbanCardSkeleton error />
            </div>
          ))
        ) : data?.content?.map((task) => (
          <div key={task.id} onClick={() => onTaskSelect(task?.id)} className="cursor-pointer">
            <KanbanCard task={task} selected={task?.id === selectedTaskId} />
          </div>
        ))}
        {canDrop && (
          <div className="absolute w-full h-full inset-0 z-10 p-2 bg-gray-100 dark:bg-gray-800 pointer-events-none">
            <div className={`border-2 flex justify-center border-dashed h-full w-full rounded-md ${isOver ? "bg-green-200 border-green-500 dark:bg-green-800 dark:border-green-400" : "bg-amber-200 border-amber-500 dark:bg-amber-800 dark:border-amber-400"}`} />
          </div>
        )}
      </div>
    </div>
  );
}
