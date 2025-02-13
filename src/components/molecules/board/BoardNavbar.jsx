"use client";

import useSWR from "swr";
import useApi from "@/hooks/useApi";
import { useMemo } from "react";
import { useParams, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { mdiViewList, mdiCog, mdiViewDashboardVariant } from "@mdi/js";

const Icon = dynamic(() => import("@mdi/react").then(module => module.Icon), { ssr: false });

export default function BoardNavbar() {
  const pathname = usePathname();
  const { boardId } = useParams();
  const api = useApi();

  const {
    data,
    error,
    isLoading: loading
  } = useSWR(boardId ? `/boards/${boardId}` : null,
    (url) => api.get(url).then((res) => res.data));

  const navigation = useMemo(() => {
    return [
      {name: "Board", icon: mdiViewDashboardVariant, path: `/boards/${boardId}`, isCurrent: `/boards/${boardId}` === pathname},
      {name: "Backlog", icon: mdiViewList, path: `/boards/${boardId}/backlog`, isCurrent: `/boards/${boardId}/backlog` === pathname},
      {name: "Settings", icon: mdiCog, path: `/boards/${boardId}/settings`, isCurrent: pathname.startsWith(`/boards/${boardId}/settings`)}
    ];
  }, [boardId, pathname]);

  return (
    <div className="bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
      <div className="max-w-screen-2xl mx-auto px-2 pt-3 sm:px-4 space-y-4">
        {loading ? (
          <div className="animate-pulse h-4 bg-gray-200 rounded-full dark:bg-gray-800 w-64" />
        ) : error ? (
          <div className="bg-red-200 dark:bg-red-400 h-4 bg-gray-200 rounded-full dark:bg-gray-800 w-64" />
        ) : (
          <h1 className="text-xl font-semibold truncate">
            {data?.name}
          </h1>
        )}
        <ul className="overflow-x-auto flex space-x-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <a href={item.path} className="block w-fit group flex flex-col space-y-1">
                <div className="flex items-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 rounded-md text-gray-900 dark:text-white px-2 py-1 space-x-2">
                  <Icon path={item.icon} size={0.75} className="text-gray-500 dark:group-hover:text-white group-hover:text-gray-900" />
                  <span className="block text-sm">
                    {item.name}
                  </span>
                </div>
                {item.isCurrent && (
                  <hr className="border-0 h-1 bg-amber-500"/>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
