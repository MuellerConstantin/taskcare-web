"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

export default function AuthGuard({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      return redirect("/login");
    }
  }, [isAuthenticated]);

  return isAuthenticated ? children : null;
}
