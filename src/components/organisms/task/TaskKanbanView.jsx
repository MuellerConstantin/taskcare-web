import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { ExclamationIcon, PlusIcon } from "@heroicons/react/solid";
import CreateTaskModal from "./CreateTaskModal";
import TaskCanbanCard from "./TaskKanbanCard";
import { fetchTasks } from "../../../store/slices/tasks";
import { updateTask } from "../../../api/tasks";
import { useStomp } from "../../../contexts/stomp";

const isTouchDevice = () => "ontouchstart" in window;

function TaskKanbanColumn({ boardId, status, tasks, onTaskMove }) {
  const navigate = useNavigate();

  const [, drop] = useDrop(() => ({
    accept: "TaskKanbanCard",
    drop: async (task) => {
      if (task.status !== status) {
        try {
          await updateTask(boardId, task.id, {
            status,
          });

          onTaskMove(task.id, status);
        } catch (err) {
          if (err.response && err.response.status === 401) {
            navigate("/logout");
          }

          throw err;
        }
      }
    },
  }));

  return (
    <div ref={drop} className="h-full space-y-2 overflow-y-scroll px-1">
      {tasks &&
        tasks.map((task) => (
          <TaskCanbanCard key={task.id} boardId={boardId} task={task} />
        ))}
    </div>
  );
}

export default function TaskKanbanView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

  const { board, currentMember } = useSelector(
    (state) => state.board,
    shallowEqual
  );

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useSelector((state) => state.tasks, shallowEqual);

  const { connecting: stompConnecting, error: stompError, client } = useStomp();

  const error = useMemo(() => {
    if (!tasksError && !stompError) {
      return null;
    }
    if (tasksError) {
      return tasksError;
    }
    return stompError;
  }, [tasksError, stompError]);

  const loading = useMemo(
    () => tasksLoading || stompConnecting,
    [tasksLoading, stompConnecting]
  );

  useEffect(() => {
    if (tasksError?.status === 401) {
      navigate("/logout");
    }
  }, [tasksError, navigate]);

  const openedTasks = useMemo(
    () =>
      tasks
        ?.filter((task) => task.status === "OPENED")
        .sort((a, b) => a.createdAt - b.createdAt) || [],
    [tasks]
  );

  const inProgressTasks = useMemo(
    () =>
      tasks
        ?.filter((task) => task.status === "IN_PROGRESS")
        .sort((a, b) => a.createdAt - b.createdAt) || [],
    [tasks]
  );

  const finishedTasks = useMemo(
    () =>
      tasks
        ?.filter((task) => task.status === "FINISHED")
        .sort((a, b) => a.createdAt - b.createdAt) || [],
    [tasks]
  );

  useEffect(() => {
    if (client && board) {
      // Listens for newly created tasks
      client.subscribe(`/topic/board.${board.id}.task-created`, () => {
        dispatch(fetchTasks(board.id));
      });

      // Listens for task updates
      client.subscribe(`/topic/board.${board.id}.task-updated`, () => {
        dispatch(fetchTasks(board.id));
      });

      // Listens for deleted tasks
      client.subscribe(`/topic/board.${board.id}.task-deleted`, () => {
        dispatch(fetchTasks(board.id));
      });
    }
  }, [client, board, dispatch]);

  return (
    <div className="space-y-4">
      {!loading && !error && (
        <div className="flex justify-end">
          <CreateTaskModal
            boardId={board.id}
            isOpen={showCreateTaskModal}
            onSubmit={() => {
              setShowCreateTaskModal(false);
              dispatch(fetchTasks(board.id));
            }}
            onClose={() => setShowCreateTaskModal(false)}
          />
          <button
            type="button"
            className="inline-flex items-center justify-center bg-transparent text-amber-500 disabled:opacity-50 hover:brightness-110"
            onClick={() => setShowCreateTaskModal(true)}
            disabled={
              currentMember.role === "USER" || currentMember.role === "VISITOR"
            }
          >
            <PlusIcon className="h-6 w-6" aria-hidden="true" />
            <div className="ml-2">Create task</div>
          </button>
        </div>
      )}
      <DndProvider backend={isTouchDevice() ? TouchBackend : HTML5Backend}>
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
                    Loading the board tasks failed.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2 h-96 md:h-screen">
                <div className="mb-4 flex items-center space-x-2">
                  <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-1 text-gray-800 dark:text-white text-xs">
                    {openedTasks ? openedTasks.length : "?"}
                  </div>
                  <h2 className="text-amber-500 text-lg font-semibold">
                    Opened
                  </h2>
                </div>
                {openedTasks && (
                  <TaskKanbanColumn
                    boardId={board.id}
                    status="OPENED"
                    tasks={openedTasks}
                    onTaskMove={() => dispatch(fetchTasks(board.id))}
                  />
                )}
              </div>
              <div className="flex flex-col space-y-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2 h-96 md:h-screen">
                <div className="mb-4 flex items-center space-x-2">
                  <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-1 text-gray-800 dark:text-white text-xs">
                    {inProgressTasks ? inProgressTasks.length : "?"}
                  </div>
                  <h2 className="text-amber-500 text-lg font-semibold">
                    In Progress
                  </h2>
                </div>
                {inProgressTasks && (
                  <TaskKanbanColumn
                    boardId={board.id}
                    status="IN_PROGRESS"
                    tasks={inProgressTasks}
                    onTaskMove={() => dispatch(fetchTasks(board.id))}
                  />
                )}
              </div>
              <div className="flex flex-col space-y-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2 h-96 md:h-screen">
                <div className="mb-4 flex items-center space-x-2">
                  <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-1 text-gray-800 dark:text-white text-xs">
                    {finishedTasks ? finishedTasks.length : "?"}
                  </div>
                  <h2 className="text-amber-500 text-lg font-semibold">
                    Finished
                  </h2>
                </div>
                {finishedTasks && (
                  <TaskKanbanColumn
                    boardId={board.id}
                    status="FINISHED"
                    tasks={finishedTasks}
                    onTaskMove={() => dispatch(fetchTasks(board.id))}
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
