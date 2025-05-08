"use client";

import { useMemo } from "react";
import { usePathname, useParams } from "next/navigation";
import useSWR from "swr";
import useApi from "@/hooks/useApi";
import { useAppSelector } from "@/store";
import { Tag, LayoutList, LayoutGrid, Users, Settings } from "lucide-react";
import { ListBox, ListBoxItem } from "@/components/atoms/ListBox";

export function Sidebar() {
  const api = useApi();
  const pathname = usePathname();
  const { boardId } = useParams();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data: currentUserData } = useSWR("/user/me", (url) =>
    api.get(url).then((res) => res.data),
  );

  const { data: currentMemberData } = useSWR(
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
    return {
      content: [
        {
          name: "Statuses",
          icon: LayoutList,
          path: `/boards/${boardId}/settings/statuses`,
          isCurrent: pathname === `/boards/${boardId}/settings/statuses`,
        },
        {
          name: "Layout",
          icon: LayoutGrid,
          path: `/boards/${boardId}/settings/layout`,
          isCurrent: pathname === `/boards/${boardId}/settings/layout`,
        },
        {
          name: "Components",
          icon: Tag,
          path: `/boards/${boardId}/settings/components`,
          isCurrent: pathname === `/boards/${boardId}/settings/components`,
        },
      ],
      administration: [
        {
          name: "General",
          icon: Settings,
          path: `/boards/${boardId}/settings/general`,
          isCurrent: pathname === `/boards/${boardId}/settings/general`,
        },
        {
          name: "Members",
          icon: Users,
          path: `/boards/${boardId}/settings/members`,
          isCurrent: pathname === `/boards/${boardId}/settings/members`,
        },
      ],
    };
  }, [pathname, boardId]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h5 className="text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">
        Board Settings
      </h5>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            Content Management
          </div>
          <ListBox
            selectionMode="single"
            selectedKeys={navigation["content"]
              .filter((item) => item.isCurrent)
              .map((item) => `settings-sidebar-${item.name}`)}
            className="space-y-1"
          >
            {navigation["content"].map((item) => (
              <ListBoxItem
                id={`settings-sidebar-${item.name}`}
                key={item.name}
                href={item.path}
              >
                <div className="inline-flex items-center space-x-2">
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
              </ListBoxItem>
            ))}
          </ListBox>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            Administration
          </div>
          <ListBox
            selectionMode="single"
            selectedKeys={navigation["administration"]
              .filter((item) => item.isCurrent)
              .map((item) => `settings-sidebar-${item.name}`)}
            className="space-y-1"
          >
            {navigation["administration"].map((item) => (
              <ListBoxItem
                id={`settings-sidebar-${item.name}`}
                key={item.name}
                href={item.path}
                isDisabled={
                  !isAuthenticated || currentMemberRole !== "ADMINISTRATOR"
                }
              >
                <div className="inline-flex items-center space-x-2">
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
              </ListBoxItem>
            ))}
          </ListBox>
        </div>
      </div>
    </div>
  );
}
