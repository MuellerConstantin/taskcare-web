"use client";

import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import dynamic from "next/dynamic";
import { Button } from "flowbite-react";
import { mdiPlus } from "@mdi/js";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import useApi from "@/hooks/useApi";
import KanbanColumn from "./KanbanColumn";
import KanbanColumnSkeleton from "./KanbanColumnSkeleton";
import TaskAddDialog from "@/components/organisms/task/TaskAddDialog";
import TaskDetailsSidebar from "../task/TaskDetailsSidebar";

const isTouchDevice = () => window && "ontouchstart" in window;

const Icon = dynamic(() => import("@mdi/react").then(module => module.Icon), { ssr: false });

const customButtonTheme = {
  "color": {
    "light": "border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-amber-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
  }
};

function KanbanView({boardId}) {
  const api = useApi();
  const { mutate } = useSWRConfig();

  const [showTaskAddDialog, setShowTaskAddDialog] = useState(false);
  const [showTaskDetailsSidebar, setShowTaskDetailsSidebar] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

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
    <div className="flex h-full w-full grow relative overflow-hidden justify-between">
      <div className="flex flex-col space-y-4 p-4 overflow-auto">
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
          onAdd={() => {
            setShowTaskAddDialog(false);
            mutate((key) => new RegExp(`^.*\/boards\/${boardId}\/statuses\/[^/]+\/tasks.*$`).test(key), null);
          }}
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
                    <KanbanColumn
                      boardId={boardId}
                      status={column}
                      selectedTaskId={selectedTaskId}
                      onTaskSelect={(id) => {
                        setShowTaskDetailsSidebar(true);
                        setSelectedTaskId(id);
                      }}
                    />
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
      <div className="lg:hidden">
        <div
          className="absolute right-0 top-0 h-full w-[25rem] max-w-[90%] bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-600 z-20 transition-transform transform ease-in-out duration-300 border-l-2 border-amber-500"
          style={{transform: showTaskDetailsSidebar ? "translateX(0)" : "translateX(100%)"}}
        >
          <TaskDetailsSidebar
            taskId={selectedTaskId}
            onClose={() => {
              setShowTaskDetailsSidebar(false);
              setSelectedTaskId(null);
            }}
          />
        </div>
      </div>
      <div className="hidden lg:block">
        <div
          className={`${!showTaskDetailsSidebar && "hidden"} shrink-0 h-full w-[25rem] bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-600 z-20 transition-transform transform ease-in-out duration-300 border-l-2 border-amber-500`}
          style={{transform: showTaskDetailsSidebar ? "translateX(0)" : "translateX(100%)"}}
        >
          <TaskDetailsSidebar
            taskId={selectedTaskId}
            onClose={() => {
              setShowTaskDetailsSidebar(false);
              setSelectedTaskId(null);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function KanbanViewWrapper({boardId}) {
  return (
    <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
      <KanbanView boardId={boardId} />
    </DndProvider>
  );
}
