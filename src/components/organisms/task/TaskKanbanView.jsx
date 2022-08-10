import { useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  DotsHorizontalIcon,
  ExclamationIcon,
  PlusIcon,
} from "@heroicons/react/solid";
import CreateTaskModal from "./CreateTaskModal";
import TaskDetailDrawer from "./TaskDetailDrawer";
import { fetchBoardTasks } from "../../../store/slices/board";

function TaskKanbanColumn({ tasks, onTaskInfo }) {
  const [, drop] = useDrop(() => ({
    accept: "KanbanCard",
  }));

  return (
    <div ref={drop} className="h-full space-y-2 overflow-y-scroll px-1">
      {tasks &&
        tasks.map((task) => (
          <TaskKanbanCard key={task.id} task={task} onInfo={onTaskInfo} />
        ))}
    </div>
  );
}

function TaskKanbanCard({ task, onInfo }) {
  const [, drag, dragPreview] = useDrag(() => ({
    type: "KanbanCard",
  }));

  return (
    <div ref={dragPreview}>
      <div
        ref={drag}
        className="bg-white text-gray-800 dark:text-white dark:bg-gray-800 rounded-md p-2 space-y-2"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h2 className="font-semibold truncate">{task.name}</h2>
            {task.priority && (
              <div className="bg-gray-200 dark:bg-gray-700 rounded-md p-1 text-amber-500 text-xs">
                {task.priority}
              </div>
            )}
          </div>
          <button
            type="button"
            className="p-1 rounded-full text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white focus:outline-none"
            onClick={() => {
              if (onInfo) onInfo(task);
            }}
          >
            <DotsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {task.description && (
          <div className="text-sm line-clamp-3">{task.description}</div>
        )}
        <div className="text-xs">
          <span className="text-gray-400">Added by&nbsp;</span>
          {task.createdBy}
        </div>
      </div>
    </div>
  );
}

export default function TaskKanbanView({ boardId }) {
  const dispatch = useDispatch();

  const [selected, setSelected] = useState(null);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

  const { tasks, loading, error } = useSelector(
    (state) => state.board,
    shallowEqual
  );

  return (
    <div className="space-y-4">
      <TaskDetailDrawer
        isOpen={!!selected}
        onClose={(refresh) => {
          setSelected(null);
          if (refresh) {
            dispatch(fetchBoardTasks(boardId));
          }
        }}
        boardId={boardId}
        task={selected}
      />
      <div className="flex justify-end">
        <CreateTaskModal
          boardId={boardId}
          isOpen={showCreateTaskModal}
          onSubmit={() => {
            setShowCreateTaskModal(false);
            dispatch(fetchBoardTasks(boardId));
          }}
          onClose={() => setShowCreateTaskModal(false)}
        />
        <button
          type="button"
          className="inline-flex items-center justify-center bg-transparent text-amber-500"
          onClick={() => setShowCreateTaskModal(true)}
        >
          <PlusIcon className="h-6 w-6" aria-hidden="true" />
          <div className="ml-2">Create task</div>
        </button>
      </div>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col space-y-4">
          {(loading || error) && (
            <div className="w-full relative">
              {error && (
                <button
                  type="button"
                  className="group absolute top-2 left-2 flex items-start space-x-2 text-red-500"
                >
                  <div className="rounded-full p-1 bg-gray-100 dark:bg-gray-700 opacity-80">
                    <ExclamationIcon className="h-6" />
                  </div>
                  <div className="invisible group-hover:visible group-focus:visible bg-gray-100 dark:bg-gray-700 rounded-md shadow-md text-xs p-2 opacity-80 max-w-xs line-clamp-4">
                    {error ? "Loading the board information failed." : null}
                  </div>
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col space-y-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2 h-96 md:h-screen">
                  <div className="mb-4 flex items-center space-x-2">
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-1 text-gray-800 dark:text-white text-xs">
                      ?
                    </div>
                    <h2 className="text-amber-500 text-lg font-semibold">
                      Opened
                    </h2>
                  </div>
                  <div
                    className={`h-full space-y-2 overflow-y-scroll px-1 ${
                      !error && "animate-pulse"
                    }`}
                  >
                    <div
                      className={`h-24 w-full rounded-md ${
                        error
                          ? "bg-red-200 dark:bg-red-400"
                          : "bg-gray-200 dark:bg-gray-800"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2 h-96 md:h-screen">
                  <div className="mb-4 flex items-center space-x-2">
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-1 text-gray-800 dark:text-white">
                      ?
                    </div>
                    <h2 className="text-amber-500 text-lg font-semibold">
                      In Progress
                    </h2>
                  </div>
                  <div
                    className={`h-full space-y-2 overflow-y-scroll px-1 ${
                      !error && "animate-pulse"
                    }`}
                  >
                    <div
                      className={`h-24 w-full rounded-md ${
                        error
                          ? "bg-red-200 dark:bg-red-400"
                          : "bg-gray-200 dark:bg-gray-800"
                      }`}
                    />
                    <div
                      className={`h-24 w-full rounded-md ${
                        error
                          ? "bg-red-200 dark:bg-red-400"
                          : "bg-gray-200 dark:bg-gray-800"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2 h-96 md:h-screen">
                  <div className="mb-4 flex items-center space-x-2">
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-1 text-gray-800 dark:text-white">
                      ?
                    </div>
                    <h2 className="text-amber-500 text-lg font-semibold">
                      Finished
                    </h2>
                  </div>
                  <div
                    className={`h-full space-y-2 overflow-y-scroll px-1 ${
                      !error && "animate-pulse"
                    }`}
                  >
                    <div
                      className={`h-24 w-full rounded-md ${
                        error
                          ? "bg-red-200 dark:bg-red-400"
                          : "bg-gray-200 dark:bg-gray-800"
                      }`}
                    />
                    <div
                      className={`h-24 w-full rounded-md ${
                        error
                          ? "bg-red-200 dark:bg-red-400"
                          : "bg-gray-200 dark:bg-gray-800"
                      }`}
                    />
                    <div
                      className={`h-24 w-full rounded-md ${
                        error
                          ? "bg-red-200 dark:bg-red-400"
                          : "bg-gray-200 dark:bg-gray-800"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2 h-96 md:h-screen">
                <div className="mb-4 flex items-center space-x-2">
                  <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-1 text-gray-800 dark:text-white text-xs">
                    {tasks
                      ? tasks.filter((task) => task.status === "OPENED").length
                      : "?"}
                  </div>
                  <h2 className="text-amber-500 text-lg font-semibold">
                    Opened
                  </h2>
                </div>
                {tasks && (
                  <TaskKanbanColumn
                    tasks={tasks.filter((task) => task.status === "OPENED")}
                    onTaskInfo={(task) => setSelected(task)}
                  />
                )}
              </div>
              <div className="flex flex-col space-y-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2 h-96 md:h-screen">
                <div className="mb-4 flex items-center space-x-2">
                  <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-1 text-gray-800 dark:text-white text-xs">
                    {tasks
                      ? tasks.filter((task) => task.status === "IN_PROGRESS")
                          .length
                      : "?"}
                  </div>
                  <h2 className="text-amber-500 text-lg font-semibold">
                    In Progress
                  </h2>
                </div>
                {tasks && (
                  <TaskKanbanColumn
                    tasks={tasks.filter(
                      (task) => task.status === "IN_PROGRESS"
                    )}
                    onTaskInfo={(task) => setSelected(task)}
                  />
                )}
              </div>
              <div className="flex flex-col space-y-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2 h-96 md:h-screen">
                <div className="mb-4 flex items-center space-x-2">
                  <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-1 text-gray-800 dark:text-white text-xs">
                    {tasks
                      ? tasks.filter((task) => task.status === "FINISHED")
                          .length
                      : "?"}
                  </div>
                  <h2 className="text-amber-500 text-lg font-semibold">
                    Finished
                  </h2>
                </div>
                {tasks && (
                  <TaskKanbanColumn
                    tasks={tasks.filter((task) => task.status === "FINISHED")}
                    onTaskInfo={(task) => setSelected(task)}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </DndProvider>
    </div>
  );
}
