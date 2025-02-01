"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Accordion, Table, Pagination, Avatar } from "flowbite-react";
import useSWR from "swr";
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

function UserInfoAvatar({username, userId}) {
  const api = useApi();

  const {
    data,
    isLoading: loading
  } = useSWR(userId ? `/users/${userId}/profile-image` : null,
    (url) => api.get(url, {responseType: "arraybuffer"})
      .then((res) => URL.createObjectURL(new Blob([res.data], { type: res.headers["content-type"] }))));

  if(loading) {
    return (
      <div className="animate-pulse">
        <Avatar size="xl" rounded />
      </div>
    );
  } else {
    if (data) {
      return (
        <Avatar
          size="xl"
          className="bg-gray-200 dark:bg-gray-800 rounded-full"
          rounded
          img={({className, ...props}) => (
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
      )
    } else {
      return (
        <Avatar size="xl" placeholderInitials={username?.slice(0, 2).toUpperCase()} rounded />
      );
    }
  }
}

export default function TmcUserInfo() {
  const { userId } = useParams();
  const api = useApi();

  const [page, setPage] = useState(1);
  const [perPage,] = useState(25);

  const {
    data,
    error,
    isLoading: loading
  } = useSWR(userId ? `/users/${userId}` : null,
    (url) => api.get(url).then((res) => res.data));

  const {
    data: boardData,
    error: boardError,
    isLoading: boardLoading
  } = useSWR(userId ? `/users/${userId}/boards?page=${page - 1}&perPage=${perPage}` : null,
    (url) => api.get(url).then((res) => res.data));

  return (
    <div className="h-full w-full flex flex-col lg:flex-row space-y-4 lg:space-y-0">
      <div className="lg:grow lg:w-[20%] flex flex-col items-center lg:pr-4">
        <UserInfoAvatar username={data?.username} userId={userId} />
        {loading ? (
          <div className="animate-pulse h-3 bg-gray-200 rounded-full dark:bg-gray-800 w-1/2 mt-4" />
        ) : error ? (
          <div className="h-3 bg-red-200 dark:bg-red-400 rounded-full w-1/2 mt-4" />
        ) : (
          <div className="mt-4 text-lg font-semibold truncate w-full text-center text-gray-900 dark:text-white">{data?.username}</div>
        )}
      </div>
      <div className="lg:grow lg:w-[80%] flex flex-col">
        <Accordion flush>
          <Accordion.Panel>
            <Accordion.Title theme={customAccordionTheme.title}>Overview</Accordion.Title>
            <Accordion.Content theme={customAccordionTheme.content}>
              {loading ? (
                <div className="max-w-sm">
                  <div className="flex justify-between items-center">
                    <span className="block text-gray-900 dark:text-white font-semibold">Username:</span>
                    <div className="animate-pulse h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32" />
                  </div>
                  <div className="flex justify-between  items-center">
                    <span className="block text-gray-900 dark:text-white font-semibold">Display Name:</span>
                    <div className="animate-pulse h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32" />
                  </div>
                  <div className="flex justify-between  items-center">
                    <span className="block text-gray-900 dark:text-white font-semibold">Identity Provider:</span>
                    <div className="animate-pulse h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32" />
                  </div>
                  <div className="flex justify-between  items-center">
                    <span className="block text-gray-900 dark:text-white font-semibold">Role:</span>
                    <div className="animate-pulse h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-32" />
                  </div>
                </div>
              ) : error ? (
                <div className="max-w-sm">
                  <div className="flex justify-between items-center">
                    <span className="block text-gray-900 dark:text-white font-semibold">Username:</span>
                    <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-32" />
                  </div>
                  <div className="flex justify-between  items-center">
                    <span className="block text-gray-900 dark:text-white font-semibold">Display Name:</span>
                    <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-32" />
                  </div>
                  <div className="flex justify-between  items-center">
                    <span className="block text-gray-900 dark:text-white font-semibold">Identity Provider:</span>
                    <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-32" />
                  </div>
                  <div className="flex justify-between  items-center">
                    <span className="block text-gray-900 dark:text-white font-semibold">Role:</span>
                    <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-32" />
                  </div>
                </div>
              ) : (
                <div className="max-w-sm">
                  <div className="flex justify-between">
                    <span className="block text-gray-900 dark:text-white font-semibold">Username:</span>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      {data?.username}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <span className="block text-gray-900 dark:text-white font-semibold">Display Name:</span>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      {data?.displayName || "-"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <span className="block text-gray-900 dark:text-white font-semibold">Identity Provider:</span>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      {data?.identityProvider}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <span className="block text-gray-900 dark:text-white font-semibold">Role:</span>
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      {data?.role}
                    </p>
                  </div>
                </div>
              )}
            </Accordion.Content>
          </Accordion.Panel>
          <Accordion.Panel>
            <Accordion.Title theme={customAccordionTheme.title}>Boards</Accordion.Title>
            <Accordion.Content theme={customAccordionTheme.content}>
              <div className="relative overflow-x-auto w-full border border-gray-200 dark:border-gray-700">
                <Table theme={customTableTheme} hoverable>
                  <Table.Head>
                    <Table.HeadCell>ID</Table.HeadCell>
                    <Table.HeadCell>Name</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {boardLoading ? Array.from(Array(10).keys()).map((key) =>
                      <Table.Row key={key} className="animate-pulse bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-36" />
                        </Table.Cell>
                        <Table.Cell>
                          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-800 w-36" />
                        </Table.Cell>
                      </Table.Row>
                    ) : boardError ? Array.from(Array(10).keys()).map((key) =>
                      <Table.Row key={key} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-36" />
                        </Table.Cell>
                        <Table.Cell>
                          <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-36" />
                        </Table.Cell>
                      </Table.Row>
                    ) : boardData?.content.map((board, index) => (
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={board.id}>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          <a
                            className="hover:underline hover:cursor-pointer hover:text-amber-500"
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
              <div className="flex justify-center mt-4">
                <Pagination
                  layout="table"
                  showIcons
                  currentPage={page}
                  totalPages={boardData?.info?.totalPages ? boardData.info.totalPages : 1}
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
