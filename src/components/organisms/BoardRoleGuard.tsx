"use client";

import { useEffect, useMemo } from "react";
import { redirect, useParams } from "next/navigation";
import { useAppSelector } from "@/store";
import useSWR from "swr";
import useApi from "@/hooks/useApi";

export default function BoardRoleGuard({
  children,
  roles,
}: Readonly<{
  children: React.ReactNode;
  roles: string[];
}>) {
  const api = useApi();
  const { boardId } = useParams();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data: currentUserData } = useSWR("/user/me", (url) =>
    api.get(url).then((res) => res.data),
  );

  const { data: currentMemberData } = useSWR(
    boardId && currentUserData
      ? `/boards/${boardId}/members?search=${encodeURIComponent(`userId=="${currentUserData.id}"`)}`
      : null,
    (url) => api.get(url).then((res) => res.data),
  );

  const currentMemberRole = useMemo(() => {
    if (currentMemberData && currentMemberData.content.length == 1) {
      return currentMemberData.content[0].role;
    } else {
      return null;
    }
  }, [currentMemberData]);

  useEffect(() => {
    if (
      !isAuthenticated ||
      (currentMemberRole && !roles.includes(currentMemberRole))
    ) {
      return redirect("/unsufficient-permissions");
    }
  }, [isAuthenticated, currentMemberRole, roles]);

  return isAuthenticated && roles.includes(currentMemberRole) ? children : null;
}
