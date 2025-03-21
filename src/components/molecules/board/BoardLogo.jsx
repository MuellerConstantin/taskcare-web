import { useMemo } from "react";
import Image from "next/image";
import useSWR from "swr";
import IdentIcon from "@/components/atoms/IdentIcon";
import useApi from "@/hooks/useApi";

export default function BoardLogo({ boardId, className }) {
  const api = useApi();

  const { data, error, isLoading } = useSWR(
    boardId ? `/boards/${boardId}/logo-image` : null,
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
    () => error && error.status === 404,
    [isLoading, error],
  );
  const isInitialLoading = useMemo(
    () => isLoading && !data && !isMissing,
    [isLoading, data, isMissing],
  );
  const isRefreshLoading = useMemo(
    () => isLoading && (data || isMissing),
    [isLoading, data, isMissing],
  );
  const hasErrored = useMemo(
    () => !isLoading && error && !isMissing,
    [isLoading, error, isMissing],
  );
  const hasSucceeded = useMemo(
    () => !isLoading && (data || isMissing),
    [isLoading, isMissing, data],
  );

  if (isInitialLoading) {
    return (
      <div
        className={`h-32 w-32 animate-pulse bg-gray-100 dark:bg-gray-800 ${className}`}
      />
    );
  }

  if (isRefreshLoading) {
    if (isMissing) {
      return (
        <div className="relative h-full w-full">
          <div
            className={`h-32 w-32 overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}
          >
            <IdentIcon value={boardId} />
          </div>
          <div className="absolute inset-0 z-50 h-full w-full animate-pulse bg-gray-200 bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50" />
        </div>
      );
    } else {
      return (
        <div className="relative h-full w-full">
          <div
            className={`relative h-32 w-32 overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}
          >
            <Image
              src={data}
              alt={boardId}
              fill
              objectFit="cover"
              layout="fill"
            />
          </div>
          <div className="absolute inset-0 z-50 h-full w-full animate-pulse bg-gray-200 bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50" />
        </div>
      );
    }
  }

  if (hasErrored) {
    return (
      <div className={`h-32 w-32 bg-red-200 dark:bg-red-400 ${className}`} />
    );
  }

  if (hasSucceeded) {
    if (isMissing) {
      return (
        <div
          className={`h-32 w-32 overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}
        >
          <IdentIcon value={boardId} />
        </div>
      );
    } else {
      return (
        <div
          className={`relative h-32 w-32 overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}
        >
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
