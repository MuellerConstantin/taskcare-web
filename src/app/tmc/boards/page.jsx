"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Table, Pagination, Checkbox, Button, Clipboard } from "flowbite-react";
import useSWR from "swr";
import { mdiPencil, mdiDelete, mdiInformation } from "@mdi/js";
import StackTemplate from "@/components/templates/StackTemplate";
import Sidebar from "@/components/organisms/tmc/Sidebar";
import api from "@/api";

const Icon = dynamic(() => import("@mdi/react").then(module => module.Icon), { ssr: false });

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

const customCheckboxTheme = {
  "root": {
    "color": {
      "amber": "text-amber-500 focus:ring-amber-500 dark:ring-offset-gray-800 dark:focus:ring-amber-500",
    }
  }
};

const customButtonTheme = {
  "color": {
    "light": "border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-amber-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
  }
};

export default function TmcBoards() {
  const [page, setPage] = useState(1);
  const [perPage,] = useState(25);
  const [checkedList, setCheckedList] = useState(new Array(25).fill(false));

  useEffect(() => {
    setCheckedList(new Array(perPage).fill(false));
  }, [perPage, page]);

  const {
    data,
    error,
    isLoading: loading
  } = useSWR(`/boards?page=${page - 1}&perPage=${perPage}`,
    (url) => api.get(url).then((res) => res.data));

  const selectedRows = useMemo(() => {
    if(data) {
      return data.content.filter((_, index) => checkedList[index]);
    }
  }, [checkedList, data]);

  return (
    <StackTemplate>
      <div className="grow flex flex-col flex">
        <div className="flex flex-col md:flex-row grow w-full max-w-screen-2xl mx-auto">
          <div className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5">
            <Sidebar />
          </div>
          <div className="w-full md:w-2/3 lg:w-3/4 xl:w-4/5 p-4 flex flex-col space-y-4">
            <div className="flex flex-col text-gray-900 dark:text-white space-y-1">
              <h1 className="text-2xl font-semibold">Boards</h1>
              <hr />
              <div className="flex space-x-2 text-xs">
                <div className="flex space-x-1 items-center">
                  <span>Total:</span>
                  {loading ? (
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-800 w-12" />
                  ) : error ? (
                    <div className="h-2 bg-red-200 dark:bg-red-400 rounded-full w-12" />
                  ) : (
                    <span className="font-semibold">{data.info.totalElements}</span>
                  )}
                </div>
                <div className="flex space-x-1 items-center">
                  <span>Showing:</span>
                  {loading ? (
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-800 w-12" />
                  ) : error ? (
                    <div className="h-2 bg-red-200 dark:bg-red-400 rounded-full w-12" />
                  ) : (
                    <span className="font-semibold">{data.content.length}</span>
                  )}
                </div>
                <div className="flex space-x-1 items-center">
                  <span>Selected:</span>
                  {loading ? (
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-800 w-12" />
                  ) : error ? (
                    <div className="h-2 bg-red-200 dark:bg-red-400 rounded-full w-12" />
                  ) : (
                    <span className="font-semibold">{selectedRows.length}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex">
              <Button.Group>
                <Button
                  theme={customButtonTheme}
                  color="light"
                  size="xs"
                  disabled={loading || error || selectedRows.length !== 1}
                >
                  <div className="flex items-center space-x-2 justify-center">
                    <Icon path={mdiInformation} size={0.75} />
                    <span>Info</span>
                  </div>
                </Button>
                <Button
                  theme={customButtonTheme}
                  color="light"
                  size="xs"
                  disabled={loading || error || selectedRows.length !== 1}
                >
                  <div className="flex items-center space-x-2 justify-center">
                    <Icon path={mdiPencil} size={0.75} />
                    <span>Edit</span>
                  </div>
                </Button>
                <Button
                  theme={customButtonTheme}
                  color="light"
                  size="xs"
                  disabled={loading || error || selectedRows.length === 0}
                >
                  <div className="flex items-center space-x-2 justify-center">
                    <Icon path={mdiDelete} size={0.75} />
                    <span>Remove</span>
                  </div>
                </Button>
              </Button.Group>
            </div>
            <div className="relative overflow-x-auto w-full border border-gray-200 dark:border-gray-700">
              <Table theme={customTableTheme} hoverable>
                <Table.Head>
                  <Table.HeadCell className="p-4">
                    <Checkbox
                      checked={checkedList[0]}
                      onChange={() => setCheckedList((oldCheckedList) => new Array(checkedList.length).fill(!oldCheckedList[0]))}
                      theme={customCheckboxTheme}
                      disabled={loading}
                      color="amber"
                    />
                  </Table.HeadCell>
                  <Table.HeadCell>ID</Table.HeadCell>
                  <Table.HeadCell>Name</Table.HeadCell>
                  <Table.HeadCell>Description</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {loading ? Array.from(Array(10).keys()).map((key) =>
                    <Table.Row key={key} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="p-4">
                        <Checkbox
                          theme={customCheckboxTheme}
                          disabled
                          color="amber"
                        />
                      </Table.Cell>
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
                  ) : error ? Array.from(Array(10).keys()).map((key) =>
                    <Table.Row key={key} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="p-4">
                        <Checkbox
                          theme={customCheckboxTheme}
                          disabled
                          color="amber"
                        />
                      </Table.Cell>
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
                  ) : data.content.map((board, index) => (
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={board.id}>
                      <Table.Cell className="p-4">
                        <Checkbox
                          checked={checkedList[index + 1]}
                          onChange={() => setCheckedList((oldCheckedList) => [...oldCheckedList.slice(0, index + 1), !oldCheckedList[index + 1], ...oldCheckedList.slice(index + 2)])}
                          theme={customCheckboxTheme}
                          color="amber"
                        />
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <div className="relative">
                          <span>{board.id}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="line-clamp-3 min-w-[10rem] max-w-[20rem]">
                          {board.name}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="line-clamp-3 min-w-[10rem] max-w-[20rem]">
                          {board.description}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
            <div className="flex justify-center">
              <Pagination
                layout="table"
                showIcons
                currentPage={page}
                totalPages={data?.info?.totalPages ? data.info.totalPages : 1}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      </div>
    </StackTemplate>
  );
}
