"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  mdiClose,
  mdiArrowDownBoldBox,
  mdiArrowBottomLeftBoldBox,
  mdiPauseBox,
  mdiArrowTopLeftBoldBox,
  mdiArrowUpBoldBox,
} from "@mdi/js";
import useSWR from "swr";
import UserAvatar from "@/components/molecules/user/UserAvatar";
import useApi from "@/hooks/useApi";

const Icon = dynamic(() => import("@mdi/react").then((module) => module.Icon), {
  ssr: false,
});

export default function TaskDetailsSidebar({ taskId, onClose }) {
  const api = useApi();

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

  const {
    data,
    error,
    isLoading: loading,
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
    <div className="flex h-full flex-col space-y-4 overflow-y-auto p-4">
      <div className="flex items-center justify-between space-x-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">
          Task Details
        </h2>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 hover:dark:text-white"
        >
          <Icon path={mdiClose} size={0.75} />
        </button>
      </div>
      <div>
        {loading ? (
          <div>
            <div className="h-4 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
        ) : error ? (
          <div>
            <div className="h-4 w-48 rounded-full bg-red-200 dark:bg-red-400" />
          </div>
        ) : (
          <a href={`/boards/${data?.boardId}/backlog/${data?.id}`}>
            <h3 className="truncate text-amber-500 hover:underline">
              {data?.name}
            </h3>
          </a>
        )}
      </div>
      <div className="space-y-4">
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
        <div className="space-y-2">
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
