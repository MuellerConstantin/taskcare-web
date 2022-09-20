import { useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useDrag } from "react-dnd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { Disclosure } from "@headlessui/react";
import {
  ChevronUpIcon,
  BellIcon,
  FlagIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
} from "@heroicons/react/solid";
import Link from "../../atoms/Link";
import Avatar from "../../atoms/Avatar";
import UpdateTaskModal from "./UpdateTaskModal";
import DeleteTaskModal from "./DeleteTaskModal";
import { fetchTasks } from "../../../store/slices/tasks";

const getTimeDifference = (timestamp) => {
  const now = new Date();
  const since = new Date(timestamp);
  const difference = Math.abs(now - since);

  const yearInMs = 365 * 24 * 60 * 60 * 1000;
  const dayInMs = 24 * 60 * 60 * 1000;
  const hourInMs = 60 * 60 * 1000;
  const minuteInMs = 60 * 1000;
  const secondInMs = 1000;

  if (Math.ceil(difference / secondInMs) <= 59) {
    return `${Math.ceil(difference / secondInMs)} seconds`;
  }

  if (Math.ceil(difference / minuteInMs) <= 59) {
    return `${Math.ceil(difference / minuteInMs)} minutes`;
  }

  if (Math.ceil(difference / hourInMs) <= 23) {
    return `${Math.ceil(difference / minuteInMs)} hours`;
  }

  if (Math.ceil(difference / dayInMs) <= 364) {
    return `${Math.ceil(difference / dayInMs)} days`;
  }

  return `${Math.ceil(difference / yearInMs)} years`;
};

export default function TaskKanbanCard({ boardId, task }) {
  const dispatch = useDispatch();

  const { currentMember } = useSelector((state) => state.board, shallowEqual);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [, drag, dragPreview] = useDrag(() => ({
    type: "TaskKanbanCard",
    item: task,
    canDrag: () => currentMember.role !== "VISITOR",
  }));

  return (
    <div ref={dragPreview}>
      <div
        ref={drag}
        className="bg-white text-gray-800 dark:text-white dark:bg-gray-800 rounded-md p-2 space-y-2"
      >
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="w-full space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <h2 className="font-semibold truncate">{task.name}</h2>
                    {task.priority && (
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-md p-1 text-amber-500 text-xs">
                        {task.priority}
                      </div>
                    )}
                  </div>
                  <ChevronUpIcon
                    className={`${open ? "rotate-180 transform" : ""} h-5 w-5`}
                  />
                </div>
                {!open && (
                  <div className="space-y-1">
                    {task.description && (
                      <ReactMarkdown
                        className="text-sm text-left"
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                      >
                        {`${task.description
                          .split(/(?:\r\n|\r|\n)/)
                          .slice(0, 4)
                          .join("\n")}${
                          task.description.split(/(?:\r\n|\r|\n)/).length > 4
                            ? "..."
                            : ""
                        }`}
                      </ReactMarkdown>
                    )}
                    <div className="text-xs text-left">
                      <span className="text-gray-400">Added by&nbsp;</span>
                      {task.createdBy}
                    </div>
                  </div>
                )}
              </Disclosure.Button>
              <Disclosure.Panel className="space-y-4">
                <hr className="border-gray-300 dark:border-gray-400 !mb-4 !mt-2" />
                <div className="flex items-center space-x-2">
                  <div className="h-10 aspect-square">
                    <Avatar value={task.createdBy} />
                  </div>
                  <div className="text-xs">
                    <Link
                      className="truncate !text-gray-800 dark:!text-white"
                      to={`/users/${task.createdBy}`}
                    >
                      {task.createdBy}
                    </Link>
                    <div>created {getTimeDifference(task.createdAt)} ago</div>
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="font-light text-xs flex space-x-1">
                    <ClockIcon className="h-4" />
                    <p className="truncate">
                      Created at: {new Date(task.createdAt).toLocaleString()}/10
                    </p>
                  </div>
                  {task.priority && (
                    <div className="font-light text-xs flex space-x-1">
                      <FlagIcon className="h-4" />
                      <p className="truncate">Priority: {task.priority}/10</p>
                    </div>
                  )}
                  {task.expiresAt && (
                    <div className="font-light text-xs flex space-x-1">
                      <BellIcon className="h-4" />
                      <p>
                        Expires at: {new Date(task.expiresAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  {task.description ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex, rehypeRaw]}
                    >
                      {task.description}
                    </ReactMarkdown>
                  ) : (
                    <span className="italic">No description provided.</span>
                  )}
                </div>
                <hr className="border-gray-300 dark:border-gray-400 !mt-4 !mb-2" />
                <div className=" flex justify-between">
                  <UpdateTaskModal
                    boardId={boardId}
                    task={task}
                    onSubmit={() => {
                      setShowUpdateModal(false);
                      dispatch(fetchTasks(boardId));
                    }}
                    onClose={() => setShowUpdateModal(false)}
                    isOpen={showUpdateModal}
                  />
                  <button
                    type="button"
                    className="inline-flex items-center justify-center bg-transparent text-amber-500 disabled:opacity-50"
                    onClick={() => setShowUpdateModal(true)}
                    disabled={currentMember.role === "VISITOR"}
                  >
                    <PencilIcon className="h-5 w-5" aria-label="Update" />
                  </button>
                  <DeleteTaskModal
                    boardId={boardId}
                    taskId={task?.id}
                    onSubmit={() => {
                      setShowDeleteModal(false);
                      dispatch(fetchTasks(boardId));
                    }}
                    onClose={() => setShowDeleteModal(false)}
                    isOpen={showDeleteModal}
                  />
                  <button
                    type="button"
                    className="inline-flex items-center justify-center bg-transparent text-amber-500 disabled:opacity-50"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={
                      currentMember.role === "USER" ||
                      currentMember.role === "VISITOR"
                    }
                  >
                    <TrashIcon className="h-5 w-5" aria-label="Delete" />
                  </button>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
