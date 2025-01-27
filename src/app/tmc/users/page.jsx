"use client";

import { useState, useEffect } from "react";
import { Table, Pagination, Checkbox } from "flowbite-react";
import useSWR from "swr";
import StackTemplate from "@/components/templates/StackTemplate";
import Sidebar from "@/components/organisms/tmc/Sidebar";
import api from "@/api";

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

export default function TmcUsers() {
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
  } = useSWR(`/users?page=${page - 1}&perPage=${perPage}`,
    (url) => api.get(url).then((res) => res.data));

  return (
    <StackTemplate>
      <div className="grow flex flex-col flex">
        <div className="flex flex-col md:flex-row grow w-full max-w-screen-2xl mx-auto">
          <div className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5">
            <Sidebar />
          </div>
          <div className="w-full md:w-2/3 lg:w-3/4 xl:w-4/5 p-4">
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
                  <Table.HeadCell>Username</Table.HeadCell>
                  <Table.HeadCell>Display Name</Table.HeadCell>
                  <Table.HeadCell>Identity Provider</Table.HeadCell>
                  <Table.HeadCell>Role</Table.HeadCell>
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
                      <Table.Cell>
                        <div className="h-2.5 bg-red-200 dark:bg-red-400 rounded-full w-36" />
                      </Table.Cell>
                    </Table.Row>
                  ) : data.content.map((user, index) => (
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={user.id}>
                      <Table.Cell className="p-4">
                        <Checkbox
                          checked={checkedList[index + 1]}
                          onChange={() => setCheckedList((oldCheckedList) => [...oldCheckedList.slice(0, index + 1), !oldCheckedList[index + 1], ...oldCheckedList.slice(index + 2)])}
                          theme={customCheckboxTheme}
                          color="amber"
                        />
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {user.username}
                      </Table.Cell>
                      <Table.Cell>{user.displayName}</Table.Cell>
                      <Table.Cell>{user.identityProvider}</Table.Cell>
                      <Table.Cell>{user.role}</Table.Cell>
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
