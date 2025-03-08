"use client";

import { useCallback } from "react";
import useSWR, { useSWRConfig } from "swr";
import { useDrop } from "react-dnd";
import useApi from "@/hooks/useApi";
import KanbanCard from "./KanbanCard";
import KanbanCardSkeleton from "./KanbanCardSkeleton";

export default function KanbanColumn({boardId, status}) {
  const api = useApi();
  const { mutate } = useSWRConfig();

  const {
    data,
    error,
    isLoading: loading
  } = useSWR(boardId && status ? `/boards/${boardId}/statuses/${status.id}/tasks` : null,
    (url) => api.get(url).then((res) => res.data));

  const updateStatus = useCallback((taskId, statusId) => {
    api.patch(`/tasks/${taskId}`, {
      statusId: statusId
    })
    .then(() => mutate((key) => new RegExp(`^.*\/boards\/${boardId}\/statuses\/[^/]+\/tasks.*$`).test(key), null));
  }, [boardId]);

  const [, dropRef] = useDrop(() => ({
    accept: ["KanbanCard"],
    drop: async (task, monitor) => {
      updateStatus(task.id, status.id);
    },
  }), [status]);

  return (
    <div ref={dropRef} className="w-[20rem] h-full flex bg-gray-100 dark:bg-gray-800 rounded-md min-h-[30rem] flex flex-col">
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
