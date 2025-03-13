"use client";

import { useState } from "react";
import { ListGroup, Button } from "flowbite-react";
import { useParams } from "next/navigation";
import useSWRInfinite from "swr/infinite";
import dynamic from "next/dynamic";
import {
  mdiArrowDownBoldBox,
  mdiArrowBottomLeftBoldBox,
  mdiPauseBox,
  mdiArrowTopLeftBoldBox,
  mdiArrowUpBoldBox
} from "@mdi/js";
import { remark } from "remark";
import strip from "strip-markdown";
import useSWR from "swr";
import useApi from "@/hooks/useApi";

const Icon = dynamic(() => import("@mdi/react").then(module => module.Icon), { ssr: false });

const customButtonTheme = {
  "color": {
    "light": "border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-amber-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
  }
};

const customListGroupTheme = {
  "item": {
    "link": {
      "active": {
        "off": "hover:bg-gray-200 focus:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500",
        "on": "bg-amber-700 text-white dark:bg-gray-800"
      },
    }
  }
};

function BacklogTaskListEntry({task, username, userId}) {
  const priorityIcons = {
    "VERY_LOW": <Icon path={mdiArrowDownBoldBox} size={0.75} color="#0ea5e9" />,
    "LOW": <Icon path={mdiArrowBottomLeftBoldBox} size={0.75} color="#38bdf8" />,
    "MEDIUM": <Icon path={mdiPauseBox} size={0.75} color="#94a3b8" />,
    "HIGH": <Icon path={mdiArrowTopLeftBoldBox} size={0.75} color="#fb923c" />,
    "VERY_HIGH": <Icon path={mdiArrowUpBoldBox} size={0.75} color="#ea580c" />,
  };

  const markdownToPlainText = (markdown) => {
    return remark().use(strip).processSync(markdown).toString();
  };

  return (
    <ListGroup.Item
      theme={customListGroupTheme["item"]}
      key={task.id}
      className="flex items-center gap-2 cursor-pointer"
      href={`/boards/${task.boardId}/backlog/${task.id}`}
    >
      <div className="flex w-full h-full justify-between">
        <div className="flex w-full h-full gap-4">
          <div className="flex items-start min-w-4 justify-center">
            {task?.priority && priorityIcons[task?.priority]}
          </div>
          <div className="flex flex-col space-y-2 overflow-hidden">
            <div className="text-start text-sm font-semibold truncate">
              {task.name}
            </div>
            <div className="text-start text-sm truncate">
              {task?.description ? markdownToPlainText(task?.description) : (<span className="italic">No description</span>)}
            </div>
          </div>
        </div>
      </div>
    </ListGroup.Item>
  );
}

export default function BacklogTaskListSidebar() {
  const api = useApi();
  const { boardId } = useParams();

  const [perPage] = useState(25);

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.content.length) return null;

    if(boardId) return `/boards/${boardId}/tasks?page=${pageIndex}&perPage=${perPage}`

    return null;
  };

  const {
    data,
    error,
    isLoading: loading,
    size,
    setSize
  } = useSWRInfinite(getKey, (url) => api.get(url).then((res) => res.data), { revalidateAll: true });

  const {
    data: membersData,
    error: membersError,
    isLoading: membersLoading
  } = useSWR(data ? data.flatMap(page => page.content).map(task => task.assigneeId && `/boards/${boardId}/members/${task.assigneeId}`) : null,
    async (urls) => {
      return await Promise.all(urls.map(url => url && api.get(url).then(res => res.data)));
    }
  , [data], { keepPreviousData: true });

  const {
    data: usersData,
    error: usersError,
    isLoading: usersLoading
  } = useSWR(membersData ? membersData.map(member => member && `/users/${member.userId}`) : null,
    async (urls) => {
      return await Promise.all(urls.map(url => url && api.get(url).then(res => res.data)));
    }
  , [membersData], { keepPreviousData: true });

  return (
    <div className="space-y-4 max-h-full max-w-full flex flex-col">
      <div className="overflow-y-auto grow">
        {loading ? (
          <ListGroup theme={customListGroupTheme}>
            {Array.from(Array(5).keys()).map((key) => (
              <ListGroup.Item
                theme={customListGroupTheme["item"]}
                key={key}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="flex flex-col space-y-1 w-full">
                  <div className="animate-pulse h-3 bg-gray-200 rounded-full dark:bg-gray-800 w-1/4" />
                  <div className="animate-pulse h-2 bg-gray-200 rounded-full dark:bg-gray-800 w-1/2" />
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : error ? (
          <ListGroup theme={customListGroupTheme}>
            {Array.from(Array(5).keys()).map((key) => (
              <ListGroup.Item
                theme={customListGroupTheme["item"]}
                key={key}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="flex flex-col space-y-1 w-full">
                  <div className="h-3 bg-red-200 rounded-full dark:bg-red-400 w-1/4" />
                  <div className="h-3 bg-red-200 rounded-full dark:bg-red-400 w-1/2" />
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <>
            {data?.length > 0 && data[0].info.totalElements > 0 ? (
              <ListGroup theme={customListGroupTheme}>
                {data.map((page, pageIndex) =>
                  page.content.map((task, taskIndex) => (
                    <BacklogTaskListEntry
                      task={task}
                      key={task.id}
                      username={usersData?.[pageIndex * perPage + taskIndex]?.username}
                      userId={usersData?.[pageIndex * perPage + taskIndex]?.id}
                    />
                  ))
                )}
              </ListGroup>
            ) : (
              <div ref={dropRef} className="text-center text-sm py-4 text-gray-500 dark:text-gray-400">
                No tasks found.
              </div>
            )}
          </>
        )}
      </div>
      {data &&data?.length > 0 && data[0].info.totalElements > 0 && (
        <div className="flex justify-center shrink-0">
          <Button
            theme={customButtonTheme}
            color="light"
            size="xs"
            onClick={() => setSize(size + 1)}
            disabled={loading || error || !data || data[data.length - 1]?.content?.length <= 0}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
