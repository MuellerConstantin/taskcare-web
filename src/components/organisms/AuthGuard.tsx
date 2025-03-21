"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAppSelector } from "@/store";

export default function AuthGuard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      return redirect("/login");
    }
  }, [isAuthenticated]);

  return isAuthenticated ? children : null;
}
