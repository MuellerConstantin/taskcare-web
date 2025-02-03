import { Card } from "flowbite-react";
import BoardLogo from "./BoardLogo";

const customCardTheme = {
  "root": {
    "children": "flex h-full flex-col justify-center gap-4 p-4",
  },
};

export default function BoardCard({board}) {
  return (
    <Card
      theme={customCardTheme}
      className="w-52 h-[15rem] flex flex-col overflow-hidden hover:cursor-pointer"
      renderImage={() => (
        <div className="min-h-[7rem] overflow-hidden">
          <BoardLogo boardId={board?.id} className="w-full h-full" />
        </div>
      )}
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        <h5 className="shrink-0 font-semibold tracking-tight text-gray-900 dark:text-white truncate">
          {board?.name}
        </h5>
        <div className="flex-1 min-h-0">
          <p className="w-full text-sm font-normal text-gray-700 dark:text-gray-400 line-clamp-3 overflow-hidden">
            {board?.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
