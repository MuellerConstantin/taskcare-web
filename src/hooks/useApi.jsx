"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/api";

export default function useApi() {
  return api;
}

export function ApiLogoutInterceptor({ children }) {
  const api = useApi();
  const router = useRouter();

  useEffect(() => {
    const logoutInterceptor = api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (
          err.response &&
          err.response.status === 401 &&
          (err.response.data?.error === "AuthenticationError" ||
            err.response.data?.error === "InvalidTokenError")
        ) {
          router.push("/login?logout=true");
        }

        return Promise.reject(err);
      },
    );

    return () => {
      api.interceptors.response.eject(logoutInterceptor);
    };
  }, [router]);

  return children;
}
