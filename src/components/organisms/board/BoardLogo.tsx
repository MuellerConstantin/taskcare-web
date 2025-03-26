import { useMemo } from "react";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import useSWR from "swr";
import { IdentIcon } from "@/components/atoms/IdentIcon";
import useApi from "@/hooks/useApi";

interface BoardLogoProps {
  boardId: string;
  className?: string;
}

export function BoardLogo({ boardId, className }: BoardLogoProps) {
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
        className={`flex h-32 w-32 animate-pulse items-center justify-center bg-slate-300 dark:bg-slate-700 ${className}`}
      >
        <ImageIcon className="aspect-square h-1/2 w-auto text-slate-200 dark:text-slate-800" />
      </div>
    );
  }

  if (isRefreshLoading) {
    if (isMissing) {
      return (
        <div className="relative h-full w-full">
          <div
            className={`h-32 w-32 overflow-hidden bg-slate-100 dark:bg-slate-900 ${className}`}
          >
            <IdentIcon value={boardId} />
          </div>
          <div className="bg-opacity-50 dark:bg-opacity-50 absolute inset-0 z-50 h-full w-full animate-pulse bg-slate-200 dark:bg-slate-900" />
        </div>
      );
    } else {
      return (
        <div className="relative h-full w-full">
          <div
            className={`relative h-32 w-32 overflow-hidden bg-slate-100 dark:bg-slate-900 ${className}`}
          >
            <Image
              src={data as any}
              alt={boardId}
              fill
              objectFit="cover"
              layout="fill"
            />
          </div>
          <div className="bg-opacity-50 dark:bg-opacity-50 absolute inset-0 z-50 h-full w-full animate-pulse bg-slate-200 dark:bg-slate-900" />
        </div>
      );
    }
  }

  if (hasErrored) {
    return (
      <div
        className={`flex h-32 w-32 items-center justify-center bg-red-200 dark:bg-red-400 ${className}`}
      >
        <ImageIcon className="aspect-square h-1/2 w-auto text-red-300 dark:text-red-500" />
      </div>
    );
  }

  if (hasSucceeded) {
    if (isMissing) {
      return (
        <div
          className={`h-32 w-32 overflow-hidden bg-slate-100 dark:bg-slate-900 ${className}`}
        >
          <IdentIcon value={boardId} />
        </div>
      );
    } else {
      return (
        <div
          className={`relative h-32 w-32 overflow-hidden bg-slate-100 dark:bg-slate-900 ${className}`}
        >
          <Image
            src={data as any}
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
