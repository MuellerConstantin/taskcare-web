"use client";

import { useEffect, useMemo } from "react";
import { redirect, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import useSWR from "swr";
import useApi from "@/hooks/useApi";

export default function BoardRoleGuard({ children, roles }) {
  const api = useApi();
  const { boardId } = useParams();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const {
    data: currentUserData,
    error: currentUserError,
    isLoading: currentUserLoading
  } = useSWR("/user/me",
    (url) => api.get(url).then((res) => res.data));

  const {
    data: currentMemberData,
    error: currentMemberError,
    isLoading: currentMemberLoading
  } = useSWR(boardId && currentUserData ? `/boards/${boardId}/members?search=${encodeURIComponent(`userId=="${currentUserData.id}"`)}` : null,
    (url) => api.get(url).then((res) => res.data));

  const currentMemberRole = useMemo(() => {
    if(currentMemberData && currentMemberData.content.length == 1) {
      return currentMemberData.content[0].role;
    } else {
      return null;
    }
  }, [currentMemberData]);

  useEffect(() => {
    if (!isAuthenticated || (currentMemberRole && !roles.includes(currentMemberRole))) {
      return redirect("/error/unsufficient-permissions");
    }
  }, [isAuthenticated, currentMemberRole]);

  return isAuthenticated && roles.includes(currentMemberRole) ? children : null;
};
