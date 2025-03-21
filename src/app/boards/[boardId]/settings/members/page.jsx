"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { Table, Pagination, Checkbox, Button } from "flowbite-react";
import useSWR from "swr";
import { mdiDelete, mdiPlus, mdiPencil } from "@mdi/js";
import MemberAddDialog from "@/components/organisms/board/settings/MemberAddDialog";
import MemberRemoveDialog from "@/components/organisms/board/settings/MemberRemoveDialog";
import MemberEditDialog from "@/components/organisms/board/settings/MemberEditDialog";
import SearchBar from "@/components/molecules/SearchBar";
import useApi from "@/hooks/useApi";

const Icon = dynamic(() => import("@mdi/react").then((module) => module.Icon), {
  ssr: false,
});

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

const customCheckboxTheme = {
  root: {
    color: {
      amber:
        "text-amber-500 focus:ring-amber-500 dark:ring-offset-gray-800 dark:focus:ring-amber-500",
    },
  },
};

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

const customButtonTheme = {
  color: {
    light:
      "border border-gray-300 bg-white text-gray-900 focus:ring-4 focus:ring-amber-300 enabled:hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-600 dark:text-white dark:focus:ring-gray-700 dark:enabled:hover:border-gray-700 dark:enabled:hover:bg-gray-700",
  },
};

export default function BoardSettingsStatuses() {
  const api = useApi();
  const { boardId } = useParams();

  const [page, setPage] = useState(1);
  const [perPage] = useState(25);
  const [searchProperty, setSearchProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [checkedList, setCheckedList] = useState(new Array(25).fill(false));

  const [showMemberAddDialog, setShowMemberAddDialog] = useState(false);
  const [showMemberRemoveDialog, setShowMemberRemoveDialog] = useState(false);
  const [showMemberEditDialog, setShowMemberEditDialog] = useState(false);

  const searchQuery = useMemo(() => {
    if (searchProperty && searchTerm && searchTerm.length > 0) {
      return encodeURIComponent(`${searchProperty}=like="%${searchTerm}%"`);
    } else {
      return null;
    }
  }, [searchProperty, searchTerm]);

  const {
    data,
    error,
    isLoading: loading,
    mutate,
  } = useSWR(
    boardId
      ? `/boards/${boardId}/members?page=${page - 1}&perPage=${perPage}${searchQuery ? `&search=${searchQuery}` : ""}`
      : null,
    (url) => api.get(url).then((res) => res.data),
  );

  const {
    data: usersData,
    error: usersError,
    isLoading: usersLoading,
  } = useSWR(
    data ? data.content.map((member) => `/users/${member.userId}`) : null,
    async (urls) => {
      return await Promise.all(
        urls.map((url) => api.get(url).then((res) => res.data)),
      );
    },
    [data],
  );

  const members = useMemo(() => {
    if (data && usersData) {
      return data.content.map((member) => {
        const user = usersData.find((user) => user.id === member.userId);

        return { ...user, ...member };
      });
    } else {
      return [];
    }
  }, [data, usersData]);

  const selectedRows = useMemo(() => {
    if (data) {
      return data.content.filter((_, index) => checkedList[index]);
    } else {
      return [];
    }
  }, [checkedList, data]);

  useEffect(() => {
    if (data?.content) {
      setCheckedList(new Array(data.content.length).fill(false));
    }
  }, [data?.content?.length]);

  return (
    <>
      <div className="flex flex-col space-y-1 text-gray-900 dark:text-white">
        <h1 className="text-xl font-semibold">Members</h1>
        <hr />
        <div className="flex space-x-2 text-xs">
          <div className="flex items-center space-x-1">
            <span>Total:</span>
            {loading ? (
              <div className="h-2 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
            ) : error ? (
              <div className="h-2 w-12 rounded-full bg-red-200 dark:bg-red-400" />
            ) : (
              <span className="font-semibold">{data.info.totalElements}</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <span>Showing:</span>
            {loading ? (
              <div className="h-2 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
            ) : error ? (
              <div className="h-2 w-12 rounded-full bg-red-200 dark:bg-red-400" />
            ) : (
              <span className="font-semibold">{data.content.length}</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <span>Selected:</span>
            {loading ? (
              <div className="h-2 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
            ) : error ? (
              <div className="h-2 w-12 rounded-full bg-red-200 dark:bg-red-400" />
            ) : (
              <span className="font-semibold">{selectedRows.length}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-12">
        <SearchBar
          onSearch={(property, term) => {
            setSearchProperty(property);
            setSearchTerm(term);
          }}
          properties={
            new Map([
              ["id", "ID"],
              ["userId", "User ID"],
              ["role", "Role"],
              ["username", "Username"],
              ["displayName", "Display Name"],
            ])
          }
        />
        <Button.Group>
          <Button
            theme={customButtonTheme}
            color="light"
            size="xs"
            disabled={loading || usersLoading || error || usersError}
            onClick={() => setShowMemberAddDialog(true)}
          >
            <div className="flex items-center justify-center space-x-2">
              <Icon path={mdiPlus} size={0.75} />
              <span>Add</span>
            </div>
          </Button>
          <Button
            theme={customButtonTheme}
            color="light"
            size="xs"
            disabled={
              loading ||
              usersLoading ||
              error ||
              usersError ||
              selectedRows.length !== 1
            }
            onClick={() => setShowMemberEditDialog(true)}
          >
            <div className="flex items-center justify-center space-x-2">
              <Icon path={mdiPencil} size={0.75} />
              <span>Edit</span>
            </div>
          </Button>
          <Button
            theme={customButtonTheme}
            color="light"
            size="xs"
            disabled={
              loading ||
              usersLoading ||
              error ||
              usersError ||
              selectedRows.length === 0
            }
            onClick={() => setShowMemberRemoveDialog(true)}
          >
            <div className="flex items-center justify-center space-x-2">
              <Icon path={mdiDelete} size={0.75} />
              <span>Remove</span>
            </div>
          </Button>
        </Button.Group>
      </div>
      <MemberAddDialog
        boardId={boardId}
        show={showMemberAddDialog}
        onClose={() => setShowMemberAddDialog(false)}
        onAdd={() => {
          setShowMemberAddDialog(false);
          mutate();
        }}
      />
      <MemberEditDialog
        boardId={boardId}
        show={showMemberEditDialog}
        memberId={selectedRows?.[0]?.id}
        onClose={() => setShowMemberEditDialog(false)}
        onEdit={() => {
          setShowMemberEditDialog(false);
          mutate();
        }}
      />
      <MemberRemoveDialog
        boardId={boardId}
        show={showMemberRemoveDialog}
        memberIds={selectedRows ? selectedRows.map((row) => row.id) : []}
        onClose={() => setShowMemberRemoveDialog(false)}
        onRemove={() => {
          setShowMemberRemoveDialog(false);
          mutate();
        }}
      />
      <div className="relative w-full overflow-x-auto border border-gray-200 dark:border-gray-700">
        <Table theme={customTableTheme} hoverable>
          <Table.Head>
            <Table.HeadCell className="p-4">
              <Checkbox
                onChange={(event) =>
                  setCheckedList(
                    new Array(checkedList.length).fill(event.target.checked),
                  )
                }
                theme={customCheckboxTheme}
                disabled={loading}
                color="amber"
              />
            </Table.HeadCell>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>User ID</Table.HeadCell>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Display Name</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {loading || usersLoading
              ? Array.from(Array(10).keys()).map((key) => (
                  <Table.Row
                    key={key}
                    className="animate-pulse bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="p-4">
                      <Checkbox
                        theme={customCheckboxTheme}
                        disabled
                        color="amber"
                      />
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <div className="h-2.5 w-36 rounded-full bg-gray-200 dark:bg-gray-800" />
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <div className="h-2.5 w-36 rounded-full bg-gray-200 dark:bg-gray-800" />
                    </Table.Cell>
                    <Table.Cell>
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
              : error || usersError
                ? Array.from(Array(10).keys()).map((key) => (
                    <Table.Row
                      key={key}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="p-4">
                        <Checkbox
                          theme={customCheckboxTheme}
                          disabled
                          color="amber"
                        />
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <div className="h-2.5 w-36 rounded-full bg-red-200 dark:bg-red-400" />
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <div className="h-2.5 w-36 rounded-full bg-red-200 dark:bg-red-400" />
                      </Table.Cell>
                      <Table.Cell>
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
                : members?.map((member, index) => (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={member.id}
                    >
                      <Table.Cell className="p-4">
                        <Checkbox
                          checked={!!checkedList[index]}
                          onChange={() =>
                            setCheckedList((oldCheckedList) => [
                              ...oldCheckedList.slice(0, index),
                              !oldCheckedList[index],
                              ...oldCheckedList.slice(index + 1),
                            ])
                          }
                          theme={customCheckboxTheme}
                          color="amber"
                        />
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <div className="relative">
                          <span>{member.id}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        <div className="relative">
                          <span>{member.userId}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="line-clamp-3 min-w-[10rem] max-w-[20rem]">
                          {member.username}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="line-clamp-3 min-w-[10rem] max-w-[20rem]">
                          {member.displayName}
                        </div>
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
