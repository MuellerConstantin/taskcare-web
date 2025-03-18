import { useMemo } from "react";
import Image from "next/image";
import useSWR from "swr";
import IdentIcon from "@/components/atoms/IdentIcon";
import useApi from "@/hooks/useApi";

export default function BoardLogo({ boardId, className }) {
  const api = useApi();

  const {
    data,
    error,
    isLoading,
  } = useSWR(boardId ? `/boards/${boardId}/logo-image` : null,
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
      <div className={`animate-pulse bg-gray-100 dark:bg-gray-800 w-32 h-32 ${className}`} />
    );
  }

  if(isRefreshLoading) {
    if(isMissing) {
      return (
        <div className="relative w-full h-full">
          <div className={`bg-gray-100 dark:bg-gray-800 w-32 h-32 overflow-hidden ${className}`}>
            <IdentIcon value={boardId} />
          </div>
          <div className="absolute inset-0 bg-opacity-50 dark:bg-opacity-50 w-full h-full z-50 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>
      );
    } else {
      return (
        <div className="relative w-full h-full">
          <div className={`bg-gray-100 dark:bg-gray-800 w-32 h-32 relative overflow-hidden ${className}`}>
            <Image
              src={data}
              alt={boardId}
              fill
              objectFit="cover"
              layout="fill"
            />
          </div>
          <div className="absolute inset-0 bg-opacity-50 dark:bg-opacity-50 w-full h-full z-50 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>
      );
    }
  }
  
  if(hasErrored) {
    return (
      <div className={`bg-red-200 dark:bg-red-400 w-32 h-32 ${className}`} />
    );
  }

  if(hasSucceeded) {
    if(isMissing) {
      return (
        <div className={`bg-gray-100 dark:bg-gray-800 w-32 h-32 overflow-hidden ${className}`}>
          <IdentIcon value={boardId} />
        </div>
      );
    } else {
      return (
        <div className={`bg-gray-100 dark:bg-gray-800 w-32 h-32 relative overflow-hidden ${className}`}>
          <Image
            src={data}
            alt={boardId}
            fill
            objectFit="cover"
            layout="fill"
          />
        </div>
      );
    }
  }

  return null;
}
