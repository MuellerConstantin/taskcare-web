"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Table, Pagination, Checkbox, Button, TextInput, Select } from "flowbite-react";
import useSWR from "swr";
import {
  mdiAccountPlus,
  mdiAccountRemove,
  mdiAccountEdit,
  mdiMagnify
} from "@mdi/js";
import UserAddDialog from "@/components/organisms/tmc/UserAddDialog";
import UserRemoveDialog from "@/components/organisms/tmc/UserRemoveDialog";
import UserEditDialog from "@/components/organisms/tmc/UserEditDialog";
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

const customButtonTheme = {
  "color": {
    "light": "border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-amber-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
  }
};

const customSearchTextInputThemeMd = {
  "field": {
    "input": {
      "colors": {
        "gray": "border-gray-300 bg-gray-50 text-gray-900 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-amber-500 dark:focus:ring-amber-500"
      },
      "withAddon": {
        "off": "rounded-lg rounded-l-none rounded-r-none"
      },
    }
  }
};

const customSearchTextInputThemeSm = {
  "field": {
    "input": {
      "colors": {
        "gray": "border-gray-300 bg-gray-50 text-gray-900 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-amber-500 dark:focus:ring-amber-500"
      },
      "withAddon": {
        "off": "rounded-lg rounded-r-none"
      },
    }
  }
};

const customSearchButtonTheme = {
  "color": {
    "light": "border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-amber-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
  },
  "pill": {
    "off": "rounded-lg rounded-l-none border-l-0",
  },
};

const customSearchSelectTheme = {
  "field": {
    "select": {
      "withAddon": {
        "off": "rounded-lg rounded-r-none border-r-0",
      },
      "colors": {
        gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-amber-500 dark:focus:ring-amber-500",
      }
    }
  }
};

function TmcUsersSearch({onSearch}) {
  const [selectedProperty, setSelectedProperty] = useState("id");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="grow">
      <div className="p-2 border rounded space-y-2 block lg:hidden">
        <Select
          sizing="sm"
          required
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
        >
          <option value="id">ID</option>
          <option value="username">Username</option>
          <option value="displayName">Display Name</option>
          <option value="identityProvider">Identity Provider</option>
          <option value="role">Role</option>
        </Select>
        <div className="flex w-full">
          <TextInput
            theme={customSearchTextInputThemeSm}
            sizing="sm"
            placeholder="Search"
            className="grow"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onSearch(selectedProperty, e.target.value);
            }}
          />
          <Button
            theme={customSearchButtonTheme}
            color="light"
            size="xs"
            onClick={() => onSearch(selectedProperty, searchTerm)}
          >
            <div className="flex items-center justify-center">
              <Icon path={mdiMagnify} size={0.75} />
            </div>
          </Button>
        </div>
      </div>
      <div className="hidden lg:flex">
        <Select
          theme={customSearchSelectTheme}
          sizing="sm"
          required
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
        >
          <option value="id">ID</option>
          <option value="username">Username</option>
          <option value="displayName">Display Name</option>
          <option value="identityProvider">Identity Provider</option>
          <option value="role">Role</option>
        </Select>
        <TextInput
          theme={customSearchTextInputThemeMd}
          sizing="sm"
          placeholder="Search"
          className="grow max-w-xs"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearch(selectedProperty, e.target.value);
          }}
        />
        <Button
          theme={customSearchButtonTheme}
          color="light"
          size="xs"
          onClick={() => onSearch(selectedProperty, searchTerm)}
        >
          <div className="flex items-center justify-center">
            <Icon path={mdiMagnify} size={0.75} />
          </div>
        </Button>
      </div>
    </div>
  );
}

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

  return (
    <>
      <div className="flex flex-col text-gray-900 dark:text-white space-y-1">
        <h1 className="text-2xl font-semibold">Users</h1>
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
        <TmcUsersSearch
          onSearch={(property, term) => {
            setSearchProperty(property);
            setSearchTerm(term);
          }}
        />
        <Button.Group>
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
          setCheckedList(new Array(data?.content?.length || 0).fill(false));
          mutate();
        }}
      />
      <UserEditDialog
        show={showUserEditDialog}
        onClose={() => setShowUserEditDialog(false)}
        onEdit={() => {
          setShowUserEditDialog(false);
          setCheckedList(new Array(data?.content?.length || 0).fill(false));
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
          setCheckedList(new Array(data?.content?.length || 0).fill(false));
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
                    checked={checkedList[index]}
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
          layout="table"
          showIcons
          currentPage={page}
          totalPages={data?.info?.totalPages ? data.info.totalPages : 1}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}
