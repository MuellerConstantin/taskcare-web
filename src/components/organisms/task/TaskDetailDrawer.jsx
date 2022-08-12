import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XIcon,
  UserIcon,
  ClockIcon,
  FlagIcon,
  BellIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import UpdateTaskModal from "./UpdateTaskModal";
import DeleteTaskModal from "./DeleteTaskModal";

export default function TaskDetailDrawer({ boardId, task, onClose, isOpen }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        onClose={() => onClose(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="text-left">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="w-3/4 max-w-sm h-screen shadow-xl bg-white dark:bg-gray-600 text-gray-800 dark:text-white w-full h-full p-4 overflow-hidden rounded-r-2xl">
              {task && (
                <div className="flex flex-col h-full w-full justify-between space-y-8 overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <h2 className="font-semibold truncate text-lg">
                          {task.name}
                        </h2>
                        <button
                          type="button"
                          className="p-1 rounded-full text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white disabled:opacity-50"
                          onClick={() => onClose(false)}
                        >
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="text-xs text-amber-500">
                        {task.status}
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="font-light flex space-x-1">
                        <UserIcon className="h-4" />
                        <p className="truncate">Added by: {task.createdBy}</p>
                      </div>
                      <div className="font-light text-xs flex space-x-1">
                        <ClockIcon className="h-4" />
                        <p className="truncate">
                          Added at: {new Date(task.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {task.priority && (
                        <div className="font-light text-xs flex space-x-1">
                          <FlagIcon className="h-4" />
                          <p className="truncate">
                            Priority: {task.priority}/10
                          </p>
                        </div>
                      )}
                      {task.expiresAt && (
                        <div className="font-light text-xs flex space-x-1">
                          <BellIcon className="h-4" />
                          <p>
                            Expires at:{" "}
                            {new Date(task.expiresAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                    {task.description ? (
                      <div>{task.description}</div>
                    ) : (
                      <div className="italic">No description provided.</div>
                    )}
                  </div>
                  <div className=" flex justify-between p-2">
                    <UpdateTaskModal
                      boardId={boardId}
                      task={task}
                      onSubmit={() => {
                        setShowUpdateModal(false);
                        onClose(true);
                      }}
                      onClose={() => setShowUpdateModal(false)}
                      isOpen={showUpdateModal}
                    />
                    <button
                      type="button"
                      className="inline-flex items-center justify-center bg-transparent text-amber-500"
                      onClick={() => setShowUpdateModal(true)}
                    >
                      <PencilIcon className="h-6 w-6" aria-label="Update" />
                    </button>
                    <DeleteTaskModal
                      boardId={boardId}
                      taskId={task?.id}
                      onSubmit={() => {
                        setShowDeleteModal(false);
                        onClose(true);
                      }}
                      onClose={() => setShowDeleteModal(false)}
                      isOpen={showDeleteModal}
                    />
                    <button
                      type="button"
                      className="inline-flex items-center justify-center bg-transparent text-amber-500"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <TrashIcon className="h-6 w-6" aria-label="Delete" />
                    </button>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
