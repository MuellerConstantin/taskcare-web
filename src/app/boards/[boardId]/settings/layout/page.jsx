"use client";

import { useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { Pagination, Tooltip, Badge } from "flowbite-react";
import { useDrag, useDrop } from "react-dnd";
import {
  DndProvider,
  TouchTransition,
  MouseTransition,
} from "react-dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import dynamic from "next/dynamic";
import { mdiDrag, mdiDelete, mdiHelp } from "@mdi/js";
import useSWR from "swr";
import useApi from "@/hooks/useApi";

const Icon = dynamic(() => import("@mdi/react").then((module) => module.Icon), {
  ssr: false,
});

const customPaginationTheme = {
  layout: {
    table: {
      base: "text-xs text-gray-700 dark:text-gray-400 text-center",
      span: "font-semibold text-gray-900 dark:text-white",
    },
  },
  pages: {
    selector: {
      base: "w-12 border border-gray-300 bg-white py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
      active:
        "bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white",
    },
    previous: {
      base: "ml-0 rounded-l-lg border border-gray-300 bg-white px-2 py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
    },
    next: {
      base: "rounded-r-lg border border-gray-300 bg-white px-2 py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
    },
  },
};

function BoardStatus({ status }) {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: "BoardStatus",
      item: status,
    }),
    [],
  );

  return (
    <div
      ref={dragRef}
      style={{ opacity }}
      className="flex cursor-grab items-center space-x-2 rounded-md bg-gray-100 p-2 dark:bg-gray-800"
    >
      <div className="flex grow items-center justify-between space-x-4 overflow-hidden">
        <span className="truncate font-semibold">{status.name}</span>
        <Icon path={mdiDrag} size={1} />
      </div>
    </div>
  );
}

function BoardColumn({ status, onDelete }) {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: "BoardStatus",
      item: status,
    }),
    [],
  );

  return (
    <div
      ref={dragRef}
      style={{ opacity }}
      className="flex h-full w-[20rem] min-w-[15rem] cursor-grab rounded-md bg-gray-100 dark:bg-gray-800"
    >
      <div className="flex w-full flex-col items-start space-y-6 text-gray-900 dark:text-white">
        <div className="space-y-4 p-2">
          <div className="flex w-full items-center justify-between space-x-4">
            <span className="truncate text-sm font-semibold">
              {status.name}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => onDelete(status.id)}
                className="flex h-fit items-center justify-center"
              >
                <Icon path={mdiDelete} size={0.75} />
              </button>
              <Icon path={mdiDrag} size={0.75} />
            </div>
          </div>
          <Badge
            size="xs"
            color={
              status.category === "DONE"
                ? "green"
                : status.category === "IN_PROGRESS"
                  ? "blue"
                  : "dark"
            }
            className="w-fit"
          >
            {status.category}
          </Badge>
        </div>
        <div className="w-full grow px-4">
          <div className="h-full w-full rounded-t-md bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}

function BoardLayout({ columns: initialColumns = [] }) {
  const api = useApi();
  const { boardId } = useParams();

  const containerRef = useRef(null);
  const [columns, setColumns] = useState(initialColumns);

  const updateLayout = useCallback(
    (newColumns) => {
      setColumns(newColumns);

      api.patch(`/boards/${boardId}`, {
        columns: newColumns.map((col) => col.id),
      });
    },
    [boardId],
  );

  const [, dropRef] = useDrop(
    () => ({
      accept: ["BoardStatus", "BoardColumn"],
      drop: async (status, monitor) => {
        const clientOffset = monitor.getClientOffset();

        if (!containerRef.current || !clientOffset) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const relativeX = clientOffset.x - containerRect.left;

        let targetIndex = columns.length;
        const columnWidth = containerRect.width / columns.length;

        for (let index = 0; index < columns.length; index++) {
          if (relativeX < columnWidth * (index + 1)) {
            targetIndex = index;
            break;
          }
        }

        const filteredColumns = columns.filter((col) => col.id !== status.id);

        const newColumns = [
          ...filteredColumns.slice(0, targetIndex),
          status,
          ...filteredColumns.slice(targetIndex),
        ];

        updateLayout(newColumns);
      },
    }),
    [columns],
  );

  return (
    <div ref={containerRef} className="h-48">
      {columns?.length > 0 ? (
        <div ref={dropRef} className="flex h-full grow gap-4 overflow-x-auto">
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              status={column}
              onDelete={(id) =>
                updateLayout(columns.filter((col) => col.id !== id))
              }
            />
          ))}
        </div>
      ) : (
        <div
          ref={dropRef}
          className="h-full w-full rounded-md border border-dashed border-gray-300 p-4 text-center dark:border-gray-700"
        >
          It seems that no layout has been assigned to the board yet.
        </div>
      )}
    </div>
  );
}

function BoardSettingsLayout() {
  const api = useApi();
  const { boardId } = useParams();

  const [statusesPage, setStatusesPage] = useState(1);
  const [statusesPerPage] = useState(25);

  const {
    data: statusesData,
    error: statusesError,
    isLoading: statusesLoading,
  } = useSWR(
    boardId
      ? `/boards/${boardId}/statuses?page=${statusesPage - 1}&perPage=${statusesPerPage}`
      : null,
    (url) => api.get(url).then((res) => res.data),
  );

  const {
    data: boardData,
    error: boardError,
    isLoading: boardLoading,
  } = useSWR(boardId ? `/boards/${boardId}` : null, (url) =>
    api.get(url).then((res) => res.data),
  );

  const {
    data: columnsData,
    error: columnsError,
    isLoading: columnsLoading,
  } = useSWR(
    boardData?.columns
      ? boardData.columns.map(
          (statusId) => `/boards/${boardId}/statuses/${statusId}`,
        )
      : null,
    async (urls) => {
      return await Promise.all(
        urls.map((url) => api.get(url).then((res) => res.data)),
      );
    },
  );

  return (
    <div className="space-y-4 text-gray-900 dark:text-white">
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-semibold">Available Statuses</h3>
            <Tooltip
              content="Are you missing something? Statuses can be managed via the separate tab. The board layout can be put together using the listed statuses."
              placement="bottom"
              className="max-w-xs"
            >
              <button className="rounded-full bg-gray-100 p-0.5 dark:bg-gray-800">
                <Icon path={mdiHelp} size={0.5} />
              </button>
            </Tooltip>
          </div>
          <hr />
        </div>
        {statusesLoading ? (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from(Array(6).keys()).map((key) => (
              <li key={key}>
                <div className="h-8 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 dark:bg-gray-800" />
              </li>
            ))}
          </ul>
        ) : statusesError ? (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from(Array(6).keys()).map((key) => (
              <li key={key}>
                <div className="h-8 w-full rounded-md bg-red-200 dark:bg-gray-800 dark:bg-red-400" />
              </li>
            ))}
          </ul>
        ) : (
          <>
            {statusesData?.info.totalElements > 0 ? (
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {statusesData?.content.map((status) => (
                  <li key={status.id}>
                    <BoardStatus status={status} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="w-full text-center">
                It seems like this board has no statuses.
              </div>
            )}
          </>
        )}
        {statusesData?.info.totalElements > 0 && (
          <div className="flex justify-center">
            <Pagination
              theme={customPaginationTheme}
              layout="pagination"
              showIcons
              currentPage={statusesPage}
              totalPages={
                statusesData?.info?.totalPages
                  ? statusesData.info.totalPages
                  : 1
              }
              onPageChange={setStatusesPage}
              className="hidden md:block"
            />
            <Pagination
              theme={customPaginationTheme}
              layout="table"
              showIcons
              currentPage={statusesPage}
              totalPages={
                statusesData?.info?.totalPages
                  ? statusesData.info.totalPages
                  : 1
              }
              onPageChange={setStatusesPage}
              className="block md:hidden"
            />
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">Board Layout</h3>
            <Tooltip
              content="Define the board layout by dragging and dropping new statuses into the layout or rearranging existing columns."
              placement="bottom"
              className="max-w-xs"
            >
              <button className="rounded-full bg-gray-100 p-0.5 dark:bg-gray-800">
                <Icon path={mdiHelp} size={0.5} />
              </button>
            </Tooltip>
          </div>
          <hr />
        </div>
        <div className="flex h-full grow flex-col">
          {boardLoading || columnsLoading ? (
            <div className="flex h-full grow gap-4 overflow-x-auto">
              {Array.from(Array(4).keys()).map((key) => (
                <div key={key}>
                  <div className="flex h-32 w-[20rem] animate-pulse rounded-md bg-gray-100 dark:bg-gray-800" />
                </div>
              ))}
            </div>
          ) : boardError || columnsError ? (
            <div className="flex h-full grow gap-4 overflow-x-auto">
              {Array.from(Array(4).keys()).map((key) => (
                <div key={key}>
                  <div className="flex h-32 w-[20rem] rounded-md bg-red-200 dark:bg-red-400" />
                </div>
              ))}
            </div>
          ) : (
            <BoardLayout columns={columnsData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function BoardSettingsLayoutWrapper() {
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
      <BoardSettingsLayout />
    </DndProvider>
  );
}
