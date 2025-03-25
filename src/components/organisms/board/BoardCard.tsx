import { BoardLogo } from "./BoardLogo";

interface BoardCardProps {
  board: {
    id: string;
    name: string;
    description: string;
  };
}

export function BoardCard({ board }: BoardCardProps) {
  return (
    <div className="flex h-fit w-[14rem] max-w-sm flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:cursor-pointer dark:border-gray-700 dark:bg-gray-800">
      <div className="aspect-video h-auto w-full shrink-0">
        <BoardLogo boardId={board.id} className="h-full w-full" />
      </div>
      <div className="min-h-[5rem] shrink-0 space-y-1 p-3">
        <h5 className="line-clamp-2 font-semibold tracking-tight text-gray-900 dark:text-white">
          {board.name}
        </h5>
      </div>
    </div>
  );
}
