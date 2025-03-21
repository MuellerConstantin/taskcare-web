"use client";

import { useState, useCallback } from "react";
import { Accordion, Button, ListGroup, Badge, Avatar } from "flowbite-react";
import { useParams } from "next/navigation";
import { useDrag, useDrop } from "react-dnd";
import {
  DndProvider,
  TouchTransition,
  MouseTransition,
} from "react-dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import useSWRInfinite from "swr/infinite";
import useSWR, { useSWRConfig } from "swr";
import dynamic from "next/dynamic";
import {
  mdiPlus,
  mdiClockEdit,
  mdiCalendarClock,
  mdiArrowDownBoldBox,
  mdiArrowBottomLeftBoldBox,
  mdiPauseBox,
  mdiArrowTopLeftBoldBox,
  mdiArrowUpBoldBox,
} from "@mdi/js";
import Image from "next/image";
import useApi from "@/hooks/useApi";
import TaskAddDialog from "@/components/organisms/task/TaskAddDialog";

const Icon = dynamic(() => import("@mdi/react").then((module) => module.Icon), {
  ssr: false,
});

const customButtonTheme = {
  color: {
    light:
      "border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-amber-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
  },
};

const customListGroupTheme = {
  item: {
    link: {
      active: {
        off: "hover:bg-gray-200 focus:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500",
        on: "bg-amber-700 text-white dark:bg-gray-800",
      },
    },
  },
};

const customAccordionTheme = {
  title: {
    base: "flex w-full items-center justify-between py-4 px-0 text-left font-medium text-gray-500 first:rounded-t-lg last:rounded-b-lg dark:text-gray-400",
    open: {
      off: "",
      on: "text-gray-900 dark:text-white",
    },
  },
  content: {
    base: "py-2 px-0 first:rounded-t-lg last:rounded-b-lg dark:bg-gray-900",
  },
};

function BacklogAvatar({ username, userId }) {
  const api = useApi();

  const { data, isLoading: loading } = useSWR(
    userId ? `/users/${userId}/profile-image` : null,
    (url) =>
      api
        .get(url, { responseType: "arraybuffer" })
        .then((res) =>
          URL.createObjectURL(
            new Blob([res.data], { type: res.headers["content-type"] }),
          ),
        ),
  );

  if (loading || !username) {
    return (
      <div className="animate-pulse">
        <Avatar size="sm" rounded />
      </div>
    );
  } else {
    if (data) {
      return (
        <Avatar
          size="sm"
          className="rounded-full bg-gray-200 dark:bg-gray-900"
          rounded
          img={({ className, ...props }) => (
            <Image
              src={data}
              alt={username}
              width={64}
              height={64}
              className={`${className} object-cover`}
              {...props}
            />
          )}
        />
      );
    } else {
      return (
        <Avatar
          size="sm"
          placeholderInitials={username.slice(0, 2).toUpperCase()}
          rounded
        />
      );
    }
  }
}

function BacklogEntry({ task, username, userId }) {
  const priorityIcons = {
    VERY_LOW: <Icon path={mdiArrowDownBoldBox} size={0.75} color="#0ea5e9" />,
    LOW: <Icon path={mdiArrowBottomLeftBoldBox} size={0.75} color="#38bdf8" />,
    MEDIUM: <Icon path={mdiPauseBox} size={0.75} color="#94a3b8" />,
    HIGH: <Icon path={mdiArrowTopLeftBoldBox} size={0.75} color="#fb923c" />,
    VERY_HIGH: <Icon path={mdiArrowUpBoldBox} size={0.75} color="#ea580c" />,
  };

  const [, dragRef] = useDrag(
    () => ({
      type: "BacklogEntry",
      item: task,
    }),
    [task],
  );

  return (
    <ListGroup.Item
      ref={dragRef}
      theme={customListGroupTheme["item"]}
      key={task.id}
      className="flex cursor-pointer items-center gap-2"
      href={`/boards/${task.boardId}/backlog/${task.id}`}
    >
      <div className="flex h-full w-full justify-between gap-4">
        <div className="flex h-full w-full gap-4">
          <div className="flex min-w-4 items-start justify-center">
            {task?.priority && priorityIcons[task?.priority]}
          </div>
          <div className="flex flex-col space-y-2">
            <div className="truncate text-start text-sm font-semibold">
              {task.name}
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 font-normal text-gray-700 dark:text-gray-400">
                <Icon path={mdiClockEdit} size={0.5} />
                <span className="text-xs">
                  {new Date(task?.updatedAt).toLocaleString()}
                </span>
              </div>
              {task?.dueDate && (
                <>
                  <div className="mx-2 h-2/3 w-[1px] border-l-2"></div>
                  <div className="flex items-center gap-1 font-normal text-gray-700 dark:text-gray-400">
                    <Icon path={mdiCalendarClock} size={0.5} />
                    <span className="text-xs">
                      {new Date(task?.dueDate).toLocaleString()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {task?.assigneeId && (
          <div className="flex items-center">
            <BacklogAvatar username={username} userId={userId} />
          </div>
        )}
      </div>
    </ListGroup.Item>
  );
}

function BacklogSection({ boardId, statusId }) {
  const api = useApi();
  const { mutate, cache } = useSWRConfig();

  const [perPage] = useState(25);

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.content.length) return null;

    if (statusId)
      return `/boards/${boardId}/statuses/${statusId}/tasks?page=${pageIndex}&perPage=${perPage}`;

    return `/boards/${boardId}/tasks/no-status?page=${pageIndex}&perPage=${perPage}`;
  };

  const {
    data: data,
    error: error,
    isLoading: loading,
    size,
    setSize,
  } = useSWRInfinite(getKey, (url) => api.get(url).then((res) => res.data), {
    revalidateAll: true,
  });

  const {
    data: membersData,
    error: membersError,
    isLoading: membersLoading,
  } = useSWR(
    data
      ? data
          .flatMap((page) => page.content)
          .map(
            (task) =>
              task.assigneeId &&
              `/boards/${boardId}/members/${task.assigneeId}`,
          )
      : null,
    async (urls) => {
      return await Promise.all(
        urls.map((url) => url && api.get(url).then((res) => res.data)),
      );
    },
    [data],
    { keepPreviousData: true },
  );

  const {
    data: usersData,
    error: usersError,
    isLoading: usersLoading,
  } = useSWR(
    membersData
      ? membersData.map((member) => member && `/users/${member.userId}`)
      : null,
    async (urls) => {
      return await Promise.all(
        urls.map((url) => url && api.get(url).then((res) => res.data)),
      );
    },
    [membersData],
    { keepPreviousData: true },
  );

  const updateStatus = useCallback(
    (taskId, statusId) => {
      api
        .patch(`/tasks/${taskId}`, {
          statusId: statusId,
        })
        .then(() => {
          cache.keys().forEach((key) => {
            let matchs = false;

            if (Array.isArray(key)) {
              matchs =
                key.some((key) =>
                  new RegExp(
                    `^\\$inf\\$\\/boards\\/${boardId}\\/statuses\\/[^/]+\\/tasks.*$`,
                  ).test(key),
                ) ||
                key.some((key) =>
                  new RegExp(
                    `^\\$inf\\$\\/boards\\/${boardId}\\/tasks\\/no-status.*$`,
                  ).test(key),
                );
            } else {
              matchs =
                new RegExp(
                  `^\\$inf\\$\\/boards\\/${boardId}\\/statuses\\/[^/]+\\/tasks.*$`,
                ).test(key) ||
                new RegExp(
                  `^\\$inf\\$\\/boards\\/${boardId}\\/tasks\\/no-status.*$`,
                ).test(key);
            }

            if (matchs) {
              mutate(key, null);
            }
          });
        })
        .then(() =>
          mutate(
            (key) =>
              new RegExp(
                `^\\/boards\\/${boardId}\\/statuses\\/[^/]+\\/tasks.*$`,
              ).test(key),
            null,
          ),
        )
        .then(() =>
          mutate(
            (key) =>
              new RegExp(`^\\/boards\\/${boardId}\\/tasks\\/no-status.*$`).test(
                key,
              ),
            null,
          ),
        );
    },
    [boardId],
  );

  const [, dropRef] = useDrop(
    () => ({
      accept: ["BacklogEntry"],
      drop: async (task, monitor) => {
        updateStatus(task.id, statusId);
      },
    }),
    [statusId],
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        {loading ? (
          <ListGroup theme={customListGroupTheme}>
            {Array.from(Array(5).keys()).map((key) => (
              <ListGroup.Item
                theme={customListGroupTheme["item"]}
                key={key}
                className="flex cursor-pointer items-center gap-2"
              >
                <div className="flex w-full flex-col space-y-1">
                  <div className="h-3 w-1/4 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="h-2 w-1/2 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
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
                className="flex cursor-pointer items-center gap-2"
              >
                <div className="flex w-full flex-col space-y-1">
                  <div className="h-3 w-1/4 rounded-full bg-red-200 dark:bg-red-400" />
                  <div className="h-3 w-1/2 rounded-full bg-red-200 dark:bg-red-400" />
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <>
            {data?.length > 0 && data[0].info.totalElements > 0 ? (
              <ListGroup ref={dropRef} theme={customListGroupTheme}>
                {data.map((page, pageIndex) =>
                  page.content.map((task, taskIndex) => (
                    <BacklogEntry
                      task={task}
                      key={task.id}
                      username={
                        usersData?.[pageIndex * perPage + taskIndex]?.username
                      }
                      userId={usersData?.[pageIndex * perPage + taskIndex]?.id}
                    />
                  )),
                )}
              </ListGroup>
            ) : (
              <div
                ref={dropRef}
                className="py-4 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                No tasks found.
              </div>
            )}
          </>
        )}
      </div>
      {data && data?.length > 0 && data[0].info.totalElements > 0 && (
        <div className="flex justify-center">
          <Button
            theme={customButtonTheme}
            color="light"
            size="xs"
            onClick={() => setSize(size + 1)}
            disabled={
              loading ||
              error ||
              !data ||
              data[data.length - 1]?.content?.length <= 0
            }
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

function BoardBacklog() {
  const api = useApi();
  const { boardId } = useParams();
  const { mutate, cache } = useSWRConfig();

  const [statusesPerPage] = useState(25);
  const [showTaskAddDialog, setShowTaskAddDialog] = useState(false);

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.content.length) return null;
    return `/boards/${boardId}/statuses?page=${pageIndex}&perPage=${statusesPerPage}`;
  };

  const {
    data: statusesData,
    error: statusesError,
    isLoading: statusesLoading,
    size,
    setSize,
  } = useSWRInfinite(getKey, (url) => api.get(url).then((res) => res.data));

  const {
    data: statusMetaData,
    error: statusMetaDataError,
    isLoading: statusMetaDataLoading,
  } = useSWR(
    statusesData
      ? statusesData
          .flatMap((page) => page.content)
          .map(
            (status) =>
              `/boards/${boardId}/statuses/${status.id}/tasks?page=0&perPage=0`,
          )
      : null,
    async (urls) => {
      return await Promise.all(
        urls.map((url) => api.get(url).then((res) => res.data)),
      );
    },
  );

  const {
    data: backlogMetaData,
    error: backlogMetaDataError,
    isLoading: backlogMetaDataLoading,
  } = useSWR(`/boards/${boardId}/tasks/no-status`, (url) =>
    api.get(url).then((res) => res.data),
  );

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl grow flex-col space-y-4 p-4">
      <div>
        <Button
          theme={customButtonTheme}
          color="light"
          size="xs"
          disabled={statusesLoading || statusesError}
          onClick={() => setShowTaskAddDialog(true)}
        >
          <div className="flex items-center justify-center space-x-2">
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

          cache.keys().forEach((key) => {
            let matchs = false;

            if (Array.isArray(key)) {
              matchs =
                key.some((key) =>
                  new RegExp(
                    `^\\$inf\\$\\/boards\\/${boardId}\\/statuses\\/[^/]+\\/tasks.*$`,
                  ).test(key),
                ) ||
                key.some((key) =>
                  new RegExp(
                    `^\\$inf\\$\\/boards\\/${boardId}\\/tasks\\/no-status.*$`,
                  ).test(key),
                );
            } else {
              matchs =
                new RegExp(
                  `^\\$inf\\$\\/boards\\/${boardId}\\/statuses\\/[^/]+\\/tasks.*$`,
                ).test(key) ||
                new RegExp(
                  `^\\$inf\\$\\/boards\\/${boardId}\\/tasks\\/no-status.*$`,
                ).test(key);
            }

            if (matchs) {
              mutate(key, null);
            }
          });

          mutate(
            (key) =>
              new RegExp(
                `^\\/boards\\/${boardId}\\/statuses\\/[^/]+\\/tasks.*$`,
              ).test(key),
            null,
          );
          mutate(
            (key) =>
              new RegExp(`^\\/boards\\/${boardId}\\/tasks\\/no-status.*$`).test(
                key,
              ),
            null,
          );
        }}
      />
      <Accordion flush alwaysOpen>
        <Accordion.Panel>
          <Accordion.Title theme={customAccordionTheme.title}>
            <div className="flex items-center space-x-4">
              <span className="font-semibold italic">Unsorted Tasks</span>
              <Badge color="light" size="xs">
                {backlogMetaData?.info.totalElements} Task(s)
              </Badge>
            </div>
          </Accordion.Title>
          <Accordion.Content theme={customAccordionTheme.content}>
            <div className="bg-gray-100 p-2 dark:bg-gray-800">
              <BacklogSection boardId={boardId} statusId={null} />
            </div>
          </Accordion.Content>
        </Accordion.Panel>
        {statusesLoading
          ? Array.from(Array(6).keys()).map((key) => (
              <Accordion.Panel key={key}>
                <Accordion.Title disabled theme={customAccordionTheme.title}>
                  <div className="h-3 w-64 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                </Accordion.Title>
              </Accordion.Panel>
            ))
          : statusesError
            ? Array.from(Array(6).keys()).map((key) => (
                <Accordion.Panel key={key}>
                  <Accordion.Title disabled theme={customAccordionTheme.title}>
                    <div className="h-3 w-64 rounded-full bg-red-200 dark:bg-red-400" />
                  </Accordion.Title>
                </Accordion.Panel>
              ))
            : statusesData?.map((page, pageIndex) =>
                page.content.map((status, statusIndex) => (
                  <Accordion.Panel key={status.id}>
                    <Accordion.Title theme={customAccordionTheme.title}>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold">{status.name}</span>
                        <Badge color="light" size="xs">
                          {
                            statusMetaData?.[
                              pageIndex * statusesPerPage + statusIndex
                            ]?.info.totalElements
                          }{" "}
                          Task(s)
                        </Badge>
                      </div>
                    </Accordion.Title>
                    <Accordion.Content theme={customAccordionTheme.content}>
                      <div className="bg-gray-100 p-2 dark:bg-gray-800">
                        <BacklogSection
                          boardId={boardId}
                          statusId={status.id}
                        />
                      </div>
                    </Accordion.Content>
                  </Accordion.Panel>
                )),
              )}
      </Accordion>
      <div className="flex justify-center">
        <Button
          theme={customButtonTheme}
          color="light"
          size="xs"
          onClick={() => setSize(size + 1)}
          disabled={
            statusesLoading ||
            statusesError ||
            !statusesData ||
            statusesData[statusesData.length - 1]?.content?.length <= 0
          }
        >
          Load More
        </Button>
      </div>
    </div>
  );
}

export default function BoardBacklogWrapper() {
  const HTML5toTouch = {
    backends: [
      {
        id: "html5",
        backend: HTML5Backend,
        transition: MouseTransition,
      },
      {
        id: "touch",
        backend: TouchBackend,
        options: { enableMouseEvents: true },
        preview: true,
        transition: TouchTransition,
      },
    ],
  };

  return (
    <DndProvider options={HTML5toTouch}>
      <BoardBacklog />
    </DndProvider>
  );
}
