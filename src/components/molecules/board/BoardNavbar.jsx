"use client";

import { useMemo } from "react";
import { useParams, usePathname } from "next/navigation";

export default function BoardNavbar() {
  const pathname = usePathname();
  const { boardId } = useParams();

  const navigation = useMemo(() => {
    return [
      {name: "Board", path: `/boards/${boardId}`, isCurrent: `/boards/${boardId}` === pathname},
      {name: "Backlog", path: `/boards/${boardId}/backlog`, isCurrent: `/boards/${boardId}/backlog` === pathname},
      {name: "Settings", path: `/boards/${boardId}/settings`, isCurrent: `/boards/${boardId}/settings` === pathname}
    ];
  }, [boardId, pathname]);

  return (
    <div className="bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
      <div className="max-w-screen-2xl mx-auto px-2 pt-3 sm:px-4">
        <ul className="overflow-x-auto flex space-x-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <a href={item.path} className="block w-fit group flex flex-col space-y-1">
                <span className="px-2 py-1 text-gray-900 dark:text-white group-hover:bg-gray-200 dark:group-hover:bg-gray-700 text-sm rounded-md">
                  {item.name}
                </span>
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
