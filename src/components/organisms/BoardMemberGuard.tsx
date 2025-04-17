"use client";

import { useEffect } from "react";
import { redirect, useParams } from "next/navigation";
import useSWR from "swr";
import { useAppSelector } from "@/store";
import useApi from "@/hooks/useApi";

export default function BoardMemberGuard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const api = useApi();
  const { boardId } = useParams();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(boardId ? `/boards/${boardId}` : null, (url) =>
    api.get(url).then((res) => res.data),
  );

  useEffect(() => {
    if (!isAuthenticated || (error && error.status === 403)) {
      return redirect("/unsufficient-permissions");
    }
  }, [isAuthenticated, error]);

  return isAuthenticated && !error ? children : null;
}
