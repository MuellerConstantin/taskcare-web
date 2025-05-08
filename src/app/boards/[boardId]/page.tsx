"use client";

import { useParams } from "next/navigation";

export default function Board() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { boardId } = useParams();

  return <div />;
}
