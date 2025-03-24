import React, { useMemo } from "react";
import useSWR from "swr";
import { Avatar } from "@/components/atoms/Avatar";
import useApi from "@/hooks/useApi";

interface PrincipalAvatarProps {
  size?: "xs" | "sm" | "md" | "lg";
}

export function PrincipalAvatar(props: PrincipalAvatarProps) {
  const api = useApi();

  const { data: userData } = useSWR(
    "/user/me",
    (url) => api.get(url).then((res) => res.data),
    {
      keepPreviousData: true,
    },
  );

  const {
    data: imageData,
    error: imageError,
    isLoading: imageIsLoading,
  } = useSWR(
    "/user/me/profile-image",
    (url) =>
      api
        .get(url, { responseType: "arraybuffer" })
        .then((res) =>
          URL.createObjectURL(
            new Blob([res.data], { type: res.headers["content-type"] }),
          ),
        ),
    { keepPreviousData: true },
  );

  const isMissing = useMemo(
    () => !!imageError && imageError.status === 404,
    [imageError],
  );

  const isInitialLoading = useMemo(
    () => imageIsLoading && !imageData && !isMissing,
    [imageIsLoading, imageData, isMissing],
  );

  const isRefreshLoading = useMemo(
    () => imageIsLoading && (!!imageData || isMissing),
    [imageIsLoading, imageData, isMissing],
  );

  const hasErrored = useMemo(
    () => !imageIsLoading && !!imageError && !isMissing,
    [imageIsLoading, imageError, isMissing],
  );

  return (
    <div className="relative flex h-fit items-center">
      <Avatar
        size="sm"
        alt={userData?.displayName || userData?.username || ""}
        src={imageData}
        {...props}
      />
      {isInitialLoading || isRefreshLoading ? (
        <div className="absolute inset-0 h-full w-full animate-pulse rounded-full bg-slate-400/50 dark:bg-slate-700/50" />
      ) : hasErrored ? (
        <div className="absolute inset-0 rounded-full bg-red-400/50 dark:bg-red-700/50" />
      ) : null}
    </div>
  );
}
