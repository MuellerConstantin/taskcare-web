"use client";

import { useEffect } from "react";
import { redirect, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import useSWR from "swr";
import useApi from "@/hooks/useApi";

export default function BoardMemberGuard({ children }) {
  const api = useApi();
  const { boardId } = useParams();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const {
    data,
    error,
    isLoading: loading,
  } = useSWR(boardId ? `/boards/${boardId}` : null, (url) =>
    api.get(url).then((res) => res.data),
  );

  useEffect(() => {
    if (!isAuthenticated || (error && error.status === 403)) {
      return redirect("/error/unsufficient-permissions");
    }
  }, [isAuthenticated, error]);

  return isAuthenticated && !error ? children : null;
}
