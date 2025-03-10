"use client";

import { useParams } from "next/navigation";
import KanbanView from "@/components/organisms/board/KanbanView";

export default function Board() {
  const { boardId } = useParams();

  return (
    <div className="flex flex-col grow w-full space-y-4">
      <div className="grow flex-col flex">
        <KanbanView boardId={boardId} />
      </div>
    </div>
  );
}
