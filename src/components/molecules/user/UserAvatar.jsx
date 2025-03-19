import { useMemo } from "react";
import { Avatar } from "flowbite-react";
import Image from "next/image";
import useSWR from "swr";
import IdentIcon from "@/components/atoms/IdentIcon";
import useApi from "@/hooks/useApi";

export default function UserAvatar({ userId, username, size = "sm" }) {
  const api = useApi();

  const {
    data,
    error,
    isLoading,
  } = useSWR(username && userId ? `/users/${userId}/profile-image` : null,
    (url) => api.get(url, {responseType: "arraybuffer"})
      .then((res) => URL.createObjectURL(new Blob([res.data], { type: res.headers["content-type"] }))),
      { keepPreviousData: true });

  const isMissing = useMemo(() => error && error.status === 404, [isLoading, error]);
  const isInitialLoading = useMemo(() => isLoading && !data && !isMissing, [isLoading, data, isMissing]);
  const isRefreshLoading = useMemo(() => isLoading && (data || isMissing), [isLoading, data, isMissing]);
  const hasErrored = useMemo(() => !isLoading && error && !isMissing, [isLoading, error, isMissing]);
  const hasSucceeded = useMemo(() => !isLoading && (data || isMissing), [isLoading, isMissing, data]);

  if(isInitialLoading) {
    return (
      <div className="animate-pulse">
        <Avatar size={size} rounded />
      </div>
    );
  }

  if(isRefreshLoading) {
    if(isMissing) {
      return (
        <div className="relative w-fit h-fit rounded-full">
          <Avatar size={size} placeholderInitials={username.slice(0, 2).toUpperCase()} rounded />
          <div className="absolute inset-0 bg-opacity-50 rounded-full dark:bg-opacity-50 w-full h-full z-50 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>
      );
    } else {
      return (
        <div className="relative w-fit h-fit">
          <Avatar
            size={size}
            rounded
            img={({className, ...props}) => (
              <Image
                src={data}
                alt={username}
                width={64}
                height={64}
                className={`${className} bg-gray-200 dark:bg-gray-900 object-cover`}
                {...props}
              />
            )}
          />
          <div className="absolute inset-0 bg-opacity-50 dark:bg-opacity-50 w-full h-full z-50 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>
      );
    }
  }

  if(hasErrored) {
    return (
      <div className="relative w-fit h-fit rounded-full">
        <Avatar size={size} rounded />
        <div className="absolute inset-0 bg-opacity-50 rounded-full dark:bg-opacity-50 w-full h-full z-50 bg-red-500" />
      </div>
    );
  }

  if(hasSucceeded) {
    if(isMissing) {
      return (
        <Avatar size={size} placeholderInitials={username.slice(0, 2).toUpperCase()} rounded />
      );
    } else {
      return (
        <Avatar
          size={size}
          rounded
          img={({className, ...props}) => (
            <Image
              src={data}
              alt={username}
              width={64}
              height={64}
              className={`${className} bg-gray-200 dark:bg-gray-900 object-cover`}
              {...props}
            />
          )}
        />
      );
    }
  }

  return <Avatar size={size} rounded />;
}
