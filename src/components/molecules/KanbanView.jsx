import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function KanbanColumn({ tasks }) {
  const [, drop] = useDrop(() => ({
    accept: "KanbanCard",
  }));

  return (
    <div ref={drop} className="h-full space-y-2 overflow-y-scroll px-1">
      {tasks && tasks.map((task) => <KanbanCard key={task.id} task={task} />)}
    </div>
  );
}

function KanbanCard({ task }) {
  const [, drag, dragPreview] = useDrag(() => ({
    type: "KanbanCard",
  }));

  return (
    <div ref={dragPreview}>
      <div
        ref={drag}
        className="bg-white text-gray-800 dark:text-white dark:bg-gray-800 rounded-md p-2 space-y-2"
      >
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold truncate">{task.name}</h2>
          {task.priority && (
            <div className="bg-gray-200 dark:bg-gray-700 rounded-md p-1 text-amber-500 text-xs">
              {task.priority}
            </div>
          )}
        </div>
        <div className="text-sm line-clamp-3">{task.description}</div>
        <div className="text-xs">
          <span className="text-gray-400">Added by&nbsp;</span>
          {task.createdBy}
        </div>
      </div>
    </div>
  );
}

export default function KanbanView({ tasks }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col space-y-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2 h-96 md:h-screen">
          <div className="mb-4 flex items-center space-x-2">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-1 text-gray-800 dark:text-white text-xs">
              {tasks
                ? tasks.filter((task) => task.status === "OPENED").length
                : "?"}
            </div>
            <h2 className="text-amber-500 text-lg font-semibold">Opened</h2>
          </div>
          {tasks && (
            <KanbanColumn
              tasks={tasks.filter((task) => task.status === "OPENED")}
            />
          )}
        </div>
        <div className="flex flex-col space-y-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2 h-96 md:h-screen">
          <div className="mb-4 flex items-center space-x-2">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-1 text-gray-800 dark:text-white text-xs">
              {tasks
                ? tasks.filter((task) => task.status === "IN_PROGRESS").length
                : "?"}
            </div>
            <h2 className="text-amber-500 text-lg font-semibold">
              In Progress
            </h2>
          </div>
          {tasks && (
            <KanbanColumn
              tasks={tasks.filter((task) => task.status === "IN_PROGRESS")}
            />
          )}
        </div>
        <div className="flex flex-col space-y-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2 h-96 md:h-screen">
          <div className="mb-4 flex items-center space-x-2">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-md p-1 text-gray-800 dark:text-white text-xs">
              {tasks
                ? tasks.filter((task) => task.status === "FINISHED").length
                : "?"}
            </div>
            <h2 className="text-amber-500 text-lg font-semibold">Finished</h2>
          </div>
          {tasks && (
            <KanbanColumn
              tasks={tasks.filter((task) => task.status === "FINISHED")}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
}
