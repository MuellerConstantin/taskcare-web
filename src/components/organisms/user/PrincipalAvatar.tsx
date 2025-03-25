import React, { useMemo } from "react";
import { User } from "lucide-react";
import useSWR from "swr";
import { Avatar } from "@/components/atoms/Avatar";
import useApi from "@/hooks/useApi";

interface PrincipalAvatarProps {
  size?: "xs" | "sm" | "md" | "lg";
}

export function PrincipalAvatar(props: PrincipalAvatarProps) {
  const api = useApi();

  const { data: userData, isLoading: userIsLoading } = useSWR(
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
    () =>
      imageIsLoading && !imageData && !isMissing && userIsLoading && !userData,
    [imageIsLoading, imageData, isMissing, userIsLoading, userData],
  );

  const isRefreshLoading = useMemo(
    () =>
      (imageIsLoading && (!!imageData || isMissing)) ||
      (userIsLoading && !!userData),
    [imageIsLoading, imageData, isMissing, userIsLoading, userData],
  );

  const hasErrored = useMemo(
    () => !imageIsLoading && !!imageError && !isMissing,
    [imageIsLoading, imageError, isMissing],
  );

  if (isInitialLoading) {
    return (
      <Avatar
        size="sm"
        alt={""}
        icon={<User className="h-full w-full" />}
        className="animate-pulse"
        {...props}
      />
    );
  }

  if (hasErrored) {
    return (
      <Avatar
        size="sm"
        alt={""}
        icon={<User className="h-full w-full" />}
        failed
        {...props}
      />
    );
  }

  return (
    <Avatar
      size="sm"
      alt={userData?.displayName || userData?.username || ""}
      src={imageData}
      className={isRefreshLoading ? "animate-pulse" : ""}
      {...props}
    />
  );
}
