import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import Button from "../atoms/Button";
import { deleteTask } from "../../api/tasks";

export default function RemoveTaskModal({
  boardId,
  taskId,
  onSubmit,
  onCancel,
  children,
}) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onCloseModal = () => {
    if (!loading) {
      setOpen(false);
    }
  };

  const onOpenModal = () => {
    setOpen(true);
  };

  const onSubmitModal = async () => {
    setLoading(true);
    setError(null);

    try {
      await deleteTask(boardId, taskId);

      setOpen(false);
      if (onSubmit) onSubmit();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/logout");
      } else {
        setError("An unexpected error occurred, please retry!");
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const onCancelModal = () => {
    setOpen(false);
    if (onCancel) onCancel();
  };

  return (
    <>
      {React.cloneElement(children, { onClick: onOpenModal })}

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
              <Dialog.Panel className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl space-y-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
                <div className="flex justify-between items-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    Remove task
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
                {error && <p className="text-center text-red-500">{error}</p>}
                <div>
                  Are you sure you want to remove this task? The following
                  things take effect immediately:
                </div>
                <div>
                  <ul className="list-disc pl-6">
                    <li>The task is irrevocably deleted.</li>
                    <li>All attachments and references will be lost.</li>
                  </ul>
                </div>
                <div>Do you still want to continue?</div>
                <div className="flex justify-between">
                  <Button
                    onClick={onSubmitModal}
                    disabled={loading}
                    className="!bg-green-500 focus:!outline-green-500 w-32 flex justify-center"
                  >
                    {!loading && <span>Yes</span>}
                    {loading && (
                      <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />
                    )}
                  </Button>
                  <Button
                    onClick={onCloseModal}
                    disabled={loading}
                    className="bg-red-500 focus:outline-red-500 w-32"
                  >
                    No
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
