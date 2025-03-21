"use client";

import useSWR from "swr";
import useApi from "@/hooks/useApi";
import { useMemo } from "react";
import { Breadcrumb } from "flowbite-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { mdiViewList, mdiCog, mdiViewDashboardVariant } from "@mdi/js";

const Icon = dynamic(() => import("@mdi/react").then((module) => module.Icon), {
  ssr: false,
});

const customBreadcrumbTheme = {
  item: {
    base: "group flex items-center overflow-hidden",
    chevron: "h-4 w-4 text-gray-400 group-first:hidden",
    href: {
      off: "flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 rounded-md px-2 py-1 overflow-hidden",
      on: "flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-2 py-1 overflow-hidden",
    },
    icon: "mr-2 h-4 w-4",
  },
};

export default function BoardNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { boardId } = useParams();
  const api = useApi();

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(boardId ? `/boards/${boardId}` : null, (url) =>
    api.get(url).then((res) => res.data),
  );

  const {
    data: currentUserData,
    error: currentUserError,
    isLoading: currentUserLoading,
  } = useSWR("/user/me", (url) => api.get(url).then((res) => res.data));

  const {
    data: currentMemberData,
    error: currentMemberError,
    isLoading: currentMemberLoading,
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
        icon: mdiViewDashboardVariant,
        path: `/boards/${boardId}`,
        isCurrent: `/boards/${boardId}` === pathname,
      },
      {
        name: "Backlog",
        icon: mdiViewList,
        path: `/boards/${boardId}/backlog`,
        isCurrent: pathname.startsWith(`/boards/${boardId}/backlog`),
      },
      {
        name: "Settings",
        icon: mdiCog,
        path: `/boards/${boardId}/settings`,
        isCurrent: pathname.startsWith(`/boards/${boardId}/settings`),
      },
    ];
  }, [boardId, pathname]);

  return (
    <div className="bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
      <div className="space-y-4 px-2 pt-3 sm:px-4">
        {loading ? (
          <div className="h-4 w-64 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
        ) : error ? (
          <div className="h-4 w-64 rounded-full bg-gray-200 bg-red-200 dark:bg-gray-800 dark:bg-red-400" />
        ) : (
          <Breadcrumb theme={customBreadcrumbTheme}>
            <Breadcrumb.Item href="/" theme={customBreadcrumbTheme["item"]}>
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#" theme={customBreadcrumbTheme["item"]}>
              <div className="truncate">{data?.name}</div>
            </Breadcrumb.Item>
          </Breadcrumb>
        )}
        <ul className="flex space-x-2 overflow-x-auto">
          {currentMemberLoading || currentUserLoading
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
                      className="group block flex w-fit flex-col space-y-1"
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
                        <Icon
                          path={item.icon}
                          size={0.75}
                          className={`${
                            item.name == "Settings" &&
                            currentMemberRole != "ADMINISTRATOR" &&
                            currentMemberRole != "MAINTAINER"
                              ? "text-gray-400 dark:text-gray-500"
                              : "text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white"
                          }`}
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
