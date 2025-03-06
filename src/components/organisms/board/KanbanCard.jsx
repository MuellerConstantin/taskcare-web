"use client";

import dynamic from "next/dynamic";
import {
  mdiClock,
  mdiCalendarClock,
  mdiArrowDownBoldBox,
  mdiArrowBottomLeftBoldBox,
  mdiPauseBox,
  mdiArrowTopLeftBoldBox,
  mdiArrowUpBoldBox
} from "@mdi/js";

const Icon = dynamic(() => import("@mdi/react").then(module => module.Icon), { ssr: false });

export default function KanbanCard({task}) {
  const priorityIcons = {
    "VERY_LOW": <Icon path={mdiArrowDownBoldBox} size={0.5} color="#fb923c" />,
    "LOW": <Icon path={mdiArrowBottomLeftBoldBox} size={0.75} color="#38bdf8" />,
    "MEDIUM": <Icon path={mdiPauseBox} size={0.5} color="#94a3b8" />,
    "HIGH": <Icon path={mdiArrowTopLeftBoldBox} size={0.5} color="#fb923c" />,
    "VERY_HIGH": <Icon path={mdiArrowUpBoldBox} size={0.5} color="#ea580c" />,
  };

  return (
    <div className="w-full h-[12rem] flex flex-col bg-white shadow dark:bg-gray-900 rounded-md p-2 overflow-hidden space-y-2 justify-between">
      <div className="space-y-2">
        <div className="font-semibold text-gray-900 dark:text-white truncate">
          {task?.name}
        </div>
        <div className="line-clamp-3 text-sm font-normal text-gray-700 dark:text-gray-400">
          {task?.description || (<span className="italic">No description</span>)}
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-1 font-normal text-gray-700 dark:text-gray-400">
          {task?.priority && priorityIcons[task?.priority]}
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 font-normal text-gray-700 dark:text-gray-400">
            <Icon path={mdiClock} size={0.5} />
            <span className="text-xs">{new Date(task?.createdAt).toLocaleString()}</span>
          </div>
          {task?.dueDate && (
            <>
              <div className="border-l-2 h-2/3 w-[1px] mx-2"></div>
              <div className="flex items-center gap-1 font-normal text-gray-700 dark:text-gray-400">
                <Icon path={mdiCalendarClock} size={0.5} />
                <span className="text-xs">{new Date(task?.dueDate).toLocaleString()}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
