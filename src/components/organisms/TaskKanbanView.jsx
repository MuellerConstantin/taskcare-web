import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DotsHorizontalIcon, ExclamationIcon } from "@heroicons/react/solid";
import TaskDetailDrawer from "./TaskDetailDrawer";
import { fetchTasks } from "../../api/tasks";

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
  const navigate = useNavigate();

  const [selected, setSelected] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState(null);

  const onFetchTasks = useCallback(
    async (id) => {
      setTasksError(null);

      try {
        const tasksRes = await fetchTasks(id);
        setTasks(tasksRes.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/logout");
        } else {
          setTasksError("The board card's information could not be loaded.");
        }

        throw err;
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (boardId) {
      setTasksLoading(true);

      onFetchTasks(boardId).finally(() => setTasksLoading(false));
    }
  }, [boardId, onFetchTasks]);

  return (
    <>
      <TaskDetailDrawer
        isOpen={!!selected}
        onClose={(refresh) => {
          setSelected(null);
          if (refresh) {
            onFetchTasks(boardId);
          }
        }}
        boardId={boardId}
        task={selected}
      />
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col space-y-4">
          {(tasksLoading || tasksError) && (
            <div className="w-full relative">
              {tasksError && (
                <button
                  type="button"
                  className="group absolute top-2 left-2 flex items-start space-x-2 text-red-500"
                >
                  <div className="rounded-full p-1 bg-gray-100 dark:bg-gray-700 opacity-80">
                    <ExclamationIcon className="h-6" />
                  </div>
                  <div className="invisible group-hover:visible group-focus:visible bg-gray-100 dark:bg-gray-700 rounded-md shadow-md text-xs p-2 opacity-80 max-w-xs line-clamp-4">
                    {tasksError}
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
                      !tasksError && "animate-pulse"
                    }`}
                  >
                    <div
                      className={`h-24 w-full rounded-md ${
                        tasksError
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
                      !tasksError && "animate-pulse"
                    }`}
                  >
                    <div
                      className={`h-24 w-full rounded-md ${
                        tasksError
                          ? "bg-red-200 dark:bg-red-400"
                          : "bg-gray-200 dark:bg-gray-800"
                      }`}
                    />
                    <div
                      className={`h-24 w-full rounded-md ${
                        tasksError
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
                      !tasksError && "animate-pulse"
                    }`}
                  >
                    <div
                      className={`h-24 w-full rounded-md ${
                        tasksError
                          ? "bg-red-200 dark:bg-red-400"
                          : "bg-gray-200 dark:bg-gray-800"
                      }`}
                    />
                    <div
                      className={`h-24 w-full rounded-md ${
                        tasksError
                          ? "bg-red-200 dark:bg-red-400"
                          : "bg-gray-200 dark:bg-gray-800"
                      }`}
                    />
                    <div
                      className={`h-24 w-full rounded-md ${
                        tasksError
                          ? "bg-red-200 dark:bg-red-400"
                          : "bg-gray-200 dark:bg-gray-800"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {!tasksLoading && !tasksError && (
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
    </>
  );
}
