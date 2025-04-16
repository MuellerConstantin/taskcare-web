"use client";

import useSWR from "swr";
import useApi from "@/hooks/useApi";
import { useMemo } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Breadcrumb, Breadcrumbs } from "@/components/atoms/Breadcrumbs";
import { SquareKanban, List, Settings } from "lucide-react";

export function BoardNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { boardId } = useParams();
  const api = useApi();

  const {
    data,
    error,
    isLoading: isLoading,
  } = useSWR(boardId ? `/boards/${boardId}` : null, (url) =>
    api.get(url).then((res) => res.data),
  );

  const {
    data: currentUserData,
    error: currentUserError,
    isLoading: currentUserIsLoading,
  } = useSWR("/user/me", (url) => api.get(url).then((res) => res.data));

  const {
    data: currentMemberData,
    error: currentMemberError,
    isLoading: currentMemberIsLoading,
  } = useSWR(
    boardId && currentUserData
      ? `/boards/${boardId}/members?search=${encodeURIComponent(`userId=="${currentUserData.id}"`)}`
      : null,
    (url) => api.get(url).then((res) => res.data),
  );

  const currentMemberRole = useMemo(() => {
    if (currentMemberData && currentMemberData.content.length == 1) {
      return currentMemberData.content[0].role;
    } else {
      return null;
    }
  }, [currentMemberData]);

  const navigation = useMemo(() => {
    return [
      {
        name: "Board",
        icon: SquareKanban,
        path: `/boards/${boardId}`,
        isCurrent: `/boards/${boardId}` === pathname,
      },
      {
        name: "Backlog",
        icon: List,
        path: `/boards/${boardId}/backlog`,
        isCurrent: pathname.startsWith(`/boards/${boardId}/backlog`),
      },
      {
        name: "Settings",
        icon: Settings,
        path: `/boards/${boardId}/settings`,
        isCurrent: pathname.startsWith(`/boards/${boardId}/settings`),
      },
    ];
  }, [boardId, pathname]);

  return (
    <div className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      <div className="space-y-4 px-2 pt-3 sm:px-4">
        {isLoading ? (
          <div className="h-4 w-64 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
        ) : error ? (
          <div className="h-4 w-64 rounded-full bg-gray-200 bg-red-200 dark:bg-gray-800 dark:bg-red-400" />
        ) : (
          <Breadcrumbs>
            <Breadcrumb href="/">Home</Breadcrumb>
            <Breadcrumb>
              <div className="truncate">{data?.name}</div>
            </Breadcrumb>
          </Breadcrumbs>
        )}
        <ul className="flex space-x-2 overflow-x-auto">
          {currentMemberIsLoading || currentUserIsLoading
            ? Array.from(Array(3).keys()).map((key) => (
                <li key={key}>
                  <div className="mb-4 h-3 w-10 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
                </li>
              ))
            : currentMemberError || currentUserError || !currentMemberRole
              ? Array.from(Array(3).keys()).map((key) => (
                  <li key={key}>
                    <div className="mb-4 h-3 w-10 rounded-md bg-red-200 dark:bg-red-400" />
                  </li>
                ))
              : navigation.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => router.push(item.path)}
                      className="group block flex w-fit cursor-pointer flex-col space-y-1"
                      disabled={
                        item.name == "Settings" &&
                        currentMemberRole != "ADMINISTRATOR" &&
                        currentMemberRole != "MAINTAINER"
                      }
                    >
                      <div
                        className={`${
                          item.name == "Settings" &&
                          currentMemberRole != "ADMINISTRATOR" &&
                          currentMemberRole != "MAINTAINER"
                            ? "text-gray-400 dark:text-gray-500"
                            : "text-gray-900 group-hover:bg-gray-200 dark:text-white dark:group-hover:bg-gray-700"
                        } flex items-center space-x-2 rounded-md px-2 py-1`}
                      >
                        <item.icon
                          className={`${
                            item.name == "Settings" &&
                            currentMemberRole != "ADMINISTRATOR" &&
                            currentMemberRole != "MAINTAINER"
                              ? "text-gray-400 dark:text-gray-500"
                              : "text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white"
                          } h-5 w-5`}
                        />
                        <span className="block text-sm">{item.name}</span>
                      </div>
                      <hr
                        className={`${item.isCurrent ? "bg-amber-500" : "bg-transparent"} h-1 border-0`}
                      />
                    </button>
                  </li>
                ))}
        </ul>
      </div>
    </div>
  );
}
