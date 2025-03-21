import { Card } from "flowbite-react";
import BoardLogo from "./BoardLogo";

const customCardTheme = {
  root: {
    children: "flex h-full flex-col justify-center gap-4 p-4",
  },
};

export default function BoardCard({ board }) {
  return (
    <Card
      href={`/boards/${board?.id}`}
      theme={customCardTheme}
      className="flex h-[15rem] w-52 flex-col overflow-hidden hover:cursor-pointer"
      renderImage={() => (
        <div className="min-h-[7rem] overflow-hidden">
          <BoardLogo boardId={board?.id} className="h-full w-full" />
        </div>
      )}
    >
      <div className="flex flex-1 flex-col overflow-hidden">
        <h5 className="shrink-0 truncate font-semibold tracking-tight text-gray-900 dark:text-white">
          {board?.name}
        </h5>
        <div className="min-h-0 flex-1">
          <p className="line-clamp-3 w-full overflow-hidden text-sm font-normal text-gray-700 dark:text-gray-400">
            {board?.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
