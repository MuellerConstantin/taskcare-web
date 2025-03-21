"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useDrag } from "react-dnd";
import { Dropdown } from "flowbite-react";
import {
  mdiDotsVertical,
  mdiClockEdit,
  mdiCalendarClock,
  mdiArrowDownBoldBox,
  mdiArrowBottomLeftBoldBox,
  mdiPauseBox,
  mdiArrowTopLeftBoldBox,
  mdiArrowUpBoldBox,
} from "@mdi/js";
import { remark } from "remark";
import strip from "strip-markdown";
import useSWR, { useSWRConfig } from "swr";
import useApi from "@/hooks/useApi";
import UserAvatar from "@/components/molecules/user/UserAvatar";
import TaskRemoveDialog from "../task/TaskRemoveDialog";

const Icon = dynamic(() => import("@mdi/react").then((module) => module.Icon), {
  ssr: false,
});

function KanbanCardMenu({ boardId, taskId }) {
  const { mutate } = useSWRConfig();

  const [showTaskRemoveDialog, setShowTaskRemoveDialog] = useState(false);

  return (
    <>
      <Dropdown
        placement="left-end"
        renderTrigger={() => (
          <button className="inline-flex items-center rounded-lg p-0 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700">
            <Icon path={mdiDotsVertical} title="Theme Toggle" size={0.75} />
          </button>
        )}
      >
        <Dropdown.Item as="a" href={`/boards/${boardId}/backlog/${taskId}`}>
          <div className="flex w-full items-center justify-between space-x-4">
            View Details
          </div>
        </Dropdown.Item>
        <Dropdown.Item as="div" onClick={() => setShowTaskRemoveDialog(true)}>
          <div className="flex w-full items-center justify-between space-x-4">
            Delete
          </div>
        </Dropdown.Item>
      </Dropdown>
      <TaskRemoveDialog
        taskId={taskId}
        show={showTaskRemoveDialog}
        onClose={() => setShowTaskRemoveDialog(false)}
        onRemove={() => {
          setShowTaskRemoveDialog(false);
          mutate(
            (key) =>
              new RegExp(
                `^.*\/boards\/${boardId}\/statuses\/[^/]+\/tasks.*$`,
              ).test(key),
            null,
          );
        }}
      />
    </>
  );
}

export default function KanbanCard({ task, selected }) {
  const api = useApi();

  const priorityIcons = {
    VERY_LOW: <Icon path={mdiArrowDownBoldBox} size={0.75} color="#0ea5e9" />,
    LOW: <Icon path={mdiArrowBottomLeftBoldBox} size={0.75} color="#38bdf8" />,
    MEDIUM: <Icon path={mdiPauseBox} size={0.75} color="#94a3b8" />,
    HIGH: <Icon path={mdiArrowTopLeftBoldBox} size={0.75} color="#fb923c" />,
    VERY_HIGH: <Icon path={mdiArrowUpBoldBox} size={0.75} color="#ea580c" />,
  };

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(
    task && task.assigneeId
      ? `/boards/${task.boardId}/members/${task.assigneeId}`
      : null,
    (url) => api.get(url).then((res) => res.data),
    { keepPreviousData: true },
  );

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useSWR(
    data ? `/users/${data.userId}` : null,
    (url) => api.get(url).then((res) => res.data),
    { keepPreviousData: true },
  );

  const [, dragRef] = useDrag(
    () => ({
      type: "KanbanCard",
      item: task,
    }),
    [task],
  );

  const markdownToPlainText = (markdown) => {
    return remark().use(strip).processSync(markdown).toString();
  };

  return (
    <div
      ref={dragRef}
      className={`flex h-[12rem] w-full space-x-2 overflow-hidden rounded-md bg-white p-2 shadow hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 ${selected ? "border-2 border-amber-500" : ""}`}
    >
      <div className="flex grow flex-col justify-between space-y-2">
        <div className="space-y-2">
          <div className="truncate font-semibold text-gray-900 dark:text-white">
            {task?.name}
          </div>
          <div className="line-clamp-3 text-sm font-normal text-gray-700 dark:text-gray-400">
            {task?.description ? (
              markdownToPlainText(task?.description)
            ) : (
              <span className="italic">No description</span>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-1 font-normal text-gray-700 dark:text-gray-400">
            {task?.priority && priorityIcons[task?.priority]}
          </div>
          <div className="flex flex-wrap items-start gap-x-2">
            <div className="flex items-center gap-1 font-normal text-gray-700 dark:text-gray-400">
              <Icon path={mdiClockEdit} size={0.5} />
              <span className="text-xs">
                {new Date(task?.updatedAt).toLocaleString()}
              </span>
            </div>
            {task?.dueDate && (
              <div className="flex items-center gap-1 font-normal text-gray-700 dark:text-gray-400">
                <Icon path={mdiCalendarClock} size={0.5} />
                <span className="text-xs">
                  {new Date(task?.dueDate).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end justify-between space-y-2">
        <div className="w-fit shrink-0 rounded-full bg-gray-100 dark:bg-gray-800">
          {task?.assigneeId && (
            <UserAvatar username={userData?.username} userId={userData?.id} />
          )}
        </div>
        <div>
          <KanbanCardMenu boardId={task?.boardId} taskId={task?.id} />
        </div>
      </div>
    </div>
  );
}
