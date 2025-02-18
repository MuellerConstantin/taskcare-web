"use client";

import { useMemo } from "react";
import { usePathname, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import { mdiAccountGroup, mdiViewDashboardVariant, mdiBulletinBoard, mdiTag, mdiViewList } from "@mdi/js";
import useSWR from "swr";
import useApi from "@/hooks/useApi";

const Icon = dynamic(() => import("@mdi/react").then(module => module.Icon), { ssr: false });

const customSidebarTheme = {
  "root": {
    "collapsed": {
      "off": "w-full"
    },
    "inner": "h-full overflow-y-auto overflow-x-hidden bg-white px-3 py-4 dark:bg-gray-900"
  },
  "item": {
    "base": "flex items-center justify-center rounded-lg px-2 py-1 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
    "content": {
      "base": "flex-1 whitespace-nowrap px-1"
    },
  }
};

export default function Sidebar() {
  const api = useApi();
  const pathname = usePathname();
  const { boardId } = useParams();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

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
    return {
      "content": [
        { name: "Statuses", icon: mdiViewList, path: `/boards/${boardId}/settings/statuses`, isCurrent: pathname === `/boards/${boardId}/settings/statuses` },
        { name: "Layout", icon: mdiBulletinBoard, path: `/boards/${boardId}/settings/layout`, isCurrent: pathname === `/boards/${boardId}/settings/layout` },
        { name: "Components", icon: mdiTag, path: `/boards/${boardId}/settings/components`, isCurrent: pathname === `/boards/${boardId}/settings/components` },
      ],
      "administration": [
        { name: "General", icon: mdiViewDashboardVariant, path: `/boards/${boardId}/settings/general`, isCurrent: pathname === `/boards/${boardId}/settings/general` },
        { name: "Members", icon: mdiAccountGroup, path: `/boards/${boardId}/settings/members`, isCurrent: pathname === `/boards/${boardId}/settings/members` },
      ],
    };
  }, [pathname]);

  return (
    <FlowbiteSidebar theme={customSidebarTheme}>
      <h5 className="text-sm font-semibold mb-4 text-gray-500 uppercase dark:text-gray-400">
        Board Settings
      </h5>
      <FlowbiteSidebar.Items>
        <FlowbiteSidebar.ItemGroup>
          <div className="text-sm px-3 font-semibold text-gray-900 dark:text-white">Content Management</div>
          {navigation["content"].map((item) => (
            <FlowbiteSidebar.Item key={item.name} href={item.path} className={item.isCurrent ? "group bg-gray-200 dark:bg-gray-800" : "group"}>
              <div className="inline-flex items-center space-x-2">
                <Icon path={item.icon} size={0.75} className="text-gray-500 dark:group-hover:text-white group-hover:text-gray-900" />
                <span>{item.name}</span>
              </div> 
            </FlowbiteSidebar.Item>
          ))}
        </FlowbiteSidebar.ItemGroup>
        <FlowbiteSidebar.ItemGroup>
          <div className="text-sm px-3 font-semibold text-gray-900 dark:text-white">Administration</div>
          {navigation["administration"].map((item) => (
            <FlowbiteSidebar.Item
              key={item.name}
              href={isAuthenticated && currentMemberRole === "ADMINISTRATOR" ? item.path : null}
              className={`${isAuthenticated && currentMemberRole === "ADMINISTRATOR" ? "" : "hover:!bg-transparent"} group`}
            >
              <div className="inline-flex items-center space-x-2">
                <Icon
                  path={item.icon}
                  size={0.75}
                  className={`${isAuthenticated && currentMemberRole === "ADMINISTRATOR" ?
                    "text-gray-500 dark:group-hover:text-white group-hover:text-gray-900" :
                    "text-gray-400 dark:text-gray-500"
                  }`}
                />
                <span className={isAuthenticated && currentMemberRole === "ADMINISTRATOR" ? "" : "text-gray-400 dark:text-gray-500"}>{item.name}</span>
              </div> 
            </FlowbiteSidebar.Item>
          ))}
        </FlowbiteSidebar.ItemGroup>
      </FlowbiteSidebar.Items>
    </FlowbiteSidebar>
  );
}
