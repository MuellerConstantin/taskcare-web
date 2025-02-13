"use client";

import { useMemo } from "react";
import { usePathname, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import { mdiAccountGroup, mdiViewDashboardVariant, mdiBulletinBoard, mdiTag } from "@mdi/js";

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
  const pathname = usePathname();
  const { boardId } = useParams();

  const navigation = useMemo(() => {
    return {
      "content": [
        { name: "Statuses", icon: mdiBulletinBoard, path: `/boards/${boardId}/settings/statuses`, isCurrent: pathname === `/boards/${boardId}/settings/statuses` },
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
                <Icon path={item.icon} size={1} className="text-gray-500 dark:group-hover:text-white group-hover:text-gray-900" />
                <span>{item.name}</span>
              </div> 
            </FlowbiteSidebar.Item>
          ))}
        </FlowbiteSidebar.ItemGroup>
        <FlowbiteSidebar.ItemGroup>
          <div className="text-sm px-3 font-semibold text-gray-900 dark:text-white">Administration</div>
          {navigation["administration"].map((item) => (
            <FlowbiteSidebar.Item key={item.name} href={item.path} className={item.isCurrent ? "group bg-gray-200 dark:bg-gray-800" : "group"}>
              <div className="inline-flex items-center space-x-2">
                <Icon path={item.icon} size={1} className="text-gray-500 dark:group-hover:text-white group-hover:text-gray-900" />
                <span>{item.name}</span>
              </div> 
            </FlowbiteSidebar.Item>
          ))}
        </FlowbiteSidebar.ItemGroup>
      </FlowbiteSidebar.Items>
    </FlowbiteSidebar>
  );
}
