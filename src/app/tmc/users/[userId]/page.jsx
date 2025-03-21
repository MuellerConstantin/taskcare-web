"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Accordion, Table, Pagination, Avatar } from "flowbite-react";
import useSWR from "swr";
import UserAvatar from "@/components/molecules/user/UserAvatar";
import useApi from "@/hooks/useApi";

const customAccordionTheme = {
  title: {
    base: "flex w-full items-center justify-between py-2 px-0 text-left font-medium text-gray-500 first:rounded-t-lg last:rounded-b-lg dark:text-gray-400",
    open: {
      off: "",
      on: "text-gray-900 dark:text-white",
    },
  },
  content: {
    base: "py-2 px-0 first:rounded-t-lg last:rounded-b-lg dark:bg-gray-900",
  },
};

const customTableTheme = {
  root: {
    shadow: "",
  },
  head: {
    cell: {
      base: "bg-gray-50 px-6 py-3 dark:bg-gray-700",
    },
  },
};

export default function TmcUserInfo() {
  const { userId } = useParams();
  const api = useApi();

  const [page, setPage] = useState(1);
  const [perPage] = useState(25);

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(userId ? `/users/${userId}` : null, (url) =>
    api.get(url).then((res) => res.data),
  );

  const {
    data: boardData,
    error: boardError,
    isLoading: boardLoading,
  } = useSWR(
    userId
      ? `/users/${userId}/boards?page=${page - 1}&perPage=${perPage}`
      : null,
    (url) => api.get(url).then((res) => res.data),
  );

  return (
    <div className="flex h-full w-full flex-col space-y-4 lg:flex-row lg:space-y-0">
      <div className="flex flex-col items-center lg:w-[20%] lg:grow lg:pr-4">
        <UserAvatar size="xl" username={data?.username} userId={userId} />
        {loading ? (
          <div className="mt-4 h-3 w-1/2 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
        ) : error ? (
          <div className="mt-4 h-3 w-1/2 rounded-full bg-red-200 dark:bg-red-400" />
        ) : (
          <div className="mt-4 w-full truncate text-center text-lg font-semibold text-gray-900 dark:text-white">
            {data?.username}
          </div>
        )}
      </div>
      <div className="flex flex-col lg:w-[80%] lg:grow">
        <Accordion flush>
          <Accordion.Panel>
            <Accordion.Title theme={customAccordionTheme.title}>
              Overview
            </Accordion.Title>
            <Accordion.Content theme={customAccordionTheme.content}>
              {loading ? (
                <div className="max-w-sm">
                  <div className="flex items-center justify-between">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Username:
                    </span>
                    <div className="h-2.5 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Display Name:
                    </span>
                    <div className="h-2.5 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Identity Provider:
                    </span>
                    <div className="h-2.5 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Role:
                    </span>
                    <div className="h-2.5 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                  </div>
                </div>
              ) : error ? (
                <div className="max-w-sm">
                  <div className="flex items-center justify-between">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Username:
                    </span>
                    <div className="h-2.5 w-32 rounded-full bg-red-200 dark:bg-red-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Display Name:
                    </span>
                    <div className="h-2.5 w-32 rounded-full bg-red-200 dark:bg-red-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Identity Provider:
                    </span>
                    <div className="h-2.5 w-32 rounded-full bg-red-200 dark:bg-red-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Role:
                    </span>
                    <div className="h-2.5 w-32 rounded-full bg-red-200 dark:bg-red-400" />
                  </div>
                </div>
              ) : (
                <div className="max-w-sm">
                  <div className="flex justify-between">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Username:
                    </span>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      {data?.username}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Display Name:
                    </span>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      {data?.displayName || "-"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Identity Provider:
                    </span>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      {data?.identityProvider}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Role:
                    </span>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      {data?.role}
                    </p>
                  </div>
                </div>
              )}
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title theme={customAccordionTheme.title}>
              Boards
            </Accordion.Title>
            <Accordion.Content theme={customAccordionTheme.content}>
              <div className="relative w-full overflow-x-auto border border-gray-200 dark:border-gray-700">
                <Table theme={customTableTheme} hoverable>
                  <Table.Head>
                    <Table.HeadCell>ID</Table.HeadCell>
                    <Table.HeadCell>Name</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {boardLoading
                      ? Array.from(Array(10).keys()).map((key) => (
                          <Table.Row
                            key={key}
                            className="animate-pulse bg-white dark:border-gray-700 dark:bg-gray-800"
                          >
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                              <div className="h-2.5 w-36 rounded-full bg-gray-200 dark:bg-gray-800" />
                            </Table.Cell>
                            <Table.Cell>
                              <div className="h-2.5 w-36 rounded-full bg-gray-200 dark:bg-gray-800" />
                            </Table.Cell>
                          </Table.Row>
                        ))
                      : boardError
                        ? Array.from(Array(10).keys()).map((key) => (
                            <Table.Row
                              key={key}
                              className="bg-white dark:border-gray-700 dark:bg-gray-800"
                            >
                              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                <div className="h-2.5 w-36 rounded-full bg-red-200 dark:bg-red-400" />
                              </Table.Cell>
                              <Table.Cell>
                                <div className="h-2.5 w-36 rounded-full bg-red-200 dark:bg-red-400" />
                              </Table.Cell>
                            </Table.Row>
                          ))
                        : boardData?.content.map((board, index) => (
                            <Table.Row
                              className="bg-white dark:border-gray-700 dark:bg-gray-800"
                              key={board.id}
                            >
                              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                <a
                                  className="hover:cursor-pointer hover:text-amber-500 hover:underline"
                                  href={`/tmc/boards/${board.id}`}
                                >
                                  {board.id}
                                </a>
                              </Table.Cell>
                              <Table.Cell className="whitespace-nowrap">
                                <div className="line-clamp-3 min-w-[10rem] max-w-[20rem]">
                                  {board.name}
                                </div>
                              </Table.Cell>
                            </Table.Row>
                          ))}
                  </Table.Body>
                </Table>
              </div>
              <div className="mt-4 flex justify-center">
                <Pagination
                  layout="table"
                  showIcons
                  currentPage={page}
                  totalPages={
                    boardData?.info?.totalPages ? boardData.info.totalPages : 1
                  }
                  onPageChange={setPage}
                />
              </div>
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion>
      </div>
    </div>
  );
}
