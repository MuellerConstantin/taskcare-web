import React, { Fragment, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon, PlusIcon } from "@heroicons/react/solid";
import * as yup from "yup";
import { Formik } from "formik";
import TextField from "../atoms/TextField";
import Button from "../atoms/Button";
import Pagination from "../molecules/Pagination";
import { fetchUsers } from "../../api/users";
import { createMember } from "../../api/members";

const schema = yup.object().shape({
  username: yup.string().required("Is required"),
});

export default function AddMemberModal({
  boardId,
  onSubmit,
  onCancel,
  children,
}) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [filter, setFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [pageable, setPageable] = useState(null);

  const [addError, setAddError] = useState(null);
  const [addLoading, setAddLoading] = useState(false);

  const onCloseModal = () => {
    if (!loading) {
      setOpen(false);
    }
  };

  const onOpenModal = () => {
    setOpen(true);
  };

  const onFetchUsers = useCallback(
    async (_page, _filter) => {
      setError(null);
      setAddError(null);

      try {
        const usersRes = await fetchUsers(_page, _filter);

        setUsers(usersRes.data.content);
        setPageable(usersRes.data.info);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/logout");
        } else {
          setError("The list of available users could not be loaded.");
        }

        throw err;
      }
    },
    [navigate]
  );

  const onAddUser = async (username) => {
    setAddLoading(true);
    setAddError(null);

    try {
      await createMember(boardId, {
        username,
        role: "USER",
      });

      setOpen(false);
      if (onSubmit) onSubmit();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/logout");
      } else if (err.response && err.response.status === 409) {
        setAddError("The selected user is already a member of the board.");
      } else {
        setAddError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setAddLoading(false);
    }
  };

  const onCancelModal = () => {
    setOpen(false);
    if (onCancel) onCancel();
  };

  useEffect(() => {
    if (currentPage >= 0 && filter) {
      setLoading(true);

      onFetchUsers(currentPage, filter).finally(() => setLoading(false));
    }
  }, [currentPage, filter, onFetchUsers]);

  return (
    <>
      {React.cloneElement(children, { onClick: onOpenModal })}

      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          onClose={onCloseModal}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl space-y-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
                <div className="flex justify-between items-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    Add member
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={onCancelModal}
                    disabled={loading}
                    className="p-1 rounded-full text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white disabled:opacity-50"
                  >
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <Formik
                  initialValues={{ username: "" }}
                  validationSchema={schema}
                  onSubmit={(values) =>
                    setFilter(`username==*${values.username}*`)
                  }
                >
                  {(props) => (
                    <form
                      className="space-y-4"
                      onSubmit={props.handleSubmit}
                      noValidate
                    >
                      <div>
                        <TextField
                          name="username"
                          type="text"
                          placeholder="Username"
                          disabled={loading}
                          onChange={props.handleChange}
                          value={props.values.username}
                          onBlur={props.handleBlur}
                          error={props.errors.username}
                          touched={
                            props.errors.username && props.touched.username
                          }
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={!(props.isValid && props.dirty) || loading}
                        className="w-full flex justify-center"
                      >
                        {!loading && <span>Search</span>}
                        {loading && (
                          <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />
                        )}
                      </Button>
                    </form>
                  )}
                </Formik>
                {filter && !loading && error && (
                  <p className="text-center text-red-500">{error}</p>
                )}
                {!addLoading && addError && (
                  <p className="text-center text-red-500">{addError}</p>
                )}
                {!loading && !error && users.length > 0 && (
                  <div className="flex flex-col space-y-2 overflow-y-scroll max-h-48">
                    {users.map((user) => (
                      <div
                        key={user.username}
                        className="px-2 py-3 border-b border-gray-300 dark:border-gray-400 flex items-center justify-between space-x-2"
                      >
                        <div className="space-y-1 overflow-hidden">
                          {(user.firstName || user.lastName) && (
                            <div className="truncate">
                              {user.firstName && (
                                <span>{user.firstName}&nbsp;</span>
                              )}
                              {user.lastName && user.lastName}
                            </div>
                          )}
                          <div
                            className={`truncate ${
                              (user.firstName || user.lastName) &&
                              "text-sm font-light"
                            }`}
                          >
                            {user.username}
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={loading || addLoading}
                          onClick={() => onAddUser(user.username)}
                          className="inline-flex items-center justify-center bg-transparent text-green-500"
                        >
                          <PlusIcon className="h-4 w-4" aria-hidden="true" />
                          <div className="ml-1 text-sm">Add</div>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {filter && !loading && !error && users.length <= 0 && (
                  <p className="text-center text-gray-800 dark:text-white">
                    No users found.
                  </p>
                )}
                {filter && !loading && !error && users.length > 0 && (
                  <Pagination
                    currentPage={pageable.page}
                    perPage={pageable.perPage}
                    totalElements={pageable.totalElements}
                    onChange={(newPage) => setCurrentPage(newPage)}
                  />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
