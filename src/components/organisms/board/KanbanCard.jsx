"use client";

import dynamic from "next/dynamic";
import { Avatar } from "flowbite-react";
import {
  mdiClockEdit,
  mdiCalendarClock,
  mdiArrowDownBoldBox,
  mdiArrowBottomLeftBoldBox,
  mdiPauseBox,
  mdiArrowTopLeftBoldBox,
  mdiArrowUpBoldBox
} from "@mdi/js";
import Image from "next/image";
import useSWR from "swr";
import useApi from "@/hooks/useApi";

const Icon = dynamic(() => import("@mdi/react").then(module => module.Icon), { ssr: false });

function KanbanCardAvatar({username, userId}) {
  const api = useApi();

  const {
    data,
    isLoading: loading
  } = useSWR(userId ? `/users/${userId}/profile-image` : null,
    (url) => api.get(url, {responseType: "arraybuffer"})
      .then((res) => URL.createObjectURL(new Blob([res.data], { type: res.headers["content-type"] }))));

  if(loading || !username) {
    return (
      <div className="animate-pulse">
        <Avatar size="sm" rounded />
      </div>
    );
  } else {
    if (data) {
      return (
        <Avatar
          size="sm"
          className="bg-gray-200 dark:bg-gray-900 rounded-full"
          rounded
          img={({className, ...props}) => (
            <Image
              src={data}
              alt={username}
              width={64}
              height={64}
              className={`${className} object-cover`}
              {...props}
            />
          )}
        />
      )
    } else {
      return (
        <Avatar size="sm" placeholderInitials={username.slice(0, 2).toUpperCase()} rounded />
      );
    }
  }
}

export default function KanbanCard({task}) {
  const api = useApi();

  const priorityIcons = {
    "VERY_LOW": <Icon path={mdiArrowDownBoldBox} size={0.75} color="#0ea5e9" />,
    "LOW": <Icon path={mdiArrowBottomLeftBoldBox} size={0.75} color="#38bdf8" />,
    "MEDIUM": <Icon path={mdiPauseBox} size={0.75} color="#94a3b8" />,
    "HIGH": <Icon path={mdiArrowTopLeftBoldBox} size={0.75} color="#fb923c" />,
    "VERY_HIGH": <Icon path={mdiArrowUpBoldBox} size={0.75} color="#ea580c" />,
  };

  const {
    data,
    error,
    isLoading: loading
  } = useSWR(task && task.assigneeId ? `/boards/${task.boardId}/members/${task.assigneeId}` : null,
    (url) => api.get(url).then((res) => res.data));

  const {
    data: userData,
    error: userError,
    isLoading: userLoading
  } = useSWR(data ? `/users/${data.userId}` : null,
    (url) => api.get(url).then((res) => res.data));

  return (
    <div className="w-full h-[12rem] flex flex-col bg-white shadow dark:bg-gray-900 rounded-md p-2 overflow-hidden space-y-2 justify-between">
      <div className="space-y-2">
        <div className="flex space-x-4 items-start justify-between">
          <div className="font-semibold text-gray-900 dark:text-white truncate">
            {task?.name}
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-fit shrink-0">
            {task?.assigneeId && (
              <KanbanCardAvatar username={userData?.username} userId={userData?.id} />
            )}
          </div>
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
            <Icon path={mdiClockEdit} size={0.5} />
            <span className="text-xs">{new Date(task?.updatedAt).toLocaleString()}</span>
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
