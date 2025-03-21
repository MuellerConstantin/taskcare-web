"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Accordion, Table, Pagination } from "flowbite-react";
import useSWR from "swr";
import BoardLogo from "@/components/molecules/board/BoardLogo";
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

export default function TmcBoardInfo() {
  const { boardId } = useParams();
  const api = useApi();

  const [page, setPage] = useState(1);
  const [perPage] = useState(25);

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(boardId ? `/boards/${boardId}` : null, (url) =>
    api.get(url).then((res) => res.data),
  );

  const {
    data: memberData,
    error: memberError,
    isLoading: memberLoading,
  } = useSWR(
    boardId
      ? `/boards/${boardId}/members?page=${page - 1}&perPage=${perPage}`
      : null,
    (url) => api.get(url).then((res) => res.data),
  );

  return (
    <div className="flex h-full w-full flex-col space-y-4 lg:flex-row lg:space-y-0">
      <div className="flex flex-col items-center lg:w-[20%] lg:grow lg:pr-4">
        <BoardLogo boardId={boardId} className="h-32 w-32 rounded-full" />
        {loading ? (
          <div className="mt-4 h-3 w-1/2 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
        ) : error ? (
          <div className="mt-4 h-3 w-1/2 rounded-full bg-red-200 dark:bg-red-400" />
        ) : (
          <div className="mt-4 w-full truncate text-center text-lg font-semibold text-gray-900 dark:text-white">
            {data?.name}
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
                <div>
                  <div className="space-y-2">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Name:
                    </span>
                    <div className="h-2.5 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                  </div>
                  <div className="space-y-2">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Description:
                    </span>
                    <div className="h-2.5 w-64 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                    <div className="h-2.5 w-64 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                    <div className="h-2.5 w-64 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                  </div>
                </div>
              ) : error ? (
                <div>
                  <div className="space-y-2">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Name:
                    </span>
                    <div className="h-2.5 w-32 rounded-full bg-red-200 dark:bg-red-400" />
                  </div>
                  <div className="space-y-2">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Description:
                    </span>
                    <div className="h-2.5 w-64 rounded-full bg-red-200 dark:bg-red-400" />
                    <div className="h-2.5 w-64 rounded-full bg-red-200 dark:bg-red-400" />
                    <div className="h-2.5 w-64 rounded-full bg-red-200 dark:bg-red-400" />
                  </div>
                </div>
              ) : (
                <div>
                  <div>
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Name:
                    </span>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      {data?.name}
                    </p>
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Description:
                    </span>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      {data?.description}
                    </p>
                  </div>
                </div>
              )}
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title theme={customAccordionTheme.title}>
              Members
            </Accordion.Title>
            <Accordion.Content theme={customAccordionTheme.content}>
              <div className="relative w-full overflow-x-auto border border-gray-200 dark:border-gray-700">
                <Table theme={customTableTheme} hoverable>
                  <Table.Head>
                    <Table.HeadCell>ID</Table.HeadCell>
                    <Table.HeadCell>User ID</Table.HeadCell>
                    <Table.HeadCell>Role</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {memberLoading
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
                            <Table.Cell>
                              <div className="h-2.5 w-36 rounded-full bg-gray-200 dark:bg-gray-800" />
                            </Table.Cell>
                          </Table.Row>
                        ))
                      : memberError
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
                              <Table.Cell>
                                <div className="h-2.5 w-36 rounded-full bg-red-200 dark:bg-red-400" />
                              </Table.Cell>
                            </Table.Row>
                          ))
                        : memberData?.content.map((member, index) => (
                            <Table.Row
                              className="bg-white dark:border-gray-700 dark:bg-gray-800"
                              key={member.id}
                            >
                              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                <div className="relative">
                                  <span>{member.id}</span>
                                </div>
                              </Table.Cell>
                              <Table.Cell className="whitespace-nowrap">
                                <a
                                  className="hover:cursor-pointer hover:text-amber-500 hover:underline"
                                  href={`/tmc/users/${member.userId}`}
                                >
                                  {member.userId}
                                </a>
                              </Table.Cell>
                              <Table.Cell>
                                <div className="line-clamp-3 min-w-[10rem] max-w-[20rem]">
                                  {member.role}
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
                    memberData?.info?.totalPages
                      ? memberData.info.totalPages
                      : 1
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
