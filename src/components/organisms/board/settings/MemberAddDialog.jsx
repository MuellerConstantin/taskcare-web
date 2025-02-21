import { useState, useCallback, useMemo, useEffect } from "react";
import { Button, Spinner, Modal, ListGroup, Pagination, Select, Label } from "flowbite-react";
import SearchBar from "@/components/molecules/SearchBar";
import useSWR from "swr";
import useApi from "@/hooks/useApi";

const customButtonTheme = {
  "color": {
    "amber": "border border-transparent bg-amber-500 text-white focus:ring-4 focus:ring-amber-300 enabled:hover:bg-amber-600 dark:focus:ring-amber-900"
  }
};

const customListGroupTheme = {
  "item": {
    "link": {
      "active": {
        "off": "hover:bg-gray-100 hover:text-amber-700 focus:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-500",
        "on": "bg-amber-700 text-white dark:bg-gray-800"
      },
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

export default function MemberAddDialog({show, boardId, onAdd, onClose}) {
  const api = useApi();

  const [page, setPage] = useState(1);
  const [perPage,] = useState(25);
  const [searchProperty, setSearchProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("MEMBER");

  const [addError, setAddError] = useState(null);
  const [addLoading, setAddLoading] = useState(false);

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

  const addMember = useCallback(async (id, role) => {
    setAddLoading(true);
    setAddError(null);

    api.post(`/boards/${boardId}/members`, {
      userId: id,
      role
    })
    .then(onAdd)
    .catch((err) => {
      setAddError("An unexpected error occurred, please retry!");
    })
    .finally(() => {
      setAddLoading(false);
    });
  }, [api, boardId]);

  useEffect(() => {
    setSelectedUser(null);
  }, [data]);

  return (
    <Modal size="lg" show={show} onClose={onClose}>
      <Modal.Header>Add Member</Modal.Header>
        <Modal.Body className="space-y-4 flex flex-col">
          <div className="flex flex-col space-y-4 text-gray-900 dark:text-white">
            {addError && (
              <p className="text-center text-red-500">{addError}</p>
            )}
            <SearchBar
              onSearch={(property, term) => {
                setSearchProperty(property);
                setSearchTerm(term);
              }}
              properties={new Map([["id", "ID"], ["username", "Username"], ["displayName", "Display Name"]])}
            />
            <div className="min-h-[10rem]">
              {loading ? (
                <ListGroup theme={customListGroupTheme}>
                  {Array.from(Array(5).keys()).map((key) => (
                    <ListGroup.Item
                      theme={customListGroupTheme["item"]}
                      key={key}
                      onClick={() => setSelectedUser(user.id)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className="flex flex-col space-y-1 w-full">
                        <div className="animate-pulse h-3 bg-gray-200 rounded-full dark:bg-gray-800 w-1/4" />
                        <div className="animate-pulse h-2 bg-gray-200 rounded-full dark:bg-gray-800 w-1/2" />
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : error ? (
                <ListGroup theme={customListGroupTheme}>
                  {Array.from(Array(5).keys()).map((key) => (
                    <ListGroup.Item
                      theme={customListGroupTheme["item"]}
                      key={key}
                      onClick={() => setSelectedUser(user.id)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className="flex flex-col space-y-1 w-full">
                        <div className="h-3 bg-red-200 rounded-full dark:bg-red-400 w-1/4" />
                        <div className="h-3 bg-red-200 rounded-full dark:bg-red-400 w-1/2" />
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <>
                  {data?.content?.length > 0 ? (
                    <ListGroup theme={customListGroupTheme}>
                      {data?.content?.map((user) => (
                        <ListGroup.Item
                          theme={customListGroupTheme["item"]}
                          key={user.id}
                          onClick={() => setSelectedUser(user.id)}
                          className={`flex items-center gap-2 cursor-pointer ${
                            selectedUser === user.id ? "bg-amber-100 text-amber-700" : ""
                          }`}
                        >
                          <div className="flex flex-col space-y-1 w-full">
                            <div className="text-start text-sm font-semibold">
                              {user.username}
                            </div>
                            <div className="text-start text-xs">
                              {user.displayName || "-"}
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <div className="text-center text-sm">
                      No users found.
                    </div>
                  )}
                </>
              )}
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
            <div>
              <div className="mb-2 block">
                <Label htmlFor="user-add-roles" value="Select role" />
              </div>
              <Select
                id="user-add-roles"
                required
                onChange={(e) => setSelectedRole(e.target.value)}
                value={selectedRole}
                color="gray"
                disabled={loading || !selectedUser}
              >
                <option>ADMINISTRATOR</option>
                <option>MAINTAINER</option>
                <option>MEMBER</option>
              </Select>
              <div className="text-xs mt-2">
                <span className="text-amber-600">Attention: </span>
                Depending on the role selected, the user is granted extensive rights for the entire board.
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Button
            theme={customButtonTheme}
            color="amber"
            type="submit"
            className="w-full"
            disabled={loading || !selectedUser}
            onClick={() => addMember(selectedUser, selectedRole)}
          >
            {!addLoading && <span>Add Member</span>}
            {addLoading && <Spinner size="sm" className="fill-white" />}
          </Button>
        </Modal.Footer>
    </Modal>
  );
}
