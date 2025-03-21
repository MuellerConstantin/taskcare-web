"use client";

import { useParams } from "next/navigation";
import KanbanView from "@/components/organisms/board/KanbanView";

export default function Board() {
  const { boardId } = useParams();

  return (
    <div className="flex w-full grow flex-col space-y-4">
      <div className="flex grow flex-col">
        <KanbanView boardId={boardId} />
      </div>
    </div>
  );
}
