"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Accordion, Table, Pagination } from "flowbite-react";
import useSWR from "swr";
import IdentIcon from "@/components/atoms/IdentIcon";
import useApi from "@/hooks/useApi";

const customAccordionTheme = {
  "title": {
    "base": "flex w-full items-center justify-between py-2 px-0 text-left font-medium text-gray-500 first:rounded-t-lg last:rounded-b-lg dark:text-gray-400",
    "open": {
      "off": "",
      "on": "text-gray-900 dark:text-white"
    }
  },
  "content": {
    "base": "py-2 px-0 first:rounded-t-lg last:rounded-b-lg dark:bg-gray-900"
  },
};

const customTableTheme = {
  "root": {
    "shadow": "",
  },
  "head": {
    "cell": {
      "base": "bg-gray-50 px-6 py-3 dark:bg-gray-700"
    }
  },
};

function BoardInfoLogo({boardName, boardId}) {
  const api = useApi();

  const {
    data
  } = useSWR(boardId ? `/boards/${boardId}/logo-image` : null,
    (url) => api.get(url, {responseType: "arraybuffer"})
      .then((res) => URL.createObjectURL(new Blob([res.data], { type: res.headers["content-type"] }))));

  if (data) {
    return (
      <div className="rounded-full bg-gray-200 dark:bg-gray-800 w-32 h-32 relative overflow-hidden">
        <Image
          src={data}
          alt={boardName}
          fill
          objectFit="cover"
          layout="fill"
        />
      </div>
    );
  } else {
    return (
      <div className="rounded-full bg-gray-200 dark:bg-gray-800 w-32 h-32 overflow-hidden">
        <IdentIcon value={boardName} />
      </div>
    );
  }
}

export default function TmcBoardInfo() {
  const { boardId } = useParams();
  const api = useApi();

  const [page, setPage] = useState(1);
  const [perPage,] = useState(25);

  const {
    data,
    error,
    isLoading: loading
  } = useSWR(boardId ? `/boards/${boardId}` : null,
    (url) => api.get(url).then((res) => res.data));

  const {
    data: memberData,
    error: memberError,
    isLoading: memberLoading
  } = useSWR(boardId ? `/boards/${boardId}/members?page=${page - 1}&perPage=${perPage}` : null,
    (url) => api.get(url).then((res) => res.data));

  return (
    <div className="h-full w-full flex flex-col lg:flex-row space-y-4 lg:space-y-0">
      <div className="lg:grow lg:w-[20%] flex flex-col items-center lg:pr-4">
        <BoardInfoLogo boardName={data?.name} boardId={boardId} />
        {loading ? (
          <div className="animate-pulse h-3 bg-gray-200 rounded-full dark:bg-gray-800 w-1/2 mt-4" />
        ) : error ? (
          <div className="h-3 bg-red-200 dark:bg-red-400 rounded-full w-1/2 mt-4" />
        ) : (
          <div className="mt-4 text-lg font-semibold truncate w-full text-center text-gray-900 dark:text-white">{data?.name}</div>
        )}
      </div>
      <div className="lg:grow lg:w-[80%] flex flex-col">
        <Accordion flush>
          <Accordion.Panel>
            <Accordion.Title theme={customAccordionTheme.title}>Overview</Accordion.Title>
            <Accordion.Content theme={customAccordionTheme.content}>
              {loading ? (
                <div>
                  <div className="space-y-2">
                    <span className="block text-gray-900 dark:text-white font-semibold">Name:</span>
                    <div className="animate-pulse h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32" />
                  </div>
                  <div className="space-y-2">
                    <span className="block text-gray-900 dark:text-white font-semibold">Description:</span>
                    <div className="animate-pulse h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-64" />
                    <div className="animate-pulse h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-64" />
                    <div className="animate-pulse h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-64" />
                  </div>
                </div>
              ) : error ? (
                <div>
                  <div className="space-y-2">
                    <span className="block text-gray-900 dark:text-white font-semibold">Name:</span>
                    <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-32" />
                  </div>
                  <div className="space-y-2">
                    <span className="block text-gray-900 dark:text-white font-semibold">Description:</span>
                    <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-64" />
                    <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-64" />
                    <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-64" />
                  </div>
                </div>
              ) : (
                <div>
                  <div>
                    <span className="block text-gray-900 dark:text-white font-semibold">Name:</span>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      {data?.name}
                    </p>
                  </div>
                  <div>
                    <span className="block text-gray-900 dark:text-white font-semibold">Description:</span>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      {data?.description}
                    </p>
                  </div>
                </div>
              )}
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title theme={customAccordionTheme.title}>Members</Accordion.Title>
            <Accordion.Content theme={customAccordionTheme.content}>
              <div className="relative overflow-x-auto w-full border border-gray-200 dark:border-gray-700">
                <Table theme={customTableTheme} hoverable>
                  <Table.Head>
                    <Table.HeadCell>ID</Table.HeadCell>
                    <Table.HeadCell>User ID</Table.HeadCell>
                    <Table.HeadCell>Role</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {memberLoading ? Array.from(Array(10).keys()).map((key) =>
                      <Table.Row key={key} className="animate-pulse bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-36" />
                        </Table.Cell>
                        <Table.Cell>
                          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-36" />
                        </Table.Cell>
                        <Table.Cell>
                          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-36" />
                        </Table.Cell>
                      </Table.Row>
                    ) : memberError ? Array.from(Array(10).keys()).map((key) =>
                      <Table.Row key={key} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-36" />
                        </Table.Cell>
                        <Table.Cell>
                          <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-36" />
                        </Table.Cell>
                        <Table.Cell>
                          <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-36" />
                        </Table.Cell>
                      </Table.Row>
                    ) : memberData?.content.map((member, index) => (
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={member.id}>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          <div className="relative">
                            <span>{member.id}</span>
                          </div>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap">
                          <a
                            className="hover:underline hover:cursor-pointer hover:text-amber-500"
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
              <div className="flex justify-center mt-4">
                <Pagination
                  layout="table"
                  showIcons
                  currentPage={page}
                  totalPages={memberData?.info?.totalPages ? memberData.info.totalPages : 1}
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
