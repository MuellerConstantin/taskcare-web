import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import * as yup from "yup";
import { Formik } from "formik";
import TextField from "../../atoms/TextField";
import TextArea from "../../atoms/TextArea";
import Button from "../../atoms/Button";
import { updateTask } from "../../../api/tasks";

const schema = yup.object().shape({
  name: yup
    .string()
    .max(50, "Maximum 50 characters allowed")
    .required("Is required"),
  description: yup
    .string()
    .max(2000, "Maximum 2000 characters allowed")
    .nullable(true),
  priority: yup
    .number()
    .integer()
    .min(0, "Minimum priority level is zero.")
    .max(10, "Priority max level is 10.")
    .nullable(true),
  expiresAt: yup.date().min(new Date()).nullable(true),
});

export default function UpdateTaskModal({
  boardId,
  task,
  onSubmit,
  onClose,
  isOpen,
}) {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSumitModal = async (values, { setFieldError }) => {
    setLoading(true);
    setError(null);

    try {
      await updateTask(boardId, task.id, {
        name: values.name,
        description: values.description === "" ? null : values.description,
        priority: values.priority === "" ? null : values.priority,
        expiresAt:
          values.expiresAt === ""
            ? null
            : new Date(values.expiresAt).toISOString(),
      });

      onSubmit();
    } catch (err) {
      if (err.response && err.response.status === 422) {
        err.response.data.details?.forEach((detail) =>
          setFieldError(detail.field.split(".").pop(), detail.message)
        );
      } else if (err.response && err.response.status === 401) {
        navigate("/logout");
      } else {
        setError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const onCloseModal = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
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
            <Dialog.Panel className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl space-y-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
              <div className="flex justify-between items-center">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                  Update task
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
                initialValues={{
                  name: task.name || "",
                  description: task.description || "",
                  priority: task.priority || "",
                  expiresAt: task.expiresAt
                    ? task.expiresAt.substring(0, 19)
                    : "",
                }}
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
                      <TextField
                        name="name"
                        type="text"
                        placeholder="Name"
                        disabled={loading}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.name}
                        error={props.errors.name}
                        touched={props.errors.name && props.touched.name}
                      />
                    </div>
                    <div>
                      <TextArea
                        name="description"
                        type="text"
                        rows="3"
                        placeholder="Description"
                        disabled={loading}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.description}
                        error={props.errors.description}
                        touched={
                          props.errors.description && props.touched.description
                        }
                        className="resize-none"
                      />
                    </div>
                    <div>
                      <TextField
                        name="priority"
                        type="number"
                        min="0"
                        max="10"
                        placeholder="Priority"
                        disabled={loading}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.priority}
                        error={props.errors.priority}
                        touched={
                          props.errors.priority && props.touched.priority
                        }
                      />
                    </div>
                    <div>
                      <TextField
                        name="expiresAt"
                        type="datetime-local"
                        placeholder="Expires At"
                        disabled={loading}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.expiresAt}
                        error={props.errors.expiresAt}
                        touched={
                          props.errors.expiresAt && props.touched.expiresAt
                        }
                      />
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
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
