"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import { mdiAccountGroup, mdiViewDashboardVariant } from "@mdi/js";

const Icon = dynamic(() => import("@mdi/react").then((module) => module.Icon), {
  ssr: false,
});

const customSidebarTheme = {
  root: {
    collapsed: {
      off: "w-full",
    },
    inner:
      "h-full overflow-y-auto overflow-x-hidden bg-white px-3 py-4 dark:bg-gray-900",
  },
  item: {
    base: "flex items-center justify-center rounded-lg px-2 py-1 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
    content: {
      base: "flex-1 whitespace-nowrap px-1",
    },
  },
};

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = useMemo(() => {
    return {
      content: [
        {
          name: "Boards",
          icon: mdiViewDashboardVariant,
          path: "/tmc/boards",
          isCurrent: pathname === "/tmc/boards",
        },
      ],
      system: [
        {
          name: "Users",
          icon: mdiAccountGroup,
          path: "/tmc/users",
          isCurrent: pathname === "/tmc/users",
        },
      ],
    };
  }, [pathname]);

  return (
    <FlowbiteSidebar theme={customSidebarTheme}>
      <h5 className="mb-4 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
        Management Console
      </h5>
      <FlowbiteSidebar.Items>
        <FlowbiteSidebar.ItemGroup>
          <div className="px-3 text-sm font-semibold text-gray-900 dark:text-white">
            Content Management
          </div>
          {navigation["content"].map((item) => (
            <FlowbiteSidebar.Item
              key={item.name}
              href={item.path}
              className={
                item.isCurrent ? "group bg-gray-200 dark:bg-gray-800" : "group"
              }
            >
              <div className="inline-flex items-center space-x-2">
                <Icon
                  path={item.icon}
                  size={1}
                  className="text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white"
                />
                <span>{item.name}</span>
              </div>
            </FlowbiteSidebar.Item>
          ))}
        </FlowbiteSidebar.ItemGroup>
        <FlowbiteSidebar.ItemGroup>
          <div className="px-3 text-sm font-semibold text-gray-900 dark:text-white">
            System Management
          </div>
          {navigation["system"].map((item) => (
            <FlowbiteSidebar.Item
              key={item.name}
              href={item.path}
              className={
                item.isCurrent ? "group bg-gray-200 dark:bg-gray-800" : "group"
              }
            >
              <div className="inline-flex items-center space-x-2">
                <Icon
                  path={item.icon}
                  size={1}
                  className="text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white"
                />
                <span>{item.name}</span>
              </div>
            </FlowbiteSidebar.Item>
          ))}
        </FlowbiteSidebar.ItemGroup>
      </FlowbiteSidebar.Items>
    </FlowbiteSidebar>
  );
}
