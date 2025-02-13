"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import useSWR from "swr";
import useApi from "@/hooks/useApi";

export default function SystemRoleGuard({ children, roles }) {
  const api = useApi();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const {
    data,
    error,
    isLoading: loading
  } = useSWR(isAuthenticated ? "/user/me" : null,
    (url) => api.get(url).then((res) => res.data));

  useEffect(() => {
    if (!isAuthenticated || (data && !roles.includes(data?.role))) {
      return redirect("/error/unsufficient-permissions");
    }
  }, [isAuthenticated, data]);

  return isAuthenticated && roles.includes(data?.role) ? children : null;
};
