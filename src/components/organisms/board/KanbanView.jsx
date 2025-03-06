"use client";

import { useState } from "react";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { Button } from "flowbite-react";
import { mdiPlus } from "@mdi/js";
import useApi from "@/hooks/useApi";
import KanbanColumn from "./KanbanColumn";
import KanbanColumnSkeleton from "./KanbanColumnSkeleton";
import TaskAddDialog from "@/components/organisms/task/TaskAddDialog";

const Icon = dynamic(() => import("@mdi/react").then(module => module.Icon), { ssr: false });

const customButtonTheme = {
  "color": {
    "light": "border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-amber-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
  }
};

export default function KanbanView({boardId}) {
  const api = useApi();

  const [showTaskAddDialog, setShowTaskAddDialog] = useState(false);

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
    <div className="flex flex-col grow h-full space-y-4">
      <div>
        <Button
          theme={customButtonTheme}
          color="light"
          size="xs"
          disabled={loading || error || columnsLoading || columnsError}
          onClick={() => setShowTaskAddDialog(true)}
        >
          <div className="flex items-center space-x-2 justify-center">
            <Icon path={mdiPlus} size={0.75} />
            <span>Add Task</span>
          </div>
        </Button>
      </div>
      <TaskAddDialog
        boardId={boardId}
        show={showTaskAddDialog}
        onClose={() => setShowTaskAddDialog(false)}
        onAdd={() => setShowTaskAddDialog(false)}
      />
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
