"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Table, Pagination, Checkbox, Button } from "flowbite-react";
import useSWR from "swr";
import {
  mdiAccountPlus,
  mdiAccountRemove,
  mdiAccountEdit,
  mdiAccountDetails
} from "@mdi/js";
import SearchBar from "@/components/molecules/SearchBar";
import UserAddDialog from "@/components/organisms/tmc/user/UserAddDialog";
import UserRemoveDialog from "@/components/organisms/tmc/user/UserRemoveDialog";
import UserEditDialog from "@/components/organisms/tmc/user/UserEditDialog";
import useApi from "@/hooks/useApi";

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

const customPaginationTheme = {
  "layout": {
    "table": {
      "base": "text-xs text-gray-700 dark:text-gray-400 text-center",
      "span": "font-semibold text-gray-900 dark:text-white"
    }
  },
  "pages": {
    "selector": {
      "base": "w-12 border border-gray-300 bg-white py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
      "active": "bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white",
    },
    "previous": {
      "base": "ml-0 rounded-l-lg border border-gray-300 bg-white px-2 py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
    },
    "next": {
      "base": "rounded-r-lg border border-gray-300 bg-white px-2 py-1.5 leading-tight text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
    },
  }
};

const customButtonTheme = {
  "color": {
    "light": "border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-amber-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
  }
};

export default function TmcUsers() {
  const api = useApi();

  const [page, setPage] = useState(1);
  const [perPage,] = useState(25);
  const [searchProperty, setSearchProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [checkedList, setCheckedList] = useState(new Array(25).fill(false));

  const [showUserAddDialog, setShowUserAddDialog] = useState(false);
  const [showUserRemoveDialog, setShowUserRemoveDialog] = useState(false);
  const [showUserEditDialog, setShowUserEditDialog] = useState(false);

  const searchQuery = useMemo(() => {
    if(searchProperty && searchTerm && searchTerm.length > 0) {
      return encodeURIComponent(`${searchProperty}=like="%${searchTerm}%"`)
    } else {
      return null;
    }
  }, [searchProperty, searchTerm]);

  const {
    data,
    error,
    isLoading: loading,
    mutate
  } = useSWR(`/users?page=${page - 1}&perPage=${perPage}${searchQuery ? `&search=${searchQuery}` : ""}`,
    (url) => api.get(url).then((res) => res.data));

  const selectedRows = useMemo(() => {
    if(data) {
      return data.content.filter((_, index) => checkedList[index]);
    } else {
      return [];
    }
  }, [checkedList, data]);

  useEffect(() => {
    if(data?.content) {
      setCheckedList(new Array(data.content.length).fill(false));
    }
  }, [data?.content?.length]);

  return (
    <>
      <div className="flex flex-col text-gray-900 dark:text-white space-y-1">
        <h1 className="text-xl font-semibold">Users</h1>
        <hr />
        <div className="flex space-x-2 text-xs">
          <div className="flex space-x-1 items-center">
            <span>Total:</span>
            {loading ? (
              <div className="animate-pulse h-2 bg-gray-200 rounded-full dark:bg-gray-800 w-12" />
            ) : error ? (
              <div className="h-2 bg-red-200 dark:bg-red-400 rounded-full w-12" />
            ) : (
              <span className="font-semibold">{data.info.totalElements}</span>
            )}
          </div>
          <div className="flex space-x-1 items-center">
            <span>Showing:</span>
            {loading ? (
              <div className="animate-pulse h-2 bg-gray-200 rounded-full dark:bg-gray-800 w-12" />
            ) : error ? (
              <div className="h-2 bg-red-200 dark:bg-red-400 rounded-full w-12" />
            ) : (
              <span className="font-semibold">{data.content.length}</span>
            )}
          </div>
          <div className="flex space-x-1 items-center">
            <span>Selected:</span>
            {loading ? (
              <div className="animate-pulse h-2 bg-gray-200 rounded-full dark:bg-gray-800 w-12" />
            ) : error ? (
              <div className="h-2 bg-red-200 dark:bg-red-400 rounded-full w-12" />
            ) : (
              <span className="font-semibold">{selectedRows.length}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:gap-x-12 md:flex-row md:flex-wrap md:justify-between md:items-center">
        <SearchBar
          onSearch={(property, term) => {
            setSearchProperty(property);
            setSearchTerm(term);
          }}
          properties={new Map([["id", "ID"], ["username", "Username"], ["displayName", "Display name"], ["identityProvider", "Identity provider"], ["role", "Role"]])}
        />
        <Button.Group>
          <Button
            theme={customButtonTheme}
            color="light"
            size="xs"
            disabled={loading || error || selectedRows.length !== 1}
            href={`/tmc/users/${selectedRows?.[0]?.id}`}
          >
            <div className="flex items-center space-x-2 justify-center">
              <Icon path={mdiAccountDetails} size={0.75} />
              <span>Info</span>
            </div>
          </Button>
          <Button
            theme={customButtonTheme}
            color="light"
            size="xs"
            disabled={loading || error}
            onClick={() => setShowUserAddDialog(true)}
          >
            <div className="flex items-center space-x-2 justify-center">
              <Icon path={mdiAccountPlus} size={0.75} />
              <span>Add</span>
            </div>
          </Button>
          <Button
            theme={customButtonTheme}
            color="light"
            size="xs"
            disabled={loading || error || selectedRows.length !== 1}
            onClick={() => setShowUserEditDialog(true)}
          >
            <div className="flex items-center space-x-2 justify-center">
              <Icon path={mdiAccountEdit} size={0.75} />
              <span>Edit</span>
            </div>
          </Button>
          <Button
            theme={customButtonTheme}
            color="light"
            size="xs"
            disabled={loading || error || selectedRows.length === 0}
            onClick={() => setShowUserRemoveDialog(true)}
          >
            <div className="flex items-center space-x-2 justify-center">
              <Icon path={mdiAccountRemove} size={0.75} />
              <span>Remove</span>
            </div>
          </Button>
        </Button.Group>
      </div>
      <UserAddDialog
        show={showUserAddDialog}
        onClose={() => setShowUserAddDialog(false)}
        onAdd={() => {
          setShowUserAddDialog(false);
          mutate();
        }}
      />
      <UserEditDialog
        show={showUserEditDialog}
        onClose={() => setShowUserEditDialog(false)}
        onEdit={() => {
          setShowUserEditDialog(false);
          mutate();
        }}
        userId={selectedRows?.[0]?.id}
        importedUser={selectedRows?.[0]?.identityProvider !== "LOCAL"}
      />
      <UserRemoveDialog
        show={showUserRemoveDialog}
        onClose={() => setShowUserRemoveDialog(false)}
        userIds={selectedRows ? selectedRows.map((row) => row.id) : []}
        onRemove={() => {
          setShowUserRemoveDialog(false);
          mutate();
        }}
      />
      <div className="relative overflow-x-auto w-full border border-gray-200 dark:border-gray-700">
        <Table theme={customTableTheme} hoverable>
          <Table.Head>
            <Table.HeadCell className="p-4">
              <Checkbox
                onChange={(event) => setCheckedList(new Array(checkedList.length).fill(event.target.checked))}
                theme={customCheckboxTheme}
                disabled={loading}
                color="amber"
              />
            </Table.HeadCell>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Display Name</Table.HeadCell>
            <Table.HeadCell>Identity Provider</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {loading ? Array.from(Array(10).keys()).map((key) =>
              <Table.Row key={key} className="animate-pulse bg-white dark:border-gray-700 dark:bg-gray-800">
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
                <Table.Cell className="whitespace-nowrap">
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
                <Table.Cell className="whitespace-nowrap">
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
                    checked={!!checkedList[index]}
                    onChange={() => setCheckedList((oldCheckedList) => [...oldCheckedList.slice(0, index), !oldCheckedList[index], ...oldCheckedList.slice(index + 1)])}
                    theme={customCheckboxTheme}
                    color="amber"
                  />
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  <div className="relative">
                    <span>{user.id}</span>
                  </div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">
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
      <div className="flex justify-center">
        <Pagination
          theme={customPaginationTheme}
          layout="pagination"
          showIcons
          currentPage={page}
          totalPages={data?.info?.totalPages ? data.info.totalPages : 1}
          onPageChange={setPage}
          className="hidden md:block"
        />
        <Pagination
          theme={customPaginationTheme}
          layout="table"
          showIcons
          currentPage={page}
          totalPages={data?.info?.totalPages ? data.info.totalPages : 1}
          onPageChange={setPage}
          className="block md:hidden"
        />
      </div>
    </>
  );
}
