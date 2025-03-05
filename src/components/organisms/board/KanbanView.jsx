"use client";

import useSWR from "swr";
import useApi from "@/hooks/useApi";
import KanbanColumn from "./KanbanColumn";
import KanbanColumnSkeleton from "./KanbanColumnSkeleton";

export default function KanbanView({boardId}) {
  const api = useApi();

  const {
    data,
    error,
    isLoading: loading
  } = useSWR(boardId ? `/boards/${boardId}` : null,
    (url) => api.get(url).then((res) => res.data));

  const {
    data: columnsData,
    error: columnsError,
    isLoading: columnsLoading
  } = useSWR(
    data?.columns ? data.columns.map(statusId => `/boards/${boardId}/statuses/${statusId}`) : null,
    async (urls) => {
      return await Promise.all(urls.map(url => api.get(url).then(res => res.data)));
    }
  );

  return (
    <div className="flex flex-col grow h-full">
      <div className="flex gap-4 overflow-x-auto h-full grow">
        {(loading || columnsLoading) ? (
          Array.from(Array(4).keys()).map((key) => (
            <div key={key}>
              <KanbanColumnSkeleton />
            </div>
          ))
        ) : (error || columnsError) ? (
          Array.from(Array(4).keys()).map((key) => (
            <div key={key}>
              <KanbanColumnSkeleton error />
            </div>
          ))
        ) : (
          <>
            {columnsData?.length > 0 ? (
              columnsData?.map((column) => (
                <div key={column.id}>
                  <KanbanColumn boardId={boardId} status={column} />
                </div>
              ))
            ) : (
              <div className="w-full text-center">
                It seems that no layout has been assigned to the board yet.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
