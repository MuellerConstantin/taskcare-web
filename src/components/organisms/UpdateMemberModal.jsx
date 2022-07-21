import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { XIcon, SelectorIcon, CheckIcon } from "@heroicons/react/solid";
import * as yup from "yup";
import { Formik } from "formik";
import Button from "../atoms/Button";
import { updateMember } from "../../api/members";

const roles = ["ADMINISTRATOR", "MAINTAINER", "USER", "VISITOR"];

const schema = yup.object().shape({
  role: yup.string().oneOf(roles),
});

export default function UpdateMemberModal({
  boardId,
  username,
  currentRole,
  onSubmit,
  onClose,
  isOpen,
}) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSumitModal = async (values, { setFieldError }) => {
    setLoading(true);
    setError(null);

    const update = {
      role: values.role === "" ? null : values.role,
    };

    try {
      await updateMember(boardId, username, update);

      setOpen(false);
      if (onSubmit) onSubmit();
    } catch (err) {
      if (err.response && err.response.status === 422) {
        err.response.data.details?.forEach((detail) =>
          setFieldError(detail.field.split(".").pop(), detail.message)
        );
      } else if (err.response && err.response.status === 401) {
        navigate("/logout");
      } else if (err.response && err.response.status === 409) {
        setError(
          "After updating the member, the board would no longer be administrable."
        );
      } else {
        setError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const onCloseModal = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        onClose={onCloseModal}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="min-h-screen px-4 text-center">
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
            <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl space-y-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
              <div className="flex justify-between items-center">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                  Update member
                </Dialog.Title>
                <button
                  type="button"
                  onClick={onCloseModal}
                  disabled={loading}
                  className="p-1 rounded-full text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white disabled:opacity-50"
                >
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              {error && <p className="text-center text-red-500">{error}</p>}
              <Formik
                initialValues={{ role: currentRole }}
                validationSchema={schema}
                onSubmit={onSumitModal}
              >
                {(props) => (
                  <form
                    className="space-y-4"
                    onSubmit={props.handleSubmit}
                    noValidate
                  >
                    <div>
                      <Listbox
                        name="role"
                        value={props.values.role}
                        onChange={(role) => props.setFieldValue("role", role)}
                      >
                        <div className="relative mt-1">
                          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-600 py-2 pl-3 pr-10 text-left shadow-md sm:text-sm">
                            <span className="block truncate">
                              {props.values.role}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <SelectorIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-600 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {roles.map((role) => (
                                <Listbox.Option
                                  key={role}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active
                                        ? "bg-gray-100 dark:bg-gray-700"
                                        : "text-gray-800 dark:text-white"
                                    }`
                                  }
                                  value={role}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected
                                            ? "font-medium"
                                            : "font-normal"
                                        }`}
                                      >
                                        {role}
                                      </span>
                                      {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-500">
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>
                    <Button
                      type="submit"
                      disabled={!(props.isValid && props.dirty) || loading}
                      className="w-full flex justify-center"
                    >
                      {!loading && <span>Update</span>}
                      {loading && (
                        <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />
                      )}
                    </Button>
                  </form>
                )}
              </Formik>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
