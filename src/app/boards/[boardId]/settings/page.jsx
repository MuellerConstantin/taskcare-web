"use client";

import { redirect, useParams } from "next/navigation";

export default function BoardSettings() {
  const { boardId } = useParams();

  redirect(`/boards/${boardId}/settings/general`);
}
