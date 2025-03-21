"use client";

import { useState, useMemo } from "react";
import { Button } from "flowbite-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  mdiPencil,
  mdiDelete,
  mdiArrowDownBoldBox,
  mdiArrowBottomLeftBoldBox,
  mdiPauseBox,
  mdiArrowTopLeftBoldBox,
  mdiArrowUpBoldBox,
} from "@mdi/js";
import useSWR from "swr";
import useApi from "@/hooks/useApi";
import UserAvatar from "@/components/molecules/user/UserAvatar";
import TaskRemoveDialog from "@/components/organisms/task/TaskRemoveDialog";
import TaskEditDialog from "@/components/organisms/task/TaskEditDialog";

const Icon = dynamic(() => import("@mdi/react").then((module) => module.Icon), {
  ssr: false,
});

const customButtonTheme = {
  color: {
    light:
      "border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-amber-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
  },
};

export default function BoardBacklogTask() {
  const api = useApi();
  const { taskId } = useParams();
  const router = useRouter();

  const priorityIcons = {
    VERY_LOW: <Icon path={mdiArrowDownBoldBox} size={0.75} color="#0ea5e9" />,
    LOW: <Icon path={mdiArrowBottomLeftBoldBox} size={0.75} color="#38bdf8" />,
    MEDIUM: <Icon path={mdiPauseBox} size={0.75} color="#94a3b8" />,
    HIGH: <Icon path={mdiArrowTopLeftBoldBox} size={0.75} color="#fb923c" />,
    VERY_HIGH: <Icon path={mdiArrowUpBoldBox} size={0.75} color="#ea580c" />,
  };

  const priorityLabels = {
    VERY_LOW: "Very Low",
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    VERY_HIGH: "Very High",
  };

  const [showTaskRemoveDialog, setShowTaskRemoveDialog] = useState(false);
  const [showTaskEditDialog, setShowTaskEditDialog] = useState(false);

  const {
    data,
    error,
    isLoading: loading,
    mutate,
  } = useSWR(taskId ? `/tasks/${taskId}` : null, (url) =>
    api.get(url).then((res) => res.data),
  );

  const {
    data: statusData,
    error: statusError,
    isLoading: statusLoading,
  } = useSWR(
    data && data.statusId
      ? `/boards/${data.boardId}/statuses/${data.statusId}`
      : null,
    (url) => api.get(url).then((res) => res.data),
    [data],
  );

  const {
    data: componentsData,
    error: componentsError,
    isLoading: componentsLoading,
  } = useSWR(
    data?.componentIds
      ? data.componentIds.map(
          (componentId) => `/boards/${data.boardId}/components/${componentId}`,
        )
      : null,
    async (urls) => {
      return await Promise.all(
        urls.map((url) => api.get(url).then((res) => res.data)),
      );
    },
    [data],
  );

  const {
    data: assigneeData,
    error: assigneeError,
    isLoading: assigneeLoading,
  } = useSWR(
    data && data.assigneeId
      ? `/boards/${data.boardId}/members/${data.assigneeId}`
      : null,
    (url) => api.get(url).then((res) => res.data),
    [data],
  );

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useSWR(
    assigneeData ? `/users/${assigneeData.userId}` : null,
    (url) => api.get(url).then((res) => res.data),
    [assigneeData],
  );

  const [showAllComponents, setShowAllComponents] = useState(false);

  const visibleComponents = useMemo(() => {
    if (showAllComponents) {
      return componentsData;
    } else {
      return componentsData?.slice(0, 3);
    }
  }, [componentsData, showAllComponents]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between space-x-4">
        <div className="overflow-hidden">
          <h1 className="truncate text-xl font-semibold">{data?.name}</h1>
        </div>
        <div className="shrink-0">
          <Button.Group>
            <Button
              theme={customButtonTheme}
              color="light"
              size="xs"
              disabled={loading || error}
              onClick={() => setShowTaskEditDialog(true)}
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon path={mdiPencil} size={0.75} />
                <span>Edit</span>
              </div>
            </Button>
            <Button
              theme={customButtonTheme}
              color="light"
              size="xs"
              disabled={loading || error}
              onClick={() => setShowTaskRemoveDialog(true)}
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon path={mdiDelete} size={0.75} />
                <span>Remove</span>
              </div>
            </Button>
          </Button.Group>
        </div>
      </div>
      <TaskRemoveDialog
        show={showTaskRemoveDialog}
        onClose={() => setShowTaskRemoveDialog(false)}
        onRemove={() => {
          setShowTaskRemoveDialog(false);
          router.push(`/boards/${data.boardId}/backlog`);
        }}
        taskId={taskId}
      />
      <TaskEditDialog
        show={showTaskEditDialog}
        onClose={() => setShowTaskEditDialog(false)}
        taskId={taskId}
        onEdit={() => {
          setShowTaskEditDialog(false);
          mutate(null);
        }}
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="font-semibold text-gray-900 dark:text-white">
            Details
          </div>
          <hr />
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <div className="text-gray-500 dark:text-gray-400">Status:</div>
            <div className="my-auto overflow-hidden">
              {loading ? (
                <div>
                  <div className="h-3 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                </div>
              ) : error ? (
                <div>
                  <div className="h-3 w-48 rounded-full bg-red-200 dark:bg-red-400" />
                </div>
              ) : (
                <>
                  {data?.statusId ? (
                    <div className="truncate text-gray-900 dark:text-white">
                      {statusData?.name}
                    </div>
                  ) : (
                    <div className="text-gray-900 dark:text-white">-</div>
                  )}
                </>
              )}
            </div>
            <div className="text-gray-500 dark:text-gray-400">Priority:</div>
            <div className="my-auto overflow-hidden">
              {loading ? (
                <div>
                  <div className="h-3 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                </div>
              ) : error ? (
                <div>
                  <div className="h-3 w-48 rounded-full bg-red-200 dark:bg-red-400" />
                </div>
              ) : (
                <>
                  {data?.priority ? (
                    <div className="flex items-center space-x-1">
                      <div>
                        {data.priority && priorityIcons[data?.priority]}
                      </div>
                      <div className="truncate text-sm text-gray-900 dark:text-white">
                        ({data.priority && priorityLabels[data?.priority]})
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-900 dark:text-white">-</div>
                  )}
                </>
              )}
            </div>
            <div className="text-gray-500 dark:text-gray-400">Created At:</div>
            <div className="my-auto overflow-hidden">
              {loading ? (
                <div>
                  <div className="h-3 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                </div>
              ) : error ? (
                <div>
                  <div className="h-3 w-48 rounded-full bg-red-200 dark:bg-red-400" />
                </div>
              ) : (
                <>
                  {data?.createdAt ? (
                    <div className="truncate text-gray-900 dark:text-white">
                      {new Date(data.createdAt).toLocaleString()}
                    </div>
                  ) : (
                    <div className="text-gray-900 dark:text-white">-</div>
                  )}
                </>
              )}
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              Last Updated At:
            </div>
            <div className="my-auto overflow-hidden">
              {loading ? (
                <div>
                  <div className="h-3 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                </div>
              ) : error ? (
                <div>
                  <div className="h-3 w-48 rounded-full bg-red-200 dark:bg-red-400" />
                </div>
              ) : (
                <>
                  {data?.updatedAt ? (
                    <div className="truncate text-gray-900 dark:text-white">
                      {new Date(data.updatedAt).toLocaleString()}
                    </div>
                  ) : (
                    <div className="text-gray-900 dark:text-white">-</div>
                  )}
                </>
              )}
            </div>
            <div className="text-gray-500 dark:text-gray-400">Due On:</div>
            <div className="my-auto overflow-hidden">
              {loading ? (
                <div>
                  <div className="h-3 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                </div>
              ) : error ? (
                <div>
                  <div className="h-3 w-48 rounded-full bg-red-200 dark:bg-red-400" />
                </div>
              ) : (
                <>
                  {data?.dueDate ? (
                    <div
                      className={`truncate ${
                        new Date(data.dueDate) < new Date() &&
                        statusData?.category !== "DONE"
                          ? "text-red-500 dark:text-red-500"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {new Date(data.dueDate).toLocaleString()}
                    </div>
                  ) : (
                    <div className="text-gray-900 dark:text-white">-</div>
                  )}
                </>
              )}
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              Component(s):
            </div>
            <div className="my-auto overflow-hidden">
              {loading || componentsLoading ? (
                <div>
                  <div className="h-3 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                </div>
              ) : error || componentsError ? (
                <div>
                  <div className="h-3 w-48 rounded-full bg-red-200 dark:bg-red-400" />
                </div>
              ) : (
                <>
                  {visibleComponents && visibleComponents.length > 0 ? (
                    <div className="overflow-hidden text-gray-900 dark:text-white">
                      {visibleComponents.map((component) => (
                        <div key={component.id} className="truncate">
                          {component.name}
                        </div>
                      ))}
                      {componentsData.length > 3 && (
                        <button
                          onClick={() =>
                            setShowAllComponents(!showAllComponents)
                          }
                          className="text-xs text-amber-500 hover:underline"
                        >
                          {showAllComponents ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-900 dark:text-white">-</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="font-semibold text-gray-900 dark:text-white">
            Persons
          </div>
          <hr />
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <div className="text-gray-500 dark:text-gray-400">Assignee:</div>
            <div className="my-auto overflow-hidden">
              {loading ? (
                <div>
                  <div className="h-3 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                </div>
              ) : error ? (
                <div>
                  <div className="h-3 w-48 rounded-full bg-red-200 dark:bg-red-400" />
                </div>
              ) : (
                <>
                  {data?.assigneeId ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-fit rounded-full bg-gray-100 dark:bg-gray-800">
                        <UserAvatar
                          size="xs"
                          username={userData?.username}
                          userId={assigneeData?.userId}
                        />
                      </div>
                      <div className="truncate text-gray-900 dark:text-white">
                        {userData?.displayName || userData?.username}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-900 dark:text-white">-</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-2 lg:col-span-2">
          <div className="font-semibold text-gray-900 dark:text-white">
            Description
          </div>
          <hr />
          {loading ? (
            <div>
              <div className="h-3 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
          ) : error ? (
            <div>
              <div className="h-3 w-48 rounded-full bg-red-200 dark:bg-red-400" />
            </div>
          ) : (
            <div className="max-h-[20rem] overflow-y-auto">
              {data?.description ? (
                <div className="prose-sm dark:prose-invert md:prose">
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {data.description}
                  </Markdown>
                </div>
              ) : (
                <div className="text-gray-900 dark:text-white">-</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
