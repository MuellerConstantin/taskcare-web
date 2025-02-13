"use client";

import useSWR from "swr";
import useApi from "@/hooks/useApi";
import { useMemo } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { mdiViewList, mdiCog, mdiViewDashboardVariant } from "@mdi/js";

const Icon = dynamic(() => import("@mdi/react").then(module => module.Icon), { ssr: false });

export default function BoardNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { boardId } = useParams();
  const api = useApi();

  const {
    data,
    error,
    isLoading: loading
  } = useSWR(boardId ? `/boards/${boardId}` : null,
    (url) => api.get(url).then((res) => res.data));

  const {
    data: currentUserData,
    error: currentUserError,
    isLoading: currentUserLoading
  } = useSWR("/user/me",
    (url) => api.get(url).then((res) => res.data));

  const {
    data: currentMemberData,
    error: currentMemberError,
    isLoading: currentMemberLoading
  } = useSWR(boardId && currentUserData ? `/boards/${boardId}/members?search=${encodeURIComponent(`userId=="${currentUserData.id}"`)}` : null,
    (url) => api.get(url).then((res) => res.data));

  const currentMemberRole = useMemo(() => {
    if(currentMemberData && currentMemberData.content.length == 1) {
      return currentMemberData.content[0].role;
    } else {
      return null;
    }
  }, [currentMemberData]);

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
          <h1 className="md:text-xl font-semibold truncate text-gray-900 dark:text-white">
            {data?.name}
          </h1>
        )}
        <ul className="overflow-x-auto flex space-x-2">
          {currentMemberLoading || currentUserLoading ? Array.from(Array(3).keys()).map((key) => (
            <li key={key}>
              <div className="animate-pulse w-10 h-3 mb-4 bg-gray-200 dark:bg-gray-700 rounded-md" />
            </li>
          )) : currentMemberError || currentUserError || !currentMemberRole ? Array.from(Array(3).keys()).map((key) => (
            <li key={key}>
              <div className="w-10 h-3 mb-4 bg-red-200 dark:bg-red-400 rounded-md" />
            </li>
          )) : 
            navigation.map((item) => {
              return item.name == "Settings" && currentMemberRole != "ADMINISTRATOR" && currentMemberRole != "MAINTAINER" ? null : (
                <li key={item.name}>
                  <button onClick={() => router.push(item.path)} className="block w-fit group flex flex-col space-y-1">
                    <div className="flex items-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 rounded-md text-gray-900 dark:text-white px-2 py-1 space-x-2">
                      <Icon path={item.icon} size={0.75} className="text-gray-500 dark:group-hover:text-white group-hover:text-gray-900" />
                      <span className="block text-sm">
                        {item.name}
                      </span>
                    </div>
                    <hr className={`${item.isCurrent ? "bg-amber-500" : "bg-transparent"} border-0 h-1`} />
                  </button>
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  );
}
